import React from "react";
import RegistrationForm from "../common/RegistrationForm"; // নতুন জেনেরিক কম্পোনেন্ট ইম্পোর্ট করা হয়েছে

const StudentRegistrationForm = () => {
  const fields = [
    {
      name: "name",
      type: "text",
      placeholder: "Enter your name",
      label: "Name",
      required: true,
    },
    {
      name: "institute",
      type: "text",
      placeholder: "Enter your institute's name",
      label: "Institute",
      required: true,
    },
    {
      name: "levelOfStudy",
      type: "select",
      placeholder: "Select Study Level",
      label: "Grade or level",
      options: ["SSC", "HSC", "Admission"],
      required: true,
    },
    {
      name: "email",
      type: "email",
      placeholder: "Enter your email address",
      label: "Email",
      required: true,
    },
    {
      name: "password",
      type: "password",
      placeholder: "Enter password",
      label: "Password",
      required: true,
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm password",
      label: "Confirm Password",
      required: true,
    },
  ];

  const roleSpecificPayload = {
    phones: [],
  };

  return (
    <RegistrationForm
      title="Student Registration"
      fields={fields}
      apiEndpoint="/auth/register/student"
      successRedirectPath="/login/student"
      formColor="blue"
      roleSpecificPayload={roleSpecificPayload}
      loginLink="/login/student"
    />
  );
};

export default StudentRegistrationForm;
