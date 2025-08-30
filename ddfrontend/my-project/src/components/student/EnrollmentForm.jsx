import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext"; // AuthContext ইম্পোর্ট করুন

const EnrollmentForm = () => {
  const {
    loggedInUser,
    courseToEnroll: courseName,
    handleEnrollSuccess,
  } = useContext(AuthContext); // useContext ব্যবহার করে state এবং ফাংশনগুলো নিন
  const [formData, setFormData] = useState({
    paymentMethod: "",
    transactionId: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";
    if (!formData.transactionId.trim())
      newErrors.transactionId = "Transaction ID is required";
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
        const payload = {
          studentEmail: loggedInUser.email,
          courseName: courseName,
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId,
        };

        await api.post("/payments", payload);

        setIsSubmitted(true);

        if (handleEnrollSuccess) {
          handleEnrollSuccess(courseName);
        }

        setTimeout(() => {
          navigate("/student/dashboard");
        }, 0);
      } catch (error) {
        setErrors({
          form: "Enrollment failed. You might already be enrolled or the course is not available.",
        });
        console.error("Enrollment error:", error);
        setIsSubmitted(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center border border-indigo-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Enroll: {courseName}
        </h2>
        {isSubmitted && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">
              Your purchase has been confirmed. Redirecting to dashboard...
            </span>
          </div>
        )}
        {errors.form && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <p>{errors.form}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2 text-left"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loggedInUser.email}
              readOnly
              className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-500 bg-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-gray-700 text-sm font-bold mb-2 text-left"
            >
              Payment Method:
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 ${
                errors.paymentMethod ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a method</option>
              <option value="bkash">Bkash</option>
              <option value="nogod">Nagad</option>
              <option value="rocket">Rocket</option>
            </select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs italic mt-1 text-left">
                {errors.paymentMethod}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="transactionId"
              className="block text-gray-700 text-sm font-bold mb-2 text-left"
            >
              Transaction ID:
            </label>
            <input
              type="text"
              id="transactionId"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 ${
                errors.transactionId ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.transactionId && (
              <p className="text-red-500 text-xs italic mt-1 text-left">
                {errors.transactionId}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center space-x-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Confirm Purchase
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;
