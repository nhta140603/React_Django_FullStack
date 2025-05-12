import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaUserCog } from "react-icons/fa";
import defaultAvatar from "../../assets/images/avatar/man-profile_1083548-15963.jpg";
import logo from '../../assets/images/logos/logo.png';
import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Header() {
  const { user, logout, loading } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const avatarUrl = user?.avatar ? `${user.avatar}` : defaultAvatar;
  return (
    <header className="bg-gradient-to-bl from-blue-600 via-blue-500 to-teal-400 text-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 md:px-8 max-w-[1310px]">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-10 w-10 rounded-full shadow-lg" />
          <span className="text-2xl font-black tracking-wider bg-gradient-to-br from-cyan-300 to-yellow-100 bg-clip-text text-transparent">
            Cà Mau <span className="text-yellow-200">Tourism</span>
          </span>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-6 font-semibold text-lg items-center">
            <li><Link to="/" className="hover:text-cyan-200 transition">Trang chủ</Link></li>
            <li><Link to="/danh-sach-chuyen-du-lich" className="hover:text-cyan-200 transition">Tour du lịch</Link></li>
            <li><Link to="/danh-sach-dia-diem" className="hover:text-cyan-200 transition">Địa điểm</Link></li>
            <li><Link to="/tim-khach-san" className="hover:text-cyan-200 transition">Khách sạn</Link></li>
            <li><Link to="/danh-sach-le-hoi" className="hover:text-cyan-200 transition">Lễ Hội</Link></li>
            <li><Link to="/am-thuc" className="hover:text-cyan-200 transition">Ẩm Thực</Link></li>
            <li><Link to="/tin-tuc-su-kien" className="hover:text-cyan-200 transition">Tin Tức</Link></li>
          </ul>
        </nav>
        <div className="relative flex items-center space-x-4">
          {loading ? (
                <div className="w-24 h-8 bg-blue-200 rounded animate-pulse"></div>
          ): !user ? (
            <>
              <a href="/login" className='px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-300 text-blue-900 font-bold shadow transition'>Đăng nhập</a>
              <a href="/register" className='px-4 py-2 rounded-full border border-cyan-300 hover:bg-cyan-500 hover:text-blue-900 transition'>Đăng ký</a>
            </>
          ) : (
            <div className="relative" ref={accountRef}>
              <button
                className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-cyan-800 transition font-bold"
                onClick={() => setAccountOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={accountOpen}
              >
                <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-cyan-200 shadow" />
                <span className="hidden sm:inline">{user.user.last_name || user.user.username || user.user.email}</span>
                <FaChevronDown className={classNames("ml-1 transition-transform", accountOpen ? "rotate-180" : "")} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-cyan-900 shadow-xl rounded-xl py-2 z-50 animate-fadeIn">
                  <Link to="/trang-ca-nhan" className="flex items-center px-5 py-3 hover:bg-cyan-100 transition">
                    <FaUserCog className="mr-2 text-cyan-600" /> Quản lý tài khoản
                  </Link>
                  <Link to="/personaltrip" className="flex items-center px-5 py-3 hover:bg-cyan-100 transition">
                    <FaUserCircle className="mr-2 text-cyan-600" /> Lộ trình cá nhân
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center px-5 py-3 w-full hover:bg-red-100 text-left text-red-600 transition"
                  >
                    <FaSignOutAlt className="mr-2" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>
        {`
        @media (max-width: 768px) {
          #mobile-menu {
            display: block;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease;
        }
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