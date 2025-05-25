import React, { useState, useEffect, useMemo } from "react";
import { createRoomBooking, AvailableQuantity } from "../../api/user_api";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart, FaShare, FaMapMarkerAlt, FaStar, FaWifi, FaParking, FaSwimmingPool, FaLandmark, FaMapMarker, FaStore,
  FaUtensils, FaDumbbell, FaCheck, FaCalendarAlt, FaUser, FaArrowRight, FaPhone,
  FaEnvelope, FaTimes, FaLock, FaCreditCard, FaImages, FaCheckSquare, FaClipboardCheck, FaInfoCircle, FaBaby, FaPaw, FaHome
} from "react-icons/fa";
import {
  FaCar, FaConciergeBell,
  FaBroom, FaBell, FaSpa, FaGlassMartiniAlt, FaTree, FaSnowflake, FaUmbrellaBeach,
  FaShuttleVan, FaChalkboardTeacher, FaTv, FaIceCream, FaWind, FaMugHot, FaSoap, FaClock,
  FaBreadSlice, FaChild, FaSuitcaseRolling, FaCarSide, FaMoneyBillWave, FaSmokingBan, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FaElevator } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import { vi } from 'date-fns/locale/vi';
import { registerLocale } from "react-datepicker";
registerLocale('vi', vi);
import "react-datepicker/dist/react-datepicker.css";
import ReviewForm from "../../components/Review_Rating/ReviewForm";
import ReviewList from "../../components/Review_Rating/ReviewList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"
import { DataLoader } from "../../hooks/useDataLoader"
import useFetchResource from "../../hooks/useFetchDetail"
import { formatPrice } from "../../utils/formatPrice"
export default function HotelDetailPage() {
  const { slug } = useParams();
  const [showSoldOutPopup, setShowSoldOutPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("rooms");
  const [wishlist, setWishlist] = useState(false);
  const [activeRoomTab, setActiveRoomTab] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    adults: 2,
    children: 0,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    specialRequests: "",
    paymentMethod: "credit_card"
  });
  const [availableQuantity, setAvailableQuantity] = useState(null);
  const queryClient = useQueryClient();
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const handleReviewAdded = () => {
    setReviewsExpanded(true);
    setTimeout(() => {
      document.getElementById('reviews-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };
  const { data: hotel = [], loadingHotel, errorHotel } = useFetchResource({ type: 'hotels', slug });

  const { data: rooms = [], loadingRooms, errorRooms } = useFetchResource({ type: 'hotels', slug, subPath: 'rooms' });

  async function fetchAvailableQuantity(roomId, checkIn, checkOut) {
    if (!roomId || !checkIn || !checkOut) return;
    try {
      const available = await AvailableQuantity(
        roomId,
        checkIn.toISOString().slice(0, 10),
        checkOut.toISOString().slice(0, 10)
      );
      setAvailableQuantity(available);
    } catch (error) {
      console.error("Lỗi khi lấy số phòng còn lại:", error);
      setAvailableQuantity(null);
    }
  }

  const galleryImages = useMemo(() => {
    if (!hotel) return [];

    const images = [
      hotel.image_cover,
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"
    ].filter(Boolean);

    return images;
  }, [hotel]);

  const minPrice = rooms.length ? Math.min(...rooms.map((r) => +r.price)) : null;
  const mapSrc =
    hotel?.latitude && hotel?.longitude
      ? `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=16&output=embed`
      : hotel?.address
        ? `https://maps.google.com/maps?q=${encodeURIComponent(
          hotel.address
        )}&z=16&output=embed`
        : "";

  const calculateNights = () => {
    const timeDiff = bookingData.checkOut.getTime() - bookingData.checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const calculateTotalPrice = () => {
    if (!rooms[activeRoomTab]) return 0;
    const nights = calculateNights();
    const roomPrice = Number(rooms[activeRoomTab].price);
    return roomPrice * nights;
  };

  function validateBookingStep1() {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.warning('Vui lòng chọn ngày nhận và trả phòng!');
      return false;
    }
    if (bookingData.checkIn >= bookingData.checkOut) {
      toast.warning('Ngày trả phòng phải sau ngày nhận phòng!');
      return false;
    }
    if (bookingData.adults < 1) {
      toast.warning('Phải có ít nhất 1 người lớn!');
      return false;
    }
    if (rooms[activeRoomTab]?.capacity && bookingData.adults > rooms[activeRoomTab]?.capacity) {
      toast.warning(`Số người lớn vượt quá sức chứa phòng (${rooms[activeRoomTab]?.capacity})!`);
      return false;
    }
    if (bookingData.children < 0) {
      toast.warning('Số trẻ em không hợp lệ!');
      return false;
    }
    return true;
  }

  function validateBookingStep2() {
    if (!bookingData.contactName.trim()) {
      toast.warning('Vui lòng nhập họ tên đầy đủ!');
      return false;
    }
    if (!/^[\p{L} ]{2,}$/u.test(bookingData.contactName)) {
      toast.warning('Họ tên không hợp lệ!');
      return false;
    }
    if (!bookingData.contactPhone.trim()) {
      toast.warning('Vui lòng nhập số điện thoại!');
      return false;
    }
    if (!/^0\d{9,10}$/.test(bookingData.contactPhone)) {
      toast.warning('Số điện thoại không hợp lệ!');
      return false;
    }
    if (!bookingData.contactEmail.trim()) {
      toast.warning('Vui lòng nhập email!');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.contactEmail)) {
      toast.warning('Email không hợp lệ!');
      return false;
    }
    if (!bookingData.paymentMethod) {
      toast.warning('Vui lòng chọn phương thức thanh toán!');
      return false;
    }
    return true;
  }

  async function handleBookingSubmit() {
    try {
      const bookingPayload = {
        room: rooms[activeRoomTab]?.id,
        check_in: bookingData.checkIn.toISOString().slice(0, 10),
        check_out: bookingData.checkOut.toISOString().slice(0, 10),
        status: "pending",
        contact_name: bookingData.contactName,
        contact_phone: bookingData.contactPhone,
        contact_email: bookingData.contactEmail,
        special_requests: bookingData.specialRequests,
        total_amount: calculateTotalPrice(),
        payment_method: bookingData.paymentMethod
      };

      await createRoomBooking('room-booking', bookingPayload);
      queryClient.invalidateQueries(["hotelRooms", slug]);
      return true;
    } catch (err) {
      if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error('Lỗi đặt phòng, vui lòng thử lại.');
      }
      return false;
    }
  }

  const openBookingModal = (roomIndex) => {
    const room = rooms[roomIndex];
    if (!room.is_available || availableQuantity <= 0) {
      setShowSoldOutPopup(true);
      return;
    }
    setActiveRoomTab(roomIndex);
    setShowBookingModal(true);
    setBookingStep(1);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  useEffect(() => {
    if (rooms.length > 0) {
      const roomId = rooms[activeRoomTab]?.id;
      fetchAvailableQuantity(roomId, bookingData.checkIn, bookingData.checkOut);
    }
  }, [rooms, activeRoomTab, bookingData.checkIn, bookingData.checkOut]);
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const AMENITY_ICONS = {
    "fa-wifi": FaWifi,
    "fa-car": FaCar,
    "fa-swimming-pool": FaSwimmingPool,
    "fa-utensils": FaUtensils,
    "fa-dumbbell": FaDumbbell,
    "fa-concierge-bell": FaConciergeBell,
    "fa-broom": FaBroom,
    "fa-bell": FaBell,
    "fa-spa": FaSpa,
    "fa-glass-martini-alt": FaGlassMartiniAlt,
    "fa-tree": FaTree,
    "fa-lock": FaLock,
    "fa-snowflake": FaSnowflake,
    "fa-umbrella-beach": FaUmbrellaBeach,
    "fa-shuttle-van": FaShuttleVan,
    "fa-chalkboard-teacher": FaChalkboardTeacher,
    "fa-tv": FaTv,
    "fa-ice-cream": FaIceCream,
    "fa-wind": FaWind,
    "fa-mug-hot": FaMugHot,
    "fa-soap": FaSoap,
    "fa-clock": FaClock,
    "fa-bread-slice": FaBreadSlice,
    "fa-child": FaChild,
    "fa-suitcase-rolling": FaSuitcaseRolling,
    "fa-car-side": FaCarSide,
    "fa-money-bill-wave": FaMoneyBillWave,
    "fa-smoking-ban": FaSmokingBan,
  };

  const amenities = [
    { label: "Wifi miễn phí", value: "fa-wifi", icon: FaWifi, description: "Kết nối Internet tốc độ cao miễn phí toàn khách sạn", key: 1 },
    { label: "Nhà hàng", value: "fa-utensils", icon: FaUtensils, description: "Phục vụ các món ăn đa dạng, buffet sáng mỗi ngày", key: 2 },
    { label: "Bể bơi ngoài trời", value: "fa-swimming-pool", icon: FaSwimmingPool, description: "Bể bơi ngoài trời cho khách thư giãn", key: 3 },
    { label: "Bãi đỗ xe miễn phí", value: "fa-car", icon: FaCar, description: "Bãi đỗ xe an toàn, miễn phí cho khách lưu trú", key: 4 },
    { label: "Phòng gym", value: "fa-dumbbell", icon: FaDumbbell, description: "Phòng tập thể dục hiện đại, trang bị đầy đủ thiết bị", key: 5 },
    { label: "Lễ tân 24/7", value: "fa-concierge-bell", icon: FaConciergeBell, description: "Dịch vụ lễ tân phục vụ 24/7", key: 6 },
    { label: "Dọn phòng hàng ngày", value: "fa-broom", icon: FaBroom, description: "Phòng được dọn dẹp, làm sạch mỗi ngày", key: 7 },
    { label: "Dịch vụ phòng (Room Service)", value: "fa-bell", icon: FaBell, description: "Gọi món, phục vụ tại phòng 24/7", key: 8 },
    { label: "Spa & Massage", value: "fa-spa", icon: FaSpa, description: "Dịch vụ spa, massage thư giãn chuyên nghiệp", key: 9 },
    { label: "Quầy bar", value: "fa-glass-martini-alt", icon: FaGlassMartiniAlt, description: "Thưởng thức đồ uống và cocktail tại quầy bar", key: 10 },
    { label: "Sân vườn", value: "fa-tree", icon: FaTree, description: "Không gian xanh, sân vườn thư giãn", key: 11 },
    { label: "Két sắt", value: "fa-lock", icon: FaLock, description: "Két sắt an toàn trong phòng", key: 12 },
    { label: "Điều hoà nhiệt độ", value: "fa-snowflake", icon: FaSnowflake, description: "Hệ thống điều hoà nhiệt độ tại phòng", key: 13 },
    { label: "Thang máy", value: "fa-elevator", icon: FaElevator, description: "Thang máy tiện lợi cho khách", key: 14 },
    { label: "Ban công", value: "fa-umbrella-beach", icon: FaUmbrellaBeach, description: "Ban công riêng với view đẹp", key: 15 },
    { label: "Dịch vụ đưa đón sân bay", value: "fa-shuttle-van", icon: FaShuttleVan, description: "Xe đưa đón sân bay tiện lợi", key: 16 },
    { label: "Phòng hội nghị", value: "fa-chalkboard-teacher", icon: FaChalkboardTeacher, description: "Phòng họp, hội nghị trang bị hiện đại", key: 17 },
    { label: "Truyền hình cáp", value: "fa-tv", icon: FaTv, description: "TV, truyền hình cáp tại phòng", key: 18 },
    { label: "Tủ lạnh mini", value: "fa-ice-cream", icon: FaIceCream, description: "Tủ lạnh mini trong phòng", key: 19 },
    { label: "Máy sấy tóc", value: "fa-wind", icon: FaWind, description: "Trang bị máy sấy tóc tại phòng tắm", key: 20 },
    { label: "Ấm siêu tốc", value: "fa-mug-hot", icon: FaMugHot, description: "Ấm đun nước siêu tốc tiện lợi", key: 21 },
    { label: "Dịch vụ giặt là", value: "fa-soap", icon: FaSoap, description: "Dịch vụ giặt là, ủi quần áo chuyên nghiệp", key: 22 },
    { label: "Phòng không hút thuốc", value: "fa-ban-smoking", icon: FaSmokingBan, description: "Phòng dành riêng cho khách không hút thuốc", key: 23 },
    { label: "Nhận/trả phòng nhanh", value: "fa-clock", icon: FaClock, description: "Nhận và trả phòng nhanh chóng", key: 24 },
    { label: "Bữa sáng miễn phí", value: "fa-bread-slice", icon: FaBreadSlice, description: "Bữa sáng miễn phí mỗi ngày", key: 25 },
    { label: "Bãi biển riêng", value: "fa-umbrella-beach", icon: FaUmbrellaBeach, description: "Bãi biển riêng cho khách nghỉ dưỡng", key: 26 },
    { label: "Sân chơi trẻ em", value: "fa-child", icon: FaChild, description: "Khu vui chơi dành cho trẻ em", key: 27 },
    { label: "Dịch vụ giữ hành lý", value: "fa-suitcase-rolling", icon: FaSuitcaseRolling, description: "Nhận giữ hành lý cho khách", key: 28 },
    { label: "Hệ thống báo cháy", value: "fa-bell", icon: FaBell, description: "Hệ thống báo cháy, an toàn phòng chống cháy nổ", key: 29 },
    { label: "Dịch vụ cho thuê xe", value: "fa-car-side", icon: FaCarSide, description: "Dịch vụ cho thuê xe tiện lợi", key: 30 },
    { label: "ATM trong khuôn viên", value: "fa-money-bill-wave", icon: FaMoneyBillWave, description: "Cây ATM ngay trong khách sạn", key: 31 },
    { label: "Wifi khu vực công cộng", value: "fa-wifi", icon: FaWifi, description: "Wifi miễn phí mọi khu vực", key: 32 },
  ];

  const hotelAmenitiesIds = Array.isArray(hotel?.amenities) ? hotel.amenities : [];
  const activeRoom = rooms[activeRoomTab] || {};
  const amenities_list = amenities.filter(amenity => hotelAmenitiesIds.includes(amenity.key)).slice(0, 6);
  const roomAmenitiesIds = Array.isArray(activeRoom.amenities) ? activeRoom.amenities : [];
  const amenities_Room_list = amenities.filter(amenity => roomAmenitiesIds.includes(amenity.key)).slice(0, 6);

  return (
    <div className="min-h-screen font-sans">
      <Breadcrumb className="px-4 pt-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/tim-khach-san">Khách sạn</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{hotel?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DataLoader
        isLoading={loadingHotel || loadingRooms}
        isError={errorHotel || errorRooms}
      >
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-20 md:pt-6 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-6 md:mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 rounded-xl overflow-hidden">
              <div className="md:col-span-2 lg:col-span-3 relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden">
                <img
                  src={galleryImages[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1470&q=80"}
                  alt={hotel?.name}
                  className="w-full h-full object-cover"
                  onClick={() => setShowFullGallery(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">{hotel?.name}</h1>
                  <div className="flex items-center space-x-1">
                    <FaMapMarkerAlt className="text-red-400" />
                    <span className="text-xs md:text-sm">{hotel?.address}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button onClick={() => setWishlist(!wishlist)} className="p-2 bg-white/80 rounded-full backdrop-blur-sm transition hover:bg-white hover:scale-105">
                    <FaHeart className={wishlist ? "text-red-500" : "text-gray-500"} />
                  </button>
                  <button className="p-2 bg-white/80 rounded-full backdrop-blur-sm transition hover:bg-white hover:scale-105">
                    <FaShare className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="hidden md:flex flex-col gap-4">
                <div className="relative h-[8.75rem] lg:h-44 rounded-xl overflow-hidden">
                  <img
                    src={galleryImages[1] || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"}
                    alt="Hotel gallery"
                    className="w-full h-full object-cover"
                    onClick={() => {
                      setCurrentImageIndex(1);
                      setShowFullGallery(true);
                    }}
                  />
                </div>
                <div
                  className="relative h-[8.75rem] lg:h-44 rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => {
                    setCurrentImageIndex(2);
                    setShowFullGallery(true);
                  }}
                >
                  <img
                    src={galleryImages[2] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                    alt="Hotel gallery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                    <span className="text-white font-medium">+ Xem tất cả ảnh</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex md:hidden items-center justify-center mb-6 gap-2">
            <button
              onClick={() => setShowFullGallery(true)}
              className="flex items-center justify-center gap-2 bg-white shadow-md rounded-full px-4 py-2 text-sm font-medium text-blue-600"
            >
              <FaImages /> Xem tất cả ảnh ({galleryImages.length})
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="flex overflow-x-auto border-b no-scrollbar">
              <button
                onClick={() => setActiveTab("rooms")}
                className={`px-4 md:px-6 py-3 md:py-4 font-medium transition-colors whitespace-nowrap ${activeTab === "rooms" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"}`}
              >
                Phòng & Giá
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={`px-4 md:px-6 py-3 md:py-4 font-medium transition-colors whitespace-nowrap ${activeTab === "info" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"}`}
              >
                Thông tin & Tiện nghi
              </button>
              <button
                onClick={() => setActiveTab("location")}
                className={`px-4 md:px-6 py-3 md:py-4 font-medium transition-colors whitespace-nowrap ${activeTab === "location" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"}`}
              >
                Vị trí
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-4 md:px-6 py-3 md:py-4 font-medium transition-colors whitespace-nowrap ${activeTab === "reviews" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"}`}
              >
                Đánh giá
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 md:mb-8">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{hotel?.name}</h2>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">Khách sạn {hotel?.star_rating || 5} sao</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: hotel?.star_rating || 5 }).map((_, i) => (
                          <FaStar key={i} className="text-sm md:text-base" />
                        ))}
                      </div>
                      <span className="ml-1 text-xs md:text-sm">(124 đánh giá)</span>
                    </div>
                    <span className="hidden md:inline">•</span>
                    <span className="flex items-center text-xs md:text-sm"><FaMapMarkerAlt className="mr-1 text-red-500" /> {hotel?.address}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-xs md:text-sm text-gray-500 mb-1">Giá chỉ từ</div>
                  <div className="flex items-center">
                    <span className="line-through text-gray-400 mr-2 text-sm">{formatPrice(minPrice) ? `${formatPrice(minPrice * 1.2)}` : "--"}</span>
                    <span className="text-xl md:text-2xl font-bold text-red-500">{formatPrice(minPrice) ? `${formatPrice(minPrice)}` : "--"}</span>
                    <span className="text-xs text-gray-500 ml-1">/đêm</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Tiết kiệm 20% cho đặt phòng hôm nay</span>
                </div>
              </div>

              <div className="mb-6 md:mb-8">
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800">Tiện nghi nổi bật</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                  {amenities_list.map((amenity) => {
                    const Icon = amenity.icon;
                    return (
                      <div key={amenity.value} className="flex flex-col items-center bg-blue-50 rounded-xl p-2 md:p-4 transition hover:bg-blue-100">
                        <Icon className="text-blue-600 text-lg md:text-xl mb-1 md:mb-2" />
                        <div className="text-xs md:text-sm text-center text-gray-700">{amenity.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6 md:mb-8">
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-gray-800">Giới thiệu</h3>
                <div className="bg-gray-50 rounded-xl p-3 md:p-4 text-gray-700">
                  <p className="text-sm md:text-base mb-3" dangerouslySetInnerHTML={{ __html: hotel?.description }}></p>
                  <button className="text-blue-600 hover:underline font-medium text-sm md:text-base">Xem thêm</button>
                </div>
              </div>

              {activeTab === "rooms" && (
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800">Các loại phòng</h3>
                  <div className="flex flex-nowrap overflow-x-auto gap-2 border-b mb-4 md:mb-6 pb-1 no-scrollbar">
                    {rooms.map((room, idx) => (
                      <button
                        key={room.id || idx}
                        onClick={() => setActiveRoomTab(idx)}
                        className={`px-3 md:px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap text-sm ${activeRoomTab === idx
                          ? "text-blue-700 border-b-2 border-blue-700 bg-white"
                          : "text-gray-500 hover:text-blue-700"
                          }`}
                      >
                        {room.room_type}
                      </button>
                    ))}
                  </div>

                  {rooms.length > 0 && (
                    <motion.div
                      key={activeRoomTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border rounded-xl overflow-hidden mb-4 shadow-md transition duration-200"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 h-48 md:h-auto relative">
                          <img
                            src={rooms[activeRoomTab].image_url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"}
                            alt={rooms[activeRoomTab].room_type}
                            className="w-full h-full object-cover"
                          />
                          {rooms[activeRoomTab].discount && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                              -{rooms[activeRoomTab].discount}%
                            </div>
                          )}
                        </div>
                        <div className="p-4 md:p-6 flex-1 flex flex-col md:flex-row">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-800 mb-2">{rooms[activeRoomTab].room_type}</h4>
                            <div className="mb-4 flex flex-wrap gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${availableQuantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                {availableQuantity > 0
                                  ? `Còn ${availableQuantity} phòng`
                                  : "Hết phòng"}
                              </span>
                            </div>
                            <div className="mb-4 flex flex-wrap gap-2">
                              <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">
                                {rooms[activeRoomTab].capacity} khách
                              </span>
                              <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">
                                {rooms[activeRoomTab].beds || "1 giường đôi"}
                              </span>
                              <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">
                                {rooms[activeRoomTab].floor ? `Tầng ${rooms[activeRoomTab].floor}` : "Diện tích tiêu chuẩn"}
                              </span>
                            </div>
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Tiện nghi phòng:</h5>
                              <div className="grid grid-cols-2 gap-1">
                                {amenities_Room_list.map((amenity, index) => {
                                  return (
                                    <div key={index} className="flex items-center text-sm text-gray-600">
                                      <FaCheck className="text-green-500 mr-1" size={12} /> {amenity.label}
                                    </div>
                                  );
                                })}

                              </div>
                            </div>
                            <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                              Xem chi tiết phòng
                            </div>
                          </div>
                          <div className="md:w-1/4 mt-4 md:mt-0 md:pl-6 md:border-l flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-end">
                                <div className="line-through text-gray-400 text-sm">
                                  {(formatPrice(Number(rooms[activeRoomTab].price) * 1.15))}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-red-500">{formatPrice(Number(rooms[activeRoomTab].price))}</span>
                                <span className="text-xs text-gray-500"> /đêm</span>
                              </div>
                              <div className="text-xs text-gray-500 text-right mb-4">
                                Chưa bao gồm thuế và phí
                              </div>
                            </div>
                            <button
                              onClick={() => openBookingModal(activeRoomTab)}
                              disabled={!rooms[activeRoomTab].is_available || availableQuantity <= 0}
                              className={`w-full py-2 px-4 rounded-lg font-medium transition
                              ${(!rooms[activeRoomTab].is_available || availableQuantity <= 0)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                              Đặt ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {rooms.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-3">😢</div>
                      <p className="text-gray-600">Không có phòng nào khả dụng vào thời điểm này.</p>
                      <p className="text-sm text-gray-500 mt-1">Vui lòng thử lại sau hoặc chọn một ngày khác.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "info" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-800">Thông tin khách sạn</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Giờ nhận/trả phòng</h4>
                          <ul className="space-y-1 text-gray-600">
                            <li className="flex items-start">
                              <FaCheckSquare className="text-green-500 mt-1 mr-2" />
                              <span>Nhận phòng: 14:00 - 22:00</span>
                            </li>
                            <li className="flex items-start">
                              <FaClipboardCheck className="text-red-500 mt-1 mr-2" />
                              <span>Trả phòng: 07:00 - 12:00</span>
                            </li>
                            <li className="flex items-start">
                              <FaInfoCircle className="text-blue-500 mt-1 mr-2" />
                              <span>Nhận phòng sớm/trả phòng muộn có thể có phí phụ thu</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Chính sách</h4>
                          <ul className="space-y-1 text-gray-600">
                            <li className="flex items-start">
                              <FaBaby className="text-blue-500 mt-1 mr-2" />
                              <span>Trẻ em dưới 6 tuổi: Miễn phí khi sử dụng giường có sẵn</span>
                            </li>
                            <li className="flex items-start">
                              <FaPaw className="text-orange-500 mt-1 mr-2" />
                              <span>Thú cưng: Không được phép</span>
                            </li>
                            <li className="flex items-start">
                              <FaSmokingBan className="text-gray-500 mt-1 mr-2" />
                              <span>Hút thuốc: Chỉ được phép ở khu vực chỉ định</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-800">Tất cả tiện nghi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-medium text-blue-600 mb-3 flex items-center"><FaConciergeBell className="mr-2" /> Dịch vụ & Tiện ích</h4>
                        <ul className="space-y-2 text-sm">
                          {amenities.filter(a => hotelAmenitiesIds.includes(a.key) && [1, 6, 7, 8, 16, 22, 24, 28, 30].includes(a.key)).map(amenity => (
                            <li key={amenity.key} className="flex items-start">
                              <amenity.icon className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                              <div>
                                <div className="font-medium">{amenity.label}</div>
                                <div className="text-xs text-gray-500">{amenity.description}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-medium text-green-600 mb-3 flex items-center"><FaUtensils className="mr-2" /> Ẩm thực & Giải trí</h4>
                        <ul className="space-y-2 text-sm">
                          {amenities.filter(a => hotelAmenitiesIds.includes(a.key) && [2, 3, 5, 9, 10, 25, 27].includes(a.key)).map(amenity => (
                            <li key={amenity.key} className="flex items-start">
                              <amenity.icon className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                              <div>
                                <div className="font-medium">{amenity.label}</div>
                                <div className="text-xs text-gray-500">{amenity.description}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-medium text-red-600 mb-3 flex items-center"><FaHome className="mr-2" /> Tiện nghi phòng</h4>
                        <ul className="space-y-2 text-sm">
                          {amenities.filter(a => hotelAmenitiesIds.includes(a.key) && [12, 13, 18, 19, 20, 21, 23].includes(a.key)).map(amenity => (
                            <li key={amenity.key} className="flex items-start">
                              <amenity.icon className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                              <div>
                                <div className="font-medium">{amenity.label}</div>
                                <div className="text-xs text-gray-500">{amenity.description}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "location" && (
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800">Vị trí khách sạn</h3>
                  <div className="bg-white rounded-xl overflow-hidden border shadow mb-4">
                    <iframe
                      title={`Bản đồ ${hotel.name}`}
                      src={mapSrc}
                      width="100%"
                      height="300"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full md:h-[400px]"
                      style={{ border: "none" }}
                    ></iframe>
                  </div>

                </div>
              )}

              {activeTab === "reviews" && (
                <div id="reviews-section" className="mt-8 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-cyan-900">Đánh giá về địa điểm</h2>
                    <button
                      onClick={() => setReviewsExpanded(!reviewsExpanded)}
                      className="text-cyan-600 hover:text-cyan-800 flex items-center text-sm"
                    >
                      {reviewsExpanded ? 'Thu gọn' : 'Xem tất cả'}
                      <svg
                        className={`ml-1 w-4 h-4 transition-transform ${reviewsExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <ReviewForm entityType="hotel" entityId={hotel.id || slug} onReviewAdded={handleReviewAdded} />

                  <div className={`mt-4 transition-all duration-300 overflow-hidden ${reviewsExpanded ? 'max-h-[2000px]' : 'max-h-[600px]'}`}>
                    <ReviewList entityType="hotel" entityId={hotel.id || slug} />
                  </div>

                  {!reviewsExpanded && (
                    <div className="h-20 bg-gradient-to-t from-white to-transparent w-full -mt-20 relative pointer-events-none"></div>
                  )}

                  {!reviewsExpanded && (
                    <div className="text-center mt-2">
                      <button
                        onClick={() => setReviewsExpanded(true)}
                        className="text-cyan-600 hover:text-cyan-800 text-sm font-medium inline-flex items-center"
                      >
                        Xem tất cả đánh giá
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t py-3 px-4 md:hidden z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Giá từ</div>
                <div className="text-lg font-bold text-red-500">{minPrice ? `${minPrice.toLocaleString()} VND` : "--"}</div>
              </div>
              <button
                onClick={() => rooms.length > 0 && openBookingModal(0)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition font-medium text-sm">
                Đặt phòng ngay
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showFullGallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
              onClick={() => setShowFullGallery(false)}
            >
              <div
                className="relative max-w-6xl w-full h-[80vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowFullGallery(false)}
                  className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-10 hover:bg-black/80 transition"
                >
                  <FaTimes size={20} />
                </button>

                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition"
                  onClick={prevImage}
                >
                  <FaChevronLeft />
                </button>

                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={galleryImages[currentImageIndex]}
                    alt={`Gallery image ${currentImageIndex + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition"
                  onClick={nextImage}
                >
                  <FaChevronRight />
                </button>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-black/60 px-4 py-2 rounded-full text-white text-sm">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBookingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              >
                <div className="flex justify-between items-center p-4 md:p-6 border-b">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    {bookingStep === 1 && "Đặt phòng"}
                    {bookingStep === 2 && "Xác nhận thông tin"}
                    {bookingStep === 3 && "Đặt phòng thành công"}
                  </h2>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="overflow-y-auto p-4 md:p-6" style={{ maxHeight: "calc(90vh - 150px)" }}>
                  {bookingStep === 1 && (
                    <div>
                      <div className="mb-6 p-3 md:p-4 bg-blue-50 rounded-lg">
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center">
                          <div className="w-full md:w-24 h-24 rounded-lg overflow-hidden">
                            <img
                              src={`${rooms[activeRoomTab].image_url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"}`}
                              alt={rooms[activeRoomTab].room_type}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1">{rooms[activeRoomTab].room_type}</h3>
                            <p className="text-gray-600 text-sm">{hotel.name}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                                {rooms[activeRoomTab].capacity} khách
                              </span>
                              <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                                {rooms[activeRoomTab].beds || "1 giường đôi"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right mt-2 md:mt-0">
                            <div className="text-lg md:text-xl font-bold text-blue-600">{Number(rooms[activeRoomTab].price).toLocaleString()} VND</div>
                            <div className="text-xs text-gray-500">mỗi đêm</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Ngày nhận phòng</label>
                          <div className="relative">
                            <DatePicker
                              dateFormat="dd/MM/yyyy"
                              locale="vi"
                              required
                              selected={bookingData.checkIn}
                              onChange={date => setBookingData({ ...bookingData, checkIn: date })}
                              minDate={new Date()}
                              className="w-full p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                            />
                            <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Ngày trả phòng</label>
                          <div className="relative">
                            <DatePicker
                              dateFormat="dd/MM/yyyy"
                              locale="vi"
                              required
                              selected={bookingData.checkOut}
                              onChange={date => setBookingData({ ...bookingData, checkOut: date })}
                              minDate={new Date(bookingData.checkIn.getTime() + 86400000)}
                              className="w-full p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                            />
                            <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Số lượng người lớn</label>
                          <div className="relative">
                            <select
                              name="adults"
                              value={bookingData.adults}
                              onChange={handleInputChange}
                              className="w-full p-2 md:p-3 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                            >
                              {[...Array(10)].map((_, i) => (
                                <option key={i} value={i + 1}>{i + 1} người lớn</option>
                              ))}
                            </select>
                            <FaUser className="absolute right-3 top-3 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Số lượng trẻ em</label>
                          <div className="relative">
                            <select
                              name="children"
                              value={bookingData.children}
                              onChange={handleInputChange}
                              className="w-full p-2 md:p-3 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                            >
                              {[...Array(6)].map((_, i) => (
                                <option key={i} value={i}>{i} trẻ em</option>
                              ))}
                            </select>
                            <FaUser className="absolute right-3 top-3 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Yêu cầu đặc biệt (nếu có)</label>
                        <textarea
                          name="specialRequests"
                          value={bookingData.specialRequests}
                          onChange={handleInputChange}
                          placeholder="Ví dụ: phòng tầng cao, phòng yên tĩnh, phòng không hút thuốc..."
                          className="w-full p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-20 md:h-24 text-sm"
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {bookingStep === 2 && (
                    <div>
                      <div className="bg-blue-50 rounded-lg p-3 md:p-4 mb-6">
                        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-2">Thông tin đặt phòng:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-500 flex-shrink-0" />
                            <div>
                              <div className="font-medium">Ngày nhận phòng:</div>
                              <div>{bookingData.checkIn.toLocaleDateString('vi-VN')}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-500 flex-shrink-0" />
                            <div>
                              <div className="font-medium">Ngày trả phòng:</div>
                              <div>{bookingData.checkOut.toLocaleDateString('vi-VN')}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUser className="text-blue-500 flex-shrink-0" />
                            <div>
                              <div className="font-medium">Số lượng khách:</div>
                              <div>{bookingData.adults} người lớn, {bookingData.children} trẻ em</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock className="text-blue-500 flex-shrink-0" />
                            <div>
                              <div className="font-medium">Thời gian lưu trú:</div>
                              <div>{calculateNights()} đêm</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-3">Thông tin liên hệ:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Họ tên người đặt</label>
                            <input
                              type="text"
                              name="contactName"
                              value={bookingData.contactName}
                              onChange={handleInputChange}
                              placeholder="Nhập họ tên đầy đủ"
                              className="w-full p-2 md:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <div className="relative">
                              <input
                                type="tel"
                                name="contactPhone"
                                value={bookingData.contactPhone}
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại liên hệ"
                                className="w-full p-2 md:p-3 pl-8 md:pl-9 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                                required
                              />
                              <FaPhone className="absolute left-3 top-2.5 md:top-3.5 text-gray-400 text-xs md:text-sm" />
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                              <input
                                type="email"
                                name="contactEmail"
                                value={bookingData.contactEmail}
                                onChange={handleInputChange}
                                placeholder="Nhập email để nhận xác nhận đặt phòng"
                                className="w-full p-2 md:p-3 pl-8 md:pl-9 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                                required
                              />
                              <FaEnvelope className="absolute left-3 top-2.5 md:top-3.5 text-gray-400 text-xs md:text-sm" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-3">Phương thức thanh toán:</h3>
                        <div className="space-y-2 md:space-y-3 text-sm">
                          <label className="flex items-center p-2 md:p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="credit_card"
                              checked={bookingData.paymentMethod === "credit_card"}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="ml-3 flex items-center">
                              <FaCreditCard className="text-blue-500 mr-2" />
                              <span>Thanh toán bằng thẻ tín dụng/ghi nợ</span>
                            </div>
                          </label>
                          <label className="flex items-center p-2 md:p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="banking"
                              checked={bookingData.paymentMethod === "banking"}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="ml-3 flex items-center">
                              <FaMoneyBillWave className="text-green-500 mr-2" />
                              <span>Chuyển khoản ngân hàng</span>
                            </div>
                          </label>
                          <label className="flex items-center p-2 md:p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="pay_at_hotel"
                              checked={bookingData.paymentMethod === "pay_at_hotel"}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="ml-3 flex items-center">
                              <FaMoneyBillWave className="text-green-500 mr-2" />
                              <span>Thanh toán tại khách sạn</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-2">Chi tiết thanh toán:</h3>
                        <div className="space-y-1 md:space-y-2 mb-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{rooms[activeRoomTab].room_type} x {calculateNights()} đêm</span>
                            <span>{(Number(rooms[activeRoomTab].price) * calculateNights()).toLocaleString()} VND</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Thuế và phí dịch vụ (10%)</span>
                            <span>{(Number(rooms[activeRoomTab].price) * calculateNights() * 0.1).toLocaleString()} VND</span>
                          </div>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Tổng thanh toán</span>
                          <span className="text-red-600">{(Number(rooms[activeRoomTab].price) * calculateNights() * 1.1).toLocaleString()} VND</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {bookingStep === 3 && (
                    <div className="text-center py-4 md:py-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheck className="text-green-500 text-2xl" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Đặt phòng thành công!</h3>
                      <p className="text-gray-600 mb-6 text-sm md:text-base">Cảm ơn bạn đã chọn {hotel.name}. Xác nhận đặt phòng đã được gửi đến email của bạn.</p>

                      <div className="bg-blue-50 p-4 md:p-5 rounded-lg mb-6 max-w-md mx-auto">
                        <div className="text-left mb-4">
                          <h4 className="font-semibold mb-1 text-sm md:text-base">Thông tin đặt phòng:</h4>
                          <div className="text-xs md:text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Mã đặt phòng:</span>
                              <span className="font-medium">BK{Math.floor(Math.random() * 10000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ngày nhận phòng:</span>
                              <span>{bookingData.checkIn.toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ngày trả phòng:</span>
                              <span>{bookingData.checkOut.toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Số đêm:</span>
                              <span>{calculateNights()} đêm</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Loại phòng:</span>
                              <span>{rooms[activeRoomTab].room_type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-medium text-sm">Tổng thanh toán:</span>
                          <span className="font-bold text-red-600 text-sm md:text-base">{(Number(rooms[activeRoomTab].price) * calculateNights() * 1.1).toLocaleString()} VND</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowBookingModal(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 md:px-8 rounded-lg transition font-medium text-sm md:text-base"
                      >
                        Đóng
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4 md:p-6 border-t flex justify-between items-center">
                  {bookingStep > 1 && bookingStep < 3 && (
                    <button
                      onClick={() => setBookingStep(bookingStep - 1)}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium text-sm"
                    >
                      <FaChevronLeft className="mr-1" /> Quay lại
                    </button>
                  )}
                  {bookingStep === 1 && (
                    <div></div>
                  )}

                  {bookingStep === 1 && (
                    <button
                      onClick={() => {
                        if (validateBookingStep1()) setBookingStep(2);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 md:px-6 rounded-lg transition font-medium flex items-center text-sm"
                    >
                      Tiếp tục <FaChevronRight className="ml-1" />
                    </button>
                  )}

                  {bookingStep === 2 && (
                    <button
                      onClick={async () => {
                        if (validateBookingStep2()) {
                          try {
                            await handleBookingSubmit();
                            setBookingStep(3);
                          } catch (err) {
                            toast.error('Có lỗi khi đặt phòng. Vui lòng thử lại!');
                          }
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 md:px-6 rounded-lg transition font-medium flex items-center text-sm"
                    >
                      Xác nhận đặt phòng <FaLock className="ml-1" />
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
          <ToastContainer position="top-right" autoClose={3000} />
        </AnimatePresence>
        <AnimatePresence>
          {showSoldOutPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4"
              onClick={() => setShowSoldOutPopup(false)}
            >
              <div
                className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center"
                onClick={e => e.stopPropagation()}
              >
                <div className="mb-3 text-red-500 text-4xl">😢</div>
                <h2 className="font-bold text-lg mb-2">Hết phòng!</h2>
                <p className="text-gray-600 mb-4">
                  Loại phòng này đã hết chỗ hoặc tạm ngừng bán. Vui lòng chọn loại phòng khác hoặc quay lại sau!
                </p>
                <button
                  onClick={() => setShowSoldOutPopup(false)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </DataLoader>

    </div>
  );
}