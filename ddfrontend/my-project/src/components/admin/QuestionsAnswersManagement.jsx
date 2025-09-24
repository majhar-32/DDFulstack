import React, { useState, useEffect } from "react";
import api from "../../services/api";
import AttachmentDisplay from "../common/AttachmentDisplay"; // নতুন কম্পোনেন্ট ইম্পোর্ট

const QuestionsAnswersManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingQuestion, setViewingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/questions");
      setQuestions(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load questions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this question permanently?"
      )
    ) {
      try {
        await api.delete(`/admin/questions/${questionId}`);
        setQuestions(questions.filter((q) => q.questionId !== questionId));
      } catch (err) {
        alert("Failed to delete the question. Please try again.");
        console.error("Delete question error:", err);
      }
    }
  };

  if (loading) return <p className="text-center p-8">Loading Q&A data...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-5xl w-full text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-8">
          Question & Answer Management ({questions.length} Total)
        </h2>

        {questions.length === 0 ? (
          <p className="text-lg text-gray-700">No questions asked yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase">
                    Solved By (Teacher)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {questions.map((item) => (
                  <tr key={item.questionId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.questionTitle?.substring(0, 30) || "N/A"}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.studentEmail || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.solvedByTeacherEmail || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "solved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => setViewingQuestion(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(item.questionId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingQuestion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Question Details
            </h3>
            <div className="text-left space-y-3">
              <p>
                <strong>Student:</strong> {viewingQuestion.studentEmail}
              </p>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="font-semibold">Question:</p>
                <p>{viewingQuestion.description}</p>
                <AttachmentDisplay
                  attachments={viewingQuestion.questionAttachments}
                />
              </div>
            </div>
            <div className="text-right mt-6">
              <button
                onClick={() => setViewingQuestion(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
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

export default QuestionsAnswersManagement;
