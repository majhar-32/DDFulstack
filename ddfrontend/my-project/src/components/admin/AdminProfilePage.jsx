import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext"; // AuthContext ইম্পোর্ট করুন

const AdminProfilePage = () => {
  const { loggedInUser } = useContext(AuthContext); // useContext ব্যবহার করে loggedInUser নিন
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "admin") {
      const fetchAdminProfile = async () => {
        try {
          setLoading(true);
          const response = await api.get(
            `/admin/profile?email=${loggedInUser.email}`
          );
          setAdminInfo(response.data);
        } catch (error) {
          console.error("Failed to load admin profile:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAdminProfile();
    }
  }, [loggedInUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <p className="text-lg text-gray-700">Loading admin profile...</p>
      </div>
    );
  }

  if (!adminInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <p className="text-lg text-red-500">Could not load admin profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full text-center border border-red-200">
        <h2 className="text-4xl font-bold text-red-600 mb-8">Admin Profile</h2>
        <div className="space-y-4 text-left">
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Name:</span> {adminInfo.name}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Email:</span> {adminInfo.email}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Role:</span> {adminInfo.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
