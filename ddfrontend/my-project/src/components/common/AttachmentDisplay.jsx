// File: majhar-32/ddfulstack/DDFulstack-1ecabd13a3204c7f675cae2434dfefed0789ff48/ddfrontend/my-project/src/components/common/AttachmentDisplay.jsx

import React, { useState } from "react";

const AttachmentDisplay = ({
  attachments,
  onRemove,
  onCaptureImage,
  onRecordAudio,
}) => {
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false); // New state for recording
  const [showCamera, setShowCamera] = useState(false); // New state for camera view

  if (!attachments || attachments.length === 0) {
    return null;
  }

  const handleEnlargeImage = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null);
  };

  const renderAttachment = (att) => {
    const isImage = att.fileType && att.fileType.startsWith("image/");
    const isVideo = att.fileType && att.fileType.startsWith("video/");
    const isAudio = att.fileType && att.fileType.startsWith("audio/");

    if (isImage) {
      return (
        <img
          src={att.fileUrl}
          alt={att.fileName}
          className="w-full h-24 object-contain rounded-md cursor-pointer"
          onClick={() => handleEnlargeImage(att.fileUrl)}
        />
      );
    } else if (isVideo) {
      return (
        <video
          src={att.fileUrl}
          controls
          className="w-full h-24 object-contain rounded-md"
        >
          Your browser does not support the video tag.
        </video>
      );
    } else if (isAudio) {
      return (
        <div className="h-24 flex items-center justify-center">
          <audio src={att.fileUrl} controls className="w-full" />
        </div>
      );
    } else {
      return (
        <a
          href={att.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-24 flex flex-col items-center justify-center bg-gray-100 rounded-md p-2"
        >
          <span className="text-3xl">📄</span>
          <span
            className="block text-xs text-gray-700 truncate w-full mt-1"
            title={att.fileName}
          >
            {att.fileName}
          </span>
        </a>
      );
    }
  };

  return (
    <>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {attachments.map((att, index) => (
          <div
            key={index}
            className="relative border rounded-lg p-2 group overflow-hidden"
          >
            {renderAttachment(att)}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(att.fileName)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
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

export default AttachmentDisplay;
