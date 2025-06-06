import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaSignOutAlt, FaUser, FaHotel, FaRoute } from "react-icons/fa";
import { useAdminAuth } from "../../context/authContext";
import { useNotificationCounts } from "../../context/NotificationCountsContext"; // Lấy context

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const { admin, logoutAdmin } = useAdminAuth();

  // Lấy số lượng từ context (chính là dữ liệu từ polling chung)
  const pendingCounts = useNotificationCounts();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white sticky top-0 z-30 flex items-center justify-between px-8 h-16 shadow rounded-b-lg">
      <div className="font-bold text-2xl text-cyan-700 flex items-center gap-3 animate-fade-in">
        <span role="img" aria-label="logo"></span> AdminPanel
      </div>
      <div className="flex items-center gap-5">
        <input
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          type="text"
          placeholder="Tìm kiếm nội dung..."
        />

        <div className="relative" ref={notificationRef}>
          <button
            className="relative p-2 hover:bg-cyan-100 rounded-full"
            title="Thông báo"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            {pendingCounts.tour > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold animate-pulse">
                {pendingCounts.tour}
              </span>
            )}
            <FaBell className="text-cyan-700 text-xl" />
          </button>

          {notificationOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg animate-dropdown-fade z-50">
              <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
                <h3 className="font-semibold">Thông báo tổng hợp</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-4 py-3 flex items-center gap-3">
                  <span className="p-2 rounded-full bg-blue-500 text-white">
                    <FaRoute />
                  </span>
                  <span>Tour chờ duyệt:</span>
                  <span className="ml-auto font-bold text-blue-600">
                    {pendingCounts.tour}
                  </span>
                </div>
                <div className="px-4 py-3 flex items-center gap-3">
                  <span className="p-2 rounded-full bg-amber-500 text-white">
                    <FaHotel />
                  </span>
                  <span>Phòng chờ duyệt:</span>
                  <span className="ml-auto font-bold text-amber-600">
                    {pendingCounts.room}
                  </span>
                </div>
                <div className="px-4 py-3 flex items-center gap-3">
                  <span className="p-2 rounded-full bg-cyan-500 text-white">
                    <FaBell />
                  </span>
                  <span>Thông báo chưa đọc:</span>
                  <span className="ml-auto font-bold text-cyan-600">
                    {pendingCounts.notification}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-2 border-t text-center rounded-b-lg">
                <a
                  href="/notifications"
                  className="text-sm text-cyan-600 hover:text-cyan-800 font-medium"
                >
                  Xem tất cả thông báo
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
          <button
            className="relative focus:outline-none cursor-pointer"
            onClick={() => setDropdownOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <img
              src="https://i.pravatar.cc/300?img=1"
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover shadow-sm avatar-hover"
            />
            <span
              className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"
              title="Online"
            ></span>
          </button>
          <span className="font-semibold text-gray-700 hidden sm:block whitespace-nowrap">
            {admin ? admin.username : "Tài khoản"}
          </span>
          {dropdownOpen && (
            <div
              className="absolute right-0 top-14 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg animate-dropdown-fade z-50"
              style={{
                boxShadow: "0 8px 24px rgba(0,0,0,.08)",
                minWidth: "10rem",
              }}
            >
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <FaUser className="text-cyan-600" />
                <div>
                  <div className="font-semibold text-gray-700 whitespace-nowrap">
                    {admin?.username}
                  </div>
                  <div className="text-xs text-gray-400">Quản trị viên</div>
                </div>
              </div>
              <button
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-cyan-50 text-red-500 font-semibold transition rounded-b-lg"
                onClick={logoutAdmin}
              >
                <FaSignOutAlt />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes dropdown-fade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown-fade {
          animation: dropdown-fade 0.18s ease;
        }
      `}</style>
    </header>
  );
}

export default Header;