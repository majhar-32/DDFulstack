import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [courseToEnroll, setCourseToEnroll] = useState(null);
  const [selectedCourseForSubjects, setSelectedCourseForSubjects] =
    useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [highlightQuestionId, setHighlightQuestionId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await api.get("/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (loggedInUser && loggedInUser.role === "student") {
        try {
          const response = await api.get(
            `/students/courses?email=${loggedInUser.email}`
          );
          setEnrolledCourses(
            new Set(response.data.map((course) => course.title))
          );
        } catch (error) {
          console.error("Failed to fetch enrolled courses:", error);
        }
      } else {
        setEnrolledCourses(new Set());
      }
    };
    fetchEnrolledCourses();
  }, [loggedInUser]);

  const addNotification = (
    recipientEmail,
    questionId,
    message,
    type = "solution"
  ) => {
    const newNotification = {
      id: Date.now(),
      recipientEmail,
      questionId,
      message,
      read: false,
      timestamp: new Date().toLocaleString(),
      type,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleEnrollClick = (courseName) => {
    setCourseToEnroll(courseName);
  };

  const handleEnrollSuccess = (newlyEnrolledCourse) => {
    setEnrolledCourses(
      (prevEnrolledCourses) =>
        new Set([...prevEnrolledCourses, newlyEnrolledCourse])
    );
  };

  const value = {
    courseToEnroll,
    setCourseToEnroll,
    selectedCourseForSubjects,
    setSelectedCourseForSubjects,
    loggedInUser,
    setLoggedInUser,
    notifications,
    setNotifications,
    highlightQuestionId,
    setHighlightQuestionId,
    courses,
    loadingCourses,
    enrolledCourses,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    handleEnrollClick,
    handleEnrollSuccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
