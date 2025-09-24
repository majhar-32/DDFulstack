import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import AskDoubtForm from "./AskDoubtForm";
import { AuthContext } from "../../context/AuthContext";
import AttachmentDisplay from "../common/AttachmentDisplay"; // নতুন কম্পোনেন্ট ইম্পোর্ট

const QuestionHistoryPage = () => {
  const { loggedInUser, addNotification } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const filterByCourseName = location.state?.courseName;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [selectedOriginalQuestion, setSelectedOriginalQuestion] =
    useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const fetchQuestions = async () => {
    if (!loggedInUser?.email) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      let url = `/questions/by-student?email=${loggedInUser.email}&page=${currentPage}&size=${pageSize}&sort=postAt,desc`;
      if (filterByCourseName) {
        url += `&courseName=${encodeURIComponent(filterByCourseName)}`;
      }
      const response = await api.get(url);
      setQuestions(response.data.content);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError("Failed to load question history.");
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [loggedInUser, filterByCourseName, currentPage]);

  const handleMarkSatisfied = async (questionId) => {
    try {
      await api.patch(`/questions/${questionId}/status/satisfied`);
      setQuestions(
        questions.map((q) =>
          q.questionId === questionId ? { ...q, status: "satisfied" } : q
        )
      );
    } catch (error) {
      alert("Failed to update status. Please try again.");
      console.error(error);
    }
  };

  const handleAskFollowUp = (question) => {
    setSelectedOriginalQuestion(question);
    setShowFollowUpForm(true);
  };

  const handleFollowUpSuccess = () => {
    setShowFollowUpForm(false);
    fetchQuestions();
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <p className="text-center p-8">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-8">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-3xl w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-purple-600 mb-6 text-center">
          {filterByCourseName
            ? `Questions for ${filterByCourseName}`
            : "Your Question History"}
        </h2>

        {questions.length === 0 && currentPage === 0 ? (
          <p className="text-lg text-gray-700 text-center">
            No questions found.
          </p>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => {
              const isSolved = question.status === "solved";
              return (
                <div
                  key={question.questionId}
                  className="bg-purple-50 p-4 rounded-lg shadow-sm border"
                >
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 mb-2">
                      {question.questionTitle}
                    </p>
                    <p className="text-gray-700">{question.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                      <span>
                        Subject:{" "}
                        <span className="font-semibold">
                          {question.subjectName}
                        </span>
                      </span>
                      <span>
                        Status:{" "}
                        <span className="font-semibold">{question.status}</span>
                      </span>
                    </div>

                    {/* এখানে প্রশ্ন অ্যাটাচমেন্টের জন্য নতুন কম্পোনেন্ট ব্যবহার করা হয়েছে */}
                    <AttachmentDisplay
                      attachments={question.questionAttachments}
                    />
                  </div>

                  {question.solutionText && (
                    <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-200 text-left">
                      <p className="font-semibold text-green-800 mb-1">
                        Solution by {question.solvedByTeacherName || "Teacher"}:
                      </p>
                      <p className="text-green-900 text-sm whitespace-pre-wrap">
                        {question.solutionText}
                      </p>

                      {/* এখানে উত্তর অ্যাটাচমেন্টের জন্য নতুন কম্পোনেন্ট ব্যবহার করা হয়েছে */}
                      <AttachmentDisplay
                        attachments={question.solutionAttachments}
                      />

                      {isSolved && (
                        <div className="flex space-x-2 mt-3 justify-end">
                          <button
                            onClick={() =>
                              handleMarkSatisfied(question.questionId)
                            }
                            className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-md"
                          >
                            Mark as Satisfied
                          </button>
                          <button
                            onClick={() => handleAskFollowUp(question)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md"
                          >
                            Ask Follow-up
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-lg text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {showFollowUpForm && (
        <AskDoubtForm
          isFollowUp={true}
          originalQuestion={selectedOriginalQuestion}
          onSuccess={handleFollowUpSuccess}
          onClose={() => setShowFollowUpForm(false)}
        />
      )}
    </div>
  );
};

export default QuestionHistoryPage;
