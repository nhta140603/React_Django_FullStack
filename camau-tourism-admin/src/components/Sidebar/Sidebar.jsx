import React from "react";
import { FaUser,FaImages, FaUsers, FaRoute, FaHotel, FaDoorOpen, FaMapMarkedAlt, FaBus, FaCar, FaCalendarAlt, FaTicketAlt, FaBlog, FaGift, FaRegLifeRing, FaBell, FaQuestionCircle, FaCog, FaStar, FaRestroom, FaChrome } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { PiBowlFoodFill } from "react-icons/pi";
import { TbBrandBooking } from "react-icons/tb";
import { MdTour } from "react-icons/md";
const menuGroups = [
  {
    title: "Người dùng & Hướng dẫn viên",
    items: [
      { icon: <FaUsers />, label: "Khách hàng", path: "/clients" },
      { icon: <FaUser />, label: "Hướng dẫn viên", path: "/tour-guides" },
      // { icon: <FaStar />, label: "Đánh giá", path: "/reviews" },
    ]
  },
  {
    title: "Tour & Điểm đến",
    items: [
      { icon: <FaRoute />, label: "Tour", path: "/tours" },
      { icon: <FaMapMarkedAlt />, label: "Điểm đến", path: "/destinations" },
      { icon: <MdTour />, label: "Đặt tour", path: "/tour-bookings" },
    ]
  },
  {
    title: "Khách sạn & Phòng",
    items: [
      { icon: <FaHotel />, label: "Khách sạn", path: "/hotels" },
      { icon: <FaDoorOpen />, label: "Phòng khách sạn", path: "/hotel-rooms" },
      { icon: <TbBrandBooking />, label: "Đặt Phòng", path: "/room-bookings" },
      { icon: <FaCar />, label: "Tiện ích", path: "/amenties" },
    ]
  },
  {
    title: "Lễ hội & Ẩm thực",
    items: [
      { icon: <FaCalendarAlt />, label: "Lễ hội", path: "/festivals" },
      { icon: <PiBowlFoodFill />, label: "Ẩm thực", path: "/cuisine" },
      // { icon: <FaGift />, label: "Khuyến mãi", path: "/promotions" },
    ]
  },
  ,
  {
    title: "Sự kiện & Bài viết",
    items: [
      { icon: <MdEventNote />, label: "Sự kiện & Bài viết", path: "/articles" },
    ]
  },
  {
    title: "Vận chuyển & Vé",
    items: [
      { icon: <FaBus />, label: "Phương tiện", path: "/vehicle" },
      // { icon: <FaTicketAlt />, label: "Vé", path: "/tickets" },
      { icon: <FaCar />, label: "Thuê xe", path: "/vehicle-rentals" },
    ]
  },
  {
    title: "Trải nghiệm cá nhân",
    items: [
      { icon: <FaRoute />, label: "Chuyến đi cá nhân", path: "/personal-trips" },
      { icon: <FaUser />, label: "Đặt HDV cá nhân", path: "/personal-tour-guide-bookings" },
    ]
  },
  {
    title: "Khác",
    items: [
      { icon: <FaBlog />, label: "Blog", path: "/blogs" },
      { icon: <FaImages />, label: "Media", path: "/media" },
      // { icon: <FaRegLifeRing />, label: "Hỗ trợ (Ticket)", path: "/support-tickets" },
      { icon: <FaBell />, label: "Thông báo", path: "/notifications" },
      { icon: <FaQuestionCircle />, label: "FAQ", path: "/faqs" },
      // { icon: <FaUsers />, label: "Wishlist", path: "/wishlists" },
      { icon: <FaCog />, label: "Cài đặt", path: "/settings" },
    ]
  }
];

function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-cyan-900 to-cyan-500 text-white min-h-screen shadow-xl flex flex-col sticky top-0 max-h-[800px]">
      <div className="flex items-center h-20 gap-2 px-8 font-extrabold text-2xl tracking-wider bg-cyan-800 shadow-lg min-h-[80px] sticky">
        <span role="img" aria-label="logo" className="text-3xl"></span>
        <span>AdminPanel</span>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <nav className="flex-1">
          {menuGroups.map((group, i) => (
            <div key={i} className="mt-6">
              <h3 className="px-6 uppercase text-xs tracking-widest font-bold text-cyan-100 mb-2 opacity-70">{group.title}</h3>
              <ul className="space-y-1">
                {group.items.map(item => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      className="flex items-center px-6 py-3 rounded-l-full transition hover:bg-cyan-700 font-medium gap-3 hover:scale-[1.03] active:bg-cyan-900"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
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
    </aside>
  );
}

export default Sidebar;