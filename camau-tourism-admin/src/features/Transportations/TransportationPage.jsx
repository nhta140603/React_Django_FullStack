import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import { getList, deleteItem } from "../../api/api_generics";
import { FaTrash } from "react-icons/fa";
import Badge from "../../components/Badge"; // Đảm bảo có component này

export default function TransportPage() {
  const [transportation, setTransportation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTransport() {
      try {
        setLoading(true);
        setError(null);
        const data = await getList("transportations");
        setTransportation(data);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }
    fetchTransport();
  }, []);

  const handleDelete = async (item) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chuyến đi này?")) return;
    try {
      await deleteItem("transportations", item.id);
      setTransportation((prev) => prev.filter((r) => r.id !== item.id));
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const columns = [
    {
      key: "client_avatar",
      title: "Avatar",
      render: (transport) => (
        <img
          src={transport.client?.avatar || "/default-avatar.png"}
          alt=""
          className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover"
        />
      ),
    },
    {
      key: "client_name",
      title: "Khách hàng",
      render: (transport) =>
        transport.client?.user?.full_name ||
        transport.client?.user?.username ||
        "--",
      className: "font-medium",
    },
    {
      key: "type",
      title: "Loại phương tiện",
      render: (transport) => transport.type || "--",
    },
    {
      key: "operator_name",
      title: "Nhà vận hành",
      render: (transport) => transport.operator_name || "--",
    },
    {
      key: "seat_class",
      title: "Hạng ghế",
      render: (transport) => transport.seat_class || "--",
    },
    {
      key: "departure",
      title: "Điểm đi",
      render: (transport) => transport.departure,
    },
    {
      key: "destination",
      title: "Điểm đến",
      render: (transport) => transport.destination,
    },
    {
      key: "departure_time",
      title: "Giờ đi",
      render: (transport) =>
        transport.departure_time
          ? new Date(transport.departure_time).toLocaleString("vi-VN")
          : "--",
    },
    {
      key: "arrival_time",
      title: "Giờ đến",
      render: (transport) =>
        transport.arrival_time
          ? new Date(transport.arrival_time).toLocaleString("vi-VN")
          : "--",
    },
    {
      key: "price",
      title: "Giá vé",
      render: (transport) =>
        transport.price
          ? Number(transport.price).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })
          : "--",
    },
    {
      key: "is_refundable",
      title: "Hoàn vé",
      render: (transport) =>
        transport.is_refundable ? (
          <Badge color="green">Có hoàn vé</Badge>
        ) : (
          <Badge color="gray">Không hoàn vé</Badge>
        ),
    },
    {
      key: "baggage_policy",
      title: "Hành lý",
      render: (transport) => (
        <span title={transport.baggage_policy}>
          {transport.baggage_policy
            ? transport.baggage_policy.length > 30
              ? transport.baggage_policy.slice(0, 30) + "..."
              : transport.baggage_policy
            : "--"}
        </span>
      ),
    },
    {
      key: "created_at",
      title: "Ngày tạo",
      render: (transport) =>
        transport.created_at
          ? new Date(transport.created_at).toLocaleString("vi-VN")
          : "--",
    },
    {
      key: "updated_at",
      title: "Cập nhật",
      render: (transport) =>
        transport.updated_at
          ? new Date(transport.updated_at).toLocaleString("vi-VN")
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
      <h1 className="text-2xl font-bold mb-4">Danh sách phương tiện</h1>
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
      {!loading && !error && (
        <DataTable columns={columns} data={transportation} actions={actions} />
      )}
    </div>
  );
}