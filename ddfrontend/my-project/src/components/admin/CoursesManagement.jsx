import React, { useState, useEffect } from "react";
import api from "../../services/api"; // API সার্ভিস ইম্পোর্ট

const CoursesManagement = ({ setCurrentPage }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses"); // API থেকে কোর্স আনা হচ্ছে
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load courses.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (
      window.confirm("Are you sure you want to delete this course permanently?")
    ) {
      try {
        await api.delete(`/courses/${courseId}`); // API তে ডিলিট রিকোয়েস্ট
        // UI থেকে কোর্সটি সাথে সাথে মুছে ফেলা হচ্ছে
        setCourses(courses.filter((course) => course.courseId !== courseId));
      } catch (err) {
        alert("Failed to delete the course. Please try again.");
        console.error("Delete course error:", err);
      }
    }
  };

  if (loading) return <p className="text-center p-8">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full text-center">
        <h2 className="text-4xl font-bold text-yellow-600 mb-8">
          Courses Management ({courses.length} Total Courses)
        </h2>
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setCurrentPage("add-course-form")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Add New Course
          </button>
        </div>
        {courses.length === 0 ? (
          <p className="text-lg text-gray-700">No courses available yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase">
                    Price (BDT)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.courseId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {course.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteCourse(course.courseId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesManagement;
