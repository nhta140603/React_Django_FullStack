import React, { useState } from "react";
import { Link } from "react-router-dom";
import { socialLogin } from "../../api/auth_api"
const LoginForm = ({ onSubmit, errorMessage, successMessage }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSubmit?.(form, rememberMe);
    }, 1500);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const onSocialLogin = async (provider, token) => {
    try {
      const user = await socialLogin(provider, token);
      console.log("Đăng nhập thành công:", user);
    } catch (error) {
      alert("Lỗi đăng nhập xã hội: " + error.message);
    }
  };
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-1">
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-spin-slow rounded-2xl blur opacity-30"></div>
      <div className="relative bg-white rounded-xl p-6">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Chào mừng trở lại!</h3>
          <p className="text-gray-600">Đăng nhập để tiếp tục hành trình của bạn</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          autoComplete="off"
        >
          <div className={`mb-5 ${shake ? 'animate-shake' : ''}`}>
            <label className="block font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Username
              </span>
            </label>
            <div className="relative group">
              <input
                type="text"
                name="username"
                required
                value={form.username}
                onChange={handleChange}
                className="w-full pl-4 pr-10 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm transition-all"
                placeholder="Nhập tên đăng nhập"
              />
              <div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none group-hover:border-indigo-200 group-focus-within:border-indigo-300 transition-all duration-300"></div>
            </div>
          </div>

          <div className={`mb-2 ${shake ? 'animate-shake' : ''}`}>
            <label className="block font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 0a2 2 0 002 2h8a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a4 4 0 10-8 0v2a2 2 0 00-2 2v6z"></path>
                </svg>
                Mật khẩu
              </span>
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full pl-4 pr-10 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm transition-all"
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
              <div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none group-hover:border-indigo-200 group-focus-within:border-indigo-300 transition-all duration-300"></div>
            </div>
            <div className="flex justify-between items-center mt-2 min-h-[20px]">
              <div>
                {errorMessage && (
                  <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
                )}
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 flex justify-center items-center relative overflow-hidden group"
          >
            <span className={`flex items-center transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Đăng nhập
            </span>
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
              <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
          </button>
        </form>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">hoặc đăng nhập với</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            className="py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center">
            <svg className="w-5 h-5" fill="#4285F4" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
          </button>
          <button className="py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center">
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z" />
            </svg>
          </button>
          <button className="py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center">
            <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.17 2.33-.88 3.56-.8 1.47.13 2.57.69 3.28 1.75-3.14 1.93-2.29 5.95.68 7.39-.68 1.85-1.65 3.76-2.6 4.83zm-3.1-18c.05 2.22-1.65 3.94-3.84 3.77-.18-2.07 1.69-3.93 3.84-3.77z" />
            </svg>
          </button>
        </div>

        <div className="text-center mt-6 text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
            Đăng ký ngay
          </Link>
        </div>

        <div className="mt-8 text-xs text-center text-gray-500">
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          <a href="#" className="text-indigo-600 hover:underline">Điều khoản dịch vụ</a>
          {" "}và{" "}
          <a href="#" className="text-indigo-600 hover:underline">Chính sách bảo mật</a>
          {" "}của chúng tôi
        </div>
      </div>
    </div>
  );
};

export default LoginForm;