import React, { useState } from "react";
import api from "../../services/api";

const OtpVerificationForm = ({ email, onOtpVerified }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("OTP is required.");
      return;
    }

    try {
      const payload = { email, otp };
      const response = await api.post("/auth/verify-otp", payload);
      if (response.status === 200) {
        onOtpVerified();
      }
    } catch (err) {
      setError("Invalid or expired OTP. Please try again.");
      console.error("OTP verification error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-2xl font-bold mb-4">Verify OTP</h3>
      <p className="text-gray-600 text-sm mb-6 text-center">
        A 6-digit OTP has been sent to your email.
      </p>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="6"
          className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpVerificationForm;
