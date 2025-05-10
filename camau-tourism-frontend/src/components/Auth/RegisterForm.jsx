import React, { useState } from "react";
import { Link } from "react-router-dom";

const RegisterForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    onSubmit?.(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7"
      autoComplete="off"
    >
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Username</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 10-6 0 3 3 0 006 0z"></path></svg>
          </span>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border-2 border-green-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm transition"
            placeholder="Nhập tên người dùng"
          />
        </div>
      </div>
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Email</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6"></path></svg>
          </span>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
            placeholder="Nhập email"
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
      <div>
        <label className="block font-semibold text-gray-700 mb-2">
          Xác nhận mật khẩu
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 0a2 2 0 002 2h8a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a4 4 0 10-8 0v2a2 2 0 00-2 2v6z"></path></svg>
          </span>
          <input
            type="password"
            name="confirmPassword"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
            placeholder="Nhập lại mật khẩu"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-500 to-blue-400 text-white font-bold py-2.5 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200"
      >
        Đăng ký
      </button>
      <div className="text-center mt-3 text-gray-600">
        Đã có tài khoản?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-semibold">
          Đăng nhập
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;