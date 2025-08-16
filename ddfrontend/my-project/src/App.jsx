import React, { useState, useRef, useEffect } from "react";
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

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [courseToEnroll, setCourseToEnroll] = useState(null);
  const [selectedCourseForSubjects, setSelectedCourseForSubjects] =
    useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const coursesSectionRef = useRef(null);
  const [isCoursesOnlyView, setIsCoursesOnlyView] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [highlightQuestionId, setHighlightQuestionId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // --- নতুন পরিবর্তন শুরু ---
  // এই state টি ছাত্রের কেনা কোর্সগুলোর নামের একটি Set রাখবে
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());

  // ছাত্র লগইন করলে বা কোনো কোর্সে এনরোল করলে তার কেনা কোর্সগুলো আবার নিয়ে আসা হবে
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
          console.error(
            "Failed to fetch enrolled courses for button state:",
            error
          );
        }
      } else {
        setEnrolledCourses(new Set());
      }
    };

    fetchEnrolledCourses();
    // currentPage পরিবর্তন হলেও এই useEffect চলবে, যাতে এনরোল করার পর UI আপডেট হয়
  }, [loggedInUser, currentPage]);
  // --- নতুন পরিবর্তন শেষ ---

  // সব কোর্স নিয়ে আসার জন্য useEffect
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

  // localStorage সম্পর্কিত notification কোডগুলো অপরিবর্তিত
  useEffect(() => {
    if (loggedInUser && loggedInUser.email) {
      const storedNotifications =
        JSON.parse(localStorage.getItem("doubtDeskNotifications")) || [];
      const userNotifications = storedNotifications.filter(
        (notif) => notif.recipientEmail === loggedInUser.email
      );
      setNotifications(userNotifications);
    } else {
      setNotifications([]);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser && loggedInUser.email) {
      const storedNotifications =
        JSON.parse(localStorage.getItem("doubtDeskNotifications")) || [];
      const otherUserNotifications = storedNotifications.filter(
        (notif) => notif.recipientEmail !== loggedInUser.email
      );
      localStorage.setItem(
        "doubtDeskNotifications",
        JSON.stringify([...otherUserNotifications, ...notifications])
      );
    }
  }, [notifications, loggedInUser]);

  useEffect(() => {
    if (currentPage === "home-and-scroll" && coursesSectionRef.current) {
      coursesSectionRef.current.scrollIntoView({ behavior: "smooth" });
      setCurrentPage("home");
    }
  }, [currentPage]);

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
      setCurrentPage("student-login-for-enroll");
    } else {
      setCurrentPage("enrollment-form");
    }
  };

  // --- getEnrolledCoursesForCurrentUser ফাংশনটি মুছে ফেলা হয়েছে ---

  const addCourse = (newCourse) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
      case "home-and-scroll":
        return (
          <main className="p-8 text-center flex-grow">
            {!isCoursesOnlyView && (
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  From Confusion to Clarity — DoubtDesk
                </h1>
                <div className="flex flex-col md:flex-row mt-12 bg-white rounded-lg shadow-md max-w-6xl mx-auto overflow-hidden">
                  <div className="md:w-1/2 p-6 flex flex-col justify-center">
                    <h1 className="text-lg text-gray-700 font-bold mb-2">
                      DoubtDesk – Your Personal Doubt-Solving Companion
                    </h1>
                    <p className="text-gray-600 leading-relaxed mb-2">
                      Struggling with a question? DoubtDesk helps students get
                      clear, subject-specific answers from expert teachers.
                    </p>
                  </div>
                  <div className="md:w-1/2 h-full">
                    <img
                      src="stress.png"
                      alt="Student thinking"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
            <section
              id="courses-section"
              className={`mt-16 ${isCoursesOnlyView ? "mt-0" : ""}`}
              ref={coursesSectionRef}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-10">
                Our Popular Courses
              </h2>
              {loadingCourses ? (
                <p>Loading courses...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.courseId}
                      topTitle={course.category}
                      programTitle={course.title}
                      courseName={course.title}
                      features={[
                        "All subjects covered",
                        "Ask unlimited questions",
                        "24/7 doubt posting facility",
                      ]}
                      priceText={`${course.price} BDT`}
                      enrollButtonText="Enroll Now"
                      onEnrollClick={handleEnrollClick}
                      // --- মূল পরিবর্তন এখানে ---
                      isEnrolled={enrolledCourses.has(course.title)}
                    />
                  ))}
                </div>
              )}
            </section>
          </main>
        );

      // --- বাকি সব case অপরিবর্তিত থাকবে ---
      case "teacher-registration":
        return <TeacherRegistrationForm setCurrentPage={setCurrentPage} />;
      case "student-registration":
        return <StudentRegistrationForm setCurrentPage={setCurrentPage} />;
      case "admin-registration":
        return <AdminRegistrationForm setCurrentPage={setCurrentPage} />;
      case "student-login":
        return (
          <StudentLoginPage
            setCurrentPage={setCurrentPage}
            setLoggedInUser={setLoggedInUser}
          />
        );
      case "student-login-for-enroll":
        return (
          <StudentLoginPage
            setCurrentPage={(page) => {
              if (page === "student-dashboard") {
                setCurrentPage("enrollment-form");
              } else {
                setCurrentPage(page);
              }
            }}
            setLoggedInUser={setLoggedInUser}
            isEnrollmentFlow={true}
          />
        );
      case "teacher-login":
        return (
          <TeacherLoginPage
            setCurrentPage={setCurrentPage}
            setLoggedInUser={setLoggedInUser}
          />
        );
      case "admin-login":
        return (
          <AdminLoginPage
            setCurrentPage={setCurrentPage}
            setLoggedInUser={setLoggedInUser}
          />
        );
      case "student-dashboard":
        return (
          <StudentDashboard
            setCurrentPage={setCurrentPage}
            setSelectedCourseForSubjects={setSelectedCourseForSubjects}
            loggedInUser={loggedInUser}
            setIsCoursesOnlyView={setIsCoursesOnlyView}
          />
        );
      case "teacher-dashboard-pending":
        return (
          <PendingQuestionsDashboard
            setCurrentPage={setCurrentPage}
            loggedInUser={loggedInUser}
            addNotification={addNotification}
            highlightQuestionId={highlightQuestionId}
            setHighlightQuestionId={setHighlightQuestionId}
          />
        );
      case "teacher-dashboard-solved":
        return (
          <SolvedQuestionsDashboard
            setCurrentPage={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      case "admin-dashboard":
        return (
          <AdminDashboard
            setCurrentPage={setCurrentPage}
            availableCourses={courses}
          />
        );
      case "admin-students":
        return <StudentsManagement setCurrentPage={setCurrentPage} />;
      case "admin-teachers":
        return <TeachersManagement setCurrentPage={setCurrentPage} />;
      case "admin-courses":
        return <CoursesManagement setCurrentPage={setCurrentPage} />;
      case "add-course-form":
        return (
          <AddCourseForm
            setCurrentPage={setCurrentPage}
            addCourse={addCourse}
          />
        );
      case "admin-qa":
        return <QuestionsAnswersManagement setCurrentPage={setCurrentPage} />;
      case "admin-money-flow":
        return (
          <MoneyFlowManagement
            setCurrentPage={setCurrentPage}
            availableCourses={courses}
          />
        );
      case "ask-doubt-for-course":
        return (
          <AskDoubtForm
            setCurrentPage={setCurrentPage}
            preselectedCourseName={selectedCourseForSubjects}
            loggedInUser={loggedInUser}
            addNotification={addNotification}
          />
        );
      case "question-history-for-course":
        return (
          <QuestionHistoryPage
            setCurrentPage={setCurrentPage}
            loggedInUser={loggedInUser}
            highlightQuestionId={highlightQuestionId}
            setHighlightQuestionId={setHighlightQuestionId}
            addNotification={addNotification}
            filterByCourseName={selectedCourseForSubjects}
          />
        );
      case "question-history":
        return (
          <QuestionHistoryPage
            setCurrentPage={setCurrentPage}
            loggedInUser={loggedInUser}
            highlightQuestionId={highlightQuestionId}
            setHighlightQuestionId={setHighlightQuestionId}
            addNotification={addNotification}
          />
        );
      case "enrollment-form":
        return (
          <EnrollmentForm
            courseName={courseToEnroll}
            setCurrentPage={setCurrentPage}
            loggedInUser={loggedInUser}
            availableCourses={courses}
          />
        );
      case "course-details":
        return (
          <CourseDetailsPage
            courseName={selectedCourseForSubjects}
            setCurrentPage={setCurrentPage}
            loggedInUser={loggedInUser}
            addNotification={addNotification}
            setHighlightQuestionId={setHighlightQuestionId}
          />
        );
      case "student-profile":
        return (
          <StudentProfilePage
            setCurrentPage={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      case "teacher-profile":
        return (
          <TeacherProfilePage
            setCurrentPage={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      case "admin-profile":
        return (
          <AdminProfilePage
            setCurrentPage={setCurrentPage}
            loggedInUser={loggedInUser}
          />
        );
      default:
        return (
          <main className="p-8 text-center flex-grow">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Page Not Found
            </h1>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
        setIsCoursesOnlyView={setIsCoursesOnlyView}
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        clearNotifications={clearNotifications}
        setHighlightQuestionId={setHighlightQuestionId}
      />
      {renderPage()}
      <Footer />
    </div>
  );
};

export default App;
