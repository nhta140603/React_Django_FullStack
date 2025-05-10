import React from "react";
import AuthLayout from "../components/Auth/AuthLayout";
import RegisterForm from "../components/Auth/RegisterForm";
import { registerUser } from "../api/auth_api";
import { validateRegister } from "../utils/validator";

const RegisterPage = () => {
  const handleRegister = async form => {
    const errors = validateRegister(form);
    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors).join("\n"));
      return;
    }
    try {
      await registerUser(form);
      alert("Đăng ký thành công!");
    } catch (err) {
      alert("Lỗi khi đăng ký: " + err.message);
    }
  };

  return (
    <AuthLayout title="Đăng ký tài khoản">
      <RegisterForm onSubmit={handleRegister} />
    </AuthLayout>
  );
};

export default RegisterPage;