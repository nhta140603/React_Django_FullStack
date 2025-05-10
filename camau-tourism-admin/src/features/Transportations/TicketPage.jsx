import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import { getList, deleteItem } from "../../api/api_generics";
import { FaTrash } from "react-icons/fa";
import Badge from "../../components/Badge";

export default function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      setError(null);
      try {
        const data = await getList("tickets");
        setTickets(data);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const handleDelete = async (item) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vé này?")) return;
    try {
      await deleteItem("tickets", item.id);
      setTickets((prev) => prev.filter((r) => r.id !== item.id));
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const columns = [
    {
      key: "transportation",
      title: "Phương tiện",
      render: (ticket) => ticket.transportation?.type || "--",
    },
    {
      key: "seat_number",
      title: "Số ghế",
      render: (ticket) => ticket.seat_number || "--",
    },
    {
      key: "ticket_code",
      title: "Mã vé",
      render: (ticket) => ticket.ticket_code || "--",
    },
    {
      key: "issued_at",
      title: "Ngày cấp",
      render: (ticket) =>
        ticket.issued_at
          ? new Date(ticket.issued_at).toLocaleString("vi-VN")
          : "--",
    },
    {
      key: "qr_code_url",
      title: "QR Code",
      render: (ticket) =>
        ticket.qr_code_url ? (
          <a href={ticket.qr_code_url} target="_blank" rel="noopener noreferrer">
            Xem QR
          </a>
        ) : (
          "--"
        ),
    },
    {
      key: "valid_from",
      title: "Hợp lệ từ",
      render: (ticket) =>
        ticket.valid_from
          ? new Date(ticket.valid_from).toLocaleString("vi-VN")
          : "--",
    },
    {
      key: "valid_until",
      title: "Hết hạn",
      render: (ticket) =>
        ticket.valid_until
          ? new Date(ticket.valid_until).toLocaleString("vi-VN")
          : "--",
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (ticket) => {
        let color = "gray";
        if (ticket.status === "valid") color = "green";
        else if (ticket.status === "used") color = "blue";
        else if (ticket.status === "expired") color = "red";
        return <Badge color={color}>{ticket.status}</Badge>;
      },
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
      <h1 className="text-2xl font-bold mb-4">Danh sách vé</h1>
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <DataTable columns={columns} data={tickets} actions={actions} />
      )}
    </div>
  );
}