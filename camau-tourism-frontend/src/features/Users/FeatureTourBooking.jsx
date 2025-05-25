import React, { useState, useEffect } from "react";
import {
    FaCalendarAlt, FaUsers, FaMoneyBillWave, FaSuitcaseRolling, FaExclamationCircle,
    FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaEye, FaCircle,
    FaEllipsisV, FaTimes, FaMapMarkerAlt, FaClock
} from "react-icons/fa";
import { getList } from "../../api/user_api";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice"
import formatDateVN from "../../utils/formatDate"
const statusColors = {
    confirmed: "text-green-500",
    pending: "text-yellow-500",
    canceled: "text-red-500",
    completed: "text-blue-500"
};

const statusBgColors = {
    confirmed: "bg-green-100",
    pending: "bg-yellow-100",
    canceled: "bg-red-100",
    completed: "bg-blue-100"
};

const statusLabels = {
    confirmed: "Đã xác nhận",
    pending: "Đang chờ",
    canceled: "Đã hủy",
    completed: "Đã hoàn thành"
};

export default function TripsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortField, setSortField] = useState("booking_date");
    const [sortDirection, setSortDirection] = useState("asc");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const data = await getList("tours-booking");
                setBookings(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setError("Không thể tải dữ liệu đơn tour. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        const handleClickOutside = () => setShowActionMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
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
                (booking.tour?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                booking.id?.toString().includes(searchQuery)
            )
        )
        .sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case "booking_date":
                    comparison = new Date(a.booking_date) - new Date(b.booking_date);
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

    const toggleActionMenu = (e, id) => {
        e.stopPropagation();
        setShowActionMenu(showActionMenu === id ? null : id);
    };

    return (
        <div className="flex-1 p-2 bg-gray-50">
            <main className="flex-1 p-3 md:p-6 max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8 flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Đơn tour của tôi</h1>
                    <Link
                        to="/danh-sach-chuyen-du-lich"
                        className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                        <FaSuitcaseRolling />
                        <span>Khám phá tour mới</span>
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 md:p-5 mb-6">
                    <div className="flex items-center justify-between mb-3 md:hidden">
                        <div className="relative flex-1 mr-2">
                            <input
                                type="text"
                                placeholder="Tìm kiếm tour..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            className="bg-blue-50 text-blue-600 p-2.5 rounded-lg hover:bg-blue-100 transition-colors"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter />
                        </button>
                    </div>

                    <div className={`md:hidden ${showFilters ? 'block' : 'hidden'} space-y-3 mt-3 border-t pt-3 animate-fadeIn`}>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="pending">Đang chờ</option>
                                <option value="completed">Đã hoàn thành</option>
                                <option value="canceled">Đã hủy</option>
                            </select>
                            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                value={sortField}
                                onChange={(e) => handleSort(e.target.value)}
                            >
                                <option value="booking_date">Sắp xếp theo ngày khởi hành</option>
                                <option value="created_at">Sắp xếp theo ngày đặt</option>
                                <option value="total_amount">Sắp xếp theo giá trị</option>
                            </select>
                            {sortDirection === "asc" ? (
                                <FaSortAmountUp
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                    onClick={() => setSortDirection("desc")}
                                />
                            ) : (
                                <FaSortAmountDown
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                    onClick={() => setSortDirection("asc")}
                                />
                            )}
                        </div>
                    </div>

                    <div className="hidden md:grid grid-cols-3 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm tour hoặc mã đơn..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-shadow"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute left-0 top-0 h-full flex items-center pl-4">
                                <FaSearch className="text-gray-400" />
                            </div>
                        </div>
                        <div className="relative">
                            <select
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-shadow"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="pending">Đang chờ</option>
                                <option value="completed">Đã hoàn thành</option>
                                <option value="canceled">Đã hủy</option>
                            </select>
                            <div className="absolute left-0 top-0 h-full flex items-center pl-4">
                                <FaFilter className="text-gray-400" />
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="relative">
                            <select
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-shadow"
                                value={sortField}
                                onChange={(e) => handleSort(e.target.value)}
                            >
                                <option value="booking_date">Sắp xếp theo ngày khởi hành</option>
                                <option value="created_at">Sắp xếp theo ngày đặt</option>
                                <option value="total_amount">Sắp xếp theo giá trị</option>
                            </select>
                            <div className="absolute left-0 top-0 h-full flex items-center pl-4">
                                {sortDirection === "asc" ? (
                                    <FaSortAmountUp
                                        className="text-gray-400 cursor-pointer"
                                        onClick={() => setSortDirection("desc")}
                                    />
                                ) : (
                                    <FaSortAmountDown
                                        className="text-gray-400 cursor-pointer"
                                        onClick={() => setSortDirection("asc")}
                                    />
                                )}
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-500">Đang tải dữ liệu đơn tour...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="text-red-500 mb-4 text-4xl md:text-5xl flex justify-center">
                            <FaExclamationCircle />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Đã xảy ra lỗi</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
                        <button
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            onClick={() => window.location.reload()}
                        >
                            Thử lại
                        </button>
                    </div>
                ) : filteredAndSortedBookings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="text-gray-400 mb-4 text-5xl md:text-6xl flex justify-center">
                            <FaSuitcaseRolling />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy đơn tour nào</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {searchQuery || statusFilter !== "all"
                                ? "Không có đơn tour nào khớp với tiêu chí tìm kiếm của bạn"
                                : "Bạn chưa đặt tour nào. Hãy khám phá và đặt tour ngay!"}
                        </p>
                        <Link
                            to="/danh-sach-chuyen-du-lich"
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors inline-block font-medium"
                        >
                            Khám phá tour mới
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        {filteredAndSortedBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
                                onClick={() => setSelectedBooking(booking)}
                            >
                                <div className="md:hidden">
                                    <div className="relative">
                                        <img
                                            src={booking.tour.image}
                                            alt={booking.tour.name}
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="absolute top-0 left-0 m-2 bg-black bg-opacity-75 text-white px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5">
                                            <FaClock className="text-xs" />
                                            <span>{booking.tour.duration} ngày</span>
                                        </div>
                                        <div
                                            className={`absolute top-0 right-0 m-2 px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 ${statusBgColors[booking.status]} ${statusColors[booking.status]}`}
                                        >
                                            <FaCircle className="text-xs" />
                                            <span className="font-medium">{statusLabels[booking.status]}</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-base font-bold text-gray-800 line-clamp-1 mb-1">{booking.tour.name}</h3>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <span>Mã đơn:</span>
                                                    <span className="font-medium text-gray-700">#{booking.id}</span>
                                                </p>
                                            </div>
                                            <div className="relative">
                                                <button
                                                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full"
                                                    onClick={(e) => toggleActionMenu(e, booking.id)}
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                {showActionMenu === booking.id && (
                                                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg z-10 border border-gray-100 py-1">
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedBooking(booking);
                                                            }}
                                                        >
                                                            <FaEye size={14} className="text-blue-500" />
                                                            <span>Chi tiết</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">
                                                    <FaCalendarAlt className="text-sm" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Khởi hành</p>
                                                    <p className="text-sm font-medium">{formatDateVN(booking.booking_date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">
                                                    <FaUsers className="text-sm" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Số người</p>
                                                    <p className="text-sm font-medium">{booking.number_of_people}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">
                                                    <FaMoneyBillWave className="text-sm" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Tổng tiền</p>
                                                    <p className="text-sm font-semibold">{formatPrice(booking.total_amount)}</p>
                                                </div>
                                            </div>
                                            {booking.status === "pending" && (
                                                <div className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg text-xs font-medium">
                                                    Cần thanh toán
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Design */}
                                <div className="hidden md:flex">
                                    <div className="w-1/3 max-h-[240px] relative">
                                        <img
                                            src={booking.tour.image}
                                            alt={booking.tour.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 bg-black bg-opacity-75 text-white px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5">
                                            <FaClock />
                                            <span>{booking.tour.duration} ngày</span>
                                        </div>
                                        <div
                                            className={`absolute top-3 right-3 px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 font-medium ${statusBgColors[booking.status]} ${statusColors[booking.status]}`}
                                        >
                                            <FaCircle className="text-xs" />
                                            <span>{statusLabels[booking.status]}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 w-2/3">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        {booking.tour.name}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4">
                                                    <FaMapMarkerAlt className="text-blue-500" />
                                                    <span>{booking.tour.destination || "Điểm đến du lịch"}</span>
                                                    <span className="mx-2 text-gray-300">•</span>
                                                    <span>Mã đơn: <span className="font-medium text-gray-700">#{booking.id}</span></span>
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedBooking(booking);
                                                    }}
                                                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center gap-2 font-medium"
                                                >
                                                    <FaEye /> Chi tiết
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6 mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">
                                                    <FaCalendarAlt />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Ngày khởi hành</p>
                                                    <p className="font-medium">{formatDateVN(booking.booking_date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">
                                                    <FaUsers />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Số người</p>
                                                    <p className="font-medium">{booking.number_of_people} người</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">
                                                    <FaMoneyBillWave />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Tổng tiền</p>
                                                    <p className="font-semibold">{formatPrice(booking.total_amount)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-center border-t border-gray-100 pt-4 text-sm">
                                            <div className="text-gray-500 flex items-center gap-1.5">
                                                <span>Đã đặt vào:</span>
                                                <span className="font-medium text-gray-700">{formatDateVN(booking.created_at)}</span>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                {booking.status === "pending" && (
                                                    <div className="flex gap-3 items-center">
                                                        <div className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg font-medium text-sm">
                                                            Thanh toán: {formatPrice(booking.paid_amount)}/{formatPrice(booking.total_amount)}
                                                        </div>
                                                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors">
                                                            Thanh toán ngay
                                                        </button>
                                                    </div>
                                                )}
                                                {booking.status === "confirmed" && (
                                                    <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg font-medium">
                                                        Đã đặt cọc
                                                    </div>
                                                )}
                                                {booking.status === "canceled" && (
                                                    <div className="bg-red-100 text-red-800 px-3 py-1.5 rounded-lg font-medium">
                                                        Đã hủy
                                                    </div>
                                                )}
                                                {booking.status === "completed" && (
                                                    <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-medium">
                                                        Đã hoàn thành
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedBooking && (
                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 transition-all p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fadeIn relative max-h-[90vh] overflow-y-auto">
                            <div className="relative">
                                <button
                                    className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-gray-900 transition-colors"
                                    onClick={() => setSelectedBooking(null)}
                                >
                                    <FaTimes />
                                </button>
                                <div
                                    className={`absolute bottom-3 left-3 px-3 py-1.5 text-sm rounded-lg flex items-center gap-1.5 font-medium ${statusBgColors[selectedBooking.status]} ${statusColors[selectedBooking.status]}`}
                                >
                                    <FaCircle className="text-xs" />
                                    <span>{statusLabels[selectedBooking.status]}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-1 text-gray-800">{selectedBooking.tour.name}</h2>
                                <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-5">
                                    <FaMapMarkerAlt className="text-blue-500" />
                                    <span>{selectedBooking.tour.destination || "Điểm đến du lịch"}</span>
                                    <span className="mx-2 text-gray-300">•</span>
                                    <span>Mã đơn: <span className="font-medium text-gray-700">#{selectedBooking.id}</span></span>
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h4 className="font-bold text-gray-800 mb-4 text-base flex items-center gap-2">
                                            <FaSuitcaseRolling className="text-blue-500" />
                                            <span>Thông tin chuyến đi</span>
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                                                    <FaCalendarAlt />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Ngày khởi hành</p>
                                                    <p className="font-medium">{formatDateVN(selectedBooking.booking_date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                                                    <FaUsers />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Số người</p>
                                                    <p className="font-medium">
                                                        {selectedBooking.number_of_people} người
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 flex-shrink-0">
                                                    <FaClock />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Thời gian tour</p>
                                                    <p className="font-medium">{selectedBooking.tour.duration} ngày</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h4 className="font-bold text-gray-800 mb-4 text-base flex items-center gap-2">
                                            <FaMoneyBillWave className="text-blue-500" />
                                            <span>Chi tiết thanh toán</span>
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-gray-500">Giá tour</p>
                                                <p className="font-medium">
                                                    {formatPrice(selectedBooking.tour.price)} x {selectedBooking.number_of_people}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-gray-500">Tổng tiền</p>
                                                <p className="font-semibold">{formatPrice(selectedBooking.total_amount)}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-gray-500">Đã thanh toán</p>
                                                <p className="font-medium text-green-600">{formatPrice(selectedBooking.paid_amount)}</p>
                                            </div>
                                            {selectedBooking.paid_amount < selectedBooking.total_amount && (
                                                <div className="flex items-center justify-between">
                                                    <p className="text-gray-500">Còn lại</p>
                                                    <p className="font-medium text-red-600">
                                                        {formatPrice(selectedBooking.total_amount - selectedBooking.paid_amount)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-gray-100 pt-5">
                                    <div className="flex flex-wrap gap-3 justify-end">
                                        <button
                                            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                                            onClick={() => setSelectedBooking(null)}
                                        >
                                            Đóng
                                        </button>
                                        {selectedBooking.status === "pending" && (
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                                                Thanh toán ngay
                                            </button>
                                        )}
                                        {selectedBooking.status === "confirmed" && (
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                                                Xem lịch trình
                                            </button>
                                        )}
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