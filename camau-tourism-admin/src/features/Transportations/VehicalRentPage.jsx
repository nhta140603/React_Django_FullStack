import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import { getList, deleteItem, createItem, updateItem } from "../../api/api_generics";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import Badge from "../../components/Badge";
import DataTableToolbar from '../../components/DataTableToolbar';
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VehicleRentalPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [editRental, setEditRental] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewRental, setViewRental] = useState(null);

  async function fetchRentals() {
    setLoading(true);
    setError(null);
    try {
      const data = await getList("vehicle-rentals");
      setRentals(data);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      toast.error("Không thể tải danh sách thuê xe!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRentals();
  }, []);

  // Thêm mới
  const handleAdd = () => {
    setEditRental(null);
    setRentalModalOpen(true);
  };

  // Sửa
  const handleEdit = (rental) => {
    setEditRental(rental);
    setRentalModalOpen(true);
  };

  // Xem chi tiết
  const handleView = (rental) => {
    setViewRental(rental);
  };

  // Đóng modal chi tiết
  const handleCloseViewModal = () => {
    setViewRental(null);
  };

  // Đóng form modal
  const handleCloseModal = () => {
    setRentalModalOpen(false);
    setEditRental(null);
  };

  // Thêm hoặc cập nhật đơn thuê
  const handleSubmitRental = async (values) => {
    // Validate cơ bản
    if (!values.client) {
      toast.warn("Vui lòng chọn khách hàng!");
      return;
    }
    if (!values.rental_date) {
      toast.warn("Vui lòng nhập ngày thuê!");
      return;
    }
    if (!values.return_date) {
      toast.warn("Vui lòng nhập ngày trả!");
      return;
    }
    if (values.price == null || values.price === "" || isNaN(Number(values.price)) || Number(values.price) <= 0) {
      toast.warn("Vui lòng nhập giá thuê hợp lệ!");
      return;
    }
    if (!values.rental_status) {
      toast.warn("Vui lòng chọn trạng thái!");
      return;
    }

    try {
      if (editRental) {
        await updateItem("vehicle-rentals", editRental.id, values);
        toast.success("Cập nhật đơn thuê thành công!");
      } else {
        await createItem("vehicle-rentals", values);
        toast.success("Thêm đơn thuê thành công!");
      }
      handleCloseModal();
      fetchRentals();
    } catch (err) {
      toast.error(editRental ? "Cập nhật thất bại!" : "Thêm mới thất bại!");
    }
  };

  // Xóa 1 đơn
  const handleDelete = async (item) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn thuê xe này?")) return;
    try {
      await deleteItem("vehicle-rentals", item.id);
      setRentals((prev) => prev.filter((r) => r.id !== item.id));
      toast.success("Đã xóa đơn thuê xe!");
    } catch (err) {
      toast.error("Xóa thất bại!");
    }
  };

  // Xóa nhiều đơn
  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedRows.length} đơn thuê?`)) {
      try {
        await Promise.all(selectedRows.map(id => deleteItem('vehicle-rentals', id)));
        setSelectedRows([]);
        await fetchRentals();
        toast.success("Đã xóa các đơn thuê đã chọn!");
      } catch {
        toast.error("Không thể xóa các đơn thuê đã chọn!");
      }
    }
  };

  const formColumns = [
    {
      field: "client",
      inputType: "select",
      title: "Khách hàng",
      required: true
    },
    {
      field: "vehicle",
      inputType: "select",
      title: "Phương tiện",
      required: false
    },
    {
      field: "destination",
      inputType: "select",
      title: "Điểm đến",
      required: false
    },
    {
      field: "rental_date",
      inputType: "date",
      title: "Ngày thuê",
      required: true
    },
    {
      field: "return_date",
      inputType: "date",
      title: "Ngày trả",
      required: true
    },
    {
      field: "driver_needed",
      inputType: "checkbox",
      title: "Cần tài xế",
      required: false
    },
    {
      field: "insurance_included",
      inputType: "checkbox",
      title: "Bao gồm bảo hiểm",
      required: false
    },
    {
      field: "price",
      inputType: "number",
      title: "Giá thuê",
      required: true,
      step: "0.01"
    },
    {
      field: "rental_status",
      inputType: "select",
      title: "Trạng thái",
      required: true,
      options: [
        { label: "Đã đặt", value: "reserved" },
        { label: "Đang thuê", value: "active" },
        { label: "Hoàn thành", value: "completed" },
        { label: "Đã hủy", value: "cancelled" }
      ]
    },
    {
      field: "note",
      inputType: "textarea",
      title: "Ghi chú",
      required: false
    }
  ];

  const columns = [
    {
      key: "checkbox",
      title: (
        <input type="checkbox"
          checked={selectedRows.length === rentals.length && rentals.length > 0}
          onChange={e => {
            if (e.target.checked) {
              setSelectedRows(rentals.map(r => r.id));
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
      )
    },
    {
      key: "client_avatar",
      title: "Avatar",
      render: (rental) => (
        <img
          src={rental.client?.user?.avatar || "/default-avatar.png"}
          alt=""
          className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover"
        />
      ),
    },
    {
      key: "client_name",
      title: "Khách hàng",
      render: (rental) =>
        rental.client?.user?.full_name ||
        rental.client?.user?.username ||
        "--",
      className: "font-medium",
    },
    {
      key: "vehicle_type",
      title: "Loại xe",
      render: (rental) => rental.vehicle_type || "--",
    },
    {
      key: "license_plate",
      title: "Biển số",
      render: (rental) => rental.license_plate || "--",
    },
    {
      key: "rental_date",
      title: "Ngày thuê",
      render: (rental) =>
        rental.rental_date
          ? new Date(rental.rental_date).toLocaleDateString("vi-VN")
          : "--",
    },
    {
      key: "return_date",
      title: "Ngày trả",
      render: (rental) =>
        rental.return_date
          ? new Date(rental.return_date).toLocaleDateString("vi-VN")
          : "--",
    },
    {
      key: "price",
      title: "Giá thuê",
      render: (rental) =>
        rental.price
          ? Number(rental.price).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })
          : "--",
    },
    {
      key: "rental_status",
      title: "Trạng thái",
      render: (rental) => {
        let color = "gray";
        if (rental.rental_status === "reserved") color = "orange";
        else if (rental.rental_status === "active") color = "blue";
        else if (rental.rental_status === "completed") color = "green";
        else if (rental.rental_status === "cancelled") color = "red";
        return <Badge color={color}>{rental.rental_status}</Badge>;
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
      icon: () => <FaEdit />,
      className: "text-blue-600 hover:text-blue-900",
    },
    {
      key: "delete",
      title: "Xóa",
      onClick: handleDelete,
      icon: () => <FaTrash />,
      className: "text-red-600 hover:text-red-900",
    },
  ];

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Danh sách thuê xe</h1>
      {loading && (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-9 w-9 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="ml-3 text-cyan-700 text-lg font-medium">Đang tải...</span>
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      <DataTableToolbar
        onAdd={handleAdd}
        selectedRows={selectedRows}
        onDeleteSelected={handleDeleteSelected}
      />
      {!loading && !error && (
        <DataTable columns={columns} data={rentals} actions={actions} />
      )}

      {viewRental && (
        <Modal onClose={handleCloseViewModal} title={`Chi tiết đơn thuê`}>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Khách hàng: </span>
              {viewRental.client?.user?.full_name ||
                viewRental.client?.user?.username ||
                "--"}
            </div>
            <div>
              <span className="font-medium">Phương tiện: </span>
              {viewRental.vehicle?.name || "--"}
            </div>
            <div>
              <span className="font-medium">Biển số: </span>
              {viewRental.license_plate || "--"}
            </div>
            <div>
              <span className="font-medium">Điểm đến: </span>
              {viewRental.destination?.name || "--"}
            </div>
            <div>
              <span className="font-medium">Ngày thuê: </span>
              {viewRental.rental_date
                ? new Date(viewRental.rental_date).toLocaleDateString("vi-VN")
                : "--"}
            </div>
            <div>
              <span className="font-medium">Ngày trả: </span>
              {viewRental.return_date
                ? new Date(viewRental.return_date).toLocaleDateString("vi-VN")
                : "--"}
            </div>
            <div>
              <span className="font-medium">Giá thuê: </span>
              {viewRental.price
                ? Number(viewRental.price).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
                : "--"}
            </div>
            <div>
              <span className="font-medium">Trạng thái: </span>
              {viewRental.rental_status}
            </div>
            <div>
              <span className="font-medium">Cần tài xế: </span>
              {viewRental.driver_needed ? "Có" : "Không"}
            </div>
            <div>
              <span className="font-medium">Bảo hiểm: </span>
              {viewRental.insurance_included ? "Có" : "Không"}
            </div>
            <div>
              <span className="font-medium">Ghi chú: </span>
              {viewRental.note || "--"}
            </div>
          </div>
        </Modal>
      )}

       {rentalModalOpen && (
        <Modal onClose={handleCloseModal} title={editRental ? "Chỉnh sửa đơn thuê xe" : "Thêm mới đơn thuê xe"}>
          <GenericForm
            columns={formColumns}
            initialValues={editRental || {}}
            onSubmit={handleSubmitRental}
            onCancel={handleCloseModal}
            submitText={editRental ? "Cập nhật" : "Thêm mới"}
          />
        </Modal>
      )}
    </div>
  );
}