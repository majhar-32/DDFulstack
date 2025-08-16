import React, { useState, useEffect } from "react";
import api from "../../services/api";
import AskDoubtForm from "./AskDoubtForm";

const QuestionHistoryPage = ({
  setCurrentPage,
  loggedInUser,
  addNotification,
  filterByCourseName = null,
}) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [selectedOriginalQuestion, setSelectedOriginalQuestion] =
    useState(null);

  // --- নতুন স্টেট: ইমেজ বড় করে দেখার জন্য ---
  const [enlargedImage, setEnlargedImage] = useState(null);

  const fetchQuestions = async () => {
    if (!loggedInUser?.email) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      let url = `/questions/by-student?email=${loggedInUser.email}`;
      if (filterByCourseName) {
        url += `&courseName=${encodeURIComponent(filterByCourseName)}`;
      }
      const response = await api.get(url);
      setQuestions(response.data);
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
  }, [loggedInUser, filterByCourseName]);

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

  // --- নতুন হ্যান্ডলার: ইমেজ বড় করার এবং বন্ধ করার জন্য ---
  const handleEnlargeImage = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null);
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

        {questions.length === 0 ? (
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
                  {/* প্রশ্নের বিবরণ */}
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
                    {/* ছাত্রের পাঠানো অ্যাটাচমেন্ট */}
                    {question.questionAttachments &&
                      question.questionAttachments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-gray-600">
                            Your Attachments:
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

                  {/* সমাধানের অংশ */}
                  {question.solutionText && (
                    <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-200 text-left">
                      <p className="font-semibold text-green-800 mb-1">
                        Solution by {question.solvedByTeacherName || "Teacher"}:
                      </p>
                      <p className="text-green-900 text-sm whitespace-pre-wrap">
                        {question.solutionText}
                      </p>

                      {/* শিক্ষকের পাঠানো অ্যাটাচমেন্ট */}
                      {question.solutionAttachments &&
                        question.solutionAttachments.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-gray-600">
                              Solution Attachments:
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {question.solutionAttachments.map(
                                (att, index) => (
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
                                )
                              )}
                            </div>
                          </div>
                        )}

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

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage("student-dashboard")}
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
          loggedInUser={loggedInUser}
          addNotification={addNotification}
          setCurrentPage={setCurrentPage}
          onSuccess={handleFollowUpSuccess}
          onClose={() => setShowFollowUpForm(false)}
        />
      )}

      {/* ইমেজ বড় করে দেখানোর মোডাল */}
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

export default QuestionHistoryPage;
