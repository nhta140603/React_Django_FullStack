import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { fetchAllPages } from '../../utils/fetchAllPages';
import { createItem, deleteItem, getList, getPage, updateItem } from "../../api/api_generics";
import { FaUserEdit, FaChevronLeft, FaChevronRight, FaTrash, FaEye, FaCalendarAlt, 
  FaMoneyBillWave, FaUsers, FaUser, FaPhone, FaCheckCircle, FaTimesCircle, 
  FaRoute, FaClipboardList, FaPencilAlt, FaFileInvoiceDollar, FaPlus } from "react-icons/fa";
import Badge from "../../components/Badge";
import DataTableToolbar from '../../components/DataTableToolbar';
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TourBookingPage() {
  const [bookings, setBookings] = useState({count: 0, results: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBooking, setEditBooking] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [selectedBookings, setSelectedBookings] = useState([]);

  const [clients, setClients] = useState([]);
  const [tours, setTours] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(1);

  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [searchQuery, setSearchQuery] = useState("");

  const statusOptions = [
    { value: "pending", label: "Đang chờ xác nhận", color: "yellow" },
    { value: "confirmed", label: "Đã xác nhận", color: "green" },
    { value: "completed", label: "Hoàn thành", color: "blue" },
    { value: "canceled", label: "Đã hủy", color: "red" },
  ];

  useEffect(() => {
    Promise.all([
      fetchAllPages(getList, 'clients'),
      fetchAllPages(getList, 'tours')
    ]).then(([clientsData, toursData]) => {
      setClients(clientsData);
      setTours(toursData);
    });
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      setError(null);
      
      let params = new URLSearchParams();
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }
      
      if (startDate && endDate) {
        params.append("booking_date_after", startDate.toISOString().split('T')[0]);
        params.append("booking_date_before", endDate.toISOString().split('T')[0]);
      }
      
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      
      const data = await getPage('tour-bookings', page, pageSize, params.toString());
      setBookings(data);
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (err) {
      toast.error("Có lỗi khi tải dữ liệu đặt tour");
      setError("Có lỗi khi tải dữ liệu đặt tour");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, [page, pageSize, filterStatus, startDate, endDate, searchQuery]);

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setViewModalOpen(true);
  };

  const handleAdd = () => {
    setEditBooking(null);
    setEditModalOpen(true);
  };

  const handleEdit = (booking) => {
    setEditBooking(booking);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditBooking(null);
  };

  const handleCloseViewModal = () => {
    setSelectedBooking(null);
    setViewModalOpen(false);
  };

  const calculateTotalAmount = (tourId, numberOfPeople) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour || !numberOfPeople) return 0;
    
    const price = parseFloat(tour.price_per_person) || 0;
    return price * numberOfPeople;
  };

  const handleEditSubmit = async (booking) => {
    try {
      let payload = { ...booking };
      
      if (payload.tour && payload.number_of_people) {
        payload.total_amount = calculateTotalAmount(
          payload.tour,
          payload.number_of_people
        );
      }

      if (editBooking) {
        await updateItem('tour-bookings', editBooking.id, payload);
        toast.success('Cập nhật thành công');
      } else {
        await createItem('tour-bookings', payload);
        toast.success('Thêm thành công');
      }
      setEditModalOpen(false);
      setEditBooking(null);
      fetchBookings();
    } catch (err) {
      toast.error(editBooking ? "Cập nhật thất bại" : "Thêm mới thất bại");
    }
  };

  const handleDelete = async (booking) => {
    if (window.confirm(`Bạn chắc chắn muốn xóa đơn đặt tour của "${getClientName(booking.client)}"?`)) {
      try {
        await deleteItem('tour-bookings', booking.id);
        toast.success("Xóa thành công!");
        fetchBookings();
      } catch (err) {
        toast.error("Xóa thất bại!");
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBookings.length === 0) return;
    if (window.confirm(`Bạn chắc chắn muốn xóa ${selectedBookings.length} đơn đặt tour?`)) {
      try {
        await Promise.all(selectedBookings.map((id) => deleteItem("tour-bookings", id)));
        setSelectedBookings([]);
        await fetchBookings();
        toast.success("Xóa thành công");
      } catch (err) {
        toast.error("Xóa thất bại!");
      }
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateItem('tour-bookings', bookingId, { 
        status: newStatus,
        ...(newStatus === "canceled" ? { canceled_at: new Date().toISOString() } : {})
      });
      toast.success(`Đã cập nhật trạng thái thành ${getStatusLabel(newStatus)}`);
      fetchBookings();
      
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          status: newStatus,
          ...(newStatus === "canceled" ? { canceled_at: new Date().toISOString() } : {})
        });
      }
    } catch (err) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'N/A';
  };

  const getTourInfo = (tourId) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return { name: 'N/A', duration: 'N/A', price: 0 };
    
    return {
      name: tour.name || 'N/A',
      duration: tour.duration || 'N/A',
      price: parseFloat(tour.price_per_person) || 0
    };
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'gray';
  };

  const formColumns = [
    { 
      key: "client", 
      title: "Khách hàng", 
      inputType: "select", 
      options: clients.map(client => ({ value: client.id, label: client.name })),
      editable: true,
      required: true
    },
    { 
      key: "tour", 
      title: "Tour", 
      inputType: "select", 
      options: tours.map(tour => ({ 
        value: tour.id, 
        label: `${tour.name} (${tour.duration} ngày)` 
      })),
      editable: true,
      required: true
    },
    { 
      key: "booking_date", 
      title: "Ngày đặt tour", 
      inputType: "date", 
      editable: true,
      required: true 
    },
    { 
      key: "number_of_people", 
      title: "Số người tham gia", 
      inputType: "number", 
      editable: true,
      required: true 
    },
    { 
      key: "status", 
      title: "Trạng thái", 
      inputType: "select", 
      options: statusOptions.map(opt => ({ value: opt.value, label: opt.label })),
      editable: true,
      required: true 
    },
    { 
      key: "contact_name", 
      title: "Tên liên hệ", 
      inputType: "text", 
      editable: true,
      required: true 
    },
    { 
      key: "contact_phone", 
      title: "SĐT liên hệ", 
      inputType: "text", 
      editable: true,
      required: true 
    },
    { 
      key: "special_request", 
      title: "Yêu cầu đặc biệt", 
      inputType: "textarea", 
      editable: true 
    },
    { 
      key: "paid_amount", 
      title: "Số tiền đã thanh toán", 
      inputType: "number", 
      editable: true 
    }
  ];

  const columns = [
    {
      key: "checkbox",
      title: (
        <input
          type="checkbox"
          checked={selectedBookings.length === bookings.results.length && bookings.results.length > 0}
          onChange={e => {
            if (e.target.checked) {
              setSelectedBookings(bookings.results.map(b => b.id));
            } else {
              setSelectedBookings([]);
            }
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedBookings.includes(row.id)}
          onChange={e => {
            if (e.target.checked) {
              setSelectedBookings(prev => [...prev, row.id]);
            } else {
              setSelectedBookings(prev => prev.filter(id => id !== row.id));
            }
          }}
        />
      ),
      width: "40px"
    },
    {
      key: "id",
      title: "Mã đặt tour",
      render: (booking) => (
        <div className="font-semibold">
          #{booking.id}
        </div>
      ),
      width: "80px"
    },
    {
      key: "tour",
      title: "Tour",
      render: (booking) => {
        const { name, duration } = getTourInfo(booking.tour);
        return (
          <div className="space-y-1">
            <div className="font-medium text-blue-700 flex items-center gap-1">
              <FaRoute className="text-blue-600" /> {name}
            </div>
            <div className="text-xs text-gray-600">
              Thời gian: {duration} ngày
            </div>
          </div>
        );
      },
      width: "25%"
    },
    {
      key: "client",
      title: "Khách hàng",
      render: (booking) => (
        <div className="space-y-1">
          <div className="font-medium flex items-center gap-1">
            <FaUser className="text-gray-600" /> {getClientName(booking.client)}
          </div>
          <div className="text-xs text-gray-600 flex items-center gap-1">
            <FaUsers /> {booking.number_of_people} người
          </div>
        </div>
      ),
      width: "15%"
    },
    {
      key: "booking_date",
      title: "Ngày đặt",
      render: (booking) => (
        <div className="flex items-center gap-1 text-sm">
          <FaCalendarAlt className="text-green-600" />
          <span>{new Date(booking.booking_date).toLocaleDateString("vi-VN")}</span>
        </div>
      ),
      width: "110px"
    },
    {
      key: "payment",
      title: "Thanh toán",
      render: (booking) => {
        const totalAmount = parseFloat(booking.total_amount) || 0;
        const paidAmount = parseFloat(booking.paid_amount) || 0;
        const remainingAmount = totalAmount - paidAmount;
        const paymentStatus = paidAmount >= totalAmount ? "paid" : paidAmount > 0 ? "partial" : "unpaid";
        
        return (
          <div className="space-y-1">
            <div className="font-medium flex items-center gap-1">
              <FaMoneyBillWave className="text-green-600" />
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
            </div>
            <div className="text-xs flex items-center gap-1">
              <Badge 
                color={paymentStatus === "paid" ? "green" : paymentStatus === "partial" ? "yellow" : "red"} 
                text={paymentStatus === "paid" ? "Đã thanh toán" : paymentStatus === "partial" ? "Đã cọc" : "Chưa thanh toán"} 
              />
            </div>
            {paymentStatus !== "paid" && (
              <div className="text-xs text-gray-600">
                Còn: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(remainingAmount)}
              </div>
            )}
          </div>
        );
      },
      width: "150px"
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (booking) => {
        const color = getStatusColor(booking.status);
        return (
          <div className="flex flex-col items-start gap-2">
            <Badge 
              color={color} 
              text={getStatusLabel(booking.status)} 
            />
            {booking.status !== "completed" && booking.status !== "canceled" && (
              <div className="flex items-center gap-1 mt-1">
            {booking.status !== "confirmed" && (
                <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(booking.id, "confirmed");
                }}
                className="text-xs py-1 px-2 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center"
              >
                <FaCheckCircle className="mr-1" />
                Xác nhận
              </button>
            )}

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(booking.id, "canceled");
                  }}
                  className="text-xs py-1 px-2 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center"
                >
                  <FaTimesCircle className="mr-1" />
                  Hủy
                </button>
              </div>
            )}
          </div>
        );
      },
      width: "140px"
    },
  ];

  const actions = [
    {
      key: "view",
      title: "Xem chi tiết",
      onClick: handleView,
      icon: () => <FaEye />,
      className: "text-cyan-600 hover:text-cyan-900",
    },
    {
      key: "edit",
      title: "Chỉnh sửa",
      onClick: handleEdit,
      icon: () => <FaPencilAlt />,
      className: "text-yellow-600 hover:text-yellow-900",
    },
    {
      key: "delete",
      title: "Xóa",
      onClick: handleDelete,
      icon: () => <FaTrash />,
      className: "text-red-600 hover:text-red-900",
    },
  ];

  const SkeletonTable = () => (
    <table className="min-w-full">
      <tbody>
        {[...Array(8)].map((_, i) => (
          <tr key={i} className="animate-pulse">
            <td className="py-2 px-2"><div className="w-6 h-6 bg-gray-200 rounded mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-4 bg-gray-200 rounded w-16 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-4 bg-gray-200 rounded w-24 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-10 bg-gray-200 rounded w-32 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-10 bg-gray-200 rounded w-32 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-8 bg-gray-200 rounded w-24 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-8 bg-gray-200 rounded w-24 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-6 bg-gray-200 rounded w-24 mx-auto" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const Pagination = () => {
    const handlePageSizeChange = (e) => {
      const newSize = parseInt(e.target.value, 10);
      setPageSize(newSize);
      setPage(1);
    };

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Trước
          </button>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Sau
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, bookings.count)}</span> trong tổng số <span className="font-medium">{bookings.count}</span>
            </p>
          </div>
          <div className="flex items-center">
            <label htmlFor="pageSize" className="mr-2 text-sm text-gray-700">Hiển thị:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded border-gray-300 text-sm mr-6"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Phân trang">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${page === 1 ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                <span className="sr-only">Trang đầu</span>
                <span className="text-xs">«</span>
              </button>
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${page === 1 ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                <span className="sr-only">Trang trước</span>
                <FaChevronLeft className="h-3 w-3" aria-hidden="true" />
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (page <= 3) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = page - 2 + i;
                }
                
                if (pageNumber <= totalPages) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${page === pageNumber ? 'bg-indigo-600 text-white' : 'text-gray-900 hover:bg-gray-50'}`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${page === totalPages ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                <span className="sr-only">Trang sau</span>
                <FaChevronRight className="h-3 w-3" aria-hidden="true" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${page === totalPages ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                <span className="sr-only">Trang cuối</span>
                <span className="text-xs">»</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const FilterSection = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            {/* Search */}
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Mã đặt, khách hàng..."
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 pl-3 pr-10 sm:text-sm border-gray-300 rounded-md"
              >
                <option value="all">Tất cả trạng thái</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Date Range Picker */}
            <div className="col-span-1 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng ngày đặt tour</label>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                isClearable={true}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn khoảng thời gian"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {/* Clear Filters */}
          <div className="md:mt-6">
            <button
              onClick={() => {
                setFilterStatus("all");
                setDateRange([null, null]);
                setSearchQuery("");
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    );
  };

  const StatisticsSection = () => {
    if (loading || bookings.count === 0) return null;
    
    // Calculate statistics
    const pendingCount = bookings.results.filter(b => b.status === 'pending').length;
    const confirmedCount = bookings.results.filter(b => b.status === 'confirmed').length;
    const completedCount = bookings.results.filter(b => b.status === 'completed').length;
    const canceledCount = bookings.results.filter(b => b.status === 'canceled').length;
    
    const totalRevenue = bookings.results.reduce((sum, booking) => sum + parseFloat(booking.total_amount || 0), 0);
    const paidRevenue = bookings.results.reduce((sum, booking) => sum + parseFloat(booking.paid_amount || 0), 0);
    
    const stats = [
      { label: "Đang chờ xác nhận", value: pendingCount, color: "bg-yellow-100 text-yellow-800" },
      { label: "Đã xác nhận", value: confirmedCount, color: "bg-green-100 text-green-800" },
      { label: "Hoàn thành", value: completedCount, color: "bg-blue-100 text-blue-800" },
      { label: "Đã hủy", value: canceledCount, color: "bg-red-100 text-red-800" },
    //   { label: "Tổng doanh thu", value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue), color: "bg-purple-100 text-purple-800" },
      { label: "Đã thanh toán", value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(paidRevenue), color: "bg-indigo-100 text-indigo-800" }
    ];
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className={`mt-1 text-xl font-semibold ${stat.color.split(' ')[1]}`}>{stat.value}</div>
            <div className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${stat.color}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý đặt tour</h1>
          <p className="text-sm text-gray-600">Quản lý tất cả các đơn đặt tour của khách hàng</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaPlus className="mr-2" /> Tạo đơn đặt tour
          </button>
        </div>
      </div>

      <StatisticsSection />
      
      <FilterSection />
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <FaClipboardList className="text-indigo-500 mr-2" />
              Danh sách đơn đặt tour
              {selectedBookings.length > 0 && (
                <span className="ml-2 text-sm text-gray-500">
                  Đã chọn {selectedBookings.length} đơn
                </span>
              )}
            </h3>
            
            {selectedBookings.length > 0 && (
              <div className="mt-3 sm:mt-0 flex space-x-2">
                <button
                  onClick={handleDeleteSelected}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaTrash className="mr-1" /> Xóa {selectedBookings.length} đơn
                </button>
              </div>
            )}
          </div>
        </div>

        {loading && 
          <div className="bg-white">
            <SkeletonTable />
          </div>
        }
        
        {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200 m-4">{error}</div>}

        {!loading && !error && bookings.results.length === 0 && (
          <div className="bg-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <FaRoute className="text-gray-400 text-5xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy đơn đặt tour nào</h3>
            <p className="text-gray-500 mb-4">Không có đơn đặt tour nào phù hợp với bộ lọc của bạn.</p>
            <button 
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="mr-2" /> Tạo đơn đặt tour mới
            </button>
          </div>
        )}

        {!loading && !error && bookings.results.length > 0 && (
          <DataTable 
            columns={columns} 
            data={bookings.results} 
            actions={actions} 
            customRowClass={(row) => {
              if (row.status === "canceled") return "bg-red-50";
              if (row.status === "completed") return "bg-green-50";
              return "";
            }}
            onRowClick={handleView}
          />
        )}
      </div>
      
      {bookings.count > 0 && <Pagination />}

      {editModalOpen && (
        <Modal 
          onClose={handleEditClose} 
          title={editBooking ? `Chỉnh sửa đơn đặt tour #${editBooking.id}` : 'Thêm đơn đặt tour mới'}
          size="lg"
        >
          <GenericForm
            columns={formColumns}
            initialValues={editBooking || {
              booking_date: new Date().toISOString().split('T')[0], 
              status: 'pending',
              number_of_people: 1
            }}
            onSubmit={handleEditSubmit}
            onCancel={handleEditClose}
            submitText={editBooking ? 'Cập nhật' : 'Thêm mới'}
          />
        </Modal>
      )}

      {viewModalOpen && selectedBooking && (
        <Modal 
          onClose={handleCloseViewModal} 
          title={`Chi tiết đơn đặt tour #${selectedBooking.id}`}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5 border-r pr-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center border-b pb-2">
                    <FaRoute className="text-blue-600 mr-2" />
                    Thông tin Tour
                  </h3>
                  <div className="pl-2 space-y-3">
                    {(() => {
                      const { name, duration } = getTourInfo(selectedBooking.tour);
                      const tour = tours.find(t => t.id === selectedBooking.tour);
                      return (
                        <>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-lg font-medium text-blue-800">{name}</div>
                            <div className="text-sm text-gray-600">Thời gian: {duration} ngày</div>
                            {tour && tour.description && (
                              <div className="mt-2 text-sm text-gray-600 line-clamp-3">
                                {tour.description}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <span className="font-medium">Số người tham gia: </span>
                            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-sm font-medium text-indigo-800">
                              {selectedBooking.number_of_people} người
                            </span>
                          </div>
                          
                          <div>
                            <span className="font-medium">Ngày đặt: </span>
                            {new Date(selectedBooking.booking_date).toLocaleDateString("vi-VN")}
                          </div>
                          
                          <div>
                            <span className="font-medium">Trạng thái: </span>
                            <Badge 
                              color={getStatusColor(selectedBooking.status)} 
                              text={getStatusLabel(selectedBooking.status)} 
                            />
                          </div>
                          
                          {selectedBooking.canceled_at && (
                            <div>
                              <span className="font-medium text-red-600">Đã hủy lúc: </span>
                              {new Date(selectedBooking.canceled_at).toLocaleString("vi-VN")}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center border-b pb-2">
                    <FaUser className="text-green-600 mr-2" />
                    Thông tin khách hàng
                  </h3>
                  <div className="pl-2 space-y-3">
                    <div>
                      <span className="font-medium">Khách hàng: </span>
                      <span className="text-indigo-700">{getClientName(selectedBooking.client)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Người liên hệ: </span>
                      {selectedBooking.contact_name}
                    </div>
                    <div>
                      <span className="font-medium">SĐT liên hệ: </span>
                      <a href={`tel:${selectedBooking.contact_phone}`} className="text-blue-600 hover:underline">
                        {selectedBooking.contact_phone}
                      </a>
                    </div>
                    {selectedBooking.special_request && (
                      <div>
                        <span className="font-medium">Yêu cầu đặc biệt: </span>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm">
                          {selectedBooking.special_request}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center border-b pb-2">
                    <FaFileInvoiceDollar className="text-green-600 mr-2" />
                    Thông tin thanh toán
                  </h3>
                  <div className="pl-2 space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Tổng tiền</div>
                      <div className="text-2xl font-bold text-green-700">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBooking.total_amount || 0)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Đã thanh toán: </span>
                      <span className="font-semibold text-lg text-green-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBooking.paid_amount || 0)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Còn lại: </span>
                      <span className="font-semibold text-lg text-red-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                          .format((parseFloat(selectedBooking.total_amount) || 0) - (parseFloat(selectedBooking.paid_amount) || 0))}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Trạng thái thanh toán: </span>
                      {(() => {
                        const totalAmount = parseFloat(selectedBooking.total_amount) || 0;
                        const paidAmount = parseFloat(selectedBooking.paid_amount) || 0;
                        const paymentStatus = paidAmount >= totalAmount ? "paid" : paidAmount > 0 ? "partial" : "unpaid";
                        
                        return (
                          <Badge 
                            color={paymentStatus === "paid" ? "green" : paymentStatus === "partial" ? "yellow" : "red"} 
                            text={paymentStatus === "paid" ? "Đã thanh toán" : paymentStatus === "partial" ? "Đã cọc" : "Chưa thanh toán"} 
                          />
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Timeline section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center border-b pb-2">
                    <FaCalendarAlt className="text-indigo-600 mr-2" />
                    Lịch sử đơn hàng
                  </h3>
                  <div className="pl-2">
                    <div className="flow-root">
                      <ul className="-mb-8">
                        <li>
                          <div className="relative pb-8">
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                  <FaPlus className="text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">Đơn đặt tour được tạo</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {new Date(selectedBooking.created_at).toLocaleString("vi-VN")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        
                        {selectedBooking.status !== "pending" && (
                          <li>
                            <div className="relative pb-8">
                              {selectedBooking.status !== "canceled" && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className={`h-8 w-8 rounded-full ${selectedBooking.status === "confirmed" || selectedBooking.status === "completed" ? "bg-blue-500" : "bg-red-500"} flex items-center justify-center ring-8 ring-white`}>
                                    {selectedBooking.status === "confirmed" || selectedBooking.status === "completed" ? <FaCheckCircle className="text-white" /> : <FaTimesCircle className="text-white" />}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      {selectedBooking.status === "confirmed" && "Đơn đặt tour đã được xác nhận"}
                                      {selectedBooking.status === "completed" && "Đơn đặt tour đã được xác nhận"}
                                      {selectedBooking.status === "canceled" && "Đơn đặt tour đã bị hủy"}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    {selectedBooking.status === "canceled" && selectedBooking.canceled_at ? 
                                      new Date(selectedBooking.canceled_at).toLocaleString("vi-VN") : 
                                      new Date(selectedBooking.updated_at).toLocaleString("vi-VN")}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        )}
                        
                        {selectedBooking.status === "completed" && (
                          <li>
                            <div className="relative">
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                    <FaCheckCircle className="text-white" />
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Tour đã hoàn thành</p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    {new Date(selectedBooking.updated_at).toLocaleString("vi-VN")}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Tạo lúc: {new Date(selectedBooking.created_at).toLocaleString("vi-VN")}
                  {selectedBooking.updated_at !== selectedBooking.created_at && (
                    <span className="ml-2">• Cập nhật lúc: {new Date(selectedBooking.updated_at).toLocaleString("vi-VN")}</span>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(selectedBooking)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <FaPencilAlt className="mr-2" /> Chỉnh sửa
                  </button>
                  
                  {selectedBooking.status !== "canceled" && (
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, "canceled")}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaTimesCircle className="mr-2" /> Hủy đơn
                    </button>
                  )}
                  
                  {selectedBooking.status === "pending" && (
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, "confirmed")}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaCheckCircle className="mr-2" /> Xác nhận
                    </button>
                  )}
                  
                  {(selectedBooking.status === "confirmed" || selectedBooking.status === "pending") && (
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, "completed")}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FaCheckCircle className="mr-2" /> Hoàn thành
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}