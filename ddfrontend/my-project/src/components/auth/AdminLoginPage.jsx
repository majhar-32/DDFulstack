import React, { useState } from "react";
import api from "../../services/api"; // API সার্ভিস ইম্পোর্ট

const AdminLoginPage = ({ setCurrentPage, setLoggedInUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      // localStorage এবং হার্ডকোডেড লজিক মুছে API কল করা হচ্ছে
      const response = await api.post("/auth/login", { email, password });
      const userData = response.data;

      if (userData.role === "admin") {
        setIsSubmitted(true);
        setLoggedInUser({
          email: userData.email,
          role: userData.role,
          name: userData.name,
        });
        setTimeout(() => {
          setCurrentPage("admin-dashboard");
        }, 0);
      } else {
        setError("This is not a valid admin account.");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border border-red-200">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Admin Login</h2>
        {isSubmitted && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Success!</strong> Logging in...
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm border rounded-md w-full py-3 px-4"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm border rounded-md w-full py-3 px-4"
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
          <a
            href="#"
            onClick={() => setCurrentPage("admin-registration")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register now.
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
