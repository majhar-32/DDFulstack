import React from "react";
import LoginPage from "../common/LoginPage";

const AdminLoginPage = () => {
  return (
    <LoginPage
      title="Admin Login"
      role="admin"
      formColor="red"
      registerLink="/register/admin"
    />
  );
};

export default AdminLoginPage;
