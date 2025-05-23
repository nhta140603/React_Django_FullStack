import React, { useState } from "react";
import {
  FaUser, FaImages, FaUsers, FaRoute, FaHotel, FaDoorOpen, FaMapMarkedAlt,
  FaCar, FaCalendarAlt, FaBlog, FaBell, FaQuestionCircle, FaCog
} from "react-icons/fa";
import { MdEventNote, MdTour } from "react-icons/md";
import { PiBowlFoodFill } from "react-icons/pi";
import { TbBrandBooking } from "react-icons/tb";
import { useNotificationCounts } from "../../context/NotificationCountsContext";

function Sidebar() {
  const counts = useNotificationCounts();
  const notificationCounts = {
    "/tour-bookings": counts.tour,
    "/room-bookings": counts.room,
    "/notifications": counts.notification,
  };
  const [activeLink, setActiveLink] = useState("/dashboard");
  const menuGroups = [
    {
      title: "Người dùng & Hướng dẫn viên",
      items: [
        { icon: <FaUsers />, label: "Khách hàng", path: "/clients" },
        { icon: <FaUser />, label: "Hướng dẫn viên", path: "/tour-guides" },
      ]
    },
    {
      title: "Tour & Điểm đến",
      items: [
        { icon: <FaRoute />, label: "Tour", path: "/tours" },
        { icon: <FaMapMarkedAlt />, label: "Điểm đến", path: "/destinations" },
        { icon: <MdTour />, label: "Đặt tour", path: "/tour-bookings", highlight: true },
      ]
    },
    {
      title: "Khách sạn & Phòng",
      items: [
        { icon: <FaHotel />, label: "Khách sạn", path: "/hotels" },
        { icon: <FaDoorOpen />, label: "Phòng khách sạn", path: "/hotel-rooms" },
        { icon: <TbBrandBooking />, label: "Đặt Phòng", path: "/room-bookings", highlight: true },
        { icon: <FaCar />, label: "Tiện ích", path: "/amenties" },
      ]
    },
    {
      title: "Lễ hội & Ẩm thực",
      items: [
        { icon: <FaCalendarAlt />, label: "Lễ hội", path: "/festivals" },
        { icon: <PiBowlFoodFill />, label: "Ẩm thực", path: "/cuisines" },
      ]
    },
    {
      title: "Sự kiện & Bài viết",
      items: [
        { icon: <MdEventNote />, label: "Sự kiện & Bài viết", path: "/articles" },
      ]
    },
    {
      title: "Khác",
      items: [
        { icon: <FaBlog />, label: "Blog", path: "/blogs" },
        { icon: <FaImages />, label: "Media", path: "/media" },
        { icon: <FaBell />, label: "Thông báo", path: "/notifications", highlight: true },
        { icon: <FaQuestionCircle />, label: "FAQ", path: "/faqs" },
        { icon: <FaCog />, label: "Cài đặt", path: "/settings" },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-cyan-900 to-cyan-500 text-white min-h-screen shadow-xl flex flex-col sticky top-0 max-h-[800px]">
      <div className="flex items-center h-20 gap-2 px-8 font-extrabold text-2xl tracking-wider bg-cyan-800 shadow-lg min-h-[80px] sticky">
        <span role="img" aria-label="logo" className="text-3xl"></span>
        <span>AdminPanel</span>
      </div>
      <div className="overflow-y-auto no-scrollbar flex-1">
        <nav>
          {menuGroups.map((group, i) => (
            <div key={i} className="mt-6">
              <h3 className="px-6 uppercase text-xs tracking-widest font-bold text-cyan-100 mb-2 opacity-70">{group.title}</h3>
              <ul className="space-y-1">
                {group.items.map(item => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      className={`flex items-center px-6 py-3 rounded-l-full transition hover:bg-cyan-700 
                        font-medium gap-3 hover:scale-[1.03] active:bg-cyan-900 
                        ${activeLink === item.path ? 'bg-cyan-700' : ''} 
                        ${item.highlight ? 'hover:bg-cyan-600' : ''}`}
                      onClick={() => setActiveLink(item.path)}
                    >
                      <span className={`text-lg ${item.highlight ? 'text-cyan-200' : ''}`}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                      {notificationCounts[item.path] > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {notificationCounts[item.path]}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="p-6 text-xs text-cyan-100 opacity-80">
        © {new Date().getFullYear()} AdminPanel
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;