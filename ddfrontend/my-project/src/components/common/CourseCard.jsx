import React from "react";

const CourseCard = ({
  topTitle,
  programTitle,
  courseName,
  features,
  priceText,
  enrollButtonText,
  isEnrolled,
  onEnrollClick,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 border border-gray-200 overflow-hidden">
      <div className="w-full bg-indigo-700 text-white py-4 px-4 -mx-4 -mt-4 mb-4 rounded-t-xl">
        <h3 className="text-3xl font-extrabold mb-1 leading-tight">
          {topTitle}
        </h3>
        <p className="text-xl font-semibold text-yellow-400">{programTitle}</p>
      </div>

      <h4 className="text-2xl font-bold text-gray-800 mb-4 px-2 leading-tight">
        {courseName}
      </h4>

      <ul className="list-disc list-inside p-0 mb-6 text-gray-700 flex-grow w-full px-4 text-left space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 text-indigo-600">•</span>
            <span className="flex-grow">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-auto px-2">
        {priceText && (
          <a
            href="#"
            className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-md"
          >
            {priceText}
          </a>
        )}
        {enrollButtonText && (
          <button
            onClick={() => onEnrollClick(courseName)}
            className={`flex-1 text-white px-6 py-3 rounded-md font-semibold transition-colors duration-200 shadow-md ${
              isEnrolled
                ? "bg-gray-500 cursor-not-allowed" // স্টাইল পরিবর্তন
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isEnrolled} // বাটনটি disable করা হলো
          >
            {isEnrolled ? "Already Enrolled" : enrollButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
