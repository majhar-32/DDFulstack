import React, { useState, useEffect } from "react";
import api from "../../services/api"; // API সার্ভিস ইম্পোর্ট

const TeachersManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/teachers");
      setTeachers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load teachers.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/teachers/${userId}/status`, {
        isActive: !currentStatus,
      });
      setTeachers(
        teachers.map((teacher) =>
          teacher.userId === userId
            ? { ...teacher, isActive: !currentStatus }
            : teacher
        )
      );
    } catch (err) {
      alert("Failed to update teacher status.");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center p-8">Loading teachers...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full text-center">
        <h2 className="text-4xl font-bold text-green-600 mb-8">
          Teachers ({teachers.length} Total)
        </h2>
        {teachers.length === 0 ? (
          <p className="text-lg text-gray-700">No teachers registered yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">
                    Institute
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">
                    Questions Solved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {teacher.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {teacher.institute}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {teacher.solvedQuestionsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          teacher.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {teacher.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() =>
                          handleToggleStatus(teacher.userId, teacher.isActive)
                        }
                        className={`px-4 py-2 rounded-md font-medium ${
                          teacher.isActive
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {teacher.isActive ? "Deactivate" : "Activate"}
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

export default TeachersManagement;
