import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { getList, updateItem, deleteItem, createItem, getPage } from "../../api/api_generics";
import { FaUserEdit, FaChevronLeft, FaChevronRight, FaTrash, FaEye, FaRegStar, FaStar, FaMapMarkerAlt, FaRegFileAlt, FaLink } from "react-icons/fa";
import Badge from "../../components/Badge";
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import DataTableToolbar from '../../components/DataTableToolbar';
import { ToastContainer, toast } from "react-toastify";
import Tooltip from "../../components/Tooltip"
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function DestinationPage() {
  const typeOptions = [
    "Địa điểm",
    "Danh lam thắng cảnh",
    "Di tích lịch sử - văn hóa",
    "Cảnh quan kiến trúc",
    "Làng nghề truyền thống",
    "Điểm du lịch văn hóa tâm linh",
    "Địa điểm vui chơi giải trí",
    "Địa điểm mua sắm",
    "Du lịch sinh thái"
  ];
  const [destinations, setDestinations] = useState({count: 0, results: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTour, setEditTour] = useState(null);
  const [ModalOpen, setModalOpen] = useState(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]); 
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPage('destinations', page, pageSize);
      setDestinations(data);
      setTotalPages(Math.ceil(data.count / pageSize))
    } catch (err) {
      toast.error("Có lỗi khi tải danh sách địa điểm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [page, pageSize]);

  const handleView = (destination) => {
    setSelectedDestination(destination);
    setDetailModalOpen(true);
  };
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedDestination(null);
  };
  const handleAdd = () => {
    setEditModalOpen(true)
    setSelectedDestination([])
  }

  const handleEdit = (destination) => {
    setEditTour(destination);
    setEditModalOpen(true);
  };
  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditTour(null);
  };
  const handleEditSubmit = async (values) => {
    let payload = values;
    try {
      if (values.image_url instanceof File) {
        const formData = new FormData();
        formColumns.forEach(col => {
          if (values[col.key] !== undefined && values[col.key] !== null) {
            formData.append(col.key, values[col.key]);
          }
        });
        payload = formData;
        if (!editTour) {
          await createItem('destinations', payload, true)
          toast.success("Thêm thành công địa điểm")
        } else {
          await updateItem('destinations', editTour.id, payload, true)
          toast.success("Cập nhật thành công địa điểm")
        }
      } else {
        if (!editTour) {
          await createItem('destinations', payload)
          toast.success("Thêm thành công địa điểm")
        } else {
          await updateItem('destinations', editTour.id, payload)
          toast.success("Cập nhật thành công địa điểm")
        }
      }
      setDetailModalOpen(false)
      setEditModalOpen(false)
      setEditTour(null)
      fetchDestinations()
    } catch (err) {
      toast.error("Có lỗi khi thực hiện thao tác: " + (err.message || "Lỗi không xác định"));
    }
  };

  const handleDelete = async (destination) => {
    if (window.confirm(`Bạn có muốn xóa ${destination.name}?`)) {
      try {
        await deleteItem("destinations", destination.id);
        toast.success("Xóa thành công");
        fetchDestinations();
      } catch (err) {
        toast.error("Có lỗi khi xóa!");
      }
    }
  };
  const handleDeleteSelected = async () => {
    if (window.confirm(`Bạn có muốn xóa ${selectedDestination.length} địa điểm đã chọn?`)) {
      try {
        await Promise.all(selectedDestination.map((id) => deleteItem('destinations', id)))
        toast.success("Xóa thành công");
        fetchDestinations();
        setSelectedDestination([]);
      } catch (err) {
        toast.error("Có lỗi khi xóa!");
      }
    }
  };
  
  const handleToggleFeatured = async (destination) => {
    try {
      setDestinations(prev => {
        const newResults = prev.results.map(item => {
          if (item.id === destination.id) {
            return { ...item, is_featured: !item.is_featured };
          }
          return item;
        });
        return { ...prev, results: newResults };
      });
      
      await updateItem("destinations", destination.id, { 
        is_featured: !destination.is_featured 
      });
            const message = !destination.is_featured 
        ? `${destination.name} đã được đánh dấu nổi bật`
        : `${destination.name} đã bỏ đánh dấu nổi bật`;
      toast.success(message);
    } catch (err) {
      setDestinations(prev => {
        const newResults = prev.results.map(item => {
          if (item.id === destination.id) {
            return destination;
          }
          return item;
        });
        return { ...prev, results: newResults };
      });
      
      console.error("Toggle featured error:", err);
      toast.error("Có lỗi khi cập nhật trạng thái nổi bật!");
    }
  };
  
  const columns = [
    {
      key: "checkbox",
      title: (
        <input type="checkbox"
          checked={selectedRowIds.length === destinations.results.length && destinations.results.length > 0}
          onChange={e => {
            if (e.target.checked) {
              setSelectedRowIds(destinations.results.map(e => e.id))
            } else {
              setSelectedRowIds([])
            }
          }}
        >
        </input>
      ),
      render: (row) => (
        <input type="checkbox"
          checked={selectedRowIds.includes(row.id)}
          onChange={e => {
            if (e.target.checked) {
              setSelectedRowIds(prev => [...prev, row.id])
            } else {
              setSelectedRowIds(prev => prev.filter(id => id !== row.id))
            }
          }}
        >
        </input>
      )
    },
    {
      key: "image_url",
      title: "Ảnh",
      render: (destination) => (
        <img
          src={destination.image_url || "/default-image.png"}
          alt={destination.name}
          className="w-14 h-14 rounded-lg border object-cover"
        />
      ),
      inputType: "file",
      editable: true,
    },
    {
      key: "name",
      title: "Tên địa điểm",
      dataIndex: "name",
      render: (destination) => (
        <div className="flex items-center gap-1">
          <Tooltip label={destination.name}>
            <span className={destination.is_featured ? "font-medium text-cyan-700" : ""}>
              {destination.name}
            </span>
          </Tooltip>
          {destination.is_featured && (
            <span className="inline-flex ml-2 items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <FaStar className="mr-1 text-yellow-500" size={10} />
              Nổi bật
            </span>
          )}
        </div>
      ),
    },
    {
      key: "type",
      title: "Loại",
      render: (destination) => (
        <Badge color="cyan">{destination.type || "Khác"}</Badge>
      ),
    },
    {
      key: "location",
      title: "Vị trí",
      render: (destination) => (
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="inline text-cyan-600" />
          <Tooltip label={destination.location}>{destination.location}</Tooltip>
        </div>
      ),
    },
    {
      key: "phone",
      title: "Số điện thoại",
      dataIndex: "phone",
      render: (destination) => destination.phone || "--",
    },
  ];
  const formColumns = [
    {
      key: "image_url",
      title: "Ảnh",
      inputType: "file",
      editable: true,
      required: true,
    },
    {
      key: "name",
      title: "Tên địa điểm",
      inputType: "text",
      required: true,
      validation: v => v?.trim().length > 0 || "Vui lòng nhập tên địa điểm"
    },
    {
      key: "type",
      title: "Loại",
      inputType: "select",
      required: true,
      options: typeOptions.map(opt => ({ label: opt, value: opt })),
      validation: v => typeOptions.includes(v) || "Vui lòng chọn loại địa điểm"
    },
    {
      key: "location",
      title: "Vị trí",
      inputType: "text",
      required: true,
      validation: v => v?.trim().length > 0 || "Vui lòng nhập vị trí"
    },
    {
      key: "website",
      title: "Website",
      inputType: "text",
      required: false,
      validation: v => !v || /^https?:\/\/[\w\-\.]+(\.[\w\-]+)+[/#?]?.*$/.test(v) || "Website không hợp lệ"
    },
    {
      key: "phone",
      title: "Số điện thoại",
      inputType: "text",
      required: false,
      validation: v => !v || /^0\d{9,10}$/.test(v) || "Số điện thoại không hợp lệ"
    },
    {
      key: "latitude",
      title: "Vĩ độ",
      inputType: "text",
      required: false,
    },
    {
      key: "longitude",
      title: "Kinh độ",
      inputType: "text",
      required: false,
    },
    {
      key: "is_featured",
      title: "Đánh dấu nổi bật",
      inputType: "checkbox",
      required: false,
      description: "Đánh dấu địa điểm này để hiển thị nổi bật trên trang chủ"
    },
  ];
  
  const navigate = useNavigate()
  const actions = [
    {
      key: "toggle_featured",
      title: (destination) => destination.is_featured ? "Bỏ đánh dấu nổi bật" : "Đánh dấu nổi bật",
      onClick: handleToggleFeatured,
      icon: (destination) => destination.is_featured ? 
        <FaStar className="text-yellow-500" /> : 
        <FaRegStar />,
      className: (destination) => destination.is_featured ? 
        "text-yellow-500 hover:text-yellow-700" : 
        "text-gray-500 hover:text-yellow-500",
    },
    {
      key: "edit_description",
      title: "Thêm/Chỉnh sửa mô tả",
      icon: () => <FaRegFileAlt />,
      onClick: (destination) => navigate(`/destinations/detail_page/${destination.id}`),
      className: "text-green-600 hover:text-green-800",
    },
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
                Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, destinations.count)}</span> trong tổng số <span className="font-medium">{destinations.count}</span> địa điểm
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
                <option value="5">5</option>
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
      <h1 className="text-2xl font-bold mb-4">Danh sách địa điểm du lịch</h1>
      <DataTableToolbar
        onAdd={handleAdd}
        selectedRows={selectedRowIds}
        onDeleteSelected={handleDeleteSelected}
      />
      {loading &&
        <div className="rounded-lg border bg-white">
          <SkeletonTable />
        </div>
      }
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          <DataTable columns={columns} data={destinations.results} actions={actions} />
          {destinations.results.length === 0 && (
            <div className="text-center py-4 bg-white rounded-lg border mt-2">
              <p className="text-gray-500">Không có địa điểm nào</p>
            </div>
          )}
        </>
      )}
      {destinations.count > 0 && <Pagination />}
      {editModalOpen && (
        <Modal onClose={handleEditClose} title={editTour ? `Chỉnh sửa địa điểm du lịch ${editTour.name}` : 'Thêm mới địa điểm du lịch'}>
          <GenericForm
            columns={formColumns}
            initialValues={editTour || {}}
            onSubmit={handleEditSubmit}
            onCancel={handleEditClose}
            submitText={editTour ? 'Cập nhật' : 'Thêm mới'}
          />
        </Modal>
      )}

      {detailModalOpen && selectedDestination && (
        <Modal onClose={handleCloseDetailModal} title={
          <>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Chi tiết địa điểm:</span> 
              {selectedDestination.name}
              {selectedDestination.is_featured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <FaStar className="mr-1 text-yellow-500" size={10} />
                  Nổi bật
                </span>
              )}
            </div>
          </>
        }>
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={selectedDestination.image_url || "/default-image.png"}
                alt={selectedDestination.name}
                className="w-32 h-32 object-cover rounded border mb-2"
              />
              <div className="flex-1 space-y-2">
                <div>
                  <span className="font-medium">Tên: </span>{selectedDestination.name}
                </div>
                <div>
                  <span className="font-medium">Loại: </span>{selectedDestination.type || "Khác"}
                </div>
                <div>
                  <span className="font-medium">Vị trí: </span>{selectedDestination?.location}
                </div>
                <div>
                  <span className="font-medium">Mô tả: </span>{selectedDestination.description || "--"}
                </div>
              </div>
            </div>
            <div>
              <span className="font-medium">Giờ mở cửa: </span>
              {selectedDestination.open_time && selectedDestination.close_time
                ? `${selectedDestination.open_time} - ${selectedDestination.close_time}`
                : "--"}
            </div>
            <div>
              <span className="font-medium">Giá vé: </span>
              {selectedDestination.ticket_price != null
                ? Number(selectedDestination.ticket_price).toLocaleString("vi-VN") + " ₫"
                : "Miễn phí"}
            </div>
            <div>
              <span className="font-medium">Website: </span>
              {selectedDestination.website ? (
                <a
                  href={selectedDestination.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-700 hover:underline"
                >
                  {selectedDestination.website}
                </a>
              ) : "--"}
            </div>
            <div>
              <span className="font-medium">Số điện thoại: </span>
              {selectedDestination.phone || "--"}
            </div>
            <div>
              <span className="font-medium">Vĩ độ: </span>
              {selectedDestination.latitude || "--"}
              {" | "}
              <span className="font-medium">Kinh độ: </span>
              {selectedDestination.longitude || "--"}
            </div>
            
            <div className="pt-2 mt-2 border-t">
              <button 
                className={`flex items-center gap-1 px-3 py-1 rounded-md ${selectedDestination.is_featured ? 
                  'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 
                  'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => {
                  handleToggleFeatured(selectedDestination);
                  setSelectedDestination(prev => ({...prev, is_featured: !prev.is_featured}));
                }}
              >
                {selectedDestination.is_featured ? (
                  <>
                    <FaStar className="text-yellow-500" /> Bỏ đánh dấu nổi bật
                  </>
                ) : (
                  <>
                    <FaRegStar /> Đánh dấu nổi bật
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}