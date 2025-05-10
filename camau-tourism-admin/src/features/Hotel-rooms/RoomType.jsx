import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import { createItem, deleteItem, getList, updateItem } from "../../api/api_generics";
import { FaEye, FaUserEdit, FaTrash } from "react-icons/fa";
import DataTableToolbar from "../../components/DataTableToolbar";
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RoomTypePage() {
  // Thêm state cho hotels & khách sạn đang chọn
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState("");

  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoomTypeEdit, setSelectedRoomTypeEdit] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);

  // Lấy danh sách khách sạn
  useEffect(() => {
    async function fetchHotels() {
      try {
        const data = await getList("hotels");
        setHotels(data);
        if (data.length > 0) {
          setSelectedHotelId(data[0].id); // Chọn mặc định khách sạn đầu tiên
        }
      } catch (err) {
        toast.error("Không thể tải danh sách khách sạn");
      }
    }
    fetchHotels();
  }, []);

  // Lấy danh sách loại phòng theo khách sạn đã chọn
  async function fetchRoomTypes(hotelId) {
    if (!hotelId) {
      setRoomTypes([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Giả sử backend hỗ trợ filter ?hotel=<id>
      const data = await getList(`room-types?hotel=${hotelId}`);
      setRoomTypes(data);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      toast.error("Không thể tải dữ liệu loại phòng");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedHotelId) {
      fetchRoomTypes(selectedHotelId);
    } else {
      setRoomTypes([]);
    }
  }, [selectedHotelId]);

  const handleView = (roomtype) => {
    setSelectedRoomType(roomtype);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedRoomType(null);
  };

  const handleEdit = (roomtype) => {
    setEditModalOpen(true);
    setSelectedRoomTypeEdit({
      ...roomtype,
      hotel: typeof roomtype.hotel === "object" ? roomtype.hotel.id : roomtype.hotel,
      id: roomtype.id,
    });
  };

  const handleAdd = () => {
    setEditModalOpen(true);
    setSelectedRoomTypeEdit(null); // form sẽ nhận initialValues là {}
  };

  function validate(values) {
    if (!values.name || values.name.trim() === "") {
      toast.warn("Vui lòng nhập tên loại phòng!");
      return false;
    }
    if (!values.hotel) {
      toast.warn("Vui lòng chọn khách sạn!");
      return false;
    }
    return true;
  }

  const handleEditSubmit = async (values) => {
    if (!validate(values)) return;
    let isEdit = !!selectedRoomTypeEdit;
    try {
      const payload = { ...values };
      if (isEdit) {
        await updateItem("room-types", selectedRoomTypeEdit.id, payload);
        toast.success("Cập nhật loại phòng thành công!");
      } else {
        await createItem("room-types", payload);
        toast.success("Thêm loại phòng thành công!");
      }
      await fetchRoomTypes(payload.hotel); // Lấy lại danh sách loại phòng theo hotel mới
      setSelectedHotelId(payload.hotel); // Đặt lại khách sạn đang lọc
      handleEditModalClose();
    } catch (err) {
      toast.error(isEdit ? "Cập nhật thất bại!" : "Thêm loại phòng thất bại!");
    }
  };

  const handleDelete = async (roomtype) => {
    if (window.confirm("Bạn có chắc muốn xóa loại phòng này?")) {
      try {
        await deleteItem("room-types", roomtype.id);
        toast.success("Xóa loại phòng thành công!");
        await fetchRoomTypes(selectedHotelId);
      } catch (err) {
        toast.error("Không thể xóa loại phòng!");
      }
    }
  };

  async function handleDeleteSelected() {
    if (selectedRows.length === 0) return;
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedRows.length} loại phòng?`)) {
      try {
        await Promise.all(selectedRows.map(id => deleteItem("room-types", id)));
        toast.success("Xóa các loại phòng đã chọn thành công!");
        await fetchRoomTypes(selectedHotelId);
        setSelectedRows([]);
      } catch {
        toast.error("Không thể xóa các loại phòng đã chọn!");
      }
    }
  }

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedRoomTypeEdit(null);
  };

  const formColumns = [
    {
      key: "hotel",
      title: "Khách sạn",
      inputType: "select",
      editable: true,
      options: hotels.map(h => ({
        value: h.id,
        label: h.name,
      })),
    },
    {
      key: "name",
      title: "Tên loại phòng",
      inputType: "text",
      editable: true,
    },
    {
      key: "description",
      title: "Mô tả",
      inputType: "textarea",
      editable: true,
    },
  ];

  const columns = [
    {
      key: "checkbox",
      title: (
        <input
          type="checkbox"
          checked={selectedRows.length === roomTypes.length && roomTypes.length > 0}
          onChange={e => {
            if (e.target.checked) {
              setSelectedRows(roomTypes.map(e => e.id));
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
      key: "name",
      title: "Tên loại phòng",
      dataIndex: "name",
      className: "font-semibold",
    },
    {
      key: "description",
      title: "Mô tả",
      render: (row) => row.description || "--",
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
            <td className="py-2 px-2"><div className="h-4 bg-gray-200 rounded w-6 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-4 bg-gray-200 rounded w-24 mx-auto" /></td>
            <td className="py-2 px-2"><div className="h-4 bg-gray-200 rounded w-32 mx-auto" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Danh sách loại phòng</h1>
      <DataTableToolbar
        onAdd={handleAdd}
        onDeleteSelected={handleDeleteSelected}
        selectedRows={selectedRows}
      />
      {loading && (
        <div className="rounded-lg border bg-white">
          <SkeletonTable />
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <DataTable columns={columns} data={roomTypes} actions={actions} />
      )}
      {detailModalOpen && selectedRoomType && (
        <Modal
          onClose={handleCloseDetailModal}
          title={
            <>
              <span className="font-semibold">Chi tiết loại phòng:</span> {selectedRoomType.name}
            </>
          }
        >
          <div className="mb-4 space-y-2 text-sm">
            <div>
              <span className="font-medium">Tên loại phòng: </span>
              {selectedRoomType.name || "--"}
            </div>
            <div>
              <span className="font-medium">Mô tả: </span>
              {selectedRoomType.description || "--"}
            </div>
            <div>
              <span className="font-medium">Tạo lúc: </span>
              {selectedRoomType.created_at
                ? new Date(selectedRoomType.created_at).toLocaleString("vi-VN")
                : "--"}
            </div>
          </div>
        </Modal>
      )}
      {editModalOpen && (
        <Modal
          onClose={handleEditModalClose}
          title={
            selectedRoomTypeEdit
              ? `Chỉnh sửa loại phòng: ${selectedRoomTypeEdit?.name}`
              : "Thêm loại phòng"
          }
        >
            <GenericForm
              columns={formColumns}
              initialValues={selectedRoomTypeEdit || { hotel: selectedHotelId || (hotels[0]?.id ?? "") }}
              onSubmit={handleEditSubmit}
              onCancel={handleEditModalClose}
              submitText={selectedRoomTypeEdit ? "Cập nhật" : "Thêm mới"}
            />
        </Modal>
      )}
    </div>
  );
}