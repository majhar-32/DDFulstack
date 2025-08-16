import React, { useState, useRef, useEffect } from "react";

const Navbar = ({
  currentPage,
  setCurrentPage,
  loggedInUser,
  setLoggedInUser,
  setIsCoursesOnlyView,
  notifications,
  markNotificationAsRead,
  clearNotifications,
  setHighlightQuestionId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const joinRef = useRef(null);
  const notificationsRef = useRef(null);

  const unreadNotificationsCount = notifications.filter(
    (notif) => !notif.read && notif.recipientEmail === loggedInUser?.email
  ).length;

  const scrollToCourses = (e) => {
    e.preventDefault();
    const coursesSection = document.getElementById("courses-section");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
    setIsJoinOpen(false);
  };

  const handleJoinOptionClick = (pageName) => {
    setCurrentPage(pageName);
    setIsOpen(false);
    setIsJoinOpen(false);
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleNotificationItemClick = (notification) => {
    markNotificationAsRead(notification.id);
    setHighlightQuestionId(notification.questionId);

    if (loggedInUser.role === "student") {
      setCurrentPage("question-history");
    } else if (loggedInUser.role === "teacher") {
      setCurrentPage("teacher-dashboard-pending");
    }
    setIsNotificationsOpen(false);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentPage("home");
    setIsCoursesOnlyView(false);
    clearNotifications();
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

  const isUserDashboardPage =
    loggedInUser &&
    (loggedInUser.role === "student" ||
      loggedInUser.role === "teacher" ||
      loggedInUser.role === "admin");
  const isTeacherDashboard = loggedInUser && loggedInUser.role === "teacher";
  const isAdminDashboard = loggedInUser && loggedInUser.role === "admin";
  const isStudentDashboard = loggedInUser && loggedInUser.role === "student";

  const getProfilePage = () => {
    if (loggedInUser && loggedInUser.role === "student") {
      return "student-profile";
    } else if (loggedInUser && loggedInUser.role === "teacher") {
      return "teacher-profile";
    } else if (loggedInUser && loggedInUser.role === "admin") {
      return "admin-profile";
    }
    return "home";
  };

  // --- নতুন পরিবর্তন শুরু ---
  const studentMainDashboardPage = "student-dashboard";

  // যে পেজগুলোতে কন্টেন্টের ভেতরেই "Back to Dashboard" বাটন আছে, তাদের তালিকা
  const pagesWithContentButton = [
    "student-profile",
    "course-details",
    "question-history",
    // নিচের পেজগুলোতে Navbar-এ বাটন দেখানো হবে
    "ask-doubt-for-course",
    "question-history-for-course",
    "enrollment-form",
  ];

  // Navbar-এ বাটনটি দেখানোর শর্ত
  const showStudentDashboardButton =
    isStudentDashboard &&
    currentPage !== studentMainDashboardPage &&
    !pagesWithContentButton.includes(currentPage);
  // --- নতুন পরিবর্তন শেষ ---

  return (
    <nav className="bg-white shadow-md py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        <div className="flex-shrink-0 flex items-center">
          <a
            href="#"
            onClick={() => {
              setIsCoursesOnlyView(false);
              setCurrentPage(isUserDashboardPage ? getProfilePage() : "home");
            }}
            className="flex items-center text-2xl font-bold text-indigo-600 rounded-md p-2 hover:bg-gray-100 transition-colors duration-200"
          >
            <img
              src="logo.png"
              alt="DoubtDesk Logo"
              className="h-16 w-16 mr-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/32x32/cccccc/000000?text=Logo";
              }}
            />
            DoubtDesk
          </a>
        </div>

        {/* --- ডেস্কটপ ভিউ --- */}
        <div className="hidden md:flex items-center space-x-6">
          {isUserDashboardPage ? (
            <>
              {/* --- ছাত্রের জন্য নতুন "Back to Dashboard" বাটন (শর্তসাপেক্ষে) --- */}
              {showStudentDashboardButton && (
                <button
                  onClick={() => setCurrentPage(studentMainDashboardPage)}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-600 transition-colors duration-200 shadow-sm"
                >
                  Back to Dashboard
                </button>
              )}

              {isTeacherDashboard && (
                <>
                  <a
                    href="#"
                    onClick={() => setCurrentPage("teacher-dashboard-pending")}
                    className={`text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-gray-100 ${
                      currentPage === "teacher-dashboard-pending"
                        ? "bg-gray-100 text-indigo-600"
                        : ""
                    }`}
                  >
                    Pending Questions
                  </a>
                  <a
                    href="#"
                    onClick={() => setCurrentPage("teacher-dashboard-solved")}
                    className={`text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-gray-100 ${
                      currentPage === "teacher-dashboard-solved"
                        ? "bg-gray-100 text-indigo-600"
                        : ""
                    }`}
                  >
                    Solved Questions
                  </a>
                </>
              )}
              {isAdminDashboard && (
                <a
                  href="#"
                  onClick={() => setCurrentPage("admin-dashboard")}
                  className={`text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-gray-100 ${
                    currentPage === "admin-dashboard" ||
                    currentPage.startsWith("admin-")
                      ? "bg-gray-100 text-indigo-600"
                      : ""
                  }`}
                >
                  Admin Dashboard
                </a>
              )}
              {(isStudentDashboard || isTeacherDashboard) && (
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={handleNotificationClick}
                    className="p-2 text-gray-700 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
                    title="Notifications"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        {notifications.length > 0 && (
                          <div className="text-right px-4 py-1 border-b">
                            <button
                              onClick={clearNotifications}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Clear All
                            </button>
                          </div>
                        )}
                        {notifications.length === 0 ? (
                          <p className="px-4 py-2 text-sm text-gray-500">
                            No new notifications.
                          </p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => handleNotificationItemClick(notif)}
                              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer`}
                              role="menuitem"
                            >
                              <p>{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notif.timestamp}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <a
                href="#"
                onClick={() => setCurrentPage(getProfilePage())}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-gray-100"
              >
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-5 py-2 rounded-md font-medium hover:bg-red-600 transition-colors duration-200 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="#courses-section"
                onClick={(e) => {
                  setIsCoursesOnlyView(false);
                  scrollToCourses(e);
                }}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-gray-100"
              >
                Courses
              </a>
              <div className="relative" ref={joinRef}>
                <button
                  onClick={() => setIsJoinOpen(!isJoinOpen)}
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 py-2 px-3 rounded-md hover:bg-gray-100 focus:outline-none flex items-center"
                >
                  Join as
                  <svg
                    className={`ml-1 h-5 w-5 transform transition-transform duration-200 ${
                      isJoinOpen ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isJoinOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <a
                        href="#"
                        onClick={() => handleJoinOptionClick("teacher-login")}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                        role="menuitem"
                      >
                        Teacher
                      </a>
                      <a
                        href="#"
                        onClick={() => handleJoinOptionClick("student-login")}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                        role="menuitem"
                      >
                        Student
                      </a>
                      <a
                        href="#"
                        onClick={() => handleJoinOptionClick("admin-login")}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                        role="menuitem"
                      >
                        Admin
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {!isOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
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
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
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

      {/* --- মোবাইল ভিউ --- */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isUserDashboardPage ? (
              <>
                {/* --- ছাত্রের জন্য নতুন "Back to Dashboard" বাটন (মোবাইল, শর্তসাপেক্ষে) --- */}
                {showStudentDashboardButton && (
                  <button
                    onClick={() => {
                      setCurrentPage(studentMainDashboardPage);
                      setIsOpen(false);
                    }}
                    className="bg-indigo-500 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
                  >
                    Back to Dashboard
                  </button>
                )}

                {isTeacherDashboard && (
                  <>
                    <a
                      href="#"
                      onClick={() => {
                        setCurrentPage("teacher-dashboard-pending");
                        setIsOpen(false);
                      }}
                      className={`text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 ${
                        currentPage === "teacher-dashboard-pending"
                          ? "bg-gray-100 text-indigo-600"
                          : ""
                      }`}
                    >
                      Pending Questions
                    </a>
                    <a
                      href="#"
                      onClick={() => {
                        setCurrentPage("teacher-dashboard-solved");
                        setIsOpen(false);
                      }}
                      className={`text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 ${
                        currentPage === "teacher-dashboard-solved"
                          ? "bg-gray-100 text-indigo-600"
                          : ""
                      }`}
                    >
                      Solved Questions
                    </a>
                  </>
                )}
                {isAdminDashboard && (
                  <a
                    href="#"
                    onClick={() => {
                      setCurrentPage("admin-dashboard");
                      setIsOpen(false);
                    }}
                    className={`text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 ${
                      currentPage === "admin-dashboard" ||
                      currentPage.startsWith("admin-")
                        ? "bg-gray-100 text-indigo-600"
                        : ""
                    }`}
                  >
                    Admin Dashboard
                  </a>
                )}
                {(isStudentDashboard || isTeacherDashboard) && (
                  <div className="relative">
                    <button
                      onClick={handleNotificationClick}
                      className="p-2 text-gray-700 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors duration-200 w-full text-left relative"
                      title="Notifications"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 inline-block mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      Notifications
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </button>
                    {isNotificationsOpen && (
                      <div className="absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          {notifications.length === 0 ? (
                            <p className="px-4 py-2 text-sm text-gray-500">
                              No notifications.
                            </p>
                          ) : (
                            notifications
                              .filter(
                                (notif) =>
                                  notif.recipientEmail === loggedInUser.email
                              )
                              .map((notif) => (
                                <div
                                  key={notif.id}
                                  onClick={() =>
                                    handleNotificationItemClick(notif)
                                  }
                                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                                    notif.read ? "bg-gray-50" : "font-semibold"
                                  }`}
                                  role="menuitem"
                                >
                                  <p>{notif.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {notif.timestamp}
                                  </p>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <a
                  href="#"
                  onClick={() => {
                    setCurrentPage(getProfilePage());
                    setIsOpen(false);
                  }}
                  className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 text-center w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="#courses-section"
                  onClick={(e) => {
                    setIsCoursesOnlyView(false);
                    scrollToCourses(e);
                  }}
                  className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                >
                  Courses
                </a>
                <div className="relative" ref={joinRef}>
                  <button
                    onClick={() => setIsJoinOpen(!isJoinOpen)}
                    className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left focus:outline-none flex items-center justify-between"
                  >
                    Join as
                    <svg
                      className={`ml-1 h-5 w-5 transform transition-transform duration-200 ${
                        isJoinOpen ? "rotate-180" : "rotate-0"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {isJoinOpen && (
                    <div className="pl-4 py-1 space-y-1">
                      <a
                        href="#"
                        onClick={() => handleJoinOptionClick("teacher-login")}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md"
                      >
                        Teacher
                      </a>
                      <a
                        href="#"
                        onClick={() => handleJoinOptionClick("student-login")}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md"
                      >
                        Student
                      </a>
                      <a
                        href="#"
                        onClick={() => handleJoinOptionClick("admin-login")}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md"
                      >
                        Admin
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
