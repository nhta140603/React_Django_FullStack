import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import LoginForm from "../components/Auth/LoginForm";
import { loginUser } from "../api/auth_api";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (form, rememberMe) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
    const response = await loginUser(form, rememberMe);
    login({ id: response.id, username: response.username });
      setSuccessMessage("Đăng nhập thành công!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      if (err.message && err.message.includes("fetch")) {
        setErrorMessage("Không thể kết nối đến server. Vui lòng thử lại.");
      } else if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.username) setErrorMessage(errorData.username[0]);
        else if (errorData.password) setErrorMessage(errorData.password[0]);
        else if (errorData.disable_account) setErrorMessage(errorData.disable_account[0]);
        else setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
      } else if (err.message) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Không thể kết nối đến server. Vui lòng thử lại.");
      }
    }
  };

  return (
    <AuthLayout>
      <LoginForm 
        onSubmit={handleLogin} 
        errorMessage={errorMessage} 
        successMessage={successMessage} 
      />
    </AuthLayout>
  );
};

export default LoginPage;