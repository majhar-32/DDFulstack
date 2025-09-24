import React, { useState } from "react";
import api from "../../services/api";

const ForgotPasswordForm = ({ onEmailSubmitted }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitted(false);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      await api.post("/auth/forgot-password", { email });
      setIsSubmitted(true);
      onEmailSubmitted(email);
    } catch (err) {
      setError("Failed to send OTP. Please check your email and try again.");
      console.error("Forgot password error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-2xl font-bold mb-4">Forgot Password?</h3>
      <p className="text-gray-600 text-sm mb-6 text-center">
        Enter your email address to receive a one-time password (OTP).
      </p>
      {isSubmitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 w-full">
          An OTP has been sent to your email.
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
