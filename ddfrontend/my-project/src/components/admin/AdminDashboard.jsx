import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    studentCount: 0,
    teacherCount: 0,
    courseCount: 0,
    pendingQuestionsCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all required data in parallel
        const [
          studentsRes,
          teachersRes,
          coursesRes,
          questionsRes,
          moneyflowRes,
        ] = await Promise.all([
          api.get("/admin/students"),
          api.get("/admin/teachers"),
          api.get("/courses"),
          api.get("/admin/questions"),
          api.get("/admin/moneyflow"),
        ]);

        const pendingQuestions = questionsRes.data.filter(
          (q) => q.status === "pending" || q.status === "follow-up-pending"
        ).length;

        const totalRevenue = moneyflowRes.data.reduce(
          (sum, item) => sum + item.amount,
          0
        );

        setStats({
          studentCount: studentsRes.data.length,
          teacherCount: teachersRes.data.length,
          courseCount: coursesRes.data.length,
          pendingQuestionsCount: pendingQuestions,
          totalRevenue: totalRevenue,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-6xl w-full text-center border border-red-200">
        <h2 className="text-4xl font-bold text-blue-500 mb-8">
          Admin Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-500 mb-3">
              Students ({stats.studentCount})
            </h3>
            <p className="text-gray-600">Manage student accounts and data.</p>
            <button
              onClick={() => navigate("/admin/students")}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-md"
            >
              View Students
            </button>
          </div>

          <div className="bg-green-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-500 mb-3">
              Teachers ({stats.teacherCount})
            </h3>
            <p className="text-gray-600">
              Manage teacher accounts and assignments.
            </p>
            <button
              onClick={() => navigate("/admin/teachers")}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-md"
            >
              View Teachers
            </button>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-500 mb-3">
              Courses ({stats.courseCount})
            </h3>
            <p className="text-gray-600">
              Manage course offerings and content.
            </p>
            <button
              onClick={() => navigate("/admin/courses")}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-md"
            >
              View Courses
            </button>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-500  mb-3">
              Questions & Answers ({stats.pendingQuestionsCount} Pending)
            </h3>
            <p className="text-gray-600">
              Monitor and review all questions and solutions.
            </p>
            <button
              onClick={() => navigate("/admin/qa")}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-md"
            >
              View Q&A
            </button>
          </div>

          <div className="bg-red-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-500 mb-3">
              Money Flow ({stats.totalRevenue} BDT)
            </h3>
            <p className="text-gray-600">
              Track financial transactions and revenue.
            </p>
            <button
              onClick={() => navigate("/admin/money-flow")}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium transition-colors duration-200 shadow-md"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
