import React, { useState, useEffect } from "react";
import api from "../../services/api"; // api import করা হয়েছে

const AdminProfilePage = ({ loggedInUser }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true); // লোডিং স্টেট যোগ করা হয়েছে

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "admin") {
      const fetchAdminProfile = async () => {
        try {
          setLoading(true);
          // API থেকে অ্যাডমিনের প্রোফাইল তথ্য আনা হচ্ছে
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
