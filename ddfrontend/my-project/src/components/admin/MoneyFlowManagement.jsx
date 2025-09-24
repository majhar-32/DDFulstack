import React, { useState, useEffect } from "react";
import api from "../../services/api"; // API সার্ভিস ইম্পোর্ট

const MoneyFlowManagement = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoneyFlowData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/moneyflow"); // নতুন API এন্ডপয়েন্ট
        const data = response.data;
        setEnrollments(data);

        const revenue = data.reduce((sum, enrollment) => {
          return sum + (enrollment.amount || 0);
        }, 0);
        setTotalRevenue(revenue);

        setError(null);
      } catch (err) {
        setError("Failed to load financial data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoneyFlowData();
  }, []);

  if (loading)
    return <p className="text-center p-8">Loading financial data...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full text-center border border-red-200">
        <div className="mb-8 p-4 bg-red-50 rounded-lg shadow-sm">
          <p className="text-lg font-semibold text-red-700">Total Revenue</p>
          <p className="text-3xl font-bold text-red-800">{totalRevenue} BDT</p>
        </div>
        {enrollments.length === 0 ? (
          <p className="text-lg text-gray-700">No transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead className="bg-red-100 border-b border-red-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">
                    Student Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">
                    Amount (BDT)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.paymentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {enrollment.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {enrollment.studentEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {enrollment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {enrollment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(enrollment.paymentDate).toLocaleDateString()}
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

export default MoneyFlowManagement;
