import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { getList, deleteItem } from "../../api/api_generics";
import { FaTrash } from "react-icons/fa";
import Badge from "../../components/Badge";
import DataTableToolbar from '../../components/DataTableToolbar';
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function PersonalTourGuideBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getList("personal-tour-guide-bookings");
      setBookings(data);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      toast.error(err.message || "Có lỗi xảy ra khi tải danh sách hướng dẫn viên!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (booking) => {
    if (
      window.confirm(
        `Bạn có muốn xóa đặt lịch hướng dẫn viên cho chuyến "${booking.personal_trip?.name}"?`
      )
    ) {
      try {
        await deleteItem("personal-tour-guide-bookings", booking.id);
        fetchBookings();
      } catch (err) {
        toast.error("Xóa thành công")
      }
    }
  };

  const columns = [
    {
      key: "personal_trip",
      title: "Chuyến đi",
      render: (b) => b.personal_trip?.name || "--",
    },
    {
      key: "tour_guide",
      title: "Hướng dẫn viên",
      render: (b) =>
        b.tour_guide
          ? `${b.tour_guide.user?.full_name || b.tour_guide.user?.username || ""}`
          : "--",
    },
    {
      key: "booking_date",
      title: "Ngày đặt",
      render: (b) => b.booking_date || "--",
    },
    {
      key: "price",
      title: "Giá",
      render: (b) =>
        b.price
          ? Number(b.price).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          : "--",
    },
    {
      key: "feedback",
      title: "Phản hồi",
      render: (b) =>
        b.feedback && b.feedback.length > 30
          ? b.feedback.slice(0, 30) + "..."
          : b.feedback || "--",
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (b) => {
        let color = "gray";
        if (b.status === "confirmed") color = "green";
        else if (b.status === "pending") color = "yellow";
        else if (b.status === "canceled") color = "red";
        return <Badge color={color}>{b.status}</Badge>;
      },
    },
    {
      key: "canceled_at",
      title: "Hủy lúc",
      render: (b) =>
        b.canceled_at
          ? new Date(b.canceled_at).toLocaleString("vi-VN")
          : "--",
    },
    {
      key: "created_at",
      title: "Ngày tạo",
      render: (b) =>
        b.created_at
          ? new Date(b.created_at).toLocaleString("vi-VN")
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
      <h1 className="text-2xl font-bold mb-4">Đặt lịch hướng dẫn viên cá nhân</h1>
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <DataTableToolbar/>
      {!loading && !error && (
        <DataTable columns={columns} data={bookings} actions={actions} />
      )}
      <ToastContainer position="top-right" autoClose={2500} ></ToastContainer>
    </div>
  );
}