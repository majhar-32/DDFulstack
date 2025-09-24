import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const RegistrationForm = ({
  title,
  fields,
  apiEndpoint,
  successRedirectPath,
  formColor,
  roleSpecificPayload = {},
  loginLink,
}) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (name) => {
    setPasswordVisibility((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      // Basic validation
      if (field.required && !formData[field.name].trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
      // Email validation
      if (
        field.name === "email" &&
        formData.email &&
        !/\S+@\S+\.\S+/.test(formData.email)
      ) {
        newErrors.email = "Email is invalid";
      }
      // Password match validation
      if (
        field.name === "confirmPassword" &&
        formData.password !== formData.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    });
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
          ...roleSpecificPayload,
          ...formData,
        };

        if (payload.phoneNumber) {
          payload.phones = [payload.phoneNumber];
          delete payload.phoneNumber;
        }

        if (payload.confirmPassword) {
          delete payload.confirmPassword;
        }

        await api.post(apiEndpoint, payload);

        setIsSubmitted(true);
        setTimeout(() => {
          navigate(successRedirectPath);
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

  const formBgClass = `bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border border-${formColor}-200`;
  const submitButtonClass = `w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold`;

  return (
    <div
      className={`min-h-screen bg-${formColor}-100 flex items-center justify-center p-4`}
    >
      <div className={formBgClass}>
        <h2 className="text-4xl font-bold text-gray-800 mb-8">{title}</h2>
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
          {fields.map((field) => {
            const isPassword = field.type === "password";
            const isVisible = !!passwordVisibility[field.name];

            return (
              <div key={field.name}>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 ${
                      errors[field.name] ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type={isPassword && isVisible ? "text" : field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 ${
                        isPassword ? "pr-12" : ""
                      } text-gray-700 ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => toggleVisibility(field.name)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isVisible}
                        tabIndex={0}
                      >
                        {isVisible ? (
                          // Eye-off icon
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.4 18.4 0 0 1 5.06-6.94" />
                            <path d="M1 1l22 22" />
                            <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12" />
                            <path d="M14.12 14.12L9.88 9.88" />
                          </svg>
                        ) : (
                          // Eye icon
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                )}
                {errors[field.name] && (
                  <p className="text-red-500 text-xs italic mt-1 text-left">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            );
          })}
          <button type="submit" className={submitButtonClass}>
            Submit
          </button>
        </form>
        {loginLink && (
          <p className="mt-8 text-gray-700">
            Already have an account?{" "}
            <Link
              to={loginLink}
              className="text-blue-600 font-semibold hover:underline"
            >
              Login now.
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
