import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RegisterForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [shake, setShake] = useState(false);
  
  useEffect(() => {
    if (!form.password) {
      setPasswordStrength(0);
      setPasswordMessage("");
      return;
    }
    
    let strength = 0;
    if (form.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(form.password)) strength += 1;
    if (/[0-9]/.test(form.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) strength += 1;
    
    setPasswordStrength(strength);
    
    if (strength === 0) setPasswordMessage("Mật khẩu quá yếu");
    else if (strength === 1) setPasswordMessage("Mật khẩu yếu");
    else if (strength === 2) setPasswordMessage("Mật khẩu trung bình");
    else if (strength === 3) setPasswordMessage("Mật khẩu khá mạnh");
    else setPasswordMessage("Mật khẩu rất mạnh");
  }, [form.password]);

  const handleChange = e => {
    setIsTyping(true);
    setForm({ ...form, [e.target.name]: e.target.value });
    
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setFormStep(2);
  };

  const prevStep = () => {
    setFormStep(1);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onSubmit?.(form);
  };

  const getPasswordColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-1">
      <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin-slow rounded-2xl blur opacity-30"></div>
      <div className="relative bg-white rounded-xl p-6">
        <div className="flex mb-6 overflow-hidden">
          <div className={`w-full transition-transform duration-500 transform ${formStep === 1 ? 'translate-x-0' : '-translate-x-full'}`}>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">Thông tin cá nhân</h3>
            <p className="text-gray-600 mb-4">Bước 1/2: Nhập thông tin tài khoản của bạn</p>
          </div>
          <div className={`absolute w-full transition-transform duration-500 transform ${formStep === 2 ? 'translate-x-0' : 'translate-x-full'}`}>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">Bảo mật tài khoản</h3>
            <p className="text-gray-600 mb-4">Bước 2/2: Tạo mật khẩu an toàn</p>
          </div>
        </div>
        
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          autoComplete="off"
        >
          <div className="relative overflow-hidden min-h-[395px]">
            <div className={`transition-transform duration-500 transform ${formStep === 1 ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className={`mb-5 ${shake ? 'animate-shake' : ''}`}>
                <label className="block font-semibold text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 10-6 0 3 3 0 006 0z"></path>
                    </svg>
                    Username
                  </span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm transition-all"
                    placeholder="Tên người dùng của bạn"
                  />
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${form.name ? 'opacity-100' : 'opacity-0'}`}>
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none group-hover:border-indigo-200 group-focus-within:border-indigo-300 transition-all duration-300"></div>
                </div>
              </div>
              
              <div className={`mb-5 ${shake ? 'animate-shake' : ''}`}>
                <label className="block font-semibold text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Email
                  </span>
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm transition-all"
                    placeholder="example@email.com"
                  />
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${form.email && /^\S+@\S+\.\S+$/.test(form.email) ? 'opacity-100' : 'opacity-0'}`}>
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none group-hover:border-indigo-200 group-focus-within:border-indigo-300 transition-all duration-300"></div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 flex justify-center items-center space-x-2"
              >
                <span>Tiếp tục</span>
                <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </button>
            </div>
            
            <div className={`absolute top-0 w-full transition-transform duration-500 transform ${formStep === 2 ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="mb-5">
                <label className="block font-semibold text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 0a2 2 0 002 2h8a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a4 4 0 10-8 0v2a2 2 0 00-2 2v6z"></path>
                    </svg>
                    Mật khẩu
                  </span>
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm transition-all"
                    placeholder="Tạo mật khẩu an toàn"
                  />
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 ${isTyping ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="animate-pulse text-indigo-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none group-hover:border-indigo-200 group-focus-within:border-indigo-300 transition-all duration-300"></div>
                </div>
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${getPasswordColor()}`} style={{ width: `${passwordStrength * 25}%` }}></div>
                  </div>
                  <p className={`text-sm mt-1 ${passwordStrength > 2 ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordMessage}
                  </p>
                  {form.password && (
                    <ul className="text-xs text-gray-500 mt-2 space-y-1">
                      <li className={`flex items-center ${form.password.length >= 8 ? 'text-green-600' : ''}`}>
                        <svg className={`w-3 h-3 mr-1 ${form.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Ít nhất 8 ký tự
                      </li>
                      <li className={`flex items-center ${/[A-Z]/.test(form.password) ? 'text-green-600' : ''}`}>
                        <svg className={`w-3 h-3 mr-1 ${/[A-Z]/.test(form.password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Ít nhất 1 chữ hoa
                      </li>
                      <li className={`flex items-center ${/[0-9]/.test(form.password) ? 'text-green-600' : ''}`}>
                        <svg className={`w-3 h-3 mr-1 ${/[0-9]/.test(form.password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Ít nhất 1 số
                      </li>
                    </ul>
                  )}
                </div>
              </div>
              
              <div className={`mb-5 ${shake ? 'animate-shake' : ''}`}>
                <label className="block font-semibold text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    Xác nhận mật khẩu
                  </span>
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-10 py-3 border-2 ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-300 bg-red-50' : 'border-indigo-100'} rounded-xl focus:outline-none ${form.confirmPassword && form.password !== form.confirmPassword ? 'focus:border-red-500 focus:ring-red-200' : 'focus:border-indigo-500 focus:ring-indigo-200'} focus:ring-2 shadow-sm transition-all`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  {form.confirmPassword && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {form.password === form.confirmPassword ? (
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      )}
                    </div>
                  )}
                  <div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none group-hover:border-indigo-200 group-focus-within:border-indigo-300 transition-all duration-300"></div>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">Mật khẩu không khớp</p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 bg-gray-200 text-gray-700 font-medium py-3.5 rounded-xl hover:bg-gray-300 transition-all duration-200 flex justify-center items-center"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
                  </svg>
                  Quay lại
                </button>
                <button
                  type="submit"
                  className={`w-2/3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 flex justify-center items-center ${form.password !== form.confirmPassword ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={form.password !== form.confirmPassword}
                >
                  <span className="mr-2">Đăng ký</span>
                  <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="text-center mt-6 text-gray-600">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
            Đăng nhập
          </Link>
        </div>
        
        <div className="mt-8 text-xs text-center text-gray-500">
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <a href="#" className="text-indigo-600 hover:underline">Điều khoản dịch vụ</a>
          {" "}và{" "}
          <a href="#" className="text-indigo-600 hover:underline">Chính sách bảo mật</a>
          {" "}của chúng tôi
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;