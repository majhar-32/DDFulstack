import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // AuthProvider ইম্পোর্ট করুন

// Component Imports
import HomePage from "./components/common/HomePage";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Auth Routes
      {
        path: "register/student",
        element: <StudentRegistrationForm />,
      },
      {
        path: "register/teacher",
        element: <TeacherRegistrationForm />,
      },
      {
        path: "register/admin",
        element: <AdminRegistrationForm />,
      },
      {
        path: "login/student",
        element: <StudentLoginPage />,
      },
      {
        path: "login/teacher",
        element: <TeacherLoginPage />,
      },
      {
        path: "login/admin",
        element: <AdminLoginPage />,
      },
      // Student Routes
      {
        path: "student/dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "student/course-details",
        element: <CourseDetailsPage />,
      },
      {
        path: "student/ask-doubt",
        element: <AskDoubtForm />,
      },
      {
        path: "student/question-history",
        element: <QuestionHistoryPage />,
      },
      {
        path: "student/enroll",
        element: <EnrollmentForm />,
      },
      {
        path: "student/profile",
        element: <StudentProfilePage />,
      },
      // Teacher Routes
      {
        path: "teacher/dashboard",
        element: <PendingQuestionsDashboard />,
      },
      {
        path: "teacher/solved",
        element: <SolvedQuestionsDashboard />,
      },
      {
        path: "teacher/profile",
        element: <TeacherProfilePage />,
      },
      // Admin Routes
      {
        path: "admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "admin/students",
        element: <StudentsManagement />,
      },
      {
        path: "admin/teachers",
        element: <TeachersManagement />,
      },
      {
        path: "admin/courses",
        element: <CoursesManagement />,
      },
      {
        path: "admin/add-course",
        element: <AddCourseForm />,
      },
      {
        path: "admin/qa",
        element: <QuestionsAnswersManagement />,
      },
      {
        path: "admin/money-flow",
        element: <MoneyFlowManagement />,
      },
      {
        path: "admin/profile",
        element: <AdminProfilePage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
