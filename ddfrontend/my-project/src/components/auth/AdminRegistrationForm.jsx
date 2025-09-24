import React from "react";
import RegistrationForm from "../common/RegistrationForm";

const AdminRegistrationForm = () => {
  const fields = [
    {
      name: "name",
      type: "text",
      placeholder: "Enter your name",
      label: "Name",
      required: true,
    },
    {
      name: "phoneNumber",
      type: "text",
      placeholder: "Enter your phone number",
      label: "Phone number",
      required: true,
    },
    {
      name: "email",
      type: "email",
      placeholder: "Enter your email",
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
    role: "admin",
  };

  return (
    <RegistrationForm
      title="Admin Registration"
      fields={fields}
      apiEndpoint="/auth/register/admin"
      successRedirectPath="/login/admin"
      formColor="purple"
      roleSpecificPayload={roleSpecificPayload}
      loginLink="/login/admin"
    />
  );
};

export default AdminRegistrationForm;
