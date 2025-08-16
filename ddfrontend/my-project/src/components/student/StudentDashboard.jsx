import React, { useState, useEffect } from "react";
import api from "../../services/api"; // API সার্ভিস ইম্পোর্ট করা হয়েছে

const StudentDashboard = ({
  setCurrentPage,
  setSelectedCourseForSubjects,
  loggedInUser,
  setIsCoursesOnlyView,
}) => {
  // enrolledCourses এর পরিবর্তে এখন courses, loading, error state থাকবে
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect ব্যবহার করে ব্যাকএন্ড থেকে ডেটা আনা হচ্ছে
  useEffect(() => {
    // লগইন করা ইউজার না থাকলে ডেটা আনার চেষ্টা করা হবে না
    if (!loggedInUser || !loggedInUser.email) {
      setLoading(false);
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        // আমাদের নতুন API এন্ডপয়েন্টে GET রিকোয়েস্ট পাঠানো হচ্ছে
        const response = await api.get(
          `/students/courses?email=${loggedInUser.email}`
        );
        setCourses(response.data); // সার্ভার থেকে পাওয়া ডেটা state-এ সেট করা হচ্ছে
        setError(null);
      } catch (err) {
        setError("Failed to load enrolled courses. Please try again later.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [loggedInUser]); // loggedInUser পরিবর্তন হলে useEffect আবার চলবে

  const handleGoToCourse = (courseName) => {
    setSelectedCourseForSubjects(courseName);
    setCurrentPage("course-details");
  };

  // লোডিং حالة দেখানো হচ্ছে
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading your courses...</p>
      </div>
    );
  }

  // এরর حالة দেখানো হচ্ছে
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full text-center border border-indigo-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 p-6 rounded-lg shadow-md col-span-full">
            <h3 className="text-2xl font-semibold text-indigo-700 mb-3">
              Enrolled Courses
            </h3>
            {courses.length === 0 ? (
              <>
                <p className="text-gray-600">
                  You haven't enrolled in any courses yet.
                </p>
                <button
                  onClick={() => {
                    setIsCoursesOnlyView(true);
                    setCurrentPage("home-and-scroll");
                  }}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium"
                >
                  Buy Courses
                </button>
              </>
            ) : (
              <div className="space-y-3">
                {/* courses state থেকে ডেটা ম্যাপ করা হচ্ছে */}
                {courses.map((course) => (
                  <div
                    key={course.courseId} // এখন courseId ইউনিক কী হিসেবে ব্যবহৃত হবে
                    className="flex items-center justify-between bg-indigo-100 p-3 rounded-md shadow-sm"
                  >
                    <span className="text-indigo-800 font-medium">
                      {course.title} {/* courseName এর পরিবর্তে title */}
                    </span>
                    <button
                      onClick={() => handleGoToCourse(course.title)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Go to Course
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setIsCoursesOnlyView(true);
                    setCurrentPage("home-and-scroll");
                  }}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium"
                >
                  Buy More Courses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
