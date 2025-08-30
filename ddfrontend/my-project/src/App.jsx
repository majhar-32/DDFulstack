import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Component Imports
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import CourseCard from "./components/common/CourseCard";
import TeacherRegistrationForm from "./components/auth/TeacherRegistrationForm";
import StudentRegistrationForm from "./components/auth/StudentRegistrationForm";
import AdminRegistrationForm from "./components/auth/AdminRegistrationForm";
import StudentLoginPage from "./components/auth/StudentLoginPage";
import TeacherLoginPage from "./components/auth/TeacherLoginPage";
import AdminLoginPage from "./components/auth/AdminLoginPage";
import StudentDashboard from "./components/student/StudentDashboard";
import PendingQuestionsDashboard from "./components/teacher/PendingQuestionsDashboard";
import SolvedQuestionsDashboard from "./components/teacher/SolvedQuestionsDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import StudentsManagement from "./components/admin/StudentsManagement";
import TeachersManagement from "./components/admin/TeachersManagement";
import CoursesManagement from "./components/admin/CoursesManagement";
import AddCourseForm from "./components/admin/AddCourseForm";
import QuestionsAnswersManagement from "./components/admin/QuestionsAnswersManagement";
import MoneyFlowManagement from "./components/admin/MoneyFlowManagement";
import AskDoubtForm from "./components/student/AskDoubtForm";
import QuestionHistoryPage from "./components/student/QuestionHistoryPage";
import CourseDetailsPage from "./components/student/CourseDetailsPage";
import EnrollmentForm from "./components/student/EnrollmentForm";
import StudentProfilePage from "./components/student/StudentProfilePage";
import TeacherProfilePage from "./components/teacher/TeacherProfilePage";
import AdminProfilePage from "./components/admin/AdminProfilePage";
import api from "./services/api";
import HomePage from "./components/common/HomePage";

const App = () => {
  const [courseToEnroll, setCourseToEnroll] = useState(null);
  const [selectedCourseForSubjects, setSelectedCourseForSubjects] =
    useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const coursesSectionRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [highlightQuestionId, setHighlightQuestionId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const navigate = useNavigate();

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
    if (!loggedInUser || loggedInUser.role !== "student") {
      navigate("/login/student");
    } else {
      navigate("/student/enroll");
    }
  };

  const handleEnrollSuccess = (newlyEnrolledCourse) => {
    setEnrolledCourses(
      (prevEnrolledCourses) =>
        new Set([...prevEnrolledCourses, newlyEnrolledCourse])
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Navbar
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        clearNotifications={clearNotifications}
        setHighlightQuestionId={setHighlightQuestionId}
      />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                courses={courses}
                handleEnrollClick={handleEnrollClick}
                enrolledCourses={enrolledCourses}
                loadingCourses={loadingCourses}
                coursesSectionRef={coursesSectionRef}
              />
            }
          />

          {/* Auth Routes */}
          <Route
            path="/register/student"
            element={<StudentRegistrationForm />}
          />
          <Route
            path="/register/teacher"
            element={<TeacherRegistrationForm />}
          />
          <Route path="/register/admin" element={<AdminRegistrationForm />} />
          <Route
            path="/login/student"
            element={<StudentLoginPage setLoggedInUser={setLoggedInUser} />}
          />
          <Route
            path="/login/teacher"
            element={<TeacherLoginPage setLoggedInUser={setLoggedInUser} />}
          />
          <Route
            path="/login/admin"
            element={<AdminLoginPage setLoggedInUser={setLoggedInUser} />}
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <StudentDashboard
                loggedInUser={loggedInUser}
                setSelectedCourseForSubjects={setSelectedCourseForSubjects}
              />
            }
          />
          <Route
            path="/student/course-details"
            element={
              <CourseDetailsPage courseName={selectedCourseForSubjects} />
            }
          />
          <Route
            path="/student/ask-doubt"
            element={
              <AskDoubtForm
                loggedInUser={loggedInUser}
                addNotification={addNotification}
              />
            }
          />
          <Route
            path="/student/question-history"
            element={
              <QuestionHistoryPage
                loggedInUser={loggedInUser}
                addNotification={addNotification}
              />
            }
          />
          <Route
            path="/student/enroll"
            element={
              <EnrollmentForm
                courseName={courseToEnroll}
                loggedInUser={loggedInUser}
                onEnrollSuccess={handleEnrollSuccess}
              />
            }
          />
          <Route
            path="/student/profile"
            element={<StudentProfilePage loggedInUser={loggedInUser} />}
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <PendingQuestionsDashboard
                loggedInUser={loggedInUser}
                addNotification={addNotification}
              />
            }
          />
          <Route
            path="/teacher/solved"
            element={<SolvedQuestionsDashboard loggedInUser={loggedInUser} />}
          />
          <Route
            path="/teacher/profile"
            element={<TeacherProfilePage loggedInUser={loggedInUser} />}
          />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<StudentsManagement />} />
          <Route path="/admin/teachers" element={<TeachersManagement />} />
          <Route path="/admin/courses" element={<CoursesManagement />} />
          <Route path="/admin/add-course" element={<AddCourseForm />} />
          <Route path="/admin/qa" element={<QuestionsAnswersManagement />} />
          <Route path="/admin/money-flow" element={<MoneyFlowManagement />} />
          <Route
            path="/admin/profile"
            element={<AdminProfilePage loggedInUser={loggedInUser} />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
