import React, { useState, useEffect } from "react";
import {
    FaCalendarAlt, FaBed, FaMoneyBillWave, FaSuitcase, FaExclamationCircle, FaSearch,
    FaFilter, FaSortAmountDown, FaSortAmountUp, FaEye, FaFileDownload, FaCircle,
    FaHotel, FaCreditCard, FaCheckCircle, FaPhoneAlt, FaUser
} from "react-icons/fa";
import ProfileSidebar from "../../components/Users/ProfileSidebar";
import { toast, ToastContainer } from 'react-toastify';
import { getList, cancelRoomBooking } from "../../api/user_api";

const statusColors = {
    confirmed: "text-green-500",
    pending: "text-yellow-500",
    canceled: "text-red-500",
    completed: "text-blue-500",
    active: "text-teal-500"
};

const statusLabels = {
    confirmed: "Đã xác nhận",
    pending: "Đang chờ",
    canceled: "Đã hủy",
    completed: "Đã hoàn thành",
    active: "Đang diễn ra"
};

export default function BookingsPage() {
    const [selectedTab, setSelectedTab] = useState("dat-phong");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortField, setSortField] = useState("check_in");
    const [sortDirection, setSortDirection] = useState("asc");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [error, setError] = useState(null);
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
        <div className="flex-1 p-2 bg-[#f5f7fb]">
            {selectedTab === "dat-phong" && (
                <main className="flex-1 p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Đặt phòng của tôi</h1>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên khách sạn, phòng..."
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                            </div>
                            <div className="relative">
                                <select
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 mb-1 text-sm">Tổng số đặt phòng</p>
                                    <p className="text-2xl font-bold">{bookings.length}</p>
                                </div>
                                <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
                                    <FaSuitcase className="text-2xl" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 mb-1 text-sm">Đã xác nhận</p>
                                    <p className="text-2xl font-bold">
                                        {bookings.filter(b => b.status === "confirmed").length}
                                    </p>
                                </div>
                                <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
                                    <FaCheckCircle className="text-2xl" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-teal-100 mb-1 text-sm">Đang diễn ra</p>
                                    <p className="text-2xl font-bold">
                                        {bookings.filter(b => b.status === "active").length}
                                    </p>
                                </div>
                                <div className="bg-teal-400 bg-opacity-30 p-3 rounded-full">
                                    <FaHotel className="text-2xl" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 mb-1 text-sm">Sắp tới</p>
                                    <p className="text-2xl font-bold">
                                        {bookings.filter(b => new Date(b.check_in) > new Date() && b.status !== "canceled").length}
                                    </p>
                                </div>
                                <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
                                    <FaCalendarAlt className="text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-xl shadow p-8 text-center">
                            <div className="text-red-500 mb-4 text-6xl flex justify-center">
                                <FaExclamationCircle />
                            </div>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Đã xảy ra lỗi</h3>
                            <p className="text-gray-500 mb-4">{error}</p>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                onClick={() => window.location.reload()}
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : filteredAndSortedBookings.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-8 text-center">
                            <div className="text-gray-500 mb-4 text-6xl flex justify-center">
                                <FaBed />
                            </div>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy đặt phòng nào</h3>
                            <p className="text-gray-500 mb-4">
                                Bạn chưa đặt phòng nào hoặc không có đặt phòng nào khớp với tiêu chí tìm kiếm
                            </p>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                Tìm khách sạn mới
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredAndSortedBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="md:flex">
                                        <div className="md:w-1/3 max-h-[250px] relative">
                                            <img
                                                src={booking.room.image_url}
                                                alt={booking.room.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-0 left-0 m-2 bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded-md">
                                                {calculateNights(booking.check_in, booking.check_out)} đêm
                                            </div>
                                            <div
                                                className={`absolute top-0 right-0 m-2 px-2 py-1 text-xs rounded-md flex items-center gap-1 bg-white ${statusColors[booking.status]}`}
                                            >
                                                <FaCircle className="text-xs" />
                                                <span>{statusLabels[booking.status]}</span>
                                            </div>
                                        </div>
                                        <div className="p-6 md:w-2/3">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                        {booking.name || "Khách sạn"}
                                                    </h3>
                                                    <p className="text-gray-600 mb-1">Phòng: {booking.room.name}</p>
                                                    <p className="text-gray-500 mb-3 text-sm">Mã đặt phòng: #{booking.id}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                                                    >
                                                        <FaEye /> Chi tiết
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-blue-500" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Nhận phòng</p>
                                                        <p className="font-medium">{formatDate(booking.check_in)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-blue-500" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Trả phòng</p>
                                                        <p className="font-medium">{formatDate(booking.check_out)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaUser className="text-blue-500" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Người liên hệ</p>
                                                        <p className="font-medium">{booking.contact_name}</p>
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
                                                            <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded flex items-center gap-1">
                                                                <FaCreditCard />
                                                                Thanh toán: {formatCurrency(booking.paid_amount)}/
                                                                {formatCurrency(booking.total_amount)}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {booking.status === "confirmed" && (
                                                        <div className="bg-green-50 text-green-700 px-3 py-1 rounded flex items-center gap-1">
                                                            <FaCheckCircle />
                                                            Đã thanh toán đầy đủ
                                                        </div>
                                                    )}
                                                    {booking.status === "canceled" && (
                                                        <div className="bg-red-50 text-red-700 px-3 py-1 rounded flex items-center gap-1">
                                                            <FaExclamationCircle />
                                                            Đã hủy {booking.canceled_at && `(${formatDate(booking.canceled_at)})`}
                                                        </div>
                                                    )}
                                                    {booking.status === "active" && (
                                                        <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded flex items-center gap-1">
                                                            <FaHotel />
                                                            Đang lưu trú
                                                        </div>
                                                    )}
                                                    {booking.status === "completed" && (
                                                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded flex items-center gap-1">
                                                            <FaCheckCircle />
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
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800">Chi tiết đặt phòng</h2>
                                        <button
                                            onClick={() => setSelectedBooking(null)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="mb-6">
                                        <img
                                            src={selectedBooking.room.image_url}
                                            alt={selectedBooking.room.name}
                                            className="w-full h-64 object-cover rounded-xl mb-4"
                                        />
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-1">{selectedBooking.room.hotel?.name}</h3>
                                                <p className="text-gray-600 mb-2">Phòng: {selectedBooking.room.name}</p>
                                                <p className="text-gray-500 mb-2 text-sm">Mã đặt phòng: #{selectedBooking.id}</p>
                                            </div>
                                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusColors[selectedBooking.status]} bg-opacity-10`}>
                                                <FaCircle className="text-xs" />
                                                <span className="font-medium">{statusLabels[selectedBooking.status]}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                <FaCalendarAlt className="text-blue-500" />
                                                Thông tin đặt phòng
                                            </h4>
                                            <div className="space-y-4 bg-blue-50 p-4 rounded-xl">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center mt-0.5">
                                                        <span className="text-xs font-bold text-blue-700">1</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Nhận phòng</p>
                                                        <p className="font-medium">{formatDate(selectedBooking.check_in)}</p>
                                                        <p className="text-xs text-gray-500">Sau 14:00</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center mt-0.5">
                                                        <span className="text-xs font-bold text-blue-700">2</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Trả phòng</p>
                                                        <p className="font-medium">{formatDate(selectedBooking.check_out)}</p>
                                                        <p className="text-xs text-gray-500">Trước 12:00</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center mt-0.5">
                                                        <span className="text-xs font-bold text-blue-700">3</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Thời gian lưu trú</p>
                                                        <p className="font-medium">{calculateNights(selectedBooking.check_in, selectedBooking.check_out)} đêm</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <h4 className="font-bold text-gray-700 mb-3 mt-6 flex items-center gap-2">
                                                <FaUser className="text-blue-500" />
                                                Thông tin liên hệ
                                            </h4>
                                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <FaUser className="text-gray-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Người liên hệ</p>
                                                        <p className="font-medium">{selectedBooking.contact_name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaPhoneAlt className="text-gray-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Số điện thoại</p>
                                                        <p className="font-medium">{selectedBooking.contact_phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                <FaMoneyBillWave className="text-green-500" />
                                                Chi tiết thanh toán
                                            </h4>
                                            <div className="space-y-4 bg-green-50 p-4 rounded-xl">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Giá phòng mỗi đêm</p>
                                                        <p className="text-xs text-gray-500">{selectedBooking.room.hotel?.name} - {selectedBooking.room.name}</p>
                                                    </div>
                                                    <p className="font-medium">{formatCurrency(selectedBooking.room.price || selectedBooking.total_amount / calculateNights(selectedBooking.check_in, selectedBooking.check_out))}</p>
                                                </div>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Số đêm</p>
                                                    </div>
                                                    <p className="font-medium">x {calculateNights(selectedBooking.check_in, selectedBooking.check_out)}</p>
                                                </div>
                                                <div className="border-t border-green-200 pt-3 flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-700">Tổng tiền</p>
                                                    </div>
                                                    <p className="font-bold">{formatCurrency(selectedBooking.total_amount)}</p>
                                                </div>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Đã thanh toán</p>
                                                    </div>
                                                    <p className="font-medium text-green-600">{formatCurrency(selectedBooking.paid_amount)}</p>
                                                </div>
                                                {selectedBooking.paid_amount < selectedBooking.total_amount && (
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Còn lại</p>
                                                        </div>
                                                        <p className="font-medium text-red-600">{formatCurrency(selectedBooking.total_amount - selectedBooking.paid_amount)}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <h4 className="font-bold text-gray-700 mb-3 mt-6 flex items-center gap-2">
                                                <FaHotel className="text-blue-500" />
                                                Thông tin địa điểm
                                            </h4>
                                            <div className="bg-gray-50 p-4 rounded-xl">
                                                <p className="font-medium mb-2">{selectedBooking.room.hotel?.name}</p>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {selectedBooking.location}
                                                </p>
                                                <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                                                    <iframe
                                                        title={`Bản đồ ${selectedBooking.name}`}
                                                        src={mapSrc}
                                                        width="100%"
                                                        height="400"
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        className="w-full"
                                                        style={{ border: "none" }}
                                                    ></iframe>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6 flex justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Đã đặt vào: {formatDate(selectedBooking.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setSelectedBooking(null)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                            >
                                                Đóng
                                            </button>
                                            {selectedBooking.status === "pending" && (
                                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                                                    <FaCreditCard /> Thanh toán
                                                </button>
                                            )}
                                            {(selectedBooking.status === "confirmed" || selectedBooking.status === "pending") &&
                                                new Date(selectedBooking.check_in) < new Date() && (
                                                    <button
                                                        onClick={handleCancelBooking}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                                                        Hủy đặt phòng
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <ToastContainer position="top-right" autoClose={3000} />
                </main>
            )}
        </div>
    );
}