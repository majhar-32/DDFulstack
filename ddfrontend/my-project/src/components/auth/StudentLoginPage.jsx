import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../../services/api";

const StudentLoginPage = ({ setLoggedInUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is coming from an enrollment attempt
  const isEnrollmentFlow = location.state?.fromEnrollment;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitted(false);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid.");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      const userData = response.data;

      if (userData.role === "student") {
        setIsSubmitted(true);
        setLoggedInUser({
          email: userData.email,
          role: userData.role,
          name: userData.name,
        });

        setTimeout(() => {
          if (isEnrollmentFlow) {
            navigate("/student/enroll");
          } else {
            navigate("/student/dashboard");
          }
        },0);
      } else {
        setError("This is not a valid student account.");
        setIsSubmitted(false);
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border border-yellow-200">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Student Login</h2>

        {isSubmitted && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Logging in...</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {error && (
              <p className="text-red-500 text-xs italic mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-md font-semibold"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/register/student"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register now.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLoginPage;
