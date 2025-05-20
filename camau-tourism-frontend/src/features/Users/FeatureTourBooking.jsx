import React, { useState, useEffect } from "react";
import {
    FaCalendarAlt, FaUsers, FaMoneyBillWave, FaSuitcaseRolling, FaExclamationCircle,
    FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaEye, FaFileDownload, FaCircle, FaEllipsisV
} from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import { getList } from "../../api/user_api";
import { Link } from "react-router-dom";
const statusColors = {
    confirmed: "text-green-500",
    pending: "text-yellow-500",
    canceled: "text-red-500",
    completed: "text-blue-500"
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleDownloadVoucher = (e) => {
        e.stopPropagation();
        toast.success("Voucher sẽ được tải về (demo)!");
    };

    const toggleActionMenu = (e, id) => {
        e.stopPropagation();
        setShowActionMenu(showActionMenu === id ? null : id);
    };

    return (
        <div className="flex-1 p-2 bg-[#f5f7fb]">
            <main className="flex-1 p-3 md:p-6 bg-[#f5f7fb]">
                <div className="mb-4 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Đơn tour của tôi</h1>
                </div>

                <div className="bg-white rounded-lg shadow p-3 md:p-4 mb-4 md:mb-6">
                    <div className="flex items-center justify-between mb-2 md:hidden">
                        <div className="relative flex-1 mr-2">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        <button
                            className="bg-blue-100 text-blue-600 p-2 rounded-lg"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter />
                        </button>
                    </div>

                    <div className={`md:hidden ${showFilters ? 'block' : 'hidden'} space-y-3 mt-3 border-t pt-3`}>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="pending">Đang chờ</option>
                                <option value="completed">Đã hoàn thành</option>
                                <option value="canceled">Đã hủy</option>
                            </select>
                            <FaFilter className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={sortField}
                                onChange={(e) => handleSort(e.target.value)}
                            >
                                <option value="booking_date">Sắp xếp theo ngày khởi hành</option>
                                <option value="created_at">Sắp xếp theo ngày đặt</option>
                                <option value="total_amount">Sắp xếp theo giá trị</option>
                            </select>
                            {sortDirection === "asc" ? (
                                <FaSortAmountUp
                                    className="absolute left-3 top-3 text-gray-400 cursor-pointer"
                                    onClick={() => setSortDirection("desc")}
                                />
                            ) : (
                                <FaSortAmountDown
                                    className="absolute left-3 top-3 text-gray-400 cursor-pointer"
                                    onClick={() => setSortDirection("asc")}
                                />
                            )}
                        </div>
                    </div>

                    <div className="hidden md:grid grid-cols-3 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm tour..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="pending">Đang chờ</option>
                                <option value="completed">Đã hoàn thành</option>
                                <option value="canceled">Đã hủy</option>
                            </select>
                            <FaFilter className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={sortField}
                                onChange={(e) => handleSort(e.target.value)}
                            >
                                <option value="booking_date">Sắp xếp theo ngày khởi hành</option>
                                <option value="created_at">Sắp xếp theo ngày đặt</option>
                                <option value="total_amount">Sắp xếp theo giá trị</option>
                            </select>
                            {sortDirection === "asc" ? (
                                <FaSortAmountUp
                                    className="absolute left-3 top-3 text-gray-400 cursor-pointer"
                                    onClick={() => setSortDirection("desc")}
                                />
                            ) : (
                                <FaSortAmountDown
                                    className="absolute left-3 top-3 text-gray-400 cursor-pointer"
                                    onClick={() => setSortDirection("asc")}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow p-6 md:p-8 text-center">
                        <div className="text-red-500 mb-4 text-4xl md:text-6xl flex justify-center">
                            <FaExclamationCircle />
                        </div>
                        <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-2">Đã xảy ra lỗi</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            onClick={() => window.location.reload()}
                        >
                            Thử lại
                        </button>
                    </div>
                ) : filteredAndSortedBookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 md:p-8 text-center">
                        <div className="text-gray-500 mb-4 text-4xl md:text-6xl flex justify-center">
                            <FaSuitcaseRolling />
                        </div>
                        <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-2">Không tìm thấy đơn tour nào</h3>
                        <p className="text-gray-500 mb-4">
                            Bạn chưa đặt tour nào hoặc không có đơn tour nào khớp với tiêu chí tìm kiếm
                        </p>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            <Link to="/danh-sach-chuyen-du-lich">Khám phá tour mới</Link>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        {filteredAndSortedBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                onClick={() => setSelectedBooking(booking)}
                            >
                                {/* Mobile Design */}
                                <div className="md:hidden">
                                    <div className="relative">
                                        <img
                                            src={booking.tour.image}
                                            alt={booking.tour.name}
                                            className="w-full h-36 object-cover"
                                        />
                                        <div className="absolute top-0 left-0 m-2 bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded-md">
                                            {booking.tour.duration} ngày
                                        </div>
                                        <div
                                            className={`absolute top-0 right-0 m-2 px-2 py-1 text-xs rounded-md flex items-center gap-1 bg-white ${statusColors[booking.status]}`}
                                        >
                                            <FaCircle className="text-xs" />
                                            <span>{statusLabels[booking.status]}</span>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-base font-bold text-gray-800 line-clamp-1">{booking.tour.name}</h3>
                                                <p className="text-xs text-gray-600">Mã đơn: #{booking.id}</p>
                                            </div>
                                            <div className="relative">
                                                <button
                                                    className="p-1 text-gray-500"
                                                    onClick={(e) => toggleActionMenu(e, booking.id)}
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                {showActionMenu === booking.id && (
                                                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border">
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedBooking(booking);
                                                            }}
                                                        >
                                                            <FaEye size={14} /> Chi tiết
                                                        </button>
                                                        {booking.status === "confirmed" && (
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                                onClick={handleDownloadVoucher}
                                                            >
                                                                <FaFileDownload size={14} /> Voucher
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                                            <div className="flex items-center gap-1">
                                                <FaCalendarAlt className="text-blue-500" />
                                                <div>{formatDate(booking.booking_date)}</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FaUsers className="text-blue-500" />
                                                <div>{booking.number_of_people} người</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-xs border-t pt-2">
                                            <div className="flex items-center gap-1">
                                                <FaMoneyBillWave className="text-blue-500" />
                                                <span className="font-medium">{formatCurrency(booking.total_amount)}</span>
                                            </div>
                                            {booking.status === "pending" && (
                                                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                                    Cần thanh toán
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:flex">
                                    <div className="w-1/3 max-h-[250px] relative">
                                        <img
                                            src={booking.tour.image}
                                            alt={booking.tour.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-0 left-0 m-2 bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded-md">
                                            {booking.tour.duration} ngày
                                        </div>
                                        <div
                                            className={`absolute top-0 right-0 m-2 px-2 py-1 text-xs rounded-md flex items-center gap-1 bg-white ${statusColors[booking.status]}`}
                                        >
                                            <FaCircle className="text-xs" />
                                            <span>{statusLabels[booking.status]}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 w-2/3">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                    {booking.tour.name}
                                                </h3>
                                                <p className="text-gray-600 mb-4">Mã đơn: #{booking.id}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedBooking(booking);
                                                    }}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                                                >
                                                    <FaEye /> Chi tiết
                                                </button>
                                                {booking.status === "confirmed" && (
                                                    <button
                                                        onClick={handleDownloadVoucher}
                                                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors flex items-center gap-1"
                                                    >
                                                        <FaFileDownload /> Voucher
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Ngày khởi hành</p>
                                                    <p className="font-medium">{formatDate(booking.booking_date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaUsers className="text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Số người</p>
                                                    <p className="font-medium">{booking.number_of_people} người</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaMoneyBillWave className="text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Tổng tiền</p>
                                                    <p className="font-medium">{formatCurrency(booking.total_amount)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-center border-t pt-4 text-sm">
                                            <div className="text-gray-600">
                                                Đã đặt vào: {formatDate(booking.created_at)}
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                {booking.status === "pending" && (
                                                    <div className="flex gap-2">
                                                        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
                                                            Thanh toán: {formatCurrency(booking.paid_amount)}/
                                                            {formatCurrency(booking.total_amount)}
                                                        </div>
                                                    </div>
                                                )}
                                                {booking.status === "confirmed" && (
                                                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded">
                                                        Đã đặt cọc
                                                    </div>
                                                )}
                                                {booking.status === "canceled" && (
                                                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded">
                                                        Đã hủy
                                                    </div>
                                                )}
                                                {booking.status === "completed" && (
                                                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white z-10 p-3 md:p-4 border-b flex justify-between items-center">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Chi tiết đơn tour</h2>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="text-gray-500 hover:text-gray-700 p-1"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-3 md:p-6">
                                <div className="mb-4 md:mb-6">
                                    <img
                                        src={selectedBooking.tour.image || "https://via.placeholder.com/800x400?text=Tour+Image"}
                                        alt={selectedBooking.tour.name}
                                        className="w-full h-48 md:h-64 object-cover rounded-lg mb-3 md:mb-4"
                                    />
                                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">{selectedBooking.tour.name}</h3>
                                    <p className="text-gray-600 mb-2 text-sm">Mã đơn: #{selectedBooking.id}</p>
                                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusColors[selectedBooking.status]} bg-opacity-10`}>
                                        <FaCircle className="text-xs" />
                                        <span className="font-medium">{statusLabels[selectedBooking.status]}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-2 md:mb-3 text-sm md:text-base">Thông tin chuyến đi</h4>
                                        <div className="space-y-2 md:space-y-3">
                                            <div className="flex items-start gap-2 md:gap-3">
                                                <FaCalendarAlt className="text-blue-500 mt-1" />
                                                <div>
                                                    <p className="text-xs md:text-sm text-gray-500">Ngày khởi hành</p>
                                                    <p className="font-medium text-sm md:text-base">{formatDate(selectedBooking.booking_date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 md:gap-3">
                                                <FaUsers className="text-blue-500 mt-1" />
                                                <div>
                                                    <p className="text-xs md:text-sm text-gray-500">Số người</p>
                                                    <p className="font-medium text-sm md:text-base">
                                                        {selectedBooking.number_of_people} người
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 md:gap-3">
                                                <FaCalendarAlt className="text-blue-500 mt-1" />
                                                <div>
                                                    <p className="text-xs md:text-sm text-gray-500">Thời gian tour</p>
                                                    <p className="font-medium text-sm md:text-base">{selectedBooking.tour.duration} ngày</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-2 md:mb-3 text-sm md:text-base">Chi tiết thanh toán</h4>
                                        <div className="space-y-2 md:space-y-3">
                                            <div className="flex items-start gap-2 md:gap-3">
                                                <FaMoneyBillWave className="text-blue-500 mt-1" />
                                                <div>
                                                    <p className="text-xs md:text-sm text-gray-500">Giá tour</p>
                                                    <p className="font-medium text-sm md:text-base">
                                                        {formatCurrency(selectedBooking.tour.price)} x {selectedBooking.number_of_people}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 md:gap-3">
                                                <FaMoneyBillWave className="text-blue-500 mt-1" />
                                                <div>
                                                    <p className="text-xs md:text-sm text-gray-500">Tổng tiền</p>
                                                    <p className="font-medium text-sm md:text-base">{formatCurrency(selectedBooking.total_amount)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 md:gap-3">
                                                <FaMoneyBillWave className="text-blue-500 mt-1" />
                                                <div>
                                                    <p className="text-xs md:text-sm text-gray-500">Đã thanh toán</p>
                                                    <p className="font-medium text-sm md:text-base">{formatCurrency(selectedBooking.paid_amount)}</p>
                                                </div>
                                            </div>
                                            {selectedBooking.paid_amount < selectedBooking.total_amount && (
                                                <div className="flex items-start gap-2 md:gap-3">
                                                    <FaMoneyBillWave className="text-blue-500 mt-1" />
                                                    <div>
                                                        <p className="text-xs md:text-sm text-gray-500">Còn lại</p>
                                                        <p className="font-medium text-sm md:text-base">
                                                            {formatCurrency(selectedBooking.total_amount - selectedBooking.paid_amount)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {selectedBooking.special_request && (
                                    <div className="mb-4 md:mb-6">
                                        <h4 className="font-bold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">Yêu cầu đặc biệt</h4>
                                        <p className="text-gray-600 bg-gray-50 p-2 md:p-3 rounded-lg text-sm">{selectedBooking.special_request}</p>
                                    </div>
                                )}
                                <div className="sticky bottom-0 bg-white border-t pt-3 md:pt-6 pb-2 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs md:text-sm text-gray-500">
                                            Đã đặt vào: {formatDate(selectedBooking.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedBooking(null)}
                                            className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                        >
                                            Đóng
                                        </button>
                                        {selectedBooking.status === "confirmed" && (
                                            <button
                                                onClick={handleDownloadVoucher}
                                                className="bg-green-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-green-600 flex items-center gap-1 text-sm"
                                            >
                                                <FaFileDownload /> Tải voucher
                                            </button>
                                        )}
                                        {selectedBooking.status === "pending" && (
                                            <button className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-blue-600 text-sm">
                                                Thanh toán
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <ToastContainer position="top-right" autoClose={3000} />
            </main>
        </div>
    );
}