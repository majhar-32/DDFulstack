import React, { useState, useEffect } from "react";
import api from "../../services/api"; // api import করা হয়েছে

const StudentProfilePage = ({ loggedInUser }) => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true); // লোডিং স্টেট যোগ করা হয়েছে

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "student") {
      const fetchStudentProfile = async () => {
        try {
          setLoading(true);
          // API থেকে ছাত্রের প্রোফাইল তথ্য আনা হচ্ছে
          const profileResponse = await api.get(
            `/students/profile?email=${loggedInUser.email}`
          );
          setStudentInfo(profileResponse.data);

          // API থেকে এনরোল করা কোর্সের তালিকা আনা হচ্ছে
          const coursesResponse = await api.get(
            `/students/courses?email=${loggedInUser.email}`
          );
          setEnrolledCourses(coursesResponse.data);
        } catch (error) {
          console.error("Failed to load student profile:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchStudentProfile();
    }
  }, [loggedInUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <p className="text-lg text-gray-700">Loading student profile...</p>
      </div>
    );
  }

  if (!studentInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <p className="text-lg text-red-500">Could not load student profile.</p>
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
            <span className="font-semibold">Name:</span> {studentInfo.name}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Email:</span> {studentInfo.email}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Institute:</span>{" "}
            {studentInfo.institute}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Grade/Level:</span>{" "}
            {studentInfo.levelOfStudy}
          </p>
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Enrolled Courses:
            </h3>
            {enrolledCourses.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {enrolledCourses.map((course) => (
                  <li key={course.courseId}>{course.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Not enrolled in any courses.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
