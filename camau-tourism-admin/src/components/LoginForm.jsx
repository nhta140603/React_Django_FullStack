// LoginForm.jsx
import { useState } from "react";
import LoginInput from "../components/LoginInput";
import { loginUser } from "../api/authAdmin";

export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username.trim() || !form.password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }
    setLoading(true);
    try {
      const result = await loginUser(form);
      localStorage.setItem("accessToken", result.tokens.access);
      localStorage.setItem("refreshToken", result.tokens.refresh);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
      <LoginInput
        name="username"
        type="text"
        value={form.username}
        onChange={handleChange}
        placeholder="Tên đăng nhập"
        icon={<span className="text-xl mr-2">👤</span>}
      />
      <LoginInput
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Mật khẩu"
        icon={<span className="text-xl mr-2">🔒</span>}
      />
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-[#007b8a] to-[#00c6e6] text-white font-semibold hover:opacity-90 transition-opacity duration-150"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      <div className="text-right">
        <a href="#" className="text-sm text-[#00b9d7] hover:underline">
          Quên mật khẩu?
        </a>
      </div>
    </form>
  );
}