// File: src/components/common/AttachmentDisplay.jsx
import React from "react";

const AttachmentDisplay = ({ attachments, onEnlargeImage }) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <p className="text-xs font-semibold text-gray-600">Attachments:</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {attachments.map((att, index) => (
          <div
            key={index}
            className="relative border rounded-md p-1 hover:bg-gray-200"
          >
            {att.fileType && att.fileType.startsWith("image/") ? (
              <img
                src={att.fileUrl}
                alt={att.fileName}
                className="w-16 h-16 object-contain rounded-md cursor-pointer"
                onClick={() => onEnlargeImage(att.fileUrl)}
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
  );
};

export default AttachmentDisplay;
