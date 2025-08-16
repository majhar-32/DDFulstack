import React, { useState } from "react";
import api from "../../services/api";

const SolutionForm = ({
  question,
  onCancel,
  loggedInUser,
  addNotification,
  onSolutionSuccess,
}) => {
  const [solutionText, setSolutionText] = useState("");
  const [error, setError] = useState("");

  // --- নতুন: ফাইল আপলোডের জন্য state ---
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError("");

    const uploadPromises = Array.from(files).map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    });

    try {
      const responses = await Promise.all(uploadPromises);
      const newAttachments = responses.map((res, index) => ({
        fileName: res.data.fileName,
        fileUrl: res.data.url,
        fileType: files[index].type,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (err) {
      setError("File upload failed. Please try again.");
      console.error("File upload error:", err);
    } finally {
      setIsUploading(false);
      event.target.value = null;
    }
  };

  const removeAttachment = (fileNameToRemove) => {
    setAttachments(
      attachments.filter((att) => att.fileName !== fileNameToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!solutionText.trim()) {
      setError("Please write a solution.");
      return;
    }
    setError("");

    try {
      const payload = {
        solutionText: solutionText,
        teacherEmail: loggedInUser.email,
        attachments: attachments, // <-- আপলোড করা ফাইলের তথ্য পাঠানো হচ্ছে
      };

      await api.post(`/questions/${question.questionId}/solve`, payload);

      if (question.studentEmail) {
        addNotification(
          question.studentEmail,
          question.questionId,
          `Your question "${question.questionTitle.substring(
            0,
            20
          )}..." has been solved!`
        );
      }

      onSolutionSuccess();
    } catch (err) {
      setError("Failed to submit solution. Please try again.");
      console.error("Solution submission error:", err);
    }
  };

  const handleEnlargeImage = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full">
          <h3 className="text-2xl font-bold text-green-600 mb-4 text-center">
            Solve Question
          </h3>
          <div className="mb-4 p-4 bg-gray-50 rounded-md border text-left">
            <p className="font-semibold">{question.questionTitle}</p>
            <p className="text-gray-700 text-sm">{question.description}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="solutionText"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Your Solution:
              </label>
              <textarea
                id="solutionText"
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                rows="8"
                placeholder="Write your detailed solution here..."
                className={`shadow-sm border rounded-md w-full py-3 px-4 ${
                  error ? "border-red-500" : ""
                }`}
              />
            </div>

            {/* --- নতুন: ফাইল আপলোড সেকশন --- */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Attach Files:
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {isUploading && (
                <p className="text-sm text-blue-600 mt-2">Uploading...</p>
              )}
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {attachments.map((att, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg p-2 group"
                  >
                    {att.fileType.startsWith("image/") ? (
                      <img
                        src={att.fileUrl}
                        alt={att.fileName}
                        className="w-full h-24 object-contain rounded-md cursor-pointer"
                        onClick={() => handleEnlargeImage(att.fileUrl)}
                      />
                    ) : (
                      <div className="h-24 flex flex-col items-center justify-center bg-gray-100 rounded-md p-2">
                        <span className="text-3xl">📄</span>
                        <span
                          className="block text-xs text-gray-700 truncate w-full"
                          title={att.fileName}
                        >
                          {att.fileName}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.fileName)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg"
              >
                Submit Solution
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-5 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- নতুন: ইমেজ বড় করে দেখানোর মোডাল --- */}
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
    </>
  );
};

export default SolutionForm;
