import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { fetchAllPages } from '../../utils/fetchAllPages';
import { createItem, deleteItem, getList, getPage, updateItem } from "../../api/api_generics";
import { FaEdit, FaChevronLeft, FaChevronRight, FaTrash, FaEye, FaUtensils, FaGlobe, FaLock } from "react-icons/fa";
import { BiImageAdd, BiSortAlt2 } from "react-icons/bi";
import DataTableToolbar from '../../components/DataTableToolbar';
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function CuisinePage() {
  const [cuisines, setCuisines] = useState({count: 0, results: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  const [selectedCuisines, setSelectedCuisines] = useState([]);
  
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterPublic, setFilterPublic] = useState('all');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  async function fetchCuisines() {
    try {
      setLoading(true);
      setError(null);
      const params = {
        ordering: sortDirection === 'asc' ? sortField : `-${sortField}`,
      };
      
      if (filterPublic !== 'all') {
        params.is_public = filterPublic === 'public';
      }
      
      const data = await getPage('cuisines', page, pageSize, params);
      setCuisines(data);
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (err) {
      toast.error("Có lỗi khi tải dữ liệu ẩm thực");
      setError("Có lỗi khi tải dữ liệu ẩm thực");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCuisines();
  }, [page, pageSize, sortField, sortDirection, filterPublic]);

  const handleView = (cuisine) => {
    setSelectedCuisine(cuisine);
    setViewModalOpen(true);
  };
  
  const handleAdd = () => {
    navigate("/cuisines-create");
  };
  
  const handleEdit = (cuisine) => {
    navigate(`/cuisines-edit/${cuisine.id}`);
  };

  const handleGallery = (cuisine) => {
    setSelectedCuisine(cuisine);
    setGalleryModalOpen(true);
  };
  
  const handleCloseViewModal = () => {
    setSelectedCuisine(null);
    setViewModalOpen(false);
  };
  
  const handleCloseGalleryModal = () => {
    setSelectedCuisine(null);
    setGalleryModalOpen(false);
  };

  const handleDelete = async (cuisine) => {
    if (window.confirm(`Bạn chắc chắn muốn xóa ẩm thực: ${cuisine.name}?`)) {
      try {
        await deleteItem('cuisines', cuisine.id);
        toast.success("Xóa thành công!");
        fetchCuisines();
      } catch (err) {
        toast.error("Xóa thất bại!");
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCuisines.length === 0) return;
    if (window.confirm(`Bạn chắc chắn muốn xóa ${selectedCuisines.length} ẩm thực đã chọn?`)) {
      try {
        await Promise.all(selectedCuisines.map((id) => deleteItem("cuisines", id)));
        setSelectedCuisines([]);
        await fetchCuisines();
        toast.success("Xóa thành công");
      } catch (err) {
        toast.error("Xóa thất bại!");
      }
    }
  };

  const handleTogglePublic = async (cuisine) => {
    try {
      await updateItem('cuisines', cuisine.id, { is_public: !cuisine.is_public });
      toast.success(`Đã ${!cuisine.is_public ? 'công khai' : 'ẩn'} ẩm thực thành công`);
      fetchCuisines();
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSaveGallery = async (images) => {
    try {
      await updateItem('cuisines', selectedCuisine.id, { gallery: images });
      toast.success("Cập nhật thư viện ảnh thành công");
      fetchCuisines();
      setGalleryModalOpen(false);
    } catch (err) {
      toast.error("Cập nhật thư viện ảnh thất bại!");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formColumns = [
    { key: "name", title: "Tên ẩm thực", inputType: "text", editable: true, required: true },
    { key: "description", title: "Mô tả", inputType: "rich-text", editable: true },
    { key: "image", title: "Ảnh đại diện", inputType: "image", editable: true },
    { key: "is_public", title: "Công khai", inputType: "checkbox", editable: true },
    { key: "slug", title: "Đường dẫn", inputType: "text", editable: true, hint: "Để trống sẽ tự động tạo từ tên" },
  ];

  const columns = [
    {
      key: "checkbox",
      title: (
        <input
          type="checkbox"
          checked={selectedCuisines.length === cuisines.results.length && cuisines.results.length > 0}
          onChange={e => {
            if (e.target.checked) {
              setSelectedCuisines(cuisines.results.map(c => c.id));
            } else {
              setSelectedCuisines([]);
            }
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedCuisines.includes(row.id)}
          onChange={e => {
            if (e.target.checked) {
              setSelectedCuisines(prev => [...prev, row.id]);
            } else {
              setSelectedCuisines(prev => prev.filter(id => id !== row.id));
            }
          }}
        />
      ),
      width: "50px",
    },
    {
      key: "image",
      title: "Ảnh",
      render: (cuisine) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {cuisine.image ? (
            <img
              src={cuisine.image}
              alt={cuisine.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUtensils className="text-gray-300 text-xl" />
          )}
        </div>
      ),
      width: "80px",
    },
    {
      key: "name",
      title: (
        <div 
          className="flex items-center cursor-pointer hover:text-blue-600"
          onClick={() => handleSort('name')}
        >
          Tên ẩm thực
          {sortField === 'name' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      render: (cuisine) => (
        <div>
          <div className="font-medium text-gray-800">{cuisine.name}</div>
          {cuisine.slug && (
            <div className="text-xs text-gray-500">/{cuisine.slug}</div>
          )}
        </div>
      ),
    },
    {
      key: "is_public",
      title: (
        <div 
          className="flex items-center cursor-pointer hover:text-blue-600"
          onClick={() => handleSort('is_public')}
        >
          Trạng thái
          {sortField === 'is_public' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      render: (cuisine) => (
        <div onClick={() => handleTogglePublic(cuisine)} className="cursor-pointer">
          {cuisine.is_public ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <FaGlobe className="mr-1" /> Công khai
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <FaLock className="mr-1" /> Ẩn
            </span>
          )}
        </div>
      ),
      width: "120px",
    },
    {
      key: "gallery",
      title: "Thư viện",
      render: (cuisine) => {
        const galleryCount = cuisine.gallery ? cuisine.gallery.length : 0;
        return (
          <button
            onClick={() => handleGallery(cuisine)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
          >
            <BiImageAdd className="mr-1" />
            {galleryCount} ảnh
          </button>
        );
      },
      width: "100px",
    },
    {
      key: "created_at",
      title: (
        <div 
          className="flex items-center cursor-pointer hover:text-blue-600"
          onClick={() => handleSort('created_at')}
        >
          Ngày tạo
          {sortField === 'created_at' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      render: (cuisine) => (
        <span className="text-sm text-gray-500">
          {formatDate(cuisine.created_at)}
        </span>
      ),
      width: "120px",
    },
  ];

  const actions = [
    {
      key: "view",
      title: "Xem chi tiết",
      onClick: handleView,
      icon: () => <FaEye />,
      className: "text-blue-600 hover:text-blue-800",
    },
    {
      key: "edit",
      title: "Chỉnh sửa",
      onClick: handleEdit,
      icon: () => <FaEdit />,
      className: "text-yellow-600 hover:text-yellow-800",
    },
    {
      key: "toggle",
      title: "Đổi trạng thái",
      onClick: handleTogglePublic,
      icon: (cuisine) => cuisine.is_public ? <FaLock /> : <FaGlobe />,
      className: "text-purple-600 hover:text-purple-800",
    },
    {
      key: "delete",
      title: "Xóa",
      onClick: handleDelete,
      icon: () => <FaTrash />,
      className: "text-red-600 hover:text-red-800",
    },
  ];

  const SkeletonTable = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
      <div className="p-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center py-3 space-x-4 animate-pulse">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
            <div className="w-24 h-5 bg-gray-200 rounded"></div>
            <div className="w-24 h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const Pagination = () => {
    const handlePageSizeChange = (e) => {
      const newSize = parseInt(e.target.value, 10);
      setPageSize(newSize);
      setPage(1);
    };

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow">
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
              Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, cuisines.count)}</span> trong tổng số <span className="font-medium">{cuisines.count}</span>
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
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${page === pageNumber ? 'bg-indigo-600 text-white' : 'text-gray-900 hover:bg-gray-50'}`}
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

  const GalleryManager = ({ images = [], onSave }) => {
    const [gallery, setGallery] = useState(images || []);
    const [newImage, setNewImage] = useState(null);
    
    const handleAddImage = () => {
      if (newImage) {
        setGallery([...gallery, newImage]);
        setNewImage(null);
      }
    };
    
    const handleRemoveImage = (index) => {
      const newGallery = [...gallery];
      newGallery.splice(index, 1);
      setGallery(newGallery);
    };
    
    const handleReorder = (index, direction) => {
      if ((direction === 'up' && index > 0) || (direction === 'down' && index < gallery.length - 1)) {
        const newGallery = [...gallery];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newGallery[index], newGallery[newIndex]] = [newGallery[newIndex], newGallery[index]];
        setGallery(newGallery);
      }
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-end gap-3 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Thêm ảnh mới</label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setNewImage(event.target.result);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
          <button
            onClick={handleAddImage}
            disabled={!newImage}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              newImage 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Thêm ảnh
          </button>
        </div>
        
        {newImage && (
          <div className="mt-2 p-2 border rounded-md bg-indigo-50">
            <img src={newImage} alt="Preview" className="h-32 object-contain mx-auto" />
          </div>
        )}
        
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium mb-3 flex items-center text-gray-700">
            <BiImageAdd className="mr-2" /> Thư viện ảnh ({gallery.length})
          </h3>
          
          {gallery.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Chưa có ảnh nào trong thư viện
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((image, index) => (
                <div key={index} className="group relative border rounded-lg overflow-hidden bg-white">
                  <img src={image} alt={`Gallery ${index}`} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleReorder(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded-full bg-white ${index === 0 ? 'text-gray-400' : 'text-blue-700'}`}
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="p-1 rounded-full bg-white text-red-700"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleReorder(index, 'down')}
                        disabled={index === gallery.length - 1}
                        className={`p-1 rounded-full bg-white ${index === gallery.length - 1 ? 'text-gray-400' : 'text-blue-700'}`}
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                    Ảnh {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => onSave(gallery)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Lưu thư viện ảnh
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaUtensils className="mr-2 text-indigo-600" /> Quản lý ẩm thực
          </h1>
          <p className="text-gray-600 mt-1">Quản lý và tùy chỉnh danh mục ẩm thực của bạn</p>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-white rounded-lg shadow-sm flex overflow-hidden">
            <button 
              className={`px-4 py-2 text-sm font-medium ${filterPublic === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setFilterPublic('all')}
            >
              Tất cả
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium flex items-center ${filterPublic === 'public' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setFilterPublic('public')}
            >
              <FaGlobe className="mr-1" /> Công khai
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium flex items-center ${filterPublic === 'private' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setFilterPublic('private')}
            >
              <FaLock className="mr-1" /> Ẩn
            </button>
          </div>
          
          <button
            onClick={() => handleSort(sortField)}
            className="flex items-center px-3 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <BiSortAlt2 className="mr-1" />
            {sortDirection === 'asc' ? 'Sắp xếp tăng dần' : 'Sắp xếp giảm dần'}
          </button>
        </div>
      </div>

      <DataTableToolbar
        onAdd={handleAdd}
        onDeleteSelected={handleDeleteSelected}
        selectedRows={selectedCuisines}
        addText="Thêm ẩm thực mới"
        className="shadow-sm"
      />

      {loading ? (
        <SkeletonTable />
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-700 shadow-sm">
          <div className="font-bold">Đã xảy ra lỗi</div>
          <div>{error}</div>
        </div>
      ) : (
        <>
          {cuisines.results.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center">
                <FaUtensils className="text-gray-400 text-5xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có ẩm thực nào</h3>
              <p className="text-gray-500 mb-4">
                {filterPublic === 'public' 
                  ? 'Chưa có ẩm thực công khai nào được tạo.'
                  : filterPublic === 'private' 
                    ? 'Chưa có ẩm thực ẩn nào được tạo.'
                    : 'Chưa có ẩm thực nào được tạo. Bắt đầu bằng cách thêm ẩm thực mới.'}
              </p>
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Thêm ẩm thực mới
              </button>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <DataTable 
                columns={columns} 
                data={cuisines.results} 
                actions={actions} 
                className="border-collapse"
                rowClassName={(row, index) => 
                  `${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`
                }
              />
            </div>
          )}
        </>
      )}
      
      {cuisines.count > 0 && <Pagination />}

      {viewModalOpen && selectedCuisine && (
        <Modal 
          onClose={handleCloseViewModal} 
          title={
            <div className="flex items-center">
              <FaUtensils className="mr-2 text-indigo-600" />
              <span className="font-semibold">{selectedCuisine.name}</span>
            </div>
          }
          size="lg"
        >
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex justify-between items-center">
              <div className="flex items-center">
                {selectedCuisine.is_public ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                    <FaGlobe className="mr-1" /> Công khai
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                    <FaLock className="mr-1" /> Ẩn
                  </span>
                )}
                
                {selectedCuisine.slug && (
                  <span className="text-sm text-indigo-700">
                    /{selectedCuisine.slug}
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                Cập nhật: {formatDate(selectedCuisine.updated_at)}
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-1/3">
                <div className="rounded-lg overflow-hidden border shadow-sm bg-white">
                  {selectedCuisine.image ? (
                    <img
                      src={selectedCuisine.image}
                      alt={selectedCuisine.name}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                      <FaUtensils className="text-gray-300 text-4xl" />
                    </div>
                  )}
                </div>
                
                {selectedCuisine.gallery && selectedCuisine.gallery.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Thư viện ảnh</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedCuisine.gallery.slice(0, 6).map((img, idx) => (
                        <div key={idx} className="relative rounded-md overflow-hidden border bg-white h-20">
                          <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          {idx === 5 && selectedCuisine.gallery.length > 6 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-medium">
                              +{selectedCuisine.gallery.length - 6}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="w-2/3">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedCuisine.description || '<p class="text-gray-500 italic">Chưa có mô tả</p>' }} />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  handleCloseViewModal();
                  handleEdit(selectedCuisine);
                }}
                className="inline-flex items-center px-3 py-2 border border-yellow-300 text-sm font-medium rounded text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
              >
                <FaEdit className="mr-1" /> Chỉnh sửa
              </button>
              
              <button
                onClick={() => {
                  handleCloseViewModal();
                  handleGallery(selectedCuisine);
                }}
                className="inline-flex items-center px-3 py-2 border border-purple-300 text-sm font-medium rounded text-purple-700 bg-purple-50 hover:bg-purple-100"
              >
                <BiImageAdd className="mr-1" /> Quản lý thư viện ảnh
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {galleryModalOpen && selectedCuisine && (
        <Modal 
          onClose={handleCloseGalleryModal} 
          title={
            <div className="flex items-center">
              <BiImageAdd className="mr-2 text-purple-600" />
              <span className="font-semibold">Thư viện ảnh: {selectedCuisine.name}</span>
            </div>
          }
          size="lg"
        >
          <GalleryManager
            images={selectedCuisine.gallery || []}
            onSave={handleSaveGallery}
          />
        </Modal>
      )}
    </div>
  );
}