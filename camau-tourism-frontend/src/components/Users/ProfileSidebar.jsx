import React, { useState, useEffect } from "react";
import defaultAvatar from "../../assets/images/avatar/man-profile_1083548-15963.jpg";
import { useAuth } from '../../contexts/AuthContext';
import { Link } from "react-router-dom";
import { FaUser, FaSuitcaseRolling, FaHotel, FaBlog, FaBell, FaHeadset, FaSignOutAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const menuItems = [
  { key: "trang-ca-nhan", icon: <FaUser />, label: "Thông tin cá nhân", path: "/trang-ca-nhan" },
  { key: "cac-chuyen-di", icon: <FaSuitcaseRolling />, label: "Đơn tour", path: "/cac-chuyen-di" },
  { key: "cac-don-dat-phong", icon: <FaHotel />, label: "Đặt phòng", path: "/cac-don-dat-phong" },
  { key: "tat-ca-thong-bao", icon: <FaBell />, label: "Thông báo", path: "/tat-ca-thong-bao" },
  { key: "blog", icon: <FaBlog />, label: "Blog cá nhân", path: "/blog" },
  { key: "support", icon: <FaHeadset />, label: "Hỗ trợ", path: "/support" },
];

export default function ProfileSidebar({ avatar, name }) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  }, [location]);

  const getSelectedTab = () => {
    if (location.pathname.includes('trang-ca-nhan')) return "trang-ca-nhan";
    if (location.pathname.includes('cac-chuyen-di')) return "cac-chuyen-di";
    if (location.pathname.includes('cac-don-dat-phong')) return "cac-don-dat-phong";
    if (location.pathname.includes('reviews')) return "reviews";
    if (location.pathname.includes('blog')) return "blog";
    if (location.pathname.includes('tat-ca-thong-bao')) return "tat-ca-thong-bao";
    if (location.pathname.includes('support')) return "support";
    return "";
  }

  const avatarUrl = user?.avatar ? `https://res.cloudinary.com/deavaowp3/${user?.avatar}` : defaultAvatar;
  const selected = getSelectedTab();

  return (
    <>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky z-40
          transition-all duration-300 ease-in-out
          bg-gradient-to-tr from-[#2E8BC0] to-[#2D9D78] text-white
          ${isMobileMenuOpen ? 'left-0' : '-left-full lg:left-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
          shadow-xl
        `}
      >
        <button
          className="hidden lg:block absolute -right-3 top-16 bg-[#F9F7F3] text-[#2E8BC0] rounded-full p-1 shadow-md hover:bg-[#EFF2F1] z-10"
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
              className={`${isCollapsed ? 'w-12 h-12' : 'w-20 h-20 md:w-24 md:h-24'} rounded-full border-4 border-white object-cover shadow-inner transition-all duration-300`}
              src={avatarUrl}
              alt="avatar"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <FaUser className="text-white text-xl" />
            </div>
          </div>
          {(!isCollapsed || window.innerWidth < 768) && (
            <div className="mt-4 font-bold text-center">
              <div className="text-lg">{name}</div>
              <div className="text-xs text-blue-100 mt-1">Thành viên</div>
            </div>
          )}
        </div>

        <div className={`border-t border-[#2E8BC0] border-opacity-30 ${isCollapsed ? 'mx-2' : 'mx-4'} mb-4`}></div>

        <nav className="flex-1 flex flex-col gap-1 px-2">
          {menuItems.map(item => (
            <Link
              key={item.key}
              to={item.path}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 ${isCollapsed ? 'px-2' : 'px-4'} py-3 text-left font-medium
                        hover:bg-[#F9F7F3]/20 rounded-xl transition-all duration-200 relative group
                        ${selected === item.key ? 'bg-[#F0C04D]/30 font-bold shadow-md text-[#134074]' : 'text-[#EFF2F1]'
                }`}
            >
              <span className={`text-lg ${selected === item.key ? 'text-white' : 'text-blue-100'}`}>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 whitespace-nowrap bg-[#2E8BC0] text-white px-2 py-1 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className={`border-t border-blue-400 border-opacity-30 ${isCollapsed ? 'mx-2' : 'mx-4'} mt-auto`}></div>

        <Link
          to="/logout"
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 ${isCollapsed ? 'px-2' : 'px-4'} py-4 text-left font-medium hover:bg-red-500/20 text-white/80 hover:text-white transition-all duration-200 mb-6 mt-2`}
        >
          <span className="text-lg"><FaSignOutAlt /></span>
          {!isCollapsed && <span>Đăng xuất</span>}
        </Link>
      </aside>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center z-30 h-16 shadow-lg">
        {menuItems.slice(0, 5).map(item => (
          <Link
            key={item.key}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-2 ${selected === item.key ? 'text-blue-600' : 'text-gray-600'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </div>
    </>
  );
}