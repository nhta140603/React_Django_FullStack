import React, { useState, useEffect } from "react";
import {
    FaCalendarAlt, FaBed, FaMoneyBillWave, FaSuitcase, FaExclamationCircle, FaSearch,
    FaFilter, FaSortAmountDown, FaSortAmountUp, FaEye, FaCircle,
    FaHotel, FaCreditCard, FaCheckCircle, FaPhoneAlt, FaUser,
    FaMapMarkerAlt, FaClock, FaReceipt, FaAngleRight, FaTimes
} from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import { getList, cancelRoomBooking } from "../../api/user_api";

const statusColors = {
    confirmed: "text-emerald-600",
    pending: "text-amber-600",
    canceled: "text-rose-600",
    completed: "text-blue-600",
    active: "text-indigo-600"
};

const statusBgColors = {
    confirmed: "bg-emerald-100",
    pending: "bg-amber-100",
    canceled: "bg-rose-100",
    completed: "bg-blue-100",
    active: "bg-indigo-100"
};

const statusLabels = {
    confirmed: "Đã xác nhận",
    pending: "Đang chờ",
    canceled: "Đã hủy",
    completed: "Đã hoàn thành",
    active: "Đang diễn ra"
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortField, setSortField] = useState("check_in");
    const [sortDirection, setSortDirection] = useState("asc");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const mapSrc =
        selectedBooking?.latitude && selectedBooking?.longitude
            ? `https://www.google.com/maps?q=${selectedBooking.latitude},${selectedBooking.longitude}&z=16&output=embed`
            : selectedBooking?.location
                ? `https://maps.google.com/maps?q=${encodeURIComponent(
                    selectedBooking.location
                )}&z=16&output=embed`
                : "";
    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const data = await getList("room-booking");
                setBookings(data);
                setError(null);
            } catch (err) {
                setError("Không thể tải dữ liệu đặt phòng. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const filteredAndSortedBookings = bookings
        .filter(booking =>
            (statusFilter === "all" || booking.status === statusFilter) &&
            (
                (booking.room?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                booking.room?.hotel?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.id?.toString().includes(searchQuery)
            )
        )
        .sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case "check_in":
                    comparison = new Date(a.check_in) - new Date(b.check_in);
                    break;
                case "total_amount":
                    comparison = a.total_amount - b.total_amount;
                    break;
                case "created_at":
                    comparison = new Date(a.created_at) - new Date(b.created_at);
                    break;
                default:
                    comparison = 0;
            }
            return sortDirection === "asc" ? comparison : -comparison;
        });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const handleCancelBooking = async () => {
        if (!selectedBooking) return;
        try {
            await cancelRoomBooking(selectedBooking.id);
            toast.success("Hủy phòng thành công");
            setSelectedBooking(null);
            setTimeout(() => {
                window.location.reload();
            }, 2000)
        } catch (err) {
            toast.error("Hủy phòng thất bại");
        }
    };
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const calculateNights = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="flex-1 p-2 bg-gray-50">
            <main className="flex-1 p-3 md:p-6 max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Đặt phòng của tôi</h1>
                    <p className="text-gray-500 mt-1">Quản lý tất cả các đặt phòng của bạn tại đây</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <FaSuitcase className="text-blue-600 text-xl" />
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm mb-1">Tổng số đặt phòng</p>
                                <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="bg-emerald-100 p-3 rounded-full">
                                <FaCheckCircle className="text-emerald-600 text-xl" />
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm mb-1">Đã xác nhận</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {bookings.filter(b => b.status === "confirmed").length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="bg-indigo-100 p-3 rounded-full">
                                <FaHotel className="text-indigo-600 text-xl" />
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm mb-1">Đang diễn ra</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {bookings.filter(b => b.status === "active").length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <FaCalendarAlt className="text-purple-600 text-xl" />
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm mb-1">Sắp tới</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {bookings.filter(b => new Date(b.check_in) > new Date() && b.status !== "canceled").length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:hidden mb-4">
                    <div className="relative mb-3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên khách sạn, phòng..."
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                    </div>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2 border border-gray-200 shadow-sm"
                    >
                        <FaFilter className="text-blue-500" />
                        {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                    </button>
                </div>

                <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="hidden md:block relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên khách sạn, phòng..."
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="pending">Đang chờ</option>
                                <option value="active">Đang diễn ra</option>
                                <option value="completed">Đã hoàn thành</option>
                                <option value="canceled">Đã hủy</option>
                            </select>
                            <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={sortField}
                                onChange={(e) => handleSort(e.target.value)}
                            >
                                <option value="check_in">Sắp xếp theo ngày nhận phòng</option>
                                <option value="created_at">Sắp xếp theo ngày đặt</option>
                                <option value="total_amount">Sắp xếp theo giá trị</option>
                            </select>
                            {sortDirection === "asc" ? (
                                <FaSortAmountUp
                                    className="absolute left-3 top-3.5 text-gray-400 cursor-pointer"
                                    onClick={() => setSortDirection("desc")}
                                />
                            ) : (
                                <FaSortAmountDown
                                    className="absolute left-3 top-3.5 text-gray-400 cursor-pointer"
                                    onClick={() => setSortDirection("asc")}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                            <p className="text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                        <div className="text-rose-500 mb-4 text-5xl flex justify-center">
                            <FaExclamationCircle />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">Đã xảy ra lỗi</h3>
                        <p className="text-gray-600 mb-5">{error}</p>
                        <button
                            className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            Thử lại
                        </button>
                    </div>
                ) : filteredAndSortedBookings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                        <div className="text-gray-400 mb-4 text-5xl flex justify-center">
                            <FaBed />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">Không tìm thấy đặt phòng nào</h3>
                        <p className="text-gray-600 mb-5">
                            Bạn chưa đặt phòng nào hoặc không có đặt phòng nào khớp với tiêu chí tìm kiếm
                        </p>
                        <button className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                            Tìm khách sạn mới
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 md:space-y-6">
                        {filteredAndSortedBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="md:flex">
                                    <div className="md:w-1/3 lg:w-1/4 h-[180px] md:h-full relative">
                                        <img
                                            src={booking.room.image_url}
                                            alt={booking.room.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-0 left-0 m-3 bg-black bg-opacity-75 text-white px-3 py-1 text-sm rounded-lg font-medium flex items-center gap-1">
                                            <FaCalendarAlt />
                                            <span>{calculateNights(booking.check_in, booking.check_out)} đêm</span>
                                        </div>
                                        <div
                                            className={`absolute top-0 right-0 m-3 px-3 py-1 text-sm rounded-lg font-medium flex items-center gap-1 ${statusBgColors[booking.status]} ${statusColors[booking.status]}`}
                                        >
                                            <FaCircle className="text-xs" />
                                            <span>{statusLabels[booking.status]}</span>
                                        </div>
                                    </div>
                                    <div className="p-5 md:w-2/3 lg:w-3/4">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        {booking.room.hotel?.name || "Khách sạn"}
                                                    </h3>
                                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                        #{booking.id}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 mb-1 flex items-center gap-1">
                                                    <FaBed className="text-blue-500" /> 
                                                    <span>Phòng: {booking.room.name}</span>
                                                </p>
                                                <p className="text-gray-600 text-sm flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-rose-500" />
                                                    <span className="truncate">{booking.location || "Địa chỉ không có sẵn"}</span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="md:self-start bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                            >
                                                <FaEye /> Chi tiết
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaCalendarAlt className="text-blue-500" />
                                                    <p className="text-xs text-gray-500">Nhận phòng</p>
                                                </div>
                                                <p className="font-medium">{formatDate(booking.check_in)}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaCalendarAlt className="text-blue-500" />
                                                    <p className="text-xs text-gray-500">Trả phòng</p>
                                                </div>
                                                <p className="font-medium">{formatDate(booking.check_out)}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaUser className="text-blue-500" />
                                                    <p className="text-xs text-gray-500">Người liên hệ</p>
                                                </div>
                                                <p className="font-medium truncate">{booking.contact_name}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaMoneyBillWave className="text-blue-500" />
                                                    <p className="text-xs text-gray-500">Tổng tiền</p>
                                                </div>
                                                <p className="font-medium">{formatCurrency(booking.total_amount)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap justify-between items-center border-t pt-4 mt-2">
                                            <div className="text-gray-600 text-sm flex items-center gap-1">
                                                <FaClock className="text-gray-400" />
                                                Đã đặt vào: {formatDate(booking.created_at)}
                                            </div>
                                            <div className="mt-2 md:mt-0 flex gap-2">
                                                {booking.status === "pending" && (
                                                    <>
                                                        <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                                                            <FaCreditCard />
                                                            Thanh toán: {formatCurrency(booking.paid_amount)}/{formatCurrency(booking.total_amount)}
                                                        </div>
                                                        <button className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                                                            Thanh toán
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status === "confirmed" && (
                                                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                                                        <FaCheckCircle />
                                                        Đã thanh toán đầy đủ
                                                    </div>
                                                )}
                                                {(booking.status === "confirmed" || booking.status === "pending") &&
                                                    new Date(booking.check_in) > new Date() && (
                                                        <button
                                                            onClick={() => setSelectedBooking(booking)}
                                                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-sm transition-colors">
                                                            Hủy phòng
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedBooking && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                            <div className="relative">
                                <div className="h-32 md:h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="absolute top-4 right-4 text-white bg-black bg-opacity-30 hover:bg-opacity-50 p-2 rounded-full transition-colors"
                                >
                                    <FaTimes />
                                </button>
                                <div className="absolute top-16 md:top-24 left-0 right-0 px-4 md:px-8">
                                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                                        {selectedBooking.room.hotel?.name}
                                                    </h2>
                                                    <span className={`${statusBgColors[selectedBooking.status]} ${statusColors[selectedBooking.status]} px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1`}>
                                                        <FaCircle className="text-xs" />
                                                        {statusLabels[selectedBooking.status]}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-1 flex items-center gap-1">
                                                    <FaBed className="text-blue-500" />
                                                    Phòng: {selectedBooking.room.name}
                                                </p>
                                                <p className="text-gray-500 text-sm">Mã đặt phòng: #{selectedBooking.id}</p>
                                            </div>
                                            {(selectedBooking.status === "confirmed" || selectedBooking.status === "pending") &&
                                                new Date(selectedBooking.check_in) > new Date() && (
                                                <button
                                                    onClick={handleCancelBooking}
                                                    className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium">
                                                    Hủy đặt phòng
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="mb-6 rounded-lg overflow-hidden">
                                                    <img
                                                        src={selectedBooking.room.image_url}
                                                        alt={selectedBooking.room.name}
                                                        className="w-full h-48 md:h-56 object-cover"
                                                    />
                                                </div>
                                                
                                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <FaCalendarAlt className="text-blue-500" />
                                                        Thông tin đặt phòng
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div className="flex gap-3 items-start">
                                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <FaCalendarAlt className="text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 text-sm mb-0.5">Nhận phòng</p>
                                                                <p className="font-medium">{formatDate(selectedBooking.check_in)}</p>
                                                                <p className="text-xs text-gray-500">Sau 14:00</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3 items-start">
                                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <FaCalendarAlt className="text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 text-sm mb-0.5">Trả phòng</p>
                                                                <p className="font-medium">{formatDate(selectedBooking.check_out)}</p>
                                                                <p className="text-xs text-gray-500">Trước 12:00</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3 items-start">
                                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <FaClock className="text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 text-sm mb-0.5">Thời gian lưu trú</p>
                                                                <p className="font-medium">{calculateNights(selectedBooking.check_in, selectedBooking.check_out)} đêm</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <FaUser className="text-blue-500" />
                                                        Thông tin liên hệ
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div className="flex gap-3 items-start">
                                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <FaUser className="text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 text-sm mb-0.5">Người liên hệ</p>
                                                                <p className="font-medium">{selectedBooking.contact_name}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3 items-start">
                                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <FaPhoneAlt className="text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 text-sm mb-0.5">Số điện thoại</p>
                                                                <p className="font-medium">{selectedBooking.contact_phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <FaMoneyBillWave className="text-emerald-500" />
                                                        Chi tiết thanh toán
                                                    </h3>
                                                    <div className="bg-white rounded-lg p-4 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-gray-700">Giá phòng mỗi đêm</p>
                                                                <p className="text-sm text-gray-500">{selectedBooking.room.hotel?.name} - {selectedBooking.room.name}</p>
                                                            </div>
                                                            <p className="font-medium">{formatCurrency(selectedBooking.room.price || selectedBooking.total_amount / calculateNights(selectedBooking.check_in, selectedBooking.check_out))}</p>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-gray-700">Số đêm</p>
                                                            <p className="font-medium">x {calculateNights(selectedBooking.check_in, selectedBooking.check_out)}</p>
                                                        </div>
                                                        <div className="h-px bg-gray-200 my-2"></div>
                                                        <div className="flex items-center justify-between">
                                                            <p className="font-bold text-gray-800">Tổng tiền</p>
                                                            <p className="font-bold text-gray-800">{formatCurrency(selectedBooking.total_amount)}</p>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-gray-700">Đã thanh toán</p>
                                                            <p className="font-medium text-emerald-600">{formatCurrency(selectedBooking.paid_amount)}</p>
                                                        </div>
                                                        {selectedBooking.paid_amount < selectedBooking.total_amount && (
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-gray-700">Còn lại</p>
                                                                <p className="font-medium text-rose-600">{formatCurrency(selectedBooking.total_amount - selectedBooking.paid_amount)}</p>
                                                            </div>
                                                        )}
                                                        
                                                        {selectedBooking.status === "pending" && (
                                                            <div className="mt-4">
                                                                <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2">
                                                                    <FaCreditCard /> Thanh toán ngay
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-rose-500" />
                                                        Địa điểm
                                                    </h3>
                                                    <div className="bg-white rounded-lg p-4 mb-3">
                                                        <p className="font-medium mb-1">{selectedBooking.room.hotel?.name}</p>
                                                        <p className="text-gray-600 text-sm">
                                                            {selectedBooking.location || "Địa chỉ không có sẵn"}
                                                        </p>
                                                    </div>
                                                    <div className="bg-gray-200 rounded-lg overflow-hidden h-48">
                                                        <iframe
                                                            title={`Bản đồ ${selectedBooking.room.hotel?.name}`}
                                                            src={mapSrc}
                                                            width="100%"
                                                            height="100%"
                                                            allowFullScreen=""
                                                            loading="lazy"
                                                            referrerPolicy="no-referrer-when-downgrade"
                                                            style={{ border: "none" }}
                                                        ></iframe>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-blue-50 rounded-xl p-4">
                                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <FaReceipt className="text-blue-500" />
                                                        Thông tin giao dịch
                                                    </h3>
                                                    <div className="space-y-3">
                                                        <div className="bg-white rounded-lg p-3 flex justify-between items-center">
                                                            <div>
                                                                <p className="text-sm text-gray-500">Ngày đặt phòng</p>
                                                                <p className="font-medium">{formatDate(selectedBooking.created_at)}</p>
                                                            </div>
                                                            <FaAngleRight className="text-gray-400" />
                                                        </div>
                                                        {selectedBooking.status === "canceled" && selectedBooking.canceled_at && (
                                                            <div className="bg-white rounded-lg p-3 flex justify-between items-center">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">Ngày hủy</p>
                                                                    <p className="font-medium">{formatDate(selectedBooking.canceled_at)}</p>
                                                                </div>
                                                                <FaAngleRight className="text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="border-t mt-6 pt-6 flex justify-end">
                                            <button
                                                onClick={() => setSelectedBooking(null)}
                                                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                            >
                                                Đóng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}