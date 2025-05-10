import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import Badge from "../../components/Badge";
import { getList, deleteItem } from "../../api/api_generics";
import { FaTrash } from "react-icons/fa";
import DataTableToolbar from '../../components/DataTableToolbar';
export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        setError("");
        const data = await getList("reviews");
        setReviews(data);
      } catch (err) {
        setError(err?.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const handleDelete = async (review) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await deleteItem("reviews", review.id);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const columns = [
    {
      key: "client_avatar",
      title: "Avatar",
      render: (review) => (
        <img
          src={review.client?.avatar || "/default-avatar.png"}
          alt=""
          className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover"
        />
      ),
    },
    {
      key: "client_name",
      title: "Khách hàng",
      render: (review) =>
        review.client?.user?.full_name ||
        review.client?.user?.username ||
        "--",
      className: "font-medium",
    },
    {
      key: "tour",
      title: "Tour",
      render: (review) => review.tour?.name || "--",
    },
    {
      key: "rating",
      title: "Đánh giá",
      render: (review) => (
        <span className="font-bold text-yellow-600">{review.rating} ★</span>
      ),
    },
    {
      key: "comment",
      title: "Nhận xét",
      render: (review) => (
        <div className="max-w-xs truncate" title={review.comment}>
          {review.comment}
        </div>
      ),
    },
    // {
    //   key: "images",
    //   title: "Ảnh",
    //   render: (review) =>
    //     review.image_urls && review.image_urls.length > 0 ? (
    //       <div className="flex gap-1">
    //         {review.image_urls.slice(0, 3).map((url, idx) => (
    //           <img
    //             key={idx}
    //             src={url}
    //             alt="Review img"
    //             className="w-8 h-8 rounded object-cover border"
    //           />
    //         ))}
    //         {review.image_urls.length > 3 && (
    //           <span className="text-xs text-gray-500 ml-1">
    //             +{review.image_urls.length - 3}
    //           </span>
    //         )}
    //       </div>
    //     ) : (
    //       <span className="text-gray-400">Không có</span>
    //     ),
    // },
    {
      key: "reply",
      title: "Phản hồi",
      render: (review) => (
        <div className="max-w-xs truncate" title={review.reply}>
          {review.reply || <span className="text-gray-400">--</span>}
        </div>
      ),
    }
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
      <h1 className="text-2xl font-bold mb-4">Danh sách đánh giá tour</h1>
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
      <DataTableToolbar />
      {!loading && !error && (
        <DataTable columns={columns} data={reviews} actions={actions} />
      )}
    </div>
  );
}