import React, { useState } from "react";
import api from "../../services/api"; // API সার্ভিস ইম্পোর্ট

const TeacherRegistrationForm = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: "", // name ফিল্ড যোগ করা হয়েছে
    institute: "",
    email: "",
    password: "",
    confirmPassword: "",
    qualification: "M.Sc in Physics", // একটি ডিফল্ট মান, এটি ফর্মে যোগ করা যেতে পারে
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
    if (!formData.institute.trim())
      newErrors.institute = "Institute is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          institute: formData.institute,
          qualification: formData.qualification,
          phones: [],
        };

        await api.post("/auth/register/teacher", payload);

        setIsSubmitted(true);
        setTimeout(() => {
          setCurrentPage("teacher-login");
        }, 0);
      } catch (error) {
        setErrors({
          form: "Registration failed. This email might already be in use.",
        });
        console.error("Teacher registration error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Teacher Registration
        </h2>
        {isSubmitted && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Success!</strong> Redirecting to
            login...
          </div>
        )}
        {errors.form && <p className="text-red-500 mb-4">{errors.form}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className={`shadow-sm border rounded-md w-full py-3 px-4 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs text-left mt-1">
                {errors.name}
              </p>
            )}
          </div>
          {/* Institute Input */}
          <div>
            <input
              type="text"
              name="institute"
              placeholder="Enter your institute's name"
              value={formData.institute}
              onChange={handleChange}
              className={`shadow-sm border rounded-md w-full py-3 px-4 ${
                errors.institute ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.institute && (
              <p className="text-red-500 text-xs text-left mt-1">
                {errors.institute}
              </p>
            )}
          </div>
          {/* Email and Password Inputs */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`shadow-sm border rounded-md w-full py-3 px-4 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs text-left mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className={`shadow-sm border rounded-md w-full py-3 px-4 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs text-left mt-1">
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`shadow-sm border rounded-md w-full py-3 px-4 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs text-left mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

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

export default TeacherRegistrationForm;
