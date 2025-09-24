import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import AttachmentDisplay from "../common/AttachmentDisplay";

const courseSubjectsData = {
  "Engineering + Biology Admission Program 2025": [
    "Physics",
    "Chemistry",
    "Math",
    "Biology",
  ],
  "SSC Full Course (Science Group)": [
    "Physics",
    "Chemistry",
    "Higher Mathematics",
    "General Mathematics",
    "Biology",
    "ICT",
  ],
  "HSC 1st Year (Prime Batch)": [
    "Physics 1st Paper",
    "Chemistry 1st Paper",
    "Math 1st Paper",
    "Biology 1st Paper",
    "ICT",
  ],
};

const AskDoubtForm = ({
  isFollowUp = false,
  originalQuestion = null,
  onSuccess,
  onClose,
}) => {
  const { loggedInUser, addNotification } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedCourseName = location.state?.courseName;

  const [doubtDescription, setDoubtDescription] = useState("");
  const [doubtTitle, setDoubtTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(
    preselectedCourseName || ""
  );
  const [selectedSubject, setSelectedSubject] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [subjectsForCourse, setSubjectsForCourse] = useState([]);
  const [error, setError] = useState("");
  const [isPosted, setIsPosted] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isFollowUp) {
      const fetchEnrolledCourses = async () => {
        if (loggedInUser?.email) {
          try {
            const response = await api.get(
              `/students/courses?email=${loggedInUser.email}`
            );
            setEnrolledCourses(response.data);
            if (preselectedCourseName) {
              setSelectedCourse(preselectedCourseName);
            }
          } catch (err) {
            console.error("Could not fetch enrolled courses", err);
          }
        }
      };
      fetchEnrolledCourses();
    }
  }, [loggedInUser, preselectedCourseName, isFollowUp]);

  useEffect(() => {
    if (selectedCourse) {
      setSubjectsForCourse(courseSubjectsData[selectedCourse] || []);
    } else {
      setSubjectsForCourse([]);
    }
  }, [selectedCourse]);

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

  const removeAttachment = (fileName) => {
    setAttachments(attachments.filter((att) => att.fileName !== fileName));
  };

  const handlePostDoubt = async (e) => {
    e.preventDefault();
    if (
      !doubtTitle.trim() ||
      !doubtDescription.trim() ||
      (!isFollowUp && (!selectedCourse || !selectedSubject))
    ) {
      setError("All fields are required.");
      return;
    }

    setError("");
    try {
      const payload = {
        studentEmail: loggedInUser.email,
        courseName: isFollowUp ? originalQuestion.courseName : selectedCourse,
        subjectName: isFollowUp
          ? originalQuestion.subjectName
          : selectedSubject,
        questionTitle: doubtTitle,
        description: doubtDescription,
        attachments: attachments,
      };

      if (isFollowUp) {
        await api.post(
          `/questions/${originalQuestion.questionId}/follow-up`,
          payload
        );
        if (onSuccess) onSuccess();
      } else {
        await api.post("/questions", payload);
        setIsPosted(true);
        setTimeout(() => {
          navigate("/student/dashboard");
        }, 0);
      }
    } catch (err) {
      setError("Failed to post your doubt. Please try again.");
      console.error("Doubt posting error:", err);
    }
  };

  return (
    <div
      className={
        isFollowUp
          ? "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
          : "min-h-screen bg-gray-100 flex items-center justify-center p-4"
      }
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center relative">
        {isFollowUp && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <h2 className="text-4xl font-bold text-blue-600 mb-6">
          {isFollowUp ? "Ask a Follow-up" : "Ask a Doubt"}
        </h2>
        {isPosted && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
            Success! Your doubt has been posted. Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handlePostDoubt} className="space-y-6 text-left">
          {!isFollowUp && (
            <>
              <div>
                <label
                  htmlFor="selectCourse"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Select Course:
                </label>
                <select
                  id="selectCourse"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  disabled={!!preselectedCourseName}
                  className="shadow-sm border rounded-md w-full py-3 px-4"
                >
                  <option value="">-- Select an Enrolled Course --</option>
                  {enrolledCourses.map((course) => (
                    <option key={course.courseId} value={course.title}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              {selectedCourse && (
                <div>
                  <label
                    htmlFor="selectSubject"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Select Subject:
                  </label>
                  <select
                    id="selectSubject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="shadow-sm border rounded-md w-full py-3 px-4"
                  >
                    <option value="">-- Select a Subject --</option>
                    {subjectsForCourse.map((subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div>
            <label
              htmlFor="doubtTitle"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Question Title:
            </label>
            <input
              id="doubtTitle"
              type="text"
              value={doubtTitle}
              onChange={(e) => setDoubtTitle(e.target.value)}
              placeholder="e.g., Problem with Newton's second law"
              className="shadow-sm border rounded-md w-full py-3 px-4"
            />
          </div>
          <div>
            <label
              htmlFor="doubtDescription"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Your Doubt:
            </label>
            <textarea
              id="doubtDescription"
              value={doubtDescription}
              onChange={(e) => setDoubtDescription(e.target.value)}
              rows="6"
              placeholder="Describe your question in detail..."
              className="shadow-sm border rounded-md w-full py-3 px-4"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Attach Files (Image, Audio, Video):
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
            <AttachmentDisplay
              attachments={attachments}
              onRemove={removeAttachment}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs italic mt-1 text-left">
              {error}
            </p>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Post Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskDoubtForm;
