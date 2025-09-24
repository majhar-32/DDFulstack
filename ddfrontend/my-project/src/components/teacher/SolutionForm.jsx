import React, { useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import AttachmentDisplay from "../common/AttachmentDisplay"; // নতুন কম্পোনেন্ট ইম্পোর্ট

const SolutionForm = ({ question, onCancel, onSolutionSuccess }) => {
  const { loggedInUser, addNotification } = useContext(AuthContext);
  const [solutionText, setSolutionText] = useState("");
  const [error, setError] = useState("");

  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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
        attachments: attachments,
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

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full">
          <h3 className="text-2xl font-bold text-blue-600 mb-4 text-center">
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
              {/* এখানে নতুন কম্পোনেন্ট ব্যবহার করা হয়েছে */}
              <AttachmentDisplay
                attachments={attachments}
                onRemove={removeAttachment}
              />
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg"
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
    </>
  );
};

export default SolutionForm;
