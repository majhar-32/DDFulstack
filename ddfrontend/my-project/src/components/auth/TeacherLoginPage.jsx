import React from "react";
import LoginPage from "../common/LoginPage";

const TeacherLoginPage = () => {
  return (
    <LoginPage
      title="Teacher Login"
      role="teacher"
      formColor="yellow"
      registerLink="/register/teacher"
    />
  );
};

export default TeacherLoginPage;
