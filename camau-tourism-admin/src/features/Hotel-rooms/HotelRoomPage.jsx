import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import { createItem, deleteItem, getList, updateItem, getPage } from "../../api/api_generics";
import { FaEye, FaUserEdit, FaChevronLeft, FaChevronRight, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import DataTableToolbar from "../../components/DataTableToolbar";
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CurrencyInput from 'react-currency-input-field';
import AmenitiesSelector from "../../components/AmenitiesSelector";
import { fetchAllPages } from '../../utils/fetchAllPages';

export default function HotelRoomPage() {
  const [hotelroom, setHotels] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedHotelRoom, setSelectedHotelRoom] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedHotelRoomEdit, setSelectedHotelRoomEdit] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [hotelsOption, setHotelsOption] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(1);

  const [amenitiesList, setAmenitiesList] = useState([]);

  useEffect(() => {
    fetchAllPages(getList, 'hotel-amenities').then(setAmenitiesList);
  }, []);

  async function fetchHotelRoom() {
    try {
      setLoading(true);
      setError(null);
      const data = await getPage('hotel-rooms', page, pageSize);
      setTotalPages(Math.ceil(data.count / pageSize));
      setHotels(data);
    }
    catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      toast.error("Không thể tải dữ liệu phòng khách sạn");
    } finally {
      setLoading(false);
    }
  }

  function getFormValue(values, key) {
    if (typeof values.get === "function") {
      return values.get(key);
    }
    return values[key];
  }

  async function fetchHotelList() {
    try {
      const data = await getList('hotels');
      setHotelsOption(
        data.results.map(hotel => ({
          label: hotel.name,
          value: hotel.id
        }))
      );
    } catch (err) {
      toast.error("Không thể lấy danh sách khách sạn");
    }
  }

  useEffect(() => {
    fetchHotelRoom();
    fetchHotelList();
  }, [page, pageSize]);

  const handleView = (hotelroom) => {
    setSelectedHotelRoom(hotelroom);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedHotelRoom(null);
  };
  const handleEdit = (hotelroom) => {
    setEditModalOpen(true);
    setSelectedHotelRoomEdit(hotelroom);
  };

  const handleAdd = () => {
    setEditModalOpen(true);
    setSelectedHotelRoomEdit(null);
  };

  function validate(values) {
    const hotel = getFormValue(values, "hotel");
    if (!hotel) {
      toast.warn("Vui lòng chọn khách sạn!");
      return false;
    }
    const room_type = getFormValue(values, "room_type");
    if (!room_type || room_type.trim() === "") {
      toast.warn("Vui lòng nhập loại phòng!");
      return false;
    }
    const price = getFormValue(values, "price");
    if (
      price == null ||
      price === "" ||
      isNaN(Number(price)) ||
      Number(price) <= 0
    ) {
      toast.warn("Vui lòng nhập giá hợp lệ!");
      return false;
    }
    const capacity = getFormValue(values, "capacity");
    if (
      capacity == null ||
      capacity === "" ||
      isNaN(Number(capacity)) ||
      Number(capacity) <= 0
    ) {
      toast.warn("Vui lòng nhập sức chứa hợp lệ!");
      return false;
    }
    return true;
  }

  // -- Xử lý tiện ích phòng khi submit --
  const handleEditSubmit = async (values) => {
    if (!validate(values)) return;
    let isEdit = !!selectedHotelRoomEdit;

    // CHỈNH SỬA: amenities sang array id
    if (values.amenities && Array.isArray(values.amenities)) {
      values.amenities = values.amenities.map(Number);
    }
    if (values instanceof FormData) {
      if (values.get && values.get('amenities')) {
        const amenities = values.getAll('amenities').map(Number);
        values.delete('amenities');
        amenities.forEach(id => values.append('amenities', id));
      }
    }

    try {
      let payload = values;
      if (values instanceof FormData) {
        if (isEdit) {
          await updateItem('hotel-rooms', selectedHotelRoomEdit.id, payload, true);
          toast.success("Cập nhật phòng thành công!");
        } else {
          await createItem('hotel-rooms', payload, true);
          toast.success("Thêm phòng thành công!");
        }
      } else {
        if (isEdit) {
          await updateItem('hotel-rooms', selectedHotelRoomEdit.id, payload);
          toast.success("Cập nhật phòng thành công!");
        } else {
          await createItem('hotel-rooms', payload);
          toast.success("Thêm phòng thành công!");
        }
      }
      await fetchHotelRoom();
      handleEditModalClose();
    } catch (err) {
      toast.error(isEdit ? "Cập nhật thất bại!" : "Thêm phòng thất bại!");
    }
  };

  const handleDelete = async (hotelroom) => {
    if (window.confirm("Bạn có chắc muốn xóa phòng này?")) {
      try {
        await deleteItem('hotel-rooms', hotelroom.id);
        toast.success("Xóa phòng thành công!");
        await fetchHotelRoom();
      } catch (err) {
        toast.error("Không thể xóa phòng!");
      }
    }
  };

  const handleToggleStatus = async (hotelroom) => {
    try {
      const newStatus = !hotelroom.is_available;
      let payload = { ...hotelroom };
      if (typeof payload.image_url === "string" && payload.image_url.startsWith("http")) {
        delete payload.image_url;
      }
      await updateItem("hotel-rooms", payload.id, {
        ...payload,
        is_available: newStatus,
        status_reason: null,
        status_note: null
      });
      toast.success(
        newStatus
          ? `Phòng "${payload.id}" đã được mở lại thành công!`
          : `Phòng "${payload.id}" đã được tạm ngưng!`
      );
      fetchHotelRoom();
    } catch (err) {
      toast.error("Có lỗi khi cập nhật trạng thái phòng.");
    }
  };

  async function handleDeleteSelected() {
    if (selectedRows.length === 0) return;
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedRows.length} phòng?`)) {
      try {
        await Promise.all(selectedRows.map(id => deleteItem('hotel-rooms', id)));
        toast.success("Xóa các phòng đã chọn thành công!");
        await fetchHotelRoom();
        setSelectedRows([]);
      } catch {
        toast.error("Không thể xóa các phòng đã chọn!");
      }
    }
  }

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedHotelRoomEdit(null);
  };

  // ---- FORM COLUMNS ----
  const formColumns = [
    {
      key: "hotel",
      title: "Khách sạn",
      inputType: "select",
      editable: true,
      options: hotelsOption,
    },
    {
      key: "room_type",
      title: "Loại phòng",
      inputType: "text",
      editable: true,
    },
    {
      key: "price",
      title: "Giá",
      renderFormItem: (value, onChange) => (
        <CurrencyInput
          value={value ?? ""}
          decimalsLimit={0}
          groupSeparator=","
          intlConfig={{ locale: "vi-VN", currency: "VND" }}
          className="border px-2 py-1 rounded w-full"
          onValueChange={(val) => onChange(val ? parseInt(val.replace(/,/g, ""), 10) : "")}
          placeholder="Nhập giá"
        />
      ),
      render: (room) =>
        room.price != null && !isNaN(Number(room.price)) ? (
          <span className="text-green-700 font-medium">
            {Number(room.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </span>
        ) : (
          "--"
        ),
    },
    {
      key: "capacity",
      title: "Sức chứa",
      inputType: "number",
      editable: true,
    },
    // -- MỚI: Trường amenities cho phòng --
    {
      key: "amenities",
      title: "Tiện ích phòng",
      inputType: "custom",
      renderInput: ({ value, onChange }) => (
        <AmenitiesSelector
          amenities={amenitiesList}
          value={value || []}
          onChange={onChange}
        />
      ),
      editable: true,
    },
    {
      key: "image_url",
      title: "Hình ảnh chính",
      inputType: "file",
      editable: true,
    },
    {
      key: "image_gallery",
      title: "Thư viện hình ảnh",
      inputType: "file",
      editable: true,
    },
  ];

  // ---- TABLE COLUMNS ----
  const columns = [
    {
      key: "checkbox",
      title: (
        <input
          type="checkbox"
          checked={selectedRows.length === hotelroom.length && hotelroom.length > 0}
          onChange={e => {
            if (e.target.checked) {
              setSelectedRows(hotelroom.map(e => e.id));
            } else {
              setSelectedRows([]);
            }
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={e => {
            if (e.target.checked) {
              setSelectedRows(prev => [...prev, row.id]);
            } else {
              setSelectedRows(prev => prev.filter(id => id !== row.id));
            }
          }}
        />
      ),
    },
    {
      key: "image_url",
      title: "Ảnh",
      render: (room) => (
        <img
          src={room.image_url || "/default-image.png"}
          alt={"Phòng " + room.room_number}
          className="w-14 h-14 rounded-lg border object-cover"
        />
      ),
    },
    {
      key: "hotel",
      title: "Khách sạn",
      render: (room) => typeof room.hotel === "object" ? room.hotel.name : room.hotel || "--",
    },
    {
      key: "room_type",
      title: "Loại phòng",
      dataIndex: "room_type",
    },
    {
      key: "price",
      title: "Giá",
      renderFormItem: (value, onChange) => (
        <CurrencyInput
          value={value ?? ""}
          decimalsLimit={0}
          groupSeparator=","
          intlConfig={{ locale: "vi-VN", currency: "VND" }}
          className="border px-2 py-1 rounded w-full"
          onValueChange={(val) => onChange(val ? parseInt(val.replace(/,/g, ""), 10) : "")}
          placeholder="Nhập giá"
        />
      ),
      render: (room) =>
        room.price != null && !isNaN(Number(room.price)) ? (
          <span className="text-green-700 font-medium">
            {Number(room.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </span>
        ) : (
          "--"
        ),
    },
    {
      key: "capacity",
      title: "Sức chứa",
      render: (room) => `${room.capacity} người`,
    },
    {
      key: "is_available",
      title: "Trạng thái",
      render: (room) => (
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(room);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${room.is_available ? "bg-green-500" : "bg-gray-300"
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${room.is_available ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </button>
          <span className={`ml-2 text-sm ${room.is_available ? "text-green-600" : "text-gray-500"}`}>
            {room.is_available ? "Hoạt động" : "Tạm ngưng"}
          </span>
        </div>
      ),
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
            <td className="py-2 px-2"><div className="w-10 h-10 bg-gray-200 rounded-full mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-4 bg-gray-200 rounded w-24 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-4 bg-gray-200 rounded w-14 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-6 bg-gray-200 rounded w-24 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-4 bg-gray-200 rounded w-20 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-4 bg-gray-200 rounded w-20 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-4 bg-gray-200 rounded w-16 mx-auto" /></td>
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
              Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, hotelroom.count)}</span> trong tổng số <span className="font-medium">{hotelroom.count}</span>
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
      <h1 className="text-2xl font-bold mb-4">Danh sách phòng khách sạn</h1>
      <DataTableToolbar
        onAdd={handleAdd}
        onDeleteSelected={handleDeleteSelected}
        selectedRows={selectedRows}
      />
      {loading &&
        <div className="rounded-lg border bg-white">
          <SkeletonTable />
        </div>
      }
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <DataTable columns={columns} data={hotelroom.results} actions={actions} />
      )}
      {hotelroom.count > 0 && <Pagination />}
      {detailModalOpen && selectedHotelRoom && (
        <Modal onClose={handleCloseDetailModal} title={
          <>
            <span className="font-semibold">Chi tiết phòng:</span> {selectedHotelRoom.room_number}
          </>
        }>
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={selectedHotelRoom.image_url || "/default-image.png"}
                alt={"Phòng " + selectedHotelRoom.room_number}
                className="w-32 h-32 object-cover rounded border mb-2"
              />
              <div className="flex-1 space-y-2">
                <div>
                  <span className="font-medium">Khách sạn: </span>
                  {typeof selectedHotelRoom.hotel === "object"
                    ? selectedHotelRoom.hotel.name
                    : selectedHotelRoom.hotel || "--"}
                </div>
                <div>
                  <span className="font-medium">Loại phòng: </span>
                  {selectedHotelRoom.room_type || "--"}
                </div>
                <div>
                  <span className="font-medium">Giá: </span>
                  {selectedHotelRoom.price != null
                    ? Number(selectedHotelRoom.price).toLocaleString("vi-VN") + " đ"
                    : "--"}
                </div>
                <div>
                  <span className="font-medium">Sức chứa: </span>
                  {selectedHotelRoom.capacity} người
                </div>
                <div>
                  <span className="font-medium">Tầng: </span>
                  {selectedHotelRoom.floor ?? "--"}
                </div>
                <div>
                  <span className="font-medium">Trạng thái: </span>
                  {selectedHotelRoom.is_available ? (
                    <span className="flex items-center text-green-600 gap-1">
                      <FaCheck /> Đang mở
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600 gap-1">
                      <FaTimes /> Đã khóa
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-medium">Tiện ích: </span>
                  {Array.isArray(selectedHotelRoom.amenities) && selectedHotelRoom.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedHotelRoom.amenities.map((amenityId) => {
                        const amenity = amenitiesList.find(a => a.id === amenityId);
                        return amenity ? (
                          <span
                            key={amenity.id}
                            className="inline-block bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded border border-cyan-200 font-medium"
                          >
                            {amenity.icon && <span className="mr-1">{/* icon nếu có */}</span>}
                            {amenity.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  ) : "--"}
                </div>
                <div>
                  <span className="font-medium">Tạo lúc: </span>
                  {selectedHotelRoom.created_at
                    ? new Date(selectedHotelRoom.created_at).toLocaleString("vi-VN")
                    : "--"}
                </div>
              </div>
            </div>
            {Array.isArray(selectedHotelRoom.image_gallery) && selectedHotelRoom.image_gallery.length > 0 && (
              <div>
                <span className="font-medium">Thư viện ảnh:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedHotelRoom.image_gallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Phòng ${selectedHotelRoom.room_number} - ảnh ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
      {editModalOpen && (
        <Modal onClose={handleEditModalClose} title={selectedHotelRoomEdit ? `Chỉnh sửa phòng khách sạn: ${selectedHotelRoomEdit?.id}` : 'Thêm mới'}>
          <GenericForm
            columns={formColumns}
            initialValues={selectedHotelRoomEdit || {}}
            onSubmit={handleEditSubmit}
            onCancel={handleEditModalClose}
            submitText={selectedHotelRoomEdit ? 'Cập nhật' : 'Thêm mới'}
          />
        </Modal>
      )}
    </div>
  );
}