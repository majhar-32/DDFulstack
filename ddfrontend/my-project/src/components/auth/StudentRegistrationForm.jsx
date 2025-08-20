import React, { useState } from "react";
import api from "../../services/api";

const StudentRegistrationForm = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    institute: "", // নতুন ফিল্ড যোগ করা হয়েছে
    gradeLevel: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.institute.trim()) newErrors.institute = "Institute is required"; // নতুন ভ্যালিডেশন
    if (!formData.gradeLevel) newErrors.gradeLevel = "Grade or level is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitted(false);
    } else {
      setErrors({});
      try {
        // payload এখন ব্যাকএন্ডের DTO-এর সাথে সম্পূর্ণ মেলে
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          institute: formData.institute, // institute ডেটা পাঠানো হচ্ছে
          levelOfStudy: formData.gradeLevel,
          phones: [], // phones আপাতত খালি পাঠানো হচ্ছে
        };

        await api.post("/auth/register/student", payload);

        setIsSubmitted(true);
        setTimeout(() => {
          setCurrentPage("student-login");
        }, 0);

      } catch (error) {
        if (error.response && error.response.status === 400) {
           setErrors({ email: "This email is already registered." });
        } else {
           setErrors({ form: "Registration failed. Please try again." });
        }
        setIsSubmitted(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border border-blue-200">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Student Registration
        </h2>
        {/* Success and Error messages */}
        {isSubmitted && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Redirecting to login...</span>
          </div>
        )}
        {errors.form && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <p>{errors.form}</p>
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs italic mt-1 text-left">{errors.name}</p>}
          </div>

          {/* Institute Input (নতুন ইনপুট ফিল্ড) */}
          <div>
            <input
              type="text"
              name="institute"
              placeholder="Enter your institute's name"
              value={formData.institute}
              onChange={handleChange}
              className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 ${
                errors.institute ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.institute && <p className="text-red-500 text-xs italic mt-1 text-left">{errors.institute}</p>}
          </div>

          {/* Grade Level Select */}
          <div>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 ${
                errors.gradeLevel ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Study Level</option>
              <option value="SSC">SSC</option>
              <option value="HSC">HSC</option>
              <option value="Admission">Admission</option>
            </select>
            {errors.gradeLevel && <p className="text-red-500 text-xs italic mt-1 text-left">{errors.gradeLevel}</p>}
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs italic mt-1 text-left">{errors.email}</p>}
          </div>

          {/* Password Inputs */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs italic mt-1 text-left">{errors.password}</p>}
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs italic mt-1 text-left">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-md font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;