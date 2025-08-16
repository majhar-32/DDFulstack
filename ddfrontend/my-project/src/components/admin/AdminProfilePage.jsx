import React, { useState, useEffect } from "react";

const AdminProfilePage = ({ setCurrentPage, loggedInUser }) => {
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "admin") {
      const admins = JSON.parse(localStorage.getItem("doubtDeskAdmins")) || [];
      const currentAdmin = admins.find((a) => a.email === loggedInUser.email);

      if (!currentAdmin && loggedInUser.email === "admin@doubtdesk.com") {
        setAdminInfo({
          name: "DoubtDesk Admin",
          phoneNumber: "01XXXXXXXXX",
          email: "admin@doubtdesk.com",
        });
      } else {
        setAdminInfo(currentAdmin);
      }
    }
  }, [loggedInUser]);

  if (!adminInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <p className="text-lg text-gray-700">Loading admin profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full text-center border border-red-200">
        <h2 className="text-4xl font-bold text-red-600 mb-8">Admin Profile</h2>
        <div className="space-y-4 text-left">
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Name:</span>{" "}
            {adminInfo.name || "N/A"}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Email:</span> {adminInfo.email}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Phone Number:</span>{" "}
            {adminInfo.phoneNumber || "N/A"}
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage("admin-dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
