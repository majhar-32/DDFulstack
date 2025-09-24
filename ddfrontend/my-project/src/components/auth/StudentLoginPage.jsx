import React from "react";
import LoginPage from "../common/LoginPage";

const StudentLoginPage = () => {
  return (
    <LoginPage
      title="Student Login"
      role="student"
      formColor="yellow"
      registerLink="/register/student"
    />
  );
};

export default StudentLoginPage;
