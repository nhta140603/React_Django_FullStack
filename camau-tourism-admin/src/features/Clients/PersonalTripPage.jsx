import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { getList, deleteItem } from "../../api/api_generics";
import { FaTrash } from "react-icons/fa";
import Badge from "../../components/Badge";
import DataTableToolbar from '../../components/DataTableToolbar';
export default function PersonalTripPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getList("personal-trips");
      setTrips(data);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (trip) => {
    if (window.confirm(`Bạn có muốn xóa chuyến đi "${trip.name}"?`)) {
      try {
        await deleteItem("personal-trips", trip.id);
        fetchTrips();
      } catch (err) {
        alert("Xóa thất bại!");
      }
    }
  };

  const columns = [
    {
      key: "main_image",
      title: "Ảnh đại diện",
      render: (trip) => (
        <img
          src={trip.main_image || "/default-trip.png"}
          alt=""
          className="w-14 h-14 rounded border object-cover"
        />
      ),
    },
    {
      key: "name",
      title: "Tên chuyến đi",
      render: (trip) => trip.name,
      className: "font-semibold",
    },
    {
      key: "description",
      title: "Mô tả",
      render: (trip) =>
        trip.description && trip.description.length > 40
          ? trip.description.slice(0, 40) + "..."
          : trip.description || "--",
    },
    {
      key: "is_public",
      title: "Công khai",
      render: (trip) =>
        trip.is_public ? (
          <Badge color="green">Công khai</Badge>
        ) : (
          <Badge color="gray">Riêng tư</Badge>
        ),
    },
    {
      key: "start_date",
      title: "Bắt đầu",
      render: (trip) => trip.start_date || "--",
    },
    {
      key: "end_date",
      title: "Kết thúc",
      render: (trip) => trip.end_date || "--",
    },
    {
      key: "created_at",
      title: "Ngày tạo",
      render: (trip) =>
        trip.created_at
          ? new Date(trip.created_at).toLocaleDateString("vi-VN")
          : "--",
    },
    {
      key: "updated_at",
      title: "Cập nhật",
      render: (trip) =>
        trip.updated_at
          ? new Date(trip.updated_at).toLocaleDateString("vi-VN")
          : "--",
    },
  ];

  const actions = [
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
      <h1 className="text-2xl font-bold mb-4">Danh sách chuyến đi cá nhân</h1>
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <DataTableToolbar/>
      {!loading && !error && (
        <DataTable columns={columns} data={trips} actions={actions} />
      )}
    </div>
  );
}