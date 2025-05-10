import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getList, updateItem, deleteItem, createItem, getPage } from "../../api/api_generics";
import DataTable from "../../components/DataTable";
import Modal from "../../../../camau-tourism-admin/src/components/Modal";
import GenericForm from "../../components/EditForm";

import {
  FaUserEdit,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaUsers,
  FaRegCalendarCheck,
  FaCheckCircle,
  FaRegFileAlt,
  FaInfoCircle,
  FaExclamationTriangle,
  FaPauseCircle,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import DataTableToolbar from '../../components/DataTableToolbar';
import Tooltip from '../../components/Tooltip'
import { ToastContainer, toast } from "react-toastify";
import CurrencyInput from 'react-currency-input-field';
import "react-toastify/dist/ReactToastify.css";
import { keepPreviousData, useQuery } from '@tanstack/react-query'
export default function TourPage() {
  const [tour, setTour] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [ModalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  const [destination, setDestinations] = useState([]);
  const [loadingDest, setLoadingDest] = useState(false);
  const [errorDest, setErrorDest] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTour, setEditTour] = useState(null);

  const [tourDestinations, setTourDestinations] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);

  const [tourGuide, setTourGuide] = useState([])
  const [optionTourGuide, setOptionTourGuide] = useState([])

  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  const navigate = useNavigate();


  const handleOpenModal = async (tour) => {
    setSelectedTour(tour);
    setModalOpen(true);
    setLoadingDest(true);
    setErrorDest(null);

    try {
      const allTourDest = await getList("tour-destination");
      const allDest = await getList("destinations");
      const tdOfTour = allTourDest.filter(td => td.tour === tour.id);
      const tdWithName = tdOfTour.map(td => ({
        ...td,
        destination_obj: allDest.find(d => d.id === td.destination)
      }));

      setTourDestinations(tdWithName);
      setDestinations(allDest);
    } catch (err) {
      setErrorDest(err.message || "Xảy ra lỗi");
    } finally {
      setLoadingDest(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTour(null);
    setDestinations([]);
    setErrorDest(null);
  };

  async function fetchTours() {
    try {
      setLoading(true);
      setError(false);
      const data = await getPage("tours", page, pageSize);
      setTour(data);
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTourGuide() {
    try {
      setLoading(true);
      setError(false);
      const data = await getList("tour-guides");
      setTourGuide(data);
      setOptionTourGuide(data.results.map(tourGuide => ({
        label: tourGuide.full_name,
        value: tourGuide.id
      })))
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchTourGuide();
  }, []);

  useEffect(() => {
    fetchTours();
  }, [page, pageSize]);

  useEffect(() => {
    setSelectedRows([]);
  }, [tour]);

  const handleExport = () => {
    alert("Chức năng xuất Excel đang được phát triển.");
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    setDeleteTarget({ type: "multi", data: selectedRows });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false);
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "multi") {
        await Promise.all(deleteTarget.data.map((row) => deleteItem("tours", row.id, row)));
        setSelectedRows([]);
        toast.success(`Đã xóa ${deleteTarget.data.length} tour thành công!`);
      } else if (deleteTarget.type === "single") {
        await deleteItem("tours", deleteTarget.data.id, deleteTarget.data);
        toast.success("Xóa tour thành công!");
      }
      await fetchTours();
    } catch (err) {
      toast.error("Có lỗi khi xóa tour.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleEdit = (tour) => {
    setEditTour(tour);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditTour(null);
    setEditModalOpen(false);
  };

  const handleAdd = () => {
    setEditTour(null);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (tour) => {
    let payload = { ...tour };
    let isFormData = false;
    if (typeof payload.image === "string" && payload.image.startsWith("http")) {
      delete payload.image;
    }
    if (payload.image instanceof File) {
      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        if (payload[key] == null) return;
        if (Array.isArray(payload[key])) {
          formData.append(key, JSON.stringify(payload[key]));
        } else {
          formData.append(key, payload[key]);
        }
      });
      payload = formData;
      isFormData = true;
    }
    if ('available_dates' in payload) {
      if (!payload.available_dates) {
        payload.available_dates = null;
      } else {
        payload.available_dates = payload.available_dates
      }
    }

    try {
      if (!editTour) {
        await createItem("tours", payload, isFormData);
        toast.success("Đã thêm tour mới thành công!");
      } else {

        await updateItem("tours", editTour.id, payload, isFormData);
        toast.success("Cập nhật tour thành công!");
      }
      setEditModalOpen(false);
      setEditTour(null);
      fetchTours();
    } catch (err) {
      toast.error("Có lỗi khi lưu tour.");
    }
  };

  const handleDelete = async (tour) => {
    try {
      await deleteItem("tours", tour.id, tour);
      setEditModalOpen(false);
      fetchTours();
      toast.success("Xóa tour thành công!");
    } catch (err) {
      toast.error("Có lỗi khi xóa tour.");
    }
  };

  const handleTourDestination = () => {
    navigate(`/tours-destinations/`);
  };

  const handleToggleStatus = async (tour) => {
    try {
      const newStatus = !tour.is_active;
      if (!newStatus) {
        setStatusTarget({
          id: tour.id,
          name: tour.name,
          currentStatus: tour.is_active,
          newStatus: newStatus
        });
        setStatusModalOpen(true);
      } else {
        let payload = { ...tour };
        if (typeof payload.image === "string" && payload.image.startsWith("http")) {
          delete payload.image;
        }
        await updateItem("tours", payload.id, {
          ...payload,
          is_active: newStatus,
          status_reason: null,
          status_note: null
        });
        toast.success(`Tour "${payload.name}" đã được kích hoạt thành công!`);
        fetchTours();
      }
    } catch (err) {
      toast.error("Có lỗi khi cập nhật trạng thái tour.");
    }
  };

  const handleStatusModalConfirm = async (reason, note) => {
    if (!statusTarget) return;

    try {
      await updateItem("tours", statusTarget.id, {
        is_active: statusTarget.newStatus,
        status_reason: reason,
        status_note: note || null
      });

      toast.success(`Đã chuyển tour "${statusTarget.name}" sang trạng thái tạm ngưng.`);
      setStatusModalOpen(false);
      setStatusTarget(null);
      fetchTours();
    } catch (err) {
      toast.error("Có lỗi khi cập nhật trạng thái tour.");
    }
  };

  const handleStatusModalCancel = () => {
    setStatusModalOpen(false);
    setStatusTarget(null);
  };

  const handleBatchStatus = async (newStatus) => {
    if (selectedRows.length === 0) return;

    try {
      if (!newStatus) {
        setStatusTarget({
          type: "batch",
          ids: selectedRows.map(row => row.id),
          count: selectedRows.length,
          newStatus: newStatus
        });
        setStatusModalOpen(true);
      } else {
        await Promise.all(selectedRows.map(row =>
          updateItem("tours", row.id, {
            ...row,
            is_active: newStatus,
            status_reason: null,
            status_note: null
          })
        ));
        toast.success(`Đã kích hoạt ${selectedRows.length} tour thành công!`);
        setSelectedRows([]);
        fetchTours();
      }
    } catch (err) {
      toast.error("Có lỗi khi cập nhật trạng thái tour.");
    }
  };

  const handleBatchStatusConfirm = async (reason, note) => {
    if (!statusTarget || statusTarget.type !== "batch") return;

    try {
      await Promise.all(statusTarget.ids.map(id =>
        updateItem("tours", id, {
          is_active: statusTarget.newStatus,
          status_reason: reason,
          status_note: note || null
        })
      ));

      toast.success(`Đã chuyển ${statusTarget.count} tour sang trạng thái tạm ngưng.`);
      setStatusModalOpen(false);
      setStatusTarget(null);
      setSelectedRows([]);
      fetchTours();
    } catch (err) {
      toast.error("Có lỗi khi cập nhật trạng thái tour.");
    }
  };

  const filteredTours = Array.isArray(tour?.results)
  ? tour.results.filter(item => {
      if (statusFilter === "active" && !item.is_active) return false;
      if (statusFilter === "inactive" && item.is_active) return false;
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        return item.name?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower);
      }
      return true;
    })
  : [];
  const formColumns = [
    {
      key: "image",
      title: "Ảnh tour",
      dataIndex: "image",
      inputType: "file",
    },
    {
      key: "name",
      title: "Tên tour",
      dataIndex: "name",
      inputType: "text",
    },
    {
      key: "description",
      title: "Mô tả",
      dataIndex: "description",
      inputType: "textarea",
    },
    {
      key: "price",
      title: "Giá",
      dataIndex: "price",
      inputType: "number",
      renderFormItem: (value, onChange) => (
        <CurrencyInput
          value={value ?? ""}
          decimalsLimit={0}
          groupSeparator=","
          intlConfig={{ locale: "vi-VN", currency: "VND" }}
          className="border px-2 py-1 rounded w-full"
          onValueChange={(val) => onChange(val ? parseInt(val.replace(/,/g, ""), 10) : "")}
          placeholder="Nhập giá"
        />
      ),
      render: (tour) =>
        tour.price != null && !isNaN(Number(tour.price)) ? (
          <span className="text-green-700 font-medium">
            {Number(tour.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </span>
        ) : (
          "--"
        ),
    },
    {
      key: "duration",
      title: "Thời lượng (ngày)",
      dataIndex: "duration",
      inputType: "number",
    },
    {
      key: "max_people",
      title: "Số người tối đa",
      dataIndex: "max_people",
      inputType: "number",
    },
    {
      key: "min_people",
      title: "Số người tối thiểu",
      dataIndex: "min_people",
      inputType: "number",
    },
    {
      key: "available_dates",
      title: "Ngày khởi hành",
      dataIndex: "available_dates",
      inputType: "date",
    },
    {
      key: "tour_guide",
      title: "Hướng dẫn viên",
      dataIndex: "tour_guide",
      inputType: "select",
      options: optionTourGuide
    }
  ];

  const columns = [
    {
      key: "name",
      title: "Tên tour",
      dataIndex: "name",
      render: (tour) => (
        <div className="flex items-center gap-1">
          <Tooltip label={tour.name}>{tour.name}</Tooltip>
        </div>
      ),

    },
    {
      key: "duration",
      title: "Thời lượng (ngày)",
      dataIndex: "duration",
      render: (tour) =>
        tour.duration != null ? (
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="inline text-cyan-600" />
            {tour.duration} ngày
          </span>
        ) : (
          "--"
        ),
      inputType: "number",
    },
    {
      key: "price",
      title: "Giá",
      dataIndex: "price",
      render: (tour) =>
        tour.price != null ? (
          <span className="text-green-700 font-medium">
            {Number(tour.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </span>
        ) : (
          "--"
        ),
      inputType: "number",
    },
    {
      key: "is_active",
      title: "Trạng thái",
      dataIndex: "is_active",
      render: (tour) => (
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(tour);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${tour.is_active ? "bg-green-500" : "bg-gray-300"
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tour.is_active ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </button>
          <span className={`ml-2 text-sm ${tour.is_active ? "text-green-600" : "text-gray-500"}`}>
            {tour.is_active ? "Hoạt động" : "Tạm ngưng"}
          </span>
          {!tour.is_active && tour.status_reason && (
            <Tooltip label={`Lý do: ${tour.status_reason}${tour.status_note ? ` - ${tour.status_note}` : ''}`}>
              <FaInfoCircle className="ml-1 text-gray-400" />
            </Tooltip>
          )}
        </div>
      ),
      inputType: "checkbox",
    },
  ];

  const actions = [
    {
      key: "edit_description",
      title: "Thêm/Chỉnh sửa mô tả",
      icon: () => <FaRegFileAlt />,
      onClick: (tour) => navigate(`/tours/detail_page/${tour.id}`),
      className: "text-green-600 hover:text-green-800",
    },
    {
      key: "view",
      title: "Xem chi tiết",
      onClick: handleOpenModal,
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

  const StatusReasonForm = ({ onConfirm, onCancel, isBatch = false }) => {
    const [reason, setReason] = useState("");
    const [note, setNote] = useState("");

    return (
      <div className="py-4">
        <p className="mb-4">
          {isBatch
            ? `Bạn đang chuyển ${statusTarget?.count} tour sang trạng thái tạm ngưng.`
            : `Bạn đang chuyển tour "${statusTarget?.name}" sang trạng thái tạm ngưng.`}
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Lý do tạm ngưng:</label>
          <select
            className="w-full p-2 border rounded"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">-- Chọn lý do --</option>
            <option value="seasonal">Hết mùa du lịch</option>
            <option value="maintenance">Bảo trì cơ sở vật chất</option>
            <option value="safety">Vấn đề an toàn</option>
            <option value="unavailable">Địa điểm không khả dụng</option>
            <option value="other">Lý do khác</option>
          </select>
        </div>

        {reason === "other" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú:</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="2"
              placeholder="Nhập lý do cụ thể..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}

        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
          <div className="flex">
            <div className="flex-shrink-0 text-blue-500">
              <FaInfoCircle className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Tour ở trạng thái tạm ngưng sẽ không xuất hiện trên các nền tảng đặt tour.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(reason, reason === "other" ? note : null)}
            disabled={!reason}
            className={`px-4 py-2 rounded font-medium ${!reason ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    );
  };

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
              Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, tour.count)}</span> trong tổng số <span className="font-medium">{tour.count}</span> tour
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
      <h1 className="text-2xl font-bold mb-4">Danh sách tour du lịch</h1>
      <DataTableToolbar
        onAdd={handleTourDestination}
        onTourDestination={handleTourDestination}
        onExport={handleExport}
        onDeleteSelected={handleDeleteSelected}
        selectedRows={selectedRows}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {selectedRows.length > 0 && (
        <div className="mb-4 p-3 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Đã chọn {selectedRows.length} tour</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBatchStatus(true)}
                className="flex items-center px-3 py-1.5 text-sm bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100"
              >
                <FaCheckCircle className="mr-1" />
                Kích hoạt tất cả
              </button>
              <button
                onClick={() => handleBatchStatus(false)}
                className="flex items-center px-3 py-1.5 text-sm bg-gray-50 text-gray-700 border border-gray-200 rounded hover:bg-gray-100"
              >
                <FaPauseCircle className="mr-1" />
                Tạm dừng tất cả
              </button>
            </div>
          </div>
        </div>
      )}

      {loading &&
        <div className="rounded-lg border bg-white">
          <SkeletonTable />
        </div>
      }

      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          <DataTable columns={columns} data={filteredTours} actions={actions} />

          {filteredTours.length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg border mt-4">
              <p className="text-gray-500">Không tìm thấy tour nào phù hợp với điều kiện tìm kiếm</p>
            </div>
          )}
          
          {/* Pagination component */}
          {tour.count > 0 && <Pagination />}
        </>
      )}

      {ModalOpen && (
        <Modal onClose={handleCloseModal} title={
          <>
            <span className="font-semibold">Chi tiết tour:</span> {selectedTour?.name}
          </>
        }>
          {selectedTour && (
            <div className="mb-4 space-y-1 text-sm">
              <div>
                <span className="font-medium">Mô tả: </span>{selectedTour.description}
              </div>
              <div className="flex flex-wrap gap-2">
                <span><FaUsers className="inline" /> Tối đa: {selectedTour.max_people}</span>
                <span><FaUsers className="inline" /> Tối thiểu: {selectedTour.min_people}</span>
                <span><FaRegCalendarCheck className="inline" /> Số ngày: {selectedTour.duration}</span>
                <span>
                  {selectedTour.is_active ? (
                    <span className="text-green-600"><FaCheckCircle className="inline" /> Hoạt động</span>
                  ) : (
                    <span className="text-gray-500"><FaPauseCircle className="inline" /> Tạm ngưng</span>
                  )}
                </span>
              </div>

              {!selectedTour.is_active && selectedTour.status_reason && (
                <div className="bg-gray-50 p-2 rounded border mt-2">
                  <span className="font-medium">Lý do tạm ngưng: </span>
                  <span className="text-gray-700">
                    {selectedTour.status_reason === "seasonal" && "Hết mùa du lịch"}
                    {selectedTour.status_reason === "maintenance" && "Bảo trì cơ sở vật chất"}
                    {selectedTour.status_reason === "safety" && "Vấn đề an toàn"}
                    {selectedTour.status_reason === "unavailable" && "Địa điểm không khả dụng"}
                    {selectedTour.status_reason === "other" && "Lý do khác"}
                    {selectedTour.status_reason !== "other" || !selectedTour.status_note ? "" : ` - ${selectedTour.status_note}`}
                  </span>
                </div>
              )}

              <div>
                <span className="font-medium">Giá: </span>
                <span className="text-green-700 font-semibold">{Number(selectedTour.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
              </div>
              <div>
                <span className="font-medium">Ngày khởi hành: </span>
                {Array.isArray(selectedTour.available_dates) && selectedTour.available_dates.length > 0
                  ? selectedTour.available_dates.join(", ")
                  : "--"}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Lịch trình các địa điểm</h3>
            {loadingDest && <div>Đang tải địa điểm...</div>}
            {errorDest && <div className="text-red-500">{errorDest}</div>}
            {!loadingDest && !errorDest && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg bg-white">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3 text-left">Ngày</th>
                      <th className="py-2 px-3 text-left">Tên địa điểm</th>
                      <th className="py-2 px-3 text-left">Vị trí</th>
                      <th className="py-2 px-3 text-left">Ảnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourDestinations.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-3 text-center text-gray-500">
                          Chưa có địa điểm nào cho tour này.
                        </td>
                      </tr>
                    ) : (
                      tourDestinations
                        .sort((a, b) => a.day_number - b.day_number)
                        .map((td, idx) => (
                          <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="py-2 px-3 text-center font-semibold">{td.day_number}</td>
                            <td className="py-2 px-3 font-medium">
                              {td.destination_obj?.name || "Không tìm thấy"}
                            </td>
                            <td className="py-2 px-3">{td.destination_obj?.location || "--"}</td>
                            <td className="py-2 px-3">
                              <img
                                src={td.destination_obj?.image || "/default-image.png"}
                                alt={td.destination_obj?.name}
                                className="w-12 h-12 object-cover rounded border"
                              />
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal>
      )}

      {editModalOpen && (
        <Modal onClose={handleEditClose} title={editTour ? `Chỉnh sửa tour: ${editTour?.name}` : "Thêm mới tour"}>
          <GenericForm
            columns={formColumns}
            initialValues={editTour || {}}
            onSubmit={handleEditSubmit}
            onCancel={handleEditClose}
            submitText={editTour ? "Cập nhật" : "Thêm mới"}
          />

          {editTour && (
            <div className="bg-gray-50 p-4 rounded-lg mt-6 border">
              <h3 className="font-medium text-gray-800 mb-3">Quản lý trạng thái tour</h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Trạng thái hiện tại:</p>
                  <p className={`font-medium text-lg ${editTour?.is_active ? "text-green-600" : "text-gray-500"}`}>
                    {editTour?.is_active ? "Tour đang hoạt động" : "Tour tạm ngưng"}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <label className="relative inline-flex items-center cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={editTour?.is_active || false}
                      onChange={() => {
                        setEditTour(prev => ({ ...prev, is_active: !prev.is_active }));
                      }}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                  <span className="text-xs text-gray-500">Chuyển đổi trạng thái</span>
                </div>
              </div>

              <div className="mt-4 bg-white p-3 rounded-md border text-sm">
                <div className="flex items-start mb-2">
                  <div className="mr-2 text-blue-500"><FaInfoCircle size={16} /></div>
                  <p>Tour đang hoạt động sẽ hiển thị trên ứng dụng và website cho khách hàng đặt.</p>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 text-yellow-500"><FaExclamationTriangle size={16} /></div>
                  <p>Tour tạm ngưng sẽ không xuất hiện trên các nền tảng đặt tour.</p>
                </div>
              </div>

              {editTour?.is_active === false && (
                <div className="mt-3 border-t pt-3">
                  <p className="text-sm mb-2">Lý do tạm ngưng:</p>
                  <select
                    className="w-full p-2 border rounded"
                    value={editTour?.status_reason || ""}
                    onChange={(e) => {
                      setEditTour(prev => ({ ...prev, status_reason: e.target.value }));
                    }}
                  >
                    <option value="">-- Chọn lý do --</option>
                    <option value="seasonal">Hết mùa du lịch</option>
                    <option value="maintenance">Bảo trì cơ sở vật chất</option>
                    <option value="safety">Vấn đề an toàn</option>
                    <option value="unavailable">Địa điểm không khả dụng</option>
                    <option value="other">Lý do khác</option>
                  </select>

                  {editTour?.status_reason === "other" && (
                    <textarea
                      className="w-full p-2 border rounded mt-2"
                      rows="2"
                      placeholder="Nhập lý do cụ thể..."
                      value={editTour?.status_note || ""}
                      onChange={(e) => {
                        setEditTour(prev => ({ ...prev, status_note: e.target.value }));
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </Modal>
      )}

      {deleteConfirmOpen && (
        <Modal
          onClose={handleCancelDelete}
          title="Xác nhận xóa"
        >
          <div className="py-4">
            {deleteTarget?.type === "multi" ? (
              <p>Bạn chắc chắn muốn xóa <span className="font-bold text-red-600">{deleteTarget.data.length}</span> tour đã chọn?</p>
            ) : (
              <p>Bạn chắc chắn muốn xóa tour <span className="font-bold text-red-600">{deleteTarget.data?.name}</span>?</p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={handleCancelDelete}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
                onClick={handleConfirmDelete}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </Modal>
      )}

      {statusModalOpen && (
        <Modal
          onClose={handleStatusModalCancel}
          title="Thay đổi trạng thái tour"
        >
          {statusTarget?.type === "batch" ? (
            <StatusReasonForm
              onConfirm={handleBatchStatusConfirm}
              onCancel={handleStatusModalCancel}
              isBatch={true}
            />
          ) : (
            <StatusReasonForm
              onConfirm={handleStatusModalConfirm}
              onCancel={handleStatusModalCancel}
              isBatch={false}
            />
          )}
        </Modal>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}