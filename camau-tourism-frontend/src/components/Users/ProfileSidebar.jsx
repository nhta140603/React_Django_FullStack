import React, { useState, useEffect } from "react";
import defaultAvatar from "../../assets/images/avatar/man-profile_1083548-15963.jpg";
import { useAuth } from '../../contexts/AuthContext';
import { Link } from "react-router-dom";
import {
  FaUser, FaSuitcaseRolling, FaHotel, FaCar, FaStar,
  FaHeart, FaBlog, FaTicketAlt, FaBell, FaHeadset, FaSignOutAlt
} from "react-icons/fa";
import { useLocation } from "react-router-dom";

const menuItems = [
  { key: "trang-ca-nhan", icon: <FaUser />, label: "Thông tin cá nhân", path: "/trang-ca-nhan" },
  { key: "cac-chuyen-di", icon: <FaSuitcaseRolling />, label: "Đơn tour", path: "/cac-chuyen-di" },
  { key: "cac-don-dat-phong", icon: <FaHotel />, label: "Đặt phòng", path: "/cac-don-dat-phong" },
  { key: "reviews", icon: <FaStar />, label: "Đánh giá của tôi", path: "/reviews" },
  { key: "blog", icon: <FaBlog />, label: "Blog cá nhân", path: "/blog" },
  { key: "notifications", icon: <FaBell />, label: "Thông báo", path: "/notifications" },
  { key: "support", icon: <FaHeadset />, label: "Hỗ trợ", path: "/support" },
];

export default function ProfileSidebar({ avatar, name }) {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const getSelectedTab = () => {
    if(location.pathname.includes('trang-ca-nhan')) return "trang-ca-nhan";
    if(location.pathname.includes('cac-chuyen-di')) return "cac-chuyen-di";
    if(location.pathname.includes('cac-don-dat-phong')) return "cac-don-dat-phong";
  }
  const avatarUrl = user?.avatar ? `${user.avatar}` : defaultAvatar;
  const selected = getSelectedTab();
  return (
    <aside 
      className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-tr from-blue-600 via-blue-500 to-teal-400 text-white flex flex-col min-h-screen shadow-xl transition-all duration-300 ease-in-out relative`}
    >
      <button 
        className="absolute -right-3 top-16 bg-white text-blue-600 rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          {isCollapsed ? 
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /> :
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          }
        </svg>
      </button>
      
      <div className={`flex flex-col items-center pt-10 pb-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div className="relative group">
          <img
            className={`${isCollapsed ? 'w-12 h-12' : 'w-24 h-24'} rounded-full border-4 border-white object-cover shadow-inner transition-all duration-300`}
            src={avatarUrl || defaultAvatar}
            alt="avatar"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <FaUser className="text-white text-xl" />
          </div>
        </div>
        {!isCollapsed && (
          <div className="mt-4 font-bold text-center">
            <div className="text-lg">{name}</div>
            <div className="text-xs text-blue-100 mt-1">Thành viên</div>
          </div>
        )}
      </div>
      
      <div className={`border-t border-blue-400 border-opacity-30 ${isCollapsed ? 'mx-2' : 'mx-4'} mb-4`}></div>
      
      <nav className="flex-1 flex flex-col gap-1 px-2 overflow-y-auto custom-scrollbar">
        {menuItems.map(item => (
          <Link
            key={item.key}
            to={item.path}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 ${isCollapsed ? 'px-2' : 'px-4'} py-3 text-left font-medium hover:bg-white/20 rounded-xl transition-all duration-200 ${
              selected === item.key ? 'bg-white/20 font-bold shadow-md' : ''
            }`}
          >
            <span className={`text-lg ${selected === item.key ? 'text-white' : 'text-blue-100'}`}>{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 whitespace-nowrap bg-blue-700 text-white px-2 py-1 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>
      
      <div className={`border-t border-blue-400 border-opacity-30 ${isCollapsed ? 'mx-2' : 'mx-4'} mt-4`}></div>
      
      <Link 
        to="/logout" 
        className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 ${isCollapsed ? 'px-2' : 'px-4'} py-4 text-left font-medium hover:bg-red-500/20 text-white/80 hover:text-white transition-all duration-200 mb-6 mt-2`}
      >
        <span className="text-lg"><FaSignOutAlt /></span>
        {!isCollapsed && <span>Đăng xuất</span>}
      </Link>
    </aside>
  );
}