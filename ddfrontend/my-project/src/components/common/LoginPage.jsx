import React, { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext"; // AuthContext ইম্পোর্ট করুন

const LoginPage = ({ title, role, formColor, registerLink }) => {
  const { setLoggedInUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // added
  const navigate = useNavigate();
  const location = useLocation();

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

      if (userData.role === role) {
        setIsSubmitted(true);
        setLoggedInUser({
          email: userData.email,
          role: userData.role,
          name: userData.name,
        });

        let successPath = `/${role}/dashboard`;
        if (role === "student" && isEnrollmentFlow) {
          successPath = "/student/enroll";
        }

        setTimeout(() => {
          navigate(successPath);
        }, 0);
      } else {
        setError(`This is not a valid ${role} account.`);
        setIsSubmitted(false);
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      setIsSubmitted(false);
    }
  };

  const formBgClass = `bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border border-${formColor}-200`;
  const submitButtonClass = `w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold`;
  const loginBgClass = `min-h-screen bg-${formColor}-100 flex items-center justify-center p-4`;

  return (
    <div className={loginBgClass}>
      <div className={formBgClass}>
        <h2 className="text-4xl font-bold text-gray-800 mb-8">{title}</h2>

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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 pr-12 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
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
            </div>

            {error && (
              <p className="text-red-500 text-xs italic mt-1">{error}</p>
            )}
          </div>

          <button type="submit" className={submitButtonClass}>
            Login
          </button>
        </form>

        {registerLink && (
          <p className="mt-8 text-gray-700">
            Don't have an account?{" "}
            <Link
              to={registerLink}
              className="text-blue-600 font-semibold hover:underline"
            >
              Register now.
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
