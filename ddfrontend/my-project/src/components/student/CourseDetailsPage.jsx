import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // AuthContext ইম্পোর্ট করুন

const CourseDetailsPage = () => {
  const { selectedCourseForSubjects: courseName } = useContext(AuthContext); // useContext ব্যবহার করে courseName নিন
  const navigate = useNavigate();

  const handleAskDoubtClick = () => {
    // We pass the courseName via state to the next route
    navigate("/student/ask-doubt", { state: { courseName: courseName } });
  };

  const handleViewQuestionsClick = () => {
    navigate("/student/question-history", {
      state: { courseName: courseName },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center border border-blue-200">
        <h2 className="text-4xl font-bold text-blue-600 mb-6">
          {courseName} Details
        </h2>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleAskDoubtClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Ask a Doubt for this Course
          </button>
          <button
            onClick={handleViewQuestionsClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            View Questions for this Course
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
