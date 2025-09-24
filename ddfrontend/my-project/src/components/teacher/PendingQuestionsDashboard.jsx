import React, { useState, useEffect, useContext } from "react";
import SolutionForm from "./SolutionForm";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import AttachmentDisplay from "../common/AttachmentDisplay"; // নতুন কম্পোনেন্ট ইম্পোর্ট

const PendingQuestionsDashboard = () => {
  const { loggedInUser, addNotification } = useContext(AuthContext);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solvingQuestion, setSolvingQuestion] = useState(null);

  const [enlargedImage, setEnlargedImage] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const fetchPendingQuestions = async () => {
    if (!loggedInUser?.email) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(
        `/questions/pending?email=${loggedInUser.email}&page=${currentPage}&size=${pageSize}&sort=postAt,desc`
      );

      setPendingQuestions(response.data.content);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError("Failed to load pending questions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingQuestions();
  }, [loggedInUser, currentPage]);

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

  const handleSolveClick = (question) => {
    setSolvingQuestion(question);
  };

  const handleSolutionSuccess = () => {
    setSolvingQuestion(null);
    fetchPendingQuestions();
  };

  const handleCancelSolve = () => {
    setSolvingQuestion(null);
  };

  if (loading)
    return <p className="text-center p-8">Loading pending questions...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full text-center">
        <h2 className="text-4xl font-bold text-purple-600 mb-6">
          Pending Questions
        </h2>
        {pendingQuestions.length === 0 && currentPage === 0 ? (
          <p className="text-lg text-gray-700">
            No pending questions assigned to you.
          </p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            {pendingQuestions.map((question) => (
              <div
                key={question.questionId}
                className="bg-blue-50 p-4 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="text-left flex-grow mb-3 md:mb-0">
                  <p className="text-blue-800 font-semibold">
                    {question.questionTitle}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {question.description}
                  </p>
                  {question.status === "follow-up-pending" && (
                    <p className="text-orange-600 text-sm font-semibold mt-1">
                      (Follow-up Question)
                    </p>
                  )}
                  <AttachmentDisplay
                    attachments={question.questionAttachments}
                  />
                </div>
                <button
                  onClick={() => handleSolveClick(question)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium ml-0 md:ml-4 flex-shrink-0 self-center"
                >
                  Solve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
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

      {solvingQuestion && (
        <SolutionForm
          question={solvingQuestion}
          onCancel={handleCancelSolve}
          onSolutionSuccess={handleSolutionSuccess}
        />
      )}
    </div>
  );
};

export default PendingQuestionsDashboard;
