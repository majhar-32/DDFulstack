
import React from "react";
import LoginPage from "../common/LoginPage";

const StudentLoginPage = ({ setLoggedInUser }) => {
  return (
    <LoginPage
      title="Student Login"
      role="student"
      formColor="yellow"
      setLoggedInUser={setLoggedInUser}
      registerLink="/register/student"
    />
  );
};

export default StudentLoginPage;


