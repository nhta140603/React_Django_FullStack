import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { fetchAllPages } from '../../utils/fetchAllPages';
import { createItem, deleteItem, getList, getPage, updateItem } from "../../api/api_generics";
import { FaUserEdit,FaChevronLeft, FaChevronRight, FaTrash, FaEye, FaMapMarkerAlt, FaLink, FaStar, FaBed } from "react-icons/fa";
import Badge from "../../components/Badge";
import DataTableToolbar from '../../components/DataTableToolbar';
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AmenitiesSelector from "../../components/AmenitiesSelector"

export default function HotelPage() {
  const [hotels, setHotels] = useState({count: 0, results: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editHotels, setEditHotels] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const [roomViewModalOpen, setRoomViewModalOpen] = useState(false);
  const [selectedHotelRoom, setSelectedHotelRoom] = useState([]);

  const [selectedHotels, setSelectedHotels] = useState([]);

  const [amenitiesList, setAmenitiesList] = useState([]);

  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)


  useEffect(() => {
    fetchAllPages(getList, 'hotel-amenities').then(setAmenitiesList);
  }, []);

  async function fetchHotels() {
    try {
      setLoading(true);
      setError(null);
      const data = await getPage('hotels', page, pageSize);
      setHotels(data);
      setTotalPages(Math.ceil(data.count /pageSize))
    } catch (err) {
      toast.error("Có lỗi khi tải dữ liệu khách sạn");
      setError("Có lỗi khi tải dữ liệu khách sạn");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHotels();
  }, [page, pageSize]);

  const handleView = (hotel) => {
    setSelectedHotel(hotel);
    setViewModalOpen(true);
  };
  const handleAdd = () => {
    setEditHotels(null);
    setEditModalOpen(true);
  };
  const handleEdit = (hotel) => {
    setEditHotels(hotel);
    setEditModalOpen(true);
  };
  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditHotels(null);
  };
  const handleCloseViewModal = () => {
    setSelectedHotel(null);
    setViewModalOpen(false);
  };

  const handleEditSubmit = async (hotel) => {
    if (hotel.amenities && Array.isArray(hotel.amenities)) {
      hotel.amenities = hotel.amenities.map(Number);
    }
    let payload = hotel;
    if (typeof payload.image_cover === "string"){
        delete payload.image_cover
    }
    try {
      if (hotel instanceof FormData) {
        if (payload.get && payload.get('amenities')) {
          const amenities = payload.getAll('amenities').map(Number);
          payload.delete('amenities');
          amenities.forEach(id => payload.append('amenities', id));
        }
        if (editHotels) {
          await updateItem('hotels', editHotels.id, payload, true);
          toast.success('Cập nhật thành công')
        } else {
          await createItem('hotels', payload, true);
          toast.success('Thêm thành công')
        }
      } else {
        if (editHotels) {
          await updateItem('hotels', editHotels.id, payload);
          toast.success('Cập nhật thành công')
        } else {
          await createItem('hotels', payload);
          toast.success('Thêm thành công')
        }
      }
      setEditModalOpen(false);
      setEditHotels(null);
      fetchHotels();
    } catch (err) {
      toast.error(editHotels ? "Cập nhật thất bại" : "Thêm mới thất bại");
    }
  };

  const handleDelete = async (hotel) => {
    try {
      await deleteItem('hotels', hotel.id);
      toast.success("Xóa thành công!");
      fetchHotels();
    } catch (err) {
      toast.error("Xóa thất bại!");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedHotels.length === 0) return;
    if (window.confirm(`Bạn chắc chắn muốn xóa ${selectedHotels.length} khách sạn?`)) {
      try {
        await Promise.all(selectedHotels.map((id) => deleteItem("hotels", id)));
        setSelectedHotels([]);
        await fetchHotels();
        toast.success("Xóa thành công");
      } catch (err) {
        toast.error("Xóa thất bại!");
      }
    }
  };

  const handleViewRoom = async (hotel) => {
    setRoomViewModalOpen(true);
    if (!hotel) {
      setSelectedHotelRoom([]);
      return;
    }
    try {
      const allRoomHotel = await getList('hotel-rooms');
      const roomOfHotel = allRoomHotel.filter(r => r.hotel === hotel.id);
      setSelectedHotelRoom(roomOfHotel);
    } catch (err) {
      toast.error("Có lỗi khi tải dữ liệu phòng");
      setSelectedHotelRoom([]);
    }
  };
  const handleCloseViewHotelRoomModal = () => {
    setSelectedHotelRoom([]);
    setRoomViewModalOpen(false);
  };

  const formColumns = [
    { key: "name", title: "Tên", inputType: "text", editable: true },
    { key: "address", title: "Địa chỉ", inputType: "text", editable: true },
    { key: "description", title: "Mô tả", inputType: "richtext", editable: true },
    { key: "phone", title: "SĐT", inputType: "text", editable: true },
    // { key: "email", title: "Email", inputType: "text", editable: true },
    { key: "star_rating", title: "Số sao", inputType: "text", editable: true },
    // { key: "website", title: "Website", inputType: "text", editable: true },
    // { key: "latitude", title: "Vĩ độ", inputType: "number", editable: true },
    // { key: "longitude", title: "Kinh độ", inputType: "number", editable: true },
    { key: "image_cover", title: "Hình ảnh", inputType: "file", editable: true },
    {
      key: "amenities",
      title: "Tiện ích",
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
  ];

  const columns = [
    {
      key: "checkbox",
      title: (
        <input
          type="checkbox"
          checked={selectedHotels.length === hotels.length && hotels.length > 0}
          onChange={e => {
            if (e.target.checked) {
              setSelectedHotels(hotels.map(h => h.id));
            } else {
              setSelectedHotels([]);
            }
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedHotels.includes(row.id)}
          onChange={e => {
            if (e.target.checked) {
              setSelectedHotels(prev => [...prev, row.id]);
            } else {
              setSelectedHotels(prev => prev.filter(id => id !== row.id));
            }
          }}
        />
      ),
    },
    {
      key: "image_cover",
      title: "Ảnh",
      render: (hotel) => (
        <img
          src={hotel.image_cover || "/default-image.png"}
          alt={hotel.name}
          className="w-14 h-14 rounded-lg border object-cover"
        />
      ),
      inputType: "file",
      editable: true,
    },
    {
      key: "name",
      title: "Tên khách sạn",
      dataIndex: "name",
      className: "font-semibold",
    },
    {
      key: "star_rating",
      title: "Hạng sao",
      render: (hotel) => (
        hotel.star_rating ? (
          <span className="flex items-center gap-1 text-yellow-500">
            {Array(hotel.star_rating).fill(0).map((_, i) => <FaStar key={i} />)}
            <span className="ml-1 text-gray-700">{hotel.star_rating} sao</span>
          </span>
        ) : (
          <span>--</span>
        )
      ),
    },
    {
      key: "address",
      title: "Địa chỉ",
      dataIndex: "address",
      render: (hotel) => (
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="inline text-cyan-600" />
          <span>{hotel.address}</span>
        </div>
      ),
    },
    {
      key: "phone",
      title: "Số điện thoại",
      dataIndex: "phone",
      render: (hotel) => hotel.phone || "--",
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      render: (hotel) => hotel.email || "--",
    },
    {
      key: "website",
      title: "Website",
      render: (hotel) =>
        hotel.website ? (
          <a
            href={hotel.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 hover:underline flex items-center gap-1"
          >
            <FaLink /> Trang web
          </a>
        ) : (
          "--"
        ),
    }
  ];

  const actions = [
    {
      key: "rooms",
      title: "Xem phòng",
      onClick: handleViewRoom,
      icon: () => <FaBed />,
      className: "text-blue-600 hover:text-blue-900",
    },
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
        const newSize = parseInt(e.target.value, 10)
        setPageSize(newSize)
        setPage(1)
      }
  
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
                Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, hotels.count)}</span> trong tổng số <span className="font-medium">{hotels.count}</span>
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
      <h1 className="text-2xl font-bold mb-4">Danh sách khách sạn</h1>
      <DataTableToolbar
        onAdd={handleAdd}
        onDeleteSelected={handleDeleteSelected}
        selectedRows={selectedHotels}
      />
      {loading && 
              <div className="rounded-lg border bg-white">
                <SkeletonTable />
              </div>
      }
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <DataTable columns={columns} data={hotels.results} actions={actions} />
      )}
      {hotels.count > 0 && <Pagination />}
      {editModalOpen && (
        <Modal onClose={handleEditClose} title={editHotels ? `Chỉnh sửa khách sạn: ${editHotels.name}` : 'Thêm mới'}>
          <GenericForm
            columns={formColumns}
            initialValues={editHotels || {}}
            onSubmit={handleEditSubmit}
            onCancel={handleEditClose}
            submitText={editHotels ? 'Cập nhật' : 'Thêm mới'}
          />
        </Modal>
      )}

      {viewModalOpen && selectedHotel && (
        <Modal onClose={handleCloseViewModal} title={
          <>
            <span className="font-semibold">Chi tiết khách sạn:</span> {selectedHotel.name}
          </>
        }>
          <div className="space-y-3 text-sm">
            <img
              src={selectedHotel.image_cover || "/default-image.png"}
              alt={selectedHotel.name}
              className="mb-2 w-full max-w-md h-48 object-cover rounded-lg border"
            />
            <div>
              <span className="font-medium">Địa chỉ: </span>
              <FaMapMarkerAlt className="inline text-cyan-600 mx-1" />
              {selectedHotel.address}
            </div>
            <div>
              <span className="font-medium">Mô tả: </span>
              <span className="whitespace-pre-line">{selectedHotel.description || "--"}</span>
            </div>
            <div>
              <span className="font-medium">Số điện thoại: </span>{selectedHotel.phone || "--"}
            </div>
            <div>
              <span className="font-medium">Email: </span>{selectedHotel.email || "--"}
            </div>
            <div>
              <span className="font-medium">Website: </span>
              {selectedHotel.website ? (
                <a href={selectedHotel.website} target="_blank" rel="noopener noreferrer" className="text-cyan-700 hover:underline flex items-center gap-1">
                  <FaLink /> Trang web
                </a>
              ) : "--"}
            </div>
            <div>
              <span className="font-medium">Hạng sao: </span>
              {selectedHotel.star_rating ? (
                <span className="flex items-center gap-1 text-yellow-500">
                  {Array(selectedHotel.star_rating).fill(0).map((_, i) => <FaStar key={i} />)}
                  <span className="ml-1 text-gray-700">{selectedHotel.star_rating} sao</span>
                </span>
              ) : "--"}
            </div>
            {/* TIỆN ÍCH (AMENITIES) */}
            {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
              <div>
                <span className="font-medium">Tiện ích: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedHotel.amenities.map((amenityId) => {
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
              </div>
            )}
            {(selectedHotel.latitude && selectedHotel.longitude) && (
              <div>
                <span className="font-medium">Vị trí: </span>
                <a
                  href={`https://maps.google.com/?q=${selectedHotel.latitude},${selectedHotel.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-700 hover:underline"
                >
                  Xem trên Google Maps ({selectedHotel.latitude}, {selectedHotel.longitude})
                </a>
              </div>
            )}
            <div>
              <span className="font-medium">Ngày tạo: </span>
              {selectedHotel.created_at ? new Date(selectedHotel.created_at).toLocaleDateString("vi-VN") : "--"}
            </div>
            <div>
              <span className="font-medium">Cập nhật gần nhất: </span>
              {selectedHotel.updated_at ? new Date(selectedHotel.updated_at).toLocaleDateString("vi-VN") : "--"}
            </div>
          </div>
        </Modal>
      )}

      {roomViewModalOpen && (
        <Modal onClose={handleCloseViewHotelRoomModal} title={`Xem các phòng`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 text-left">Ảnh</th>
                  <th className="py-2 px-3 text-left">Số phòng</th>
                  <th className="py-2 px-3 text-left">Loại phòng</th>
                  <th className="py-2 px-3 text-left">Tầng</th>
                  <th className="py-2 px-3 text-left">Giá</th>
                  <th className="py-2 px-3 text-left">Sức chứa</th>
                  <th className="py-2 px-3 text-left">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {selectedHotelRoom.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-3 text-center text-gray-500">
                      Chưa có phòng nào cho khách sạn này.
                    </td>
                  </tr>
                ) : (
                  selectedHotelRoom.map((td, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-3 text-center font-semibold"><img src={td.image_url} alt="" className="w-16 h-10 object-cover rounded" /></td>
                      <td className="py-2 px-3 font-medium">{td.room_number || "Không tìm thấy"}</td>
                      <td className="py-2 px-3">{td.room_type || "--"}</td>
                      <td className="py-2 px-3 font-medium">{td.floor || "Không tìm thấy"}</td>
                      <td className="py-2 px-3">{td.price || "--"}</td>
                      <td className="py-2 px-3">{td.capacity || "--"}</td>
                      <td className="py-2 px-3">{td.is_available ? `Có sẵn` : `Hết phòng`}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}