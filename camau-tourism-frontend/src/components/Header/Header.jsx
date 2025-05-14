import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserCog, FaCompass, FaMapMarkedAlt, FaHotel, FaCalendarAlt, FaUtensils, FaNewspaper, FaBars, FaTimes } from "react-icons/fa";
import defaultAvatar from "../../assets/images/avatar/man-profile_1083548-15963.jpg";
import logo from '../../assets/images/logos/logo.png';
import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Header() {
  const { user, logout, loading } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef();
  
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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
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
      "transition-all duration-300 text-white sticky top-0 z-50",
      scrolled 
        ? "bg-blue-600/95 backdrop-blur-lg shadow-md py-2" 
        : "bg-blue-600/95 backdrop-blur-lg shadow-md py-2"
    )}>
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8 max-w-[1310px]">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative overflow-hidden rounded-full shadow-lg">
            <img 
              src={logo} 
              alt="logo" 
              className="h-10 w-10 rounded-full transition-transform duration-300 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full"></div>
          </div>
          <div className="relative">
            <span className="text-2xl font-black tracking-wider bg-gradient-to-br from-white to-cyan-200 bg-clip-text text-transparent">
              Cà Mau <span className="text-yellow-300">Tourism</span>
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></div>
          </div>
        </Link>
        
        <nav className="hidden lg:block">
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
        
        <div className="relative flex items-center space-x-3">
          <button 
            className="lg:hidden p-2 rounded-full hover:bg-blue-700 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? 
              <FaTimes className="w-6 h-6" /> : 
              <FaBars className="w-6 h-6" />
            }
          </button>
          
          {loading ? (
            <div className="w-24 h-8 bg-blue-400/30 rounded-full animate-pulse"></div>
          ): !user ? (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-blue-900 font-bold shadow transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Đăng nhập
              </Link>
              <Link 
                to="/register" 
                className="hidden sm:block px-4 py-2 rounded-full border-2 border-cyan-300 hover:bg-cyan-500 hover:border-transparent hover:text-blue-900 transition-all duration-300 hover:shadow-lg"
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
                <div className="relative">
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="w-9 h-9 rounded-full border-2 border-cyan-300 shadow object-cover"
                  />
                  {user.user.isAdmin && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border border-blue-700 flex items-center justify-center">
                      <span className="text-[8px] text-blue-900 font-bold">A</span>
                    </div>
                  )}
                </div>
                <span className="hidden sm:inline text-sm">
                  {user.user.last_name || user.user.username || user.user.email.split('@')[0]}
                </span>
                <FaChevronDown className={classNames(
                  "transition-transform duration-300", 
                  accountOpen ? "rotate-180" : ""
                )} />
              </button>
              
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 shadow-xl rounded-xl py-1 z-50 transform transition-all duration-300 origin-top-right">
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
                  >
                    <FaUserCog className="mr-3 text-blue-600" /> 
                    <span>Quản lý tài khoản</span>
                  </Link>
                  
                  <Link 
                    to="/personaltrip" 
                    className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors text-blue-700"
                  >
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
      </div>
      
      <div 
        className={classNames(
          "fixed inset-0 bg-blue-900/95 z-40 lg:hidden flex flex-col transition-all duration-300 ease-in-out backdrop-blur-lg",
          mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
        )}
      >
        <div className="flex justify-end p-4">
          <button 
            className="text-white p-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center flex-grow">
          <ul className="flex flex-col space-y-6 text-center w-full px-12">
            {menuItems.map((item, index) => (
              <li key={index} className="w-full">
                <Link 
                  to={item.path} 
                  className="flex items-center justify-center py-2 px-4 text-xl font-semibold text-white hover:text-cyan-300 transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
            
            {!user && (
              <div className="pt-6 flex flex-col space-y-4 w-full">
                <Link 
                  to="/login" 
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-blue-900 font-bold text-center transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className="w-full py-3 rounded-xl border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-600 hover:text-white font-bold text-center transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
      
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </header>
  );
}

export default Header;