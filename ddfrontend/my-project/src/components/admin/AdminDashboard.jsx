import React, { useState, useEffect } from "react";

const AdminDashboard = ({ setCurrentPage, availableCourses }) => {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [pendingQuestionsCount, setPendingQuestionsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const students =
      JSON.parse(localStorage.getItem("doubtDeskStudents")) || [];
    setStudentCount(students.length);

    const teachers =
      JSON.parse(localStorage.getItem("doubtDeskTeachers")) || [];
    const activeTeachers = teachers.filter(
      (teacher) => teacher.isActive !== false
    );
    setTeacherCount(activeTeachers.length);

    setCourseCount(availableCourses.length);

    const questions =
      JSON.parse(localStorage.getItem("doubtDeskQuestions")) || [];
    const pending = questions.filter(
      (q) => q.status === "pending" || q.status === "follow-up-pending"
    );
    setPendingQuestionsCount(pending.length);

    const enrolledCourses =
      JSON.parse(localStorage.getItem("enrolledCourses")) || [];
    const revenue = enrolledCourses.reduce((sum, enrollment) => {
      const coursePrice =
        availableCourses.find((c) => c.courseName === enrollment.courseName)
          ?.priceText || "0 BDT";
      const priceValue = parseInt(coursePrice.replace(" BDT", "")) || 0;
      return sum + priceValue;
    }, 0);
    setTotalRevenue(revenue);
  }, [availableCourses]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-6xl w-full text-center border border-red-200">
        <h2 className="text-4xl font-bold text-red-600 mb-8">
          Admin Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">
              Students ({studentCount})
            </h3>
            <p className="text-gray-600">Manage student accounts and data.</p>
            <button
              onClick={() => setCurrentPage("admin-students")}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-md"
            >
              View Students
            </button>
          </div>

          <div className="bg-green-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-green-700 mb-3">
              Teachers ({teacherCount})
            </h3>
            <p className="text-gray-600">
              Manage teacher accounts and assignments.
            </p>
            <button
              onClick={() => setCurrentPage("admin-teachers")}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-md"
            >
              View Teachers
            </button>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-yellow-700 mb-3">
              Courses ({courseCount})
            </h3>
            <p className="text-gray-600">
              Manage course offerings and content.
            </p>
            <button
              onClick={() => setCurrentPage("admin-courses")}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-md"
            >
              View Courses
            </button>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-purple-700 mb-3">
              Questions & Answers ({pendingQuestionsCount} Pending)
            </h3>
            <p className="text-gray-600">
              Monitor and review all questions and solutions.
            </p>
            <button
              onClick={() => setCurrentPage("admin-qa")}
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-md"
            >
              View Q&A
            </button>
          </div>

          <div className="bg-red-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-red-700 mb-3">
              Money Flow ({totalRevenue} BDT)
            </h3>
            <p className="text-gray-600">
              Track financial transactions and revenue.
            </p>
            <button
              onClick={() => setCurrentPage("admin-money-flow")}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-md"
            >
              View Details
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage("home")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
