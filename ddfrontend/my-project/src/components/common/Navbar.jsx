import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // AuthContext ইম্পোর্ট করুন

const Navbar = () => {
  const {
    loggedInUser,
    setLoggedInUser,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    setHighlightQuestionId,
  } = useContext(AuthContext); // useContext ব্যবহার করে state গুলো নিন
  const [isOpen, setIsOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const joinRef = useRef(null);
  const notificationsRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const unreadNotificationsCount = notifications.filter(
    (notif) => !notif.read && notif.recipientEmail === loggedInUser?.email
  ).length;

  const scrollToCourses = (e) => {
    e.preventDefault();
    setIsOpen(false);
    setIsJoinOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById("courses-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document
        .getElementById("courses-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNotificationItemClick = (notification) => {
    markNotificationAsRead(notification.id);
    setHighlightQuestionId(notification.questionId);

    if (loggedInUser.role === "student") {
      navigate("/student/question-history");
    } else if (loggedInUser.role === "teacher") {
      navigate("/teacher/dashboard");
    }
    setIsNotificationsOpen(false);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    clearNotifications();
    navigate("/");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (joinRef.current && !joinRef.current.contains(event.target)) {
        setIsJoinOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [joinRef, notificationsRef]);

  const getDashboardPage = () => {
    if (!loggedInUser) return "/";
    switch (loggedInUser.role) {
      case "student":
        return "/student/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  const getProfilePage = () => {
    if (!loggedInUser) return "/";
    switch (loggedInUser.role) {
      case "student":
        return "/student/profile";
      case "teacher":
        return "/teacher/profile";
      case "admin":
        return "/admin/profile";
      default:
        return "/";
    }
  };

  const isTeacherDashboard = loggedInUser && loggedInUser.role === "teacher";
  const isStudentDashboard = loggedInUser && loggedInUser.role === "student";

  const getLinkClassName = (path) => {
    return `text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-gray-100 ${
      location.pathname === path ? "bg-gray-100 text-indigo-600" : ""
    }`;
  };

  const getMobileLinkClassName = (path) => {
    return `text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 ${
      location.pathname === path ? "bg-gray-100 text-indigo-600" : ""
    }`;
  };

  return (
    <nav className="bg-white shadow-md py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        <div className="flex-shrink-0 flex items-center">
          <Link
            to={loggedInUser ? getDashboardPage() : "/"}
            className="flex items-center text-2xl font-bold text-indigo-600 rounded-md p-2 hover:bg-gray-100 transition-colors duration-200"
          >
            <img
              src="/logo.png"
              alt="DoubtDesk Logo"
              className="h-16 w-16 mr-2"
            />
            DoubtDesk
          </Link>
        </div>

        {/* --- Desktop View --- */}
        <div className="hidden md:flex items-center space-x-6">
          {loggedInUser ? (
            <>
              <Link
                to={getDashboardPage()}
                className={getLinkClassName(getDashboardPage())}
              >
                Dashboard
              </Link>
              {isTeacherDashboard && (
                <Link
                  to="/teacher/solved"
                  className={getLinkClassName("/teacher/solved")}
                >
                  Solved Questions
                </Link>
              )}
              <Link
                to={getProfilePage()}
                className={getLinkClassName(getProfilePage())}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-600 transition-colors duration-200 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/#courses-section"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-gray-100"
              >
                Courses
              </Link>
              <div className="relative" ref={joinRef}>
                <button
                  onClick={() => setIsJoinOpen(!isJoinOpen)}
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-gray-100 focus:outline-none flex items-center"
                >
                  Join as
                </button>
                {isJoinOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <Link
                        to="/login/teacher"
                        onClick={() => setIsJoinOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                      >
                        Teacher
                      </Link>
                      <Link
                        to="/login/student"
                        onClick={() => setIsJoinOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                      >
                        Student
                      </Link>
                      <Link
                        to="/login/admin"
                        onClick={() => setIsJoinOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                      >
                        Admin
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
          >
            {!isOpen ? (
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* --- Mobile View --- */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {loggedInUser ? (
              <>
                <Link
                  to={getDashboardPage()}
                  onClick={() => setIsOpen(false)}
                  className={getMobileLinkClassName(getDashboardPage())}
                >
                  Dashboard
                </Link>
                {isTeacherDashboard && (
                  <Link
                    to="/teacher/solved"
                    onClick={() => setIsOpen(false)}
                    className={getMobileLinkClassName("/teacher/solved")}
                  >
                    Solved Questions
                  </Link>
                )}
                <Link
                  to={getProfilePage()}
                  onClick={() => setIsOpen(false)}
                  className={getMobileLinkClassName(getProfilePage())}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-blue-500 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/#courses-section"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                >
                  Courses
                </Link>
                <Link
                  to="/login/teacher"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                >
                  Teacher Login
                </Link>
                <Link
                  to="/login/student"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                >
                  Student Login
                </Link>
                <Link
                  to="/login/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
