import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom"; // useNavigate ইম্পোর্ট করুন

const AddCourseForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    price: "",
    duration: "1 Year",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate(); // useNavigate হুক ব্যবহার করুন

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.title.trim()) newErrors.title = "Course Title is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    else if (isNaN(formData.price)) newErrors.price = "Price must be a number";
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
          category: formData.category,
          title: formData.title,
          price: parseFloat(formData.price),
          duration: formData.duration,
        };

        await api.post("/courses", payload);

        setIsSubmitted(true);
        setTimeout(() => {
          navigate("/admin/courses");
        }, 0);
      } catch (error) {
        console.error("Failed to add course:", error);
        setErrors({
          form: "Failed to add course. Please check the console for details.",
        });
        setIsSubmitted(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Add New Course
        </h2>
        {/* ... Success/Error মেসেজ ... */}
        {isSubmitted && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Redirecting to courses...</span>
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
            <input
              type="text"
              name="category"
              placeholder="e.g., Engineering, SSC, HSC"
              value={formData.category}
              onChange={handleChange}
              className={`shadow-sm border rounded-md w-full py-3 px-4 ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="title"
              placeholder="Course Title (e.g., Admission Program 2025)"
              value={formData.title}
              onChange={handleChange}
              className={`shadow-sm border rounded-md w-full py-3 px-4 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="price"
              placeholder="Price (e.g., 2000)"
              value={formData.price}
              onChange={handleChange}
              className={`shadow-sm border rounded-md w-full py-3 px-4 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-md font-semibold"
          >
            Add Course
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-md font-semibold mt-4"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourseForm;
