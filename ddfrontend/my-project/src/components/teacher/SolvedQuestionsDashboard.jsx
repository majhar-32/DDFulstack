import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import AttachmentDisplay from "../common/AttachmentDisplay";

const SolvedQuestionsDashboard = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewingQuestionDetails, setViewingQuestionDetails] = useState(null);

  useEffect(() => {
    const fetchSolvedQuestions = async () => {
      if (!loggedInUser?.email) return;
      try {
        setLoading(true);
        const response = await api.get(
          `/questions/solved-by-teacher?email=${loggedInUser.email}`
        );
        const sortedQuestions = response.data.sort(
          (a, b) => new Date(b.answerAt) - new Date(a.answerAt)
        );
        setSolvedQuestions(sortedQuestions);
        setError(null);
      } catch (err) {
        setError("Failed to load solved questions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSolvedQuestions();
  }, [loggedInUser]);

  const handleViewDetailsClick = async (questionId) => {
    try {
      const response = await api.get(`/questions/${questionId}`);
      setViewingQuestionDetails(response.data);
    } catch (err) {
      alert("Could not fetch question details.");
      console.error(err);
    }
  };

  const handleCloseDetailsView = () => {
    setViewingQuestionDetails(null);
  };

  if (loading)
    return <p className="text-center p-8">Loading solved questions...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-6">
          Solved Questions
        </h2>
        {solvedQuestions.length === 0 ? (
          <p className="text-lg text-gray-700">
            You haven't solved any questions yet.
          </p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
            {solvedQuestions.map((question) => (
              <div
                key={question.questionId}
                className="bg-green-50 p-4 rounded-lg shadow-sm border flex justify-between items-center"
              >
                <div className="text-left">
                  <p className="text-green-800 font-semibold">
                    {question.questionTitle}
                  </p>
                  <p className="text-xs text-gray-600">
                    Status:{" "}
                    <span className="font-medium">{question.status}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleViewDetailsClick(question.questionId)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-medium"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingQuestionDetails && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full text-left space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">
              Question Details
            </h3>

            <div>
              <p className="font-semibold text-gray-700">Student's Question:</p>
              <div className="p-3 bg-gray-50 rounded-md border mt-1">
                <p className="font-bold">
                  {viewingQuestionDetails.questionTitle}
                </p>
                <p className="whitespace-pre-wrap">
                  {viewingQuestionDetails.description}
                </p>
                <AttachmentDisplay
                  attachments={viewingQuestionDetails.questionAttachments}
                />
              </div>
            </div>

            <div>
              <p className="font-semibold text-green-700">Your Solution:</p>
              <div className="p-3 bg-green-50 rounded-md border border-green-200 mt-1">
                <p className="whitespace-pre-wrap">
                  {viewingQuestionDetails.solutionText}
                </p>
                <AttachmentDisplay
                  attachments={viewingQuestionDetails.solutionAttachments}
                />
              </div>
            </div>

            <div className="text-right mt-4">
              <button
                onClick={handleCloseDetailsView}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolvedQuestionsDashboard;
