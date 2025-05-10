import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaSuitcaseRolling, FaExclamationCircle, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaEye, FaFileDownload, FaCircle } from "react-icons/fa";
import ProfileSidebar from "../../components/Users/ProfileSidebar";
import { toast, ToastContainer } from 'react-toastify';
import { getList } from "../../api/user_api";

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
    const [selectedTab, setSelectedTab] = useState("cac-chuyen-di");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortField, setSortField] = useState("booking_date");
    const [sortDirection, setSortDirection] = useState("asc");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [error, setError] = useState(null);

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

    const handleDownloadVoucher = () => {
        toast.success("Voucher sẽ được tải về (demo)!");
    };

    return (
        <div className="flex-1 p-2 bg-[#f5f7fb]">
            {selectedTab === "cac-chuyen-di" && (
                <main className="flex-1 p-6 bg-[#f5f7fb]">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Đơn tour của tôi</h1>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <div className="bg-white rounded-lg shadow p-8 text-center">
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
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="text-gray-500 mb-4 text-6xl flex justify-center">
                                <FaSuitcaseRolling />
                            </div>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy đơn tour nào</h3>
                            <p className="text-gray-500 mb-4">
                                Bạn chưa đặt tour nào hoặc không có đơn tour nào khớp với tiêu chí tìm kiếm
                            </p>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                Khám phá tour mới
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredAndSortedBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="md:flex">
                                        <div className="md:w-1/3 max-h-[250px]  relative">
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
                                        <div className="p-6 md:w-2/3">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                        {booking.tour.name}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4">Mã đơn: #{booking.id}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedBooking(booking)}
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
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn tour</h2>
                                        <button
                                            onClick={() => setSelectedBooking(null)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="mb-6">
                                        <img
                                            src={selectedBooking.tour.image || "https://via.placeholder.com/800x400?text=Tour+Image"}
                                            alt={selectedBooking.tour.name}
                                            className="w-full h-64 object-cover rounded-lg mb-4"
                                        />
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedBooking.tour.name}</h3>
                                        <p className="text-gray-600 mb-2">Mã đơn: #{selectedBooking.id}</p>
                                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusColors[selectedBooking.status]} bg-opacity-10`}>
                                            <FaCircle className="text-xs" />
                                            <span className="font-medium">{statusLabels[selectedBooking.status]}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h4 className="font-bold text-gray-700 mb-3">Thông tin chuyến đi</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <FaCalendarAlt className="text-blue-500 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Ngày khởi hành</p>
                                                        <p className="font-medium">{formatDate(selectedBooking.booking_date)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <FaUsers className="text-blue-500 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Số người</p>
                                                        <p className="font-medium">
                                                            {selectedBooking.number_of_people} người
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <FaCalendarAlt className="text-blue-500 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Thời gian tour</p>
                                                        <p className="font-medium">{selectedBooking.tour.duration} ngày</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-700 mb-3">Chi tiết thanh toán</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <FaMoneyBillWave className="text-blue-500 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Giá tour</p>
                                                        <p className="font-medium">
                                                            {formatCurrency(selectedBooking.tour.price)} x {selectedBooking.number_of_people}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <FaMoneyBillWave className="text-blue-500 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Tổng tiền</p>
                                                        <p className="font-medium">{formatCurrency(selectedBooking.total_amount)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <FaMoneyBillWave className="text-blue-500 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Đã thanh toán</p>
                                                        <p className="font-medium">{formatCurrency(selectedBooking.paid_amount)}</p>
                                                    </div>
                                                </div>
                                                {selectedBooking.paid_amount < selectedBooking.total_amount && (
                                                    <div className="flex items-start gap-3">
                                                        <FaMoneyBillWave className="text-blue-500 mt-1" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Còn lại</p>
                                                            <p className="font-medium">
                                                                {formatCurrency(selectedBooking.total_amount - selectedBooking.paid_amount)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedBooking.special_request && (
                                        <div className="mb-6">
                                            <h4 className="font-bold text-gray-700 mb-2">Yêu cầu đặc biệt</h4>
                                            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedBooking.special_request}</p>
                                        </div>
                                    )}
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
                                            {selectedBooking.status === "confirmed" && (
                                                <button
                                                    onClick={handleDownloadVoucher}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                                                >
                                                    <FaFileDownload /> Tải voucher
                                                </button>
                                            )}
                                            {selectedBooking.status === "pending" && (
                                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
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
            )}
        </div>
    );
}