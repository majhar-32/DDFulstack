import React, { useState, useEffect } from "react";

const TeacherProfilePage = ({ setCurrentPage, loggedInUser }) => {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [solvedQuestionsCount, setSolvedQuestionsCount] = useState(0);

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "teacher") {
      const teachers =
        JSON.parse(localStorage.getItem("doubtDeskTeachers")) || [];
      const currentTeacher = teachers.find(
        (t) => t.email === loggedInUser.email
      );
      setTeacherInfo(currentTeacher);

      const allQuestions =
        JSON.parse(localStorage.getItem("doubtDeskQuestions")) || [];
      const solvedByThisTeacher = allQuestions.filter(
        (q) =>
          (q.status === "solved" || q.status === "follow-up-solved") &&
          q.solvedByTeacher === loggedInUser.email
      );
      setSolvedQuestionsCount(solvedByThisTeacher.length);
    }
  }, [loggedInUser]);

  if (!teacherInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <p className="text-lg text-gray-700">Loading teacher profile...</p>
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
            <span className="font-semibold">Email:</span> {teacherInfo.email}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Institute:</span>{" "}
            {teacherInfo.institute}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Questions Solved:</span>{" "}
            {solvedQuestionsCount}
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage("teacher-dashboard-pending")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
