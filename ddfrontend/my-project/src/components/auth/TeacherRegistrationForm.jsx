import React from "react";
import RegistrationForm from "../common/RegistrationForm";

const TeacherRegistrationForm = () => {
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
      name: "qualification",
      type: "text",
      placeholder: "Enter your qualification",
      label: "Qualification",
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
      title="Teacher Registration"
      fields={fields}
      apiEndpoint="/auth/register/teacher"
      successRedirectPath="/login/teacher"
      formColor="blue"
      roleSpecificPayload={roleSpecificPayload}
      loginLink="/login/teacher"
    />
  );
};

export default TeacherRegistrationForm;
