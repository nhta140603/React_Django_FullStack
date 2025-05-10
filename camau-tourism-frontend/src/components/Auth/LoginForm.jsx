import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7"
      autoComplete="off"
    >
      <div>
        <label className="block font-semibold text-gray-700 mb-2">
          Username
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6"></path></svg>
          </span>
          <input
            type="text"
            name="username"
            required
            value={form.username}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
            placeholder="Nhập email của bạn"
          />
        </div>
      </div>
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Mật khẩu</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 0a2 2 0 002 2h8a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a4 4 0 10-8 0v2a2 2 0 00-2 2v6z"></path></svg>
          </span>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
            placeholder="Nhập mật khẩu"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold py-2.5 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200"
      >
        Đăng nhập
      </button>
      <div className="text-center mt-3 text-gray-600">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-blue-600 hover:underline font-semibold">
          Đăng ký ngay
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;