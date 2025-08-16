import React, { useState, useEffect } from "react";

const StudentProfilePage = ({ setCurrentPage, loggedInUser }) => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "student") {
      const students =
        JSON.parse(localStorage.getItem("doubtDeskStudents")) || [];
      const currentStudent = students.find(
        (s) => s.email === loggedInUser.email
      );
      setStudentInfo(currentStudent);

      const storedEnrolledCourses =
        JSON.parse(localStorage.getItem("enrolledCourses")) || [];
      const studentCourses = storedEnrolledCourses
        .filter((enrollment) => enrollment.studentEmail === loggedInUser.email)
        .map((enrollment) => enrollment.courseName);
      setEnrolledCourses(studentCourses);
    }
  }, [loggedInUser]);

  if (!studentInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <p className="text-lg text-gray-700">Loading student profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full text-center border border-indigo-200">
        <h2 className="text-4xl font-bold text-indigo-600 mb-8">
          Student Profile
        </h2>
        <div className="space-y-4 text-left">
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Email:</span> {studentInfo.email}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Grade/Level:</span>{" "}
            {studentInfo.gradeLevel}
          </p>
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Enrolled Courses:
            </h3>
            {enrolledCourses.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {enrolledCourses.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Not enrolled in any courses.</p>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage("student-dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
