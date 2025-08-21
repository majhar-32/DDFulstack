import React from "react";
import LoginPage from "../common/LoginPage";

const AdminLoginPage = ({ setLoggedInUser }) => {
  return (
    <LoginPage
      title="Admin Login"
      role="admin"
      formColor="red"
      setLoggedInUser={setLoggedInUser}
      registerLink="/register/admin"
    />
  );
};

export default AdminLoginPage;
