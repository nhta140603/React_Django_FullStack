import React from "react";
import AuthLayout from "../components/Auth/AuthLayout";
import RegisterForm from "../components/Auth/RegisterForm";
import { registerUser } from "../api/auth_api";
import { validateRegister } from "../utils/validator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const RegisterPage = () => {
  const navigate = useNavigate()
  const handleRegister = async form => {
    const errors = validateRegister(form);
    if (Object.keys(errors).length > 0) {
      toast.warning(Object.values(errors).join("\n"));
      return;
    }
    try {
      await registerUser(form);
      toast.success("Đăng ký thành công!");
      setTimeout(() =>{
        navigate(`/`)
      }, 1000)
    } catch (err) {
      toast.error("Lỗi khi đăng ký: " + err.message);
    }
  };

  return (
    <AuthLayout title="Đăng ký tài khoản">
      <RegisterForm onSubmit={handleRegister} />
      <ToastContainer position="top-right" autoClose={1000}></ToastContainer>
    </AuthLayout>
  );
};

export default RegisterPage;