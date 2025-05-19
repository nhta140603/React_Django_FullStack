import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SocialIcon } from 'react-social-icons'
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserCog, FaCompass, FaMapMarkedAlt, FaHotel, FaCalendarAlt, FaUtensils, FaNewspaper, FaBars, FaTimes } from "react-icons/fa";
import defaultAvatar from "../../assets/images/avatar/man-profile_1083548-15963.jpg";
import { loginUser } from '../../api/auth_api';
import logo from '../../assets/images/logos/logo.png';
import { Link } from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Header() {
  const { user, logout, loading } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const [methodAuthOpen, setMethodAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSocialLogin, setShowSocialLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const accountRef = useRef();
  const mobileAccountRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
      if (mobileAccountRef.current && !mobileAccountRef.current.contains(event.target)) {
        setMobileAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset drawer state when closed
  useEffect(() => {
    if (!methodAuthOpen) {
      setTimeout(() => {
        setShowSocialLogin(true);
        setLoginForm({ username: "", password: "" });
        setLoginError("");
      }, 300); // Delay to ensure animation completes first
    }
  }, [methodAuthOpen]);

  const handleLoginInputChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const result = await loginUser(loginForm);
      toast.success("Đăng nhập thành công:", result);
      setMethodAuthOpen(false);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginMethod = (e) => {
    e.preventDefault();
    setIsTransitioning(true);
    
    setTimeout(() => {
      setShowSocialLogin(!showSocialLogin);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  };

  const avatarUrl = user?.avatar ? `https://res.cloudinary.com/deavaowp3/${user?.avatar}` : defaultAvatar;

  const menuItems = [
    { name: 'Trang chủ', path: '/', icon: <FaCompass className="mr-2" /> },
    { name: 'Tour du lịch', path: '/danh-sach-chuyen-du-lich', icon: <FaMapMarkedAlt className="mr-2" /> },
    { name: 'Địa điểm', path: '/danh-sach-dia-diem', icon: <FaMapMarkedAlt className="mr-2" /> },
    { name: 'Khách sạn', path: '/tim-khach-san', icon: <FaHotel className="mr-2" /> },
    { name: 'Lễ Hội', path: '/danh-sach-le-hoi', icon: <FaCalendarAlt className="mr-2" /> },
    { name: 'Ẩm Thực', path: '/am-thuc', icon: <FaUtensils className="mr-2" /> },
    { name: 'Tin Tức', path: '/tin-tuc-su-kien', icon: <FaNewspaper className="mr-2" /> },
  ];

  return (
    <header className={classNames(
      "transition-all duration-300 text-white sticky top-0 z-50 h-[60px]",
      scrolled
        ? "bg-blue-600/95 backdrop-blur-lg shadow-md"
        : "bg-blue-600/95 backdrop-blur-lg shadow-md"
    )}>
      <div className="flex lg:hidden justify-between items-center px-3 py-2 relative">

        <button
          className="p-2 rounded-full text-white bg-blue-500/80 hover:bg-blue-700 transition"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>

        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10">
          <span className="text-lg font-bold text-white leading-tight tracking-wide">
            <span>Cà Mau</span> <span className="text-yellow-300">Tourism</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-8 h-8 bg-blue-400/30 rounded-full animate-pulse"></div>
          ) : !user ? (
            <Drawer open={methodAuthOpen} onOpenChange={setMethodAuthOpen}>
              <DrawerTrigger asChild>
                <button
                  onClick={() => setMethodAuthOpen((prev) => !prev)}
                  className="p-2 rounded-full text-white bg-blue-500/80 hover:bg-blue-700 transition"
                  aria-label="Đăng nhập"
                >
                  <FaUserCircle className="w-6 h-6" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-white text-gray-900 rounded-t-3xl pb-8">
                <DrawerHeader>
                  <DrawerTitle className="text-center text-lg font-bold">Đăng nhập tài khoản</DrawerTitle>
                  <DrawerDescription className="text-center text-gray-500">
                    Đăng nhập để có thể nhận thêm nhiều thông tin hơn nữa
                  </DrawerDescription>
                </DrawerHeader>
                <div className="relative min-h-[320px] flex flex-col justify-center">
                  <div 
                    className={classNames(
                      "transition-all duration-300 absolute w-full",
                      showSocialLogin ? 
                        (isTransitioning ? "opacity-0 transform translate-y-5" : "opacity-100 transform translate-y-0") : 
                        "opacity-0 transform -translate-y-5 pointer-events-none"
                    )}
                  >
                    <div className="flex flex-col gap-4 px-6 mt-4">
                      <button className="px-9 flex items-center gap-3 w-full py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold transition">
                        <span className="flex-shrink-0"><SocialIcon className="text-left" network="google" style={{ width: 24, height: 24 }} /></span>
                        <span>Đăng nhập bằng Google</span>
                      </button>
                      <button className="px-9 flex items-center gap-3 w-full py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold transition">
                        <span className="flex-shrink-0"><SocialIcon network="facebook" style={{ width: 24, height: 24 }} /></span>
                        <span>Đăng nhập bằng Facebook</span>
                      </button>
                    </div>
                  </div>

                  <div 
                    className={classNames(
                      "transition-all duration-300 absolute w-full",
                      !showSocialLogin ? 
                        (isTransitioning ? "opacity-0 transform translate-y-5" : "opacity-100 transform translate-y-0") : 
                        "opacity-0 transform -translate-y-5 pointer-events-none"
                    )}
                  >
                    <div className="px-6 mt-12">
                      <form onSubmit={handleLoginSubmit} className="space-y-7" autoComplete="off">
                        {loginError && (
                          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {loginError}
                          </div>
                        )}
                        <div>
                          <label className="block font-semibold text-gray-700 mb-2">
                            Username
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6"></path>
                              </svg>
                            </span>
                            <input
                              type="text"
                              name="username"
                              required
                              value={loginForm.username}
                              onChange={handleLoginInputChange}
                              className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
                              placeholder="Nhập email của bạn"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-2">Mật khẩu</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 0a2 2 0 002 2h8a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a4 4 0 10-8 0v2a2 2 0 00-2 2v6z"></path>
                              </svg>
                            </span>
                            <input
                              type="password"
                              name="password"
                              required
                              value={loginForm.password}
                              onChange={handleLoginInputChange}
                              className="w-full pl-10 pr-4 py-2 border-2 border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
                              placeholder="Nhập mật khẩu"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold py-2.5 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:hover:scale-100"
                        >
                          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                        <div className="text-center mt-3 text-gray-600">
                          Chưa có tài khoản?{" "}
                          <Link to="/register" className="text-blue-600 hover:underline font-semibold" onClick={() => setMethodAuthOpen(false)}>
                            Đăng ký ngay
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-12">
                  <button 
                    onClick={toggleLoginMethod} 
                    className="text-blue-600 hover:underline font-medium transition-all duration-200 hover:text-blue-800 px-4 py-2 rounded-full hover:bg-blue-50"
                    disabled={isTransitioning}
                  >
                    {showSocialLogin ? "Các lựa chọn khác" : "Đăng nhập với mạng xã hội"}
                  </button>
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <div className="relative" ref={mobileAccountRef}>
              <button
                className="flex items-center px-2 py-1 rounded-full hover:bg-blue-700/60 transition-all duration-300 font-semibold"
                onClick={() => setMobileAccountOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={mobileAccountOpen}
              >
                <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-cyan-300 shadow object-cover" />
                <FaChevronDown className={classNames("ml-1 transition-transform duration-300", mobileAccountOpen ? "rotate-180" : "")} />
              </button>
              {mobileAccountOpen && (
                <div className="absolute right-0 mt-1 w-60 bg-white text-gray-800 shadow-xl rounded-xl py-1 z-50 dropdown-menu origin-top-right">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.user.first_name} {user.user.last_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.user.email}
                    </p>
                  </div>
                  <Link
                    to="/trang-ca-nhan"
                    className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors text-blue-700"
                    onClick={() => setMobileAccountOpen(false)}
                  >
                    <FaUserCog className="mr-3 text-blue-600" />
                    <span>Quản lý tài khoản</span>
                  </Link>
                  <Link
                    to="/personaltrip"
                    className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors text-blue-700"
                    onClick={() => setMobileAccountOpen(false)}
                  >
                    <FaUserCircle className="mr-3 text-blue-600" />
                    <span>Lộ trình cá nhân</span>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => { setMobileAccountOpen(false); logout(); }}
                    className="flex items-center px-4 py-3 w-full hover:bg-red-50 text-left text-red-600 transition-colors"
                  >
                    <FaSignOutAlt className="mr-3" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      <div
        className={classNames(
          "w-full transition-all duration-300 ease-in-out absolute left-0 right-0 top-[60px] z-40 lg:hidden",
          mobileMenuOpen ? "max-h-[calc(100vh-60px)] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 invisible"
        )}
        style={{ backgroundColor: '#222' }}
      >
        <ul className="w-full" style={{ backgroundColor: '#222' }}>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="h-12 flex items-center hover:bg-blue-700/50 transition-colors duration-300"
            >
              <span className='block pl-5 text-base font-medium text-white'>{item.icon}</span>
              <Link
                to={item.path}
                className="block w-full pl-2 pr-4 text-base font-medium text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden lg:flex justify-between items-center max-w-[1310px] mx-auto px-6 py-2">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="logo" className="h-10 w-10 rounded-full shadow-md border-2 border-white" />
          <span className="text-2xl font-black bg-gradient-to-br from-white to-cyan-200 bg-clip-text text-transparent">
            Cà Mau <span className="text-yellow-300">Tourism</span>
          </span>
        </Link>
        <nav>
          <ul className="flex space-x-6 font-medium text-base items-center">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="relative py-2 px-1 hover:text-cyan-200 transition-colors duration-300 group"
                >
                  <span>{item.name}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-8 bg-blue-400/30 rounded-full animate-pulse"></div>
          ) : !user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-blue-900 font-bold shadow transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full border-2 border-cyan-300 hover:bg-cyan-500 hover:border-transparent hover:text-blue-900 transition-all duration-300 hover:shadow-lg"
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <div className="relative" ref={accountRef}>

              <button
                className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-blue-700/60 transition-all duration-300 font-bold"
                onClick={() => setAccountOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={accountOpen}
              >
                <img src={avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full border-2 border-cyan-300 shadow object-cover" />
                <span className="hidden sm:inline text-sm">
                  {user.user.last_name || user.user.username || user.user.email.split('@')[0]}
                </span>
                <FaChevronDown className={classNames("transition-transform duration-300", accountOpen ? "rotate-180" : "")} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white text-gray-800 shadow-xl rounded-xl py-1 z-50 dropdown-menu origin-top-right">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.user.first_name} {user.user.last_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.user.email}
                    </p>
                  </div>
                  <Link to="/trang-ca-nhan" className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors text-blue-700">
                    <FaUserCog className="mr-3 text-blue-600" />
                    <span>Quản lý tài khoản</span>
                  </Link>
                  <Link to="/personaltrip" className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors text-blue-700">
                    <FaUserCircle className="mr-3 text-blue-600" />
                    <span>Lộ trình cá nhân</span>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-3 w-full hover:bg-red-50 text-left text-red-600 transition-colors"
                  >
                    <FaSignOutAlt className="mr-3" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <ToastContainer position='top-right' autoClose={3000}></ToastContainer>
      </div>

      <style>
        {`
        @keyframes fade-in-dropdown {
          from { opacity: 0; transform: translateY(-5px) scale(0.98);}
          to { opacity: 1; transform: translateY(0) scale(1);}
        }
        
        .dropdown-menu {
          animation: fade-in-dropdown 0.15s ease-out forwards;
          transform-origin: top;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        /* Smooth mobile menu animation */
        @media (max-width: 1023px) {
          .invisible {
            visibility: hidden;
          }
        }
        `}
      </style>
    </header>
  );
}

export default Header;