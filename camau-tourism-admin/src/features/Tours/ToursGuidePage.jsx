import React, { useState, useEffect } from "react";
import { getList, updateItem, deleteItem, createItem, getPage } from "../../api/api_generics";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import {
  FaUserEdit, FaTrash, FaEye, FaCalendarAlt, FaChevronLeft, FaChevronRight,
  FaCheckCircle, FaCertificate, FaLanguage, FaPhone
} from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import DataTableToolbar from '../../components/DataTableToolbar';
export default function TourGuidePage() {
  const [tourGuide, setTourGuide] = useState({count: 0, results: []});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTourGuide, setSelectedTourGuide] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTourGuide, setEditTourGuide] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const fetchTourGuide = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getPage('tour-guides', page, pageSize);
      setTotalPages(Math.ceil(data.count / pageSize))
      setTourGuide(data);
    } catch (err) {
      toast.error("Có lỗi xảy ra khi tải danh sách")
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTourGuide();
  }, [page, pageSize]);


  const handleShowDetail = (tourGuide) => {
    setSelectedTourGuide(tourGuide);
    setDetailOpen(true);
  };

  const handleDelete = async (tourGuide) => {
    if (window.confirm(`Bạn có muốn xóa ${tourGuide.full_name}?`)) {
      await deleteItem("tour-guides", tourGuide.id);
      fetchTourGuide();
    }
  };
  const handleAdd = () => {
    setEditTourGuide(null);
    setEditModalOpen(true);
  };

  const handleExport = () => {
    alert("Chức năng xuất Excel sẽ được bổ sung!");
  };
  const handleDeleteSelected = async () => {
    if (
      window.confirm(
        `Bạn có chắc muốn xóa ${selectedRows.length} hướng dẫn viên đã chọn?`
      )
    ) {
      await Promise.all(
        selectedRows.map((id) => deleteItem("tour-guides", id))
      );
      setSelectedRows([]);
      fetchTourGuide();
    }
  };
  const filteredTourGuide = tourGuide.results.filter((item) => {
    if (!searchValue) return true;
    const value = searchValue.toLowerCase();
    return (
      item.full_name?.toLowerCase().includes(value) ||
      item.phone?.toLowerCase().includes(value) ||
      item.languages?.join(", ").toLowerCase().includes(value)
    );
  });

  const handleEdit = (tourGuide) => {
    setEditTourGuide(tourGuide);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditTourGuide(null);
    setEditModalOpen(false);
  };

  const handleEditSubmit = async (values) => {
    let payload = values;
    if (typeof payload.avatar === "string"){
      delete payload.avatar
    }
    if (values instanceof FormData) {
      if (!editTourGuide) {
        await createItem("tour-guides", payload, true);
        toast.success("Thêm thành công")
      } else {
        await updateItem("tour-guides", editTourGuide.id, payload, true);
        toast.success("Cập nhật thành công")
      }
    } else {
      if (!editTourGuide) {
        await createItem("tour-guides", payload);
        toast.success("Thêm thành công")
      } else {
        await updateItem("tour-guides", editTourGuide.id, payload);
        toast.success("Cập nhật thành công")
      }
    }
    setEditModalOpen(false);
    setEditTourGuide(null);
    fetchTourGuide();
  };
  const formColumns = [
    {
      key: "avatar",
      title: "Ảnh đại diện",
      inputType: "file",
      accept: "image/*",
      editable: true,
      required: false,
    },
    {
      key: "full_name",
      title: "Họ tên",
      inputType: "text",
      editable: true,
      required: true,
      placeholder: "Nhập họ tên",
    },
    {
      key: "gender",
      title: "Giới tính",
      inputType: "select",
      options: [
        { label: "Nam", value: "Nam" },
        { label: "Nữ", value: "Nữ" },
        { label: "Khác", value: "Khác" }
      ],
      editable: true,
      required: false,
      placeholder: "Chọn giới tính",
    },
    {
      key: "dob",
      title: "Ngày sinh",
      inputType: "date",
      editable: true,
      required: false,
      placeholder: "Chọn ngày sinh",
    },
    {
      key: "phone",
      title: "Số điện thoại",
      inputType: "text",
      editable: true,
      required: true,
      placeholder: "Nhập số điện thoại",
    },
    {
      key: "bio",
      title: "Giới thiệu bản thân",
      inputType: "textarea",
      editable: true,
      required: false,
      placeholder: "Nhập mô tả ngắn về bản thân",
    },
    {
      key: "languages",
      title: "Ngôn ngữ",
      inputType: "tags", // If your GenericForm supports tags, else use 'text' and split by comma
      editable: true,
      required: false,
      placeholder: "Ví dụ: Tiếng Anh, Tiếng Việt",
      help: "Nhập các ngôn ngữ, phân tách bằng dấu phẩy",
    },
    {
      key: "certifications",
      title: "Chứng chỉ",
      inputType: "tags", // If not supported, use 'text'
      editable: true,
      required: false,
      placeholder: "Ví dụ: Chứng chỉ A, Chứng chỉ B",
      help: "Nhập các chứng chỉ, phân tách bằng dấu phẩy",
    },
    {
      key: "is_verified",
      title: "Đã xác thực",
      inputType: "checkbox",
      editable: true,
      required: false,
      help: "Đánh dấu nếu đã xác thực",
    }
  ];
  const columns = [
    {
      key: "checkbox",
      title: (
        <input
          type="checkbox"
          checked={selectedRows.length === tourGuide.length && tourGuide.length > 0}
          onChange={e => {
            if (e.target.checked) {
              setSelectedRows(tourGuide);
            } else {
              setSelectedRows([]);
            }
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={!!selectedRows.find(item => item.id === row.id)}
          onChange={e => {
            if (e.target.checked) {
              setSelectedRows(items => [...items, row]);
            } else {
              setSelectedRows(items => items.filter(item => item.id !== row.id));
            }
          }}
        />
      ),
    },
    {
      key: "avatar",
      title: "Ảnh",
      render: (tourGuide) => (
        <img
          src={tourGuide.avatar || "/default-image.png"}
          alt={tourGuide.full_name || "avatar"}
          className="w-14 h-14 rounded-lg border object-cover"
        />
      ),
      inputType: "file",
      editable: true,
    },
    {
      key: "full_name",
      title: "Họ tên HDV",
      render: (tourGuide) => (
        <span title={tourGuide.full_name} className="font-semibold line-clamp-2">
          {tourGuide.full_name}
        </span>
      ),
      dataIndex: "full_name",
      inputType: "text",
      editable: true,
    },
    {
      key: "gender",
      title: "Giới tính",
      render: (tourGuide) =>
        tourGuide.gender
          ? <span className="text-green-700 font-medium">{tourGuide.gender}</span>
          : "--",
      dataIndex: "gender",
      inputType: "select",
      options: [
        { label: "Nam", value: "Nam" },
        { label: "Nữ", value: "Nữ" },
        { label: "Khác", value: "Khác" },
      ],
      editable: true,
    },
    {
      key: "dob",
      title: "Ngày Sinh",
      render: (tourGuide) =>
        tourGuide.dob
          ? (
            <span className="flex items-center gap-1">
              <FaCalendarAlt className="inline text-cyan-600" />
              {tourGuide.dob}
            </span>
          )
          : "--",
      dataIndex: "dob",
      inputType: "date",
      editable: true,
    },
    {
      key: "phone",
      title: "SĐT",
      render: (tourGuide) =>
        <span className="flex items-center gap-2">
          <FaPhone className="inline text-gray-600" />
          <span>{tourGuide.phone}</span>
        </span>,
      dataIndex: "phone",
      inputType: "text",
      editable: true,
    },
    {
      key: "languages",
      title: "Ngôn ngữ",
      render: (tourGuide) =>
        tourGuide.languages && tourGuide.languages.length > 0
          ? (
            <span className="flex flex-wrap items-center gap-1">
              <FaLanguage className="inline text-blue-600" />
              {tourGuide.languages.join(",")}
            </span>
          )
          : "--",
      dataIndex: "languages",
      inputType: "text",
      editable: true,
    },
    {
      key: "is_verified",
      title: "Đã xác thực",
      render: (tourGuide) =>
        tourGuide.is_verified
          ? (
            <span className="flex items-center gap-1 text-green-600 font-semibold">
              <FaCheckCircle /> Đã xác thực
            </span>
          )
          : <span className="text-gray-400">Chưa xác thực</span>,
      dataIndex: "is_verified",
      inputType: "checkbox",
      editable: true,
    }
  ];

  const actions = [
    {
      key: "view",
      title: "Xem chi tiết",
      onClick: handleShowDetail,
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
    }
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
                Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, tourGuide.count)}</span> trong tổng số <span className="font-medium">{tourGuide.count}</span> tour
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
                
                {/* Page number buttons */}
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
      <h1 className="text-2xl font-bold mb-4">Danh sách hướng dẫn viên du lịch</h1>
      <DataTableToolbar
        onAdd={handleAdd}
        onExport={handleExport}
        onDeleteSelected={handleDeleteSelected}
        selectedRows={selectedRows}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Tìm kiếm tên, SĐT, ngôn ngữ..."
      />
      {loading && 
              <div className="rounded-lg border bg-white">
                <SkeletonTable />
              </div>
      }
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <DataTable columns={columns} data={filteredTourGuide} actions={actions} />
      )}
      {tourGuide.count > 0 && <Pagination/>}
      <Modal
        open={!detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Chi tiết hướng dẫn viên du lịch"
      >
        {selectedTourGuide ? (
          <div className="space-y-2">
            <div>
              <img
                src={selectedTourGuide.avatar || "/default-avatar.png"}
                alt=""
                className="w-20 h-20 rounded-full border-2 border-cyan-400 object-cover mb-2"
              />
            </div>
            <div><b>Tên:</b> {selectedTourGuide.full_name || selectedTourGuide.username}</div>
            <div><b>Giới tính:</b> {selectedTourGuide.gender || "Chưa rõ"}</div>
            <div><b>Ngày sinh:</b> {selectedTourGuide.dob || "Chưa rõ"}</div>
            <div><b>Bio:</b> {selectedTourGuide.bio || "--"}</div>
            <div><b>SĐT:</b> {selectedTourGuide.phone || "--"}</div>
            <div><b>Đánh giá:</b> {selectedTourGuide.rating || "Chưa rõ"}</div>
            <div><b>Ngôn ngữ:</b> {selectedTourGuide.languages?.join(', ') || "Chưa rõ"}</div>
            <div><b>Chứng chỉ:</b> {selectedTourGuide.certifications?.join(', ') || "--"}</div>
            <div>
              <b>Trạng thái:</b>{" "}
              {selectedTourGuide.is_verified
                ? (
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <FaCheckCircle /> Đã xác thực
                  </span>
                )
                : <span className="text-gray-400">Chưa xác thực</span>
              }
            </div>
            <div>
              <b>Ngày tạo:</b>{" "}
              {selectedTourGuide.created_at
                ? new Date(selectedTourGuide.created_at).toLocaleDateString("vi-VN")
                : "--"}
            </div>
          </div>
        ) : null}
      </Modal>

      {editModalOpen && editTourGuide && (
        <Modal onClose={handleEditClose} title={`Chỉnh sửa: ${editTourGuide.full_name}`}>
          <GenericForm
            columns={formColumns}
            initialValues={editTourGuide }
            onSubmit={handleEditSubmit}
            onCancel={handleEditClose}
            submitText="Cập nhật"
          />
        </Modal>
      )}
      {editModalOpen && (
        <Modal onClose={handleEditClose} title={editTourGuide ? `Chỉnh sửa: ${editTourGuide.full_name}` : "Thêm hướng dẫn viên"}>
          <GenericForm
            columns={formColumns}
            initialValues={editTourGuide || {}}
            onSubmit={handleEditSubmit}
            onCancel={handleEditClose}
            submitText={editTourGuide ? "Cập nhật" : "Thêm mới"}
          />
        </Modal>
      )}
      <ToastContainer position="top-right" autoClose={2500} ></ToastContainer>
    </div>
  );
}