import React, { useState, useEffect } from "react";
import api from "../../services/api"; // api import করা হয়েছে

const TeacherProfilePage = ({ loggedInUser }) => {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(true); // লোডিং স্টেট যোগ করা হয়েছে

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "teacher") {
      const fetchTeacherProfile = async () => {
        try {
          setLoading(true);
          // API থেকে শিক্ষকের প্রোফাইল তথ্য আনা হচ্ছে
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
