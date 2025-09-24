import React, { useState, useEffect } from "react";
import api from "../../services/api";

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/students");
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
      await api.patch(`/admin/students/${userId}/status`, {
        isActive: !currentStatus,
      });
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
    if (
      window.confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    ) {
      alert("Delete functionality is not yet implemented in the backend.");
    }
  };

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
                        {student.isActive ? "Inactive" : "Active"}
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
                        {student.isActive ? "Activate" : "Deactivate"}
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
      </div>
    </div>
  );
};

export default StudentsManagement;
