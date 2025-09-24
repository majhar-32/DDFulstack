import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext"; // AuthContext ইম্পোর্ট করুন

const TeacherProfilePage = () => {
  const { loggedInUser } = useContext(AuthContext); // useContext ব্যবহার করে loggedInUser নিন
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "teacher") {
      const fetchTeacherProfile = async () => {
        try {
          setLoading(true);
          const response = await api.get(
            `/teachers/profile?email=${loggedInUser.email}`
          );
          setTeacherInfo(response.data);
        } catch (error) {
          console.error("Failed to load teacher profile:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTeacherProfile();
    }
  }, [loggedInUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <p className="text-lg text-gray-700">Loading teacher profile...</p>
      </div>
    );
  }

  if (!teacherInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <p className="text-lg text-red-500">Could not load teacher profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full text-center border border-green-200">
        <h2 className="text-4xl font-bold text-green-600 mb-8">
          Teacher Profile
        </h2>
        <div className="space-y-4 text-left">
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Name:</span> {teacherInfo.name}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Email:</span> {teacherInfo.email}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Institute:</span>{" "}
            {teacherInfo.institute}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Qualification:</span>{" "}
            {teacherInfo.qualification}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Questions Solved:</span>{" "}
            {teacherInfo.solvedQuestionsCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
