import React, { useState, useEffect, useContext } from "react";
import SolutionForm from "./SolutionForm";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext"; // AuthContext ইম্পোর্ট করুন

const PendingQuestionsDashboard = () => {
  const { loggedInUser, addNotification } = useContext(AuthContext); // useContext ব্যবহার করে state এবং ফাংশনগুলো নিন
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solvingQuestion, setSolvingQuestion] = useState(null);

  const [enlargedImage, setEnlargedImage] = useState(null);

  // পেইজিনেশন এর জন্য নতুন স্টেট যোগ করা হলো
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5; // প্রতি পেজে কতগুলো প্রশ্ন থাকবে

  const fetchPendingQuestions = async () => {
    if (!loggedInUser?.email) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // পেজ এবং সাইজ প্যারামিটার API কলে যুক্ত করা হলো
      const response = await api.get(
        `/questions/pending?email=${loggedInUser.email}&page=${currentPage}&size=${pageSize}`
      );

      setPendingQuestions(response.data.content); // `content` থেকে প্রশ্নগুলো নিন
      setTotalPages(response.data.totalPages); // মোট পেজের সংখ্যা সেট করুন
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
  }, [loggedInUser, currentPage]); // currentPage পরিবর্তন হলে নতুন করে প্রশ্ন লোড হবে

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

  const handleEnlargeImage = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null);
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

                  {question.questionAttachments &&
                    question.questionAttachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-gray-600">
                          Attachments:
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {question.questionAttachments.map((att, index) => (
                            <div
                              key={index}
                              className="relative border rounded-md p-1 hover:bg-gray-200"
                            >
                              {att.fileType &&
                              att.fileType.startsWith("image/") ? (
                                <img
                                  src={att.fileUrl}
                                  alt={att.fileName}
                                  className="w-16 h-16 object-contain rounded-md cursor-pointer"
                                  onClick={() =>
                                    handleEnlargeImage(att.fileUrl)
                                  }
                                />
                              ) : (
                                <a
                                  href={att.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-16 h-16 flex flex-col items-center justify-center bg-gray-100 rounded-md p-1"
                                >
                                  <span className="text-2xl">📄</span>
                                  <span
                                    className="block text-xs text-gray-500 truncate w-full"
                                    title={att.fileName}
                                  >
                                    File
                                  </span>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
                <button
                  onClick={() => handleSolveClick(question)}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium ml-0 md:ml-4 flex-shrink-0 self-center"
                >
                  Solve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* পেইজিনেশন বাটন */}
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

      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={handleCloseEnlargedImage}
        >
          <img
            src={enlargedImage}
            alt="Enlarged"
            className="max-w-[90vw] max-h-[90vh] cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 cursor-pointer"
            onClick={handleCloseEnlargedImage}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingQuestionsDashboard;
