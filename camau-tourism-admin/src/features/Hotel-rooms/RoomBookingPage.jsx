import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { fetchAllPages } from '../../utils/fetchAllPages';
import { createItem, deleteItem, getList, getPage, updateItem } from "../../api/api_generics";
import { FaUserEdit, FaChevronLeft, FaChevronRight, FaTrash, FaEye, FaCalendarAlt, FaMoneyBillWave, FaBed, FaUser, FaPhone, FaCheckCircle, FaTimesCircle, FaHotel } from "react-icons/fa";
import Badge from "../../components/Badge";
import DataTableToolbar from '../../components/DataTableToolbar';
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingPage() {
  const [bookings, setBookings] = useState({count: 0, results: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBooking, setEditBooking] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [selectedBookings, setSelectedBookings] = useState([]);

  const [clients, setClients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(1);

  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const statusOptions = [
    { value: "confirmed", label: "Đã xác nhận", color: "green" },
    { value: "pending", label: "Chờ xác nhận", color: "yellow" },
    { value: "canceled", label: "Đã hủy", color: "red" },
  ];

  useEffect(() => {
    Promise.all([
      fetchAllPages(getList, 'clients'),
      fetchAllPages(getList, 'hotel-rooms'),
      fetchAllPages(getList, 'hotels')
    ]).then(([clientsData, roomsData, hotelsData]) => {
      setClients(clientsData);
      setRooms(roomsData);
      setHotels(hotelsData);
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
        params.append("check_in_after", startDate.toISOString().split('T')[0]);
        params.append("check_out_before", endDate.toISOString().split('T')[0]);
      }
      
      const data = await getPage('room-bookings', page, pageSize, params.toString());
      setBookings(data);
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (err) {
      toast.error("Có lỗi khi tải dữ liệu đặt phòng");
      setError("Có lỗi khi tải dữ liệu đặt phòng");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, [page, pageSize, filterStatus, startDate, endDate]);

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

  const calculateTotalAmount = (checkIn, checkOut, roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room || !checkIn || !checkOut) return 0;
    
    const price = parseFloat(room.price) || 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return price * Math.max(diffDays, 1);
  };

  const handleEditSubmit = async (booking) => {
    try {
      let payload = { ...booking };
      
      if (payload.room && payload.check_in && payload.check_out) {
        payload.total_amount = calculateTotalAmount(
          payload.check_in,
          payload.check_out,
          payload.room
        );
      }

      if (editBooking) {
        await updateItem('room-bookings', editBooking.id, payload);
        toast.success('Cập nhật thành công');
      } else {
        await createItem('room-bookings', payload);
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
    if (window.confirm(`Bạn chắc chắn muốn xóa đơn đặt phòng của "${getClientName(booking.client)}"?`)) {
      try {
        await deleteItem('room-bookings', booking.id);
        toast.success("Xóa thành công!");
        fetchBookings();
      } catch (err) {
        toast.error("Xóa thất bại!");
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBookings.length === 0) return;
    if (window.confirm(`Bạn chắc chắn muốn xóa ${selectedBookings.length} đơn đặt phòng?`)) {
      try {
        await Promise.all(selectedBookings.map((id) => deleteItem("room-bookings", id)));
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
      await updateItem('room-bookings', bookingId, { status: newStatus });
      toast.success(`Đã cập nhật trạng thái thành ${getStatusLabel(newStatus)}`);
      fetchBookings();
    } catch (err) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'N/A';
  };

  const getRoomInfo = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { number: 'N/A', hotel: 'N/A' };
    
    const hotel = hotels.find(h => h.id === room.hotel);
    return {
      number: room.room_number || 'N/A',
      type: room.room_type || 'N/A',
      hotel: hotel ? hotel.name : 'N/A'
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
      key: "room", 
      title: "Phòng", 
      inputType: "select", 
      options: rooms.map(room => {
        const hotel = hotels.find(h => h.id === room.hotel);
        return { 
          value: room.id, 
          label: `${hotel ? hotel.name : 'N/A'} - Phòng ${room.room_number} (${room.room_type})` 
        };
      }),
      editable: true,
      required: true
    },
    { 
      key: "check_in", 
      title: "Ngày nhận phòng", 
      inputType: "date", 
      editable: true,
      required: true 
    },
    { 
      key: "check_out", 
      title: "Ngày trả phòng", 
      inputType: "date", 
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
    },
    {
      key: "id",
      title: "Mã đặt phòng",
      render: (booking) => (
        <div className="font-semibold">
          #{booking.id}
        </div>
      ),
    },
    {
      key: "room",
      title: "Phòng",
      render: (booking) => {
        const { number, type, hotel } = getRoomInfo(booking.room);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="font-medium">{type}</span>
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <FaHotel className="text-gray-500" /> {hotel}
            </div>
          </div>
        );
      },
    },
    {
      key: "dates",
      title: "Ngày đặt phòng",
      render: (booking) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <FaCalendarAlt className="text-green-600" />
            <span>Nhận: {new Date(booking.check_in).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <FaCalendarAlt className="text-red-600" />
            <span>Trả: {new Date(booking.check_out).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="text-xs text-gray-600">
            {(() => {
              const checkIn = new Date(booking.check_in);
              const checkOut = new Date(booking.check_out);
              const diffTime = checkOut.getTime() - checkIn.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return `${diffDays} đêm`;
            })()}
          </div>
        </div>
      ),
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
            <div className="text-sm flex items-center gap-1">
              <Badge 
                color={paymentStatus === "paid" ? "green" : paymentStatus === "partial" ? "yellow" : "red"} 
                text={paymentStatus === "paid" ? "Đã thanh toán" : paymentStatus === "partial" ? "Thanh toán một phần" : "Chưa thanh toán"} 
              />
            </div>
            {paymentStatus !== "paid" && (
              <div className="text-xs text-gray-600">
                Còn lại: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(remainingAmount)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "contact",
      title: "Liên hệ",
      render: (booking) => (
        <div className="space-y-1 text-sm">
          <div>{booking.contact_name}</div>
          <div className="flex items-center gap-1">
            <FaPhone className="text-gray-600" />
            <a href={`tel:${booking.contact_phone}`} className="text-blue-600 hover:underline">
              {booking.contact_phone}
            </a>
          </div>
        </div>
      ),
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
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(booking.id, "confirmed");
                  }}
                  className="text-xs py-1 px-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  <FaCheckCircle className="inline mr-1" />
                  Xác nhận
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(booking.id, "canceled");
                  }}
                  className="text-xs py-1 px-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  <FaTimesCircle className="inline mr-1" />
                  Hủy
                </button>
              </div>
            )}
          </div>
        );
      },
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
      icon: () => <FaUserEdit />,
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
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg">
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
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${page === pageNumber ? 'bg-blue-600 text-white' : 'text-gray-900 hover:bg-gray-50'}`}
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


  return (
    <div className="p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý đặt phòng</h1>
        <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
          {bookings.count} đơn đặt phòng
        </div>
      </div>

      
      <DataTableToolbar
        onAdd={handleAdd}
        onDeleteSelected={handleDeleteSelected}
        selectedRows={selectedBookings}
      />
      
      {loading && 
        <div className="rounded-lg border bg-white">
          <SkeletonTable />
        </div>
      }
      
      {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">{error}</div>}

      {!loading && !error && bookings.results.length === 0 && (
        <div className="bg-white p-8 text-center rounded-lg border">
          <div className="flex justify-center mb-4">
            <FaBed className="text-gray-400 text-5xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy đơn đặt phòng nào</h3>
          <p className="text-gray-500 mb-4">Không có đơn đặt phòng nào khớp với bộ lọc của bạn.</p>
          <button 
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Tạo đơn đặt phòng mới
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
        />
      )}
      
      {bookings.count > 0 && <Pagination />}

      {editModalOpen && (
        <Modal 
          onClose={handleEditClose} 
          title={editBooking ? `Chỉnh sửa đơn đặt phòng #${editBooking.id}` : 'Thêm đơn đặt phòng mới'}
          size="lg"
        >
          <GenericForm
            columns={formColumns}
            initialValues={editBooking || {}}
            onSubmit={handleEditSubmit}
            onCancel={handleEditClose}
            submitText={editBooking ? 'Cập nhật' : 'Thêm mới'}
          />
        </Modal>
      )}

      {viewModalOpen && selectedBooking && (
        <Modal 
          onClose={handleCloseViewModal} 
          title={`Chi tiết đơn đặt phòng #${selectedBooking.id}`}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 border-r pr-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                    <FaUser className="text-blue-600 mr-2" />
                    Thông tin khách hàng
                  </h3>
                  <div className="pl-6 space-y-2">
                    <div>
                      <span className="font-medium">Khách hàng: </span>
                      {getClientName(selectedBooking.client)}
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
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                    <FaBed className="text-indigo-600 mr-2" />
                    Thông tin phòng
                  </h3>
                  <div className="pl-6 space-y-2">
                    {(() => {
                      const { number, type, hotel } = getRoomInfo(selectedBooking.room);
                      return (
                        <>
                          <div>
                            <span className="font-medium">Khách sạn: </span>
                            {hotel}
                          </div>
                          <div>
                            <span className="font-medium">Phòng số: </span>
                            {number}
                          </div>
                          <div>
                            <span className="font-medium">Loại phòng: </span>
                            {type}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                    <FaCalendarAlt className="text-green-600 mr-2" />
                    Thông tin đặt phòng
                  </h3>
                  <div className="pl-6 space-y-2">
                    <div>
                      <span className="font-medium">Ngày đặt: </span>
                      {new Date(selectedBooking.booking_date).toLocaleDateString("vi-VN")}
                    </div>
                    <div>
                      <span className="font-medium">Ngày nhận phòng: </span>
                      {new Date(selectedBooking.check_in).toLocaleDateString("vi-VN")}
                    </div>
                    <div>
                      <span className="font-medium">Ngày trả phòng: </span>
                      {new Date(selectedBooking.check_out).toLocaleDateString("vi-VN")}
                    </div>
                    <div>
                      <span className="font-medium">Số đêm: </span>
                      {(() => {
                        const checkIn = new Date(selectedBooking.check_in);
                        const checkOut = new Date(selectedBooking.check_out);
                        const diffTime = checkOut.getTime() - checkIn.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays;
                      })()}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái: </span>
                      <Badge 
                        color={getStatusColor(selectedBooking.status)} 
                        text={getStatusLabel(selectedBooking.status)} 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                    <FaMoneyBillWave className="text-green-600 mr-2" />
                    Thông tin thanh toán
                  </h3>
                  <div className="pl-6 space-y-2">
                    <div>
                      <span className="font-medium">Tổng tiền: </span>
                      <span className="text-lg font-semibold">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBooking.total_amount || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Đã thanh toán: </span>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBooking.paid_amount || 0)}
                    </div>
                    <div>
                      <span className="font-medium">Còn lại: </span>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((selectedBooking.total_amount || 0) - (selectedBooking.paid_amount || 0))}
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
                            text={paymentStatus === "paid" ? "Đã thanh toán" : paymentStatus === "partial" ? "Thanh toán một phần" : "Chưa thanh toán"} 
                          />
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Tạo lúc: {new Date(selectedBooking.created_at).toLocaleString("vi-VN")}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(selectedBooking)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <FaUserEdit className="mr-1" /> Chỉnh sửa
                  </button>
                  
                  {selectedBooking.status !== "canceled" && (
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, "canceled")}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaTimesCircle className="mr-1" /> Hủy đơn
                    </button>
                  )}
                  
                  {selectedBooking.status !== "completed" && selectedBooking.status !== "canceled" && (
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, "completed")}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FaCheckCircle className="mr-1" /> Hoàn thành
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