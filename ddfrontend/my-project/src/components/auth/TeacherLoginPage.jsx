
import React from "react";
import LoginPage from "../common/LoginPage";

const TeacherLoginPage = ({ setLoggedInUser }) => {
  return (
    <LoginPage
      title="Teacher Login"
      role="teacher"
      formColor="yellow"
      setLoggedInUser={setLoggedInUser}
      registerLink="/register/teacher"
    />
  );
};

export default TeacherLoginPage;





