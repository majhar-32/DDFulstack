// File: majhar-32/ddfulstack/DDFulstack-1ecabd13a3204c7f675cae2434dfefed0789ff48/ddfrontend/my-project/src/components/teacher/SolutionForm.jsx

import React, { useState, useContext, useRef, useEffect } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import AttachmentDisplay from "../common/AttachmentDisplay";

const SolutionForm = ({ question, onCancel, onSolutionSuccess }) => {
  const { loggedInUser, addNotification } = useContext(AuthContext);
  const [solutionText, setSolutionText] = useState("");
  const [error, setError] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // New states and refs for new features
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCapturingVideo, setIsCapturingVideo] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const currentStreamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // File upload function updated to handle files from any source
  const handleFileUpload = async (files) => {
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
    }
  };

  const removeAttachment = (fileNameToRemove) => {
    setAttachments(
      attachments.filter((att) => att.fileName !== fileNameToRemove)
    );
  };

  // Voice Recording Functions
  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/mp3",
          });
          const audioFile = new File(
            [audioBlob],
            `voice-note-${Date.now()}.mp3`,
            { type: "audio/mp3" }
          );
          handleFileUpload([audioFile]);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Recording not allowed", err);
        setError("Microphone access denied or not available.");
      }
    }
  };

  const handleStopAndAttachRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCancelRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  // Camera Functions
  const handleCameraOpen = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true, // For video recording
        });
        currentStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOpen(true);
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Camera access denied or not available.");
      }
    }
  };

  const handleCameraCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const imageFile = new File([blob], `capture-${Date.now()}.png`, {
            type: "image/png",
          });
          handleFileUpload([imageFile]);
          handleCameraClose();
        }
      }, "image/png");
    }
  };

  const handleStartVideoRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        currentStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        let localVideoChunks = [];
        mediaRecorder.ondataavailable = (e) => {
          localVideoChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const videoBlob = new Blob(localVideoChunks, { type: "video/mp4" });
          const videoFile = new File([videoBlob], `video-${Date.now()}.mp4`, {
            type: "video/mp4",
          });
          handleFileUpload([videoFile]);
          localVideoChunks = [];
        };
        mediaRecorder.start();
        setIsCapturingVideo(true);
        setIsCameraOpen(true);
      } catch (err) {
        console.error("Video recording not allowed", err);
        setError("Camera/Microphone access denied or not available.");
      }
    }
  };

  const handleStopVideoRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsCapturingVideo(false);
      handleCameraClose();
    }
  };

  const handleCameraClose = () => {
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach((track) => track.stop());
      currentStreamRef.current = null;
    }
    setIsCameraOpen(false);
    setIsCapturingVideo(false);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    handleFileUpload(e.target.files);
    e.target.value = null; // Clear input field
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
              <div className="flex items-center space-x-4 mb-4">
                <label
                  htmlFor="file-upload"
                  className="bg-purple-600 text-white rounded-full p-3 cursor-pointer hover:bg-purple-700 transition-colors duration-200"
                >
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
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
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.415a4 4 0 105.656 5.656l6.586-6.586"
                    />
                  </svg>
                </label>

                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="bg-green-600 text-white rounded-full p-3 cursor-pointer hover:bg-green-700 transition-colors duration-200"
                    title="Start Voice Recording"
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
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-200 rounded-full animate-pulse">
                    <span className="text-sm text-red-500 font-semibold">
                      Recording...
                    </span>
                    <button
                      type="button"
                      onClick={handleStopAndAttachRecording}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
                    >
                      Stop & Attach
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelRecording}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCameraOpen}
                  className="bg-blue-600 text-white rounded-full p-3 cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                  title="Open Camera"
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
                      d="M3 9a2 2 0 012-2h.931a2 2 0 001.667-.923l.333-.667A2 2 0 019.069 5H14c.974 0 1.83.626 2.222 1.577l.333.666A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>

              {isUploading && (
                <p className="text-sm text-blue-600 mt-2">Uploading...</p>
              )}
              <AttachmentDisplay
                attachments={attachments}
                onRemove={removeAttachment}
              />
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

          {isCameraOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center p-4 z-50">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="max-h-[70vh] rounded-lg shadow-lg"
              ></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
              <div className="mt-4 space-x-4">
                <button
                  type="button"
                  onClick={handleCameraCapture}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg"
                >
                  Capture Image
                </button>
                {!isCapturingVideo ? (
                  <button
                    type="button"
                    onClick={handleStartVideoRecording}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg"
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopVideoRecording}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-5 rounded-lg"
                  >
                    Stop Recording
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCameraClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-lg"
                >
                  Close Camera
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SolutionForm;
