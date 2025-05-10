import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import { getList, deleteItem, createItem, updateItem } from "../../api/api_generics";
import { FaEdit, FaTrash } from "react-icons/fa";
import Badge from "../../components/Badge";
import DataTableToolbar from '../../components/DataTableToolbar';
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VEHICLE_TYPE_OPTIONS = [
  { value: "car", label: "Car" },
  { value: "motorbike", label: "Motorbike" },
  { value: "bus", label: "Bus" },
  { value: "bicycle", label: "Bicycle" },
  { value: "van", label: "Van" },
  { value: "other", label: "Other" },
];

export default function VehicleRentalPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  async function fetchVehicles() {
    setLoading(true);
    setError(null);
    try {
      const data = await getList("vehicles");
      setVehicles(data);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      toast.error("Không thể tải danh sách xe!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAdd = () => {
    setVehicleModalOpen(true);
    setEditVehicle(null);
  };

  const handleEdit = (vehicle) => {
    setEditVehicle(vehicle)
    setVehicleModalOpen(true);
  };

  // Ràng buộc dữ liệu đầu vào
  function validateVehicle(vehicle) {
    if (!vehicle.vehicle_type) {
      toast.warn("Vui lòng chọn loại xe!");
      return false;
    }
    if (!vehicle.brand || vehicle.brand.trim() === "") {
      toast.warn("Vui lòng nhập hãng xe!");
      return false;
    }
    if (!vehicle.license_plate || vehicle.license_plate.trim() === "") {
      toast.warn("Vui lòng nhập biển số!");
      return false;
    }
    if (
      vehicle.seat_count === undefined ||
      vehicle.seat_count === null ||
      isNaN(Number(vehicle.seat_count)) ||
      Number(vehicle.seat_count) < 1
    ) {
      toast.warn("Vui lòng nhập số ghế hợp lệ (>=1)!");
      return false;
    }
    return true;
  }

  const handleDelete = async (vehicle) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa xe này?")) return;
    try {
      await deleteItem("vehicles", vehicle.id);
      setVehicles((prev) => prev.filter(r => r.id !== vehicle.id));
      toast.success("Đã xóa xe thành công!");
    } catch (err) {
      toast.error("Xóa thất bại!");
    }
  };

  const handleSubmitEditRentals = async (vehicle) => {
    if (!validateVehicle(vehicle)) return;
    let payload = vehicle;
    try {
      if (payload instanceof FormData) {
        if (!editVehicle) {
          await createItem('vehicles', payload, true);
          toast.success("Thêm xe thành công!");
        } else {
          await updateItem('vehicles', editVehicle.id, payload, true);
          toast.success("Cập nhật xe thành công!");
        }
      } else {
        if (!editVehicle) {
          await createItem('vehicles', payload);
          toast.success("Thêm xe thành công!");
        } else {
          await updateItem('vehicles', editVehicle.id, payload);
          toast.success("Cập nhật xe thành công!");
        }
      }
      setVehicleModalOpen(false)
      setEditVehicle(null)
      await fetchVehicles();
    } catch (err) {
      toast.error(editVehicle ? "Cập nhật thất bại!" : "Thêm xe thất bại!");
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedRows.length} xe?`)) {
      try {
        await Promise.all(selectedRows.map(row => deleteItem('vehicles', row)));
        setSelectedRows([]);
        await fetchVehicles();
        toast.success("Đã xóa các xe đã chọn!");
      } catch {
        toast.error("Không thể xóa các xe đã chọn!");
      }
    }
  };

  const handleCloseModal = () => {
    setVehicleModalOpen(false);
    setEditVehicle(null);
  };

  const columns = [
    {
      key: "checkbox",
      title: (
        <input
          type="checkbox"
          checked={selectedRows.length === vehicles.length && vehicles.length > 0}
          onChange={e => setSelectedRows(e.target.checked ? vehicles.map(v => v.id) : [])}
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
      key: "image",
      title: "Ảnh",
      render: (vehicle) =>
        vehicle.image ? (
          <img
            src={vehicle.image}
            alt=""
            className="w-12 h-12 object-cover rounded border"
          />
        ) : (
          <span className="italic text-gray-400">Không có ảnh</span>
        ),
    },
    {
      key: "vehicle_type",
      title: "Loại xe",
      render: (vehicle) =>
        VEHICLE_TYPE_OPTIONS.find(opt => opt.value === vehicle.vehicle_type)?.label || "--",
    },
    {
      key: "brand",
      title: "Hãng",
      render: (vehicle) => vehicle.brand || "--",
      className: "font-medium",
    },
    {
      key: "license_plate",
      title: "Biển số",
      render: (vehicle) => vehicle.license_plate || "--",
    },
    {
      key: "color",
      title: "Màu",
      render: (vehicle) => vehicle.color || "--",
    },
    {
      key: "is_available",
      title: "Sẵn sàng",
      render: (vehicle) =>
        vehicle.is_available ? <Badge color="green">Có</Badge> : <Badge color="gray">Không</Badge>,
    },
    {
      key: "description",
      title: "Mô tả",
      render: (vehicle) =>
        vehicle.description ? (
          <span className="truncate block max-w-xs">{vehicle.description}</span>
        ) : (
          <span className="italic text-gray-400">--</span>
        ),
    },
  ];

  const formColumns = [
    {
      key: "vehicle_type",
      title: "Loại xe",
      inputType: "select",
      options: VEHICLE_TYPE_OPTIONS,
      required: true,
    },
    {
      key: "brand",
      title: "Hãng",
      inputType: "text",
      required: true,
    },
    {
      key: "model",
      title: "Model",
      inputType: "text",
    },
    {
      key: "license_plate",
      title: "Biển số",
      inputType: "text",
      required: true,
    },
    {
      key: "seat_count",
      title: "Số ghế",
      inputType: "number",
      min: 1,
      required: true,
    },
    {
      key: "color",
      title: "Màu",
      inputType: "text",
    },
    {
      key: "year",
      title: "Năm sản xuất",
      inputType: "number",
      min: 1900,
      max: new Date().getFullYear(),
    },
    {
      key: "is_available",
      title: "Sẵn sàng cho thuê",
      inputType: "checkbox",
    },
    {
      key: "description",
      title: "Mô tả",
      inputType: "textarea",
    },
    {
      key: "image",
      title: "Ảnh",
      inputType: "image",
    },
  ];

  const actions = [
    {
      key: "edit",
      title: "Sửa",
      onClick: handleEdit,
      icon: () => <FaEdit />,
      className: "text-blue-600 hover:text-blue-900 cursor-pointer",
    },
    {
      key: "delete",
      title: "Xóa",
      onClick: handleDelete,
      icon: () => <FaTrash />,
      className: "text-red-600 hover:text-red-900 cursor-pointer",
    },
  ];

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Danh sách xe</h1>
      {loading && <div>
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-9 w-9 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="ml-3 text-cyan-700 text-lg font-medium">Đang tải...</span>
        </div>
      </div>}
      {error && <div className="text-red-500">{error}</div>}

      <DataTableToolbar
        onAdd={handleAdd}
        selectedRows={selectedRows}
        onDeleteSelected={handleDeleteSelected}
      />

      {!loading && !error && (
        <DataTable columns={columns} data={vehicles} actions={actions} />
      )}

      {vehicleModalOpen && (
        <Modal onClose={handleCloseModal} title={editVehicle ? `Chỉnh sửa phương tiện: ${VEHICLE_TYPE_OPTIONS.find(e=>e.value===editVehicle?.vehicle_type)?.label} - ${editVehicle?.id}` : "Thêm mới phương tiện"}>
          <GenericForm
            columns={formColumns}
            initialValues={editVehicle || {}}
            onSubmit={handleSubmitEditRentals}
            onCancel={handleCloseModal}
            submitText={editVehicle ? "Cập nhật" : "Thêm mới"}
          />
        </Modal>
      )}
    </div>
  );
}