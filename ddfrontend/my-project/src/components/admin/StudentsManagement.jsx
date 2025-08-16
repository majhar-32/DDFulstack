import React, { useState, useEffect } from "react";
import api from "../../services/api"; // API সার্ভিস ইম্পোর্ট

const StudentsManagement = ({ setCurrentPage }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/students"); // নতুন API এন্ডপয়েন্ট
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load students.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      // স্ট্যাটাস পরিবর্তনের জন্য PATCH রিকোয়েস্ট
      await api.patch(`/admin/students/${userId}/status`, {
        isActive: !currentStatus,
      });
      // UI তে সাথে সাথে পরিবর্তন দেখানোর জন্য state আপডেট করা হচ্ছে
      setStudents(
        students.map((student) =>
          student.userId === userId
            ? { ...student, isActive: !currentStatus }
            : student
        )
      );
    } catch (err) {
      alert("Failed to update student status.");
      console.error(err);
    }
  };

  const handleDeleteStudent = (email) => {
    // ডিলিট করার কার্যকারিতা আপাতত কমেন্ট আউট করে রাখা হলো, কারণ এটি জটিল হতে পারে
    // (ছাত্রের সাথে সম্পর্কিত পেমেন্ট, প্রশ্ন ইত্যাদি ডিলিট করতে হবে)
    if (
      window.confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    ) {
      alert("Delete functionality is not yet implemented in the backend.");
      // try {
      //   await api.delete(`/admin/students/by-email?email=${email}`);
      //   fetchStudents(); // তালিকা রিফ্রেশ করা হচ্ছে
      // } catch (err) {
      //   alert("Failed to delete student.");
      // }
    }
  };

  // StudentResponseDTO-তে levelOfStudy যোগ করতে হবে
  // StudentServiceImpl-এর mapToStudentResponseDTO মেথডে নিচের লাইনটি যোগ করুন:
  // dto.setLevelOfStudy(student.getLevelOfStudy());
  // StudentResponseDTO তেও ফিল্ডটি যোগ করুন: private String levelOfStudy;

  if (loading) return <p className="text-center p-8">Loading students...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-8">
          Students ({students.length} Total)
        </h2>
        {students.length === 0 ? (
          <p className="text-lg text-gray-700">No students registered yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Grade/Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {student.levelOfStudy || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() =>
                          handleToggleStatus(student.userId, student.isActive)
                        }
                        className={`px-3 py-1 rounded-md font-medium ${
                          student.isActive
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {student.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.email)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-medium"
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
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage("admin-dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentsManagement;
