import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { fetchAllPages } from '../../utils/fetchAllPages';
import { createItem, deleteItem, getList, getPage, updateItem } from "../../api/api_generics";
import { FaEdit, FaChevronLeft, FaChevronRight, FaTrash, FaEye, FaCalendarAlt, FaNewspaper, FaRegCalendarCheck } from "react-icons/fa";
import Badge from "../../components/Badge";
import DataTableToolbar from '../../components/DataTableToolbar';
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function EventNewPage() {
  const [articles, setArticles] = useState({count: 0, results: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editArticle, setEditArticle] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [selectedArticles, setSelectedArticles] = useState([]);
  
  const [filterType, setFilterType] = useState('all');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  async function fetchArticles() {
    try {
      setLoading(true);
      setError(null);
      const data = await getPage('articles', page, pageSize);
      
      let filteredResults = data.results;
      if (filterType !== 'all') {
        filteredResults = data.results.filter(article => article.type === filterType);
      }
      
      setArticles({...data, results: filteredResults});
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (err) {
      toast.error("Có lỗi khi tải dữ liệu bài viết");
      setError("Có lỗi khi tải dữ liệu bài viết");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArticles();
  }, [page, pageSize, filterType]);

  const handleView = (article) => {
    setSelectedArticle(article);
    setViewModalOpen(true);
  };
  
  const handleAdd = () => {
    navigate("/articles-create");
  };
  
  const handleEdit = (article) => {
    navigate(`/articles-edit/${article.id}`)
  };
  
  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditArticle(null);
  };
  
  const handleCloseViewModal = () => {
    setSelectedArticle(null);
    setViewModalOpen(false);
  };

  const handleEditSubmit = async (article) => {
    let payload = article;
    if (typeof payload.cover_image_url === "string"){
        delete payload.cover_image_url;
    }

    try {
      if (article instanceof FormData) {
        if (editArticle) {
          await updateItem('articles', editArticle.id, payload, true);
          toast.success('Cập nhật thành công');
        } else {
          await createItem('articles', payload, true);
          toast.success('Thêm thành công');
        }
      } else {
        if (editArticle) {
          await updateItem('articles', editArticle.id, payload);
          toast.success('Cập nhật thành công');
        } else {
          await createItem('articles', payload);
          toast.success('Thêm thành công');
        }
      }
      setEditModalOpen(false);
      setEditArticle(null);
      fetchArticles();
    } catch (err) {
      toast.error(editArticle ? "Cập nhật thất bại" : "Thêm mới thất bại");
    }
  };

  const handleDelete = async (article) => {
    try {
      await deleteItem('articles', article.id);
      toast.success("Xóa thành công!");
      fetchArticles();
    } catch (err) {
      toast.error("Xóa thất bại!");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedArticles.length === 0) return;
    if (window.confirm(`Bạn chắc chắn muốn xóa ${selectedArticles.length} bài viết?`)) {
      try {
        await Promise.all(selectedArticles.map((id) => deleteItem("articles", id)));
        setSelectedArticles([]);
        await fetchArticles();
        toast.success("Xóa thành công");
      } catch (err) {
        toast.error("Xóa thất bại!");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formColumns = [
    { 
      key: "type", 
      title: "Loại bài viết", 
      inputType: "select",
      options: [
        { value: "news", label: "Tin tức" },
        { value: "event", label: "Sự kiện" }
      ],
      editable: true 
    },
    { key: "title", title: "Tiêu đề", inputType: "text", editable: true },
    { key: "cover_image_url", title: "Ảnh bìa", inputType: "file", editable: true },
    { 
      key: "event_date", 
      title: "Thời gian sự kiện", 
      inputType: "datetime-local", 
      editable: true,
      dependsOn: { field: "type", value: "event" }
    },
    { key: "slug", title: "Đường dẫn", inputType: "text", editable: true },
  ];

  const columns = [
    {
      key: "checkbox",
      title: (
        <input
          type="checkbox"
          checked={selectedArticles.length === articles.results.length && articles.results.length > 0}
          onChange={e => {
            if (e.target.checked) {
              setSelectedArticles(articles.results.map(a => a.id));
            } else {
              setSelectedArticles([]);
            }
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedArticles.includes(row.id)}
          onChange={e => {
            if (e.target.checked) {
              setSelectedArticles(prev => [...prev, row.id]);
            } else {
              setSelectedArticles(prev => prev.filter(id => id !== row.id));
            }
          }}
        />
      ),
    },
    {
      key: "cover_image_url",
      title: "Ảnh bìa",
      render: (article) => (
        <img
          src={article.cover_image_url || "/default-image.png"}
          alt={article.title}
          className="w-20 h-14 rounded-md border object-cover"
        />
      ),
    },
    {
      key: "type",
      title: "Loại",
      render: (article) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          article.type === 'event' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {article.type === 'event' ? (
            <><FaCalendarAlt className="mr-1" /> Sự kiện</>
          ) : (
            <><FaNewspaper className="mr-1" /> Tin tức</>
          )}
        </span>
      ),
    },
    {
      key: "title",
      title: "Tiêu đề",
      render: (article) => (
        <div className="font-medium text-gray-800">{article.title}</div>
      ),
    },
    {
      key: "event_date",
      title: "Thời gian",
      render: (article) => (
        <div>
          {article.type === 'event' && article.event_date ? (
            <div className="flex items-center text-sm text-purple-700">
              <FaRegCalendarCheck className="mr-1" />
              {formatDate(article.event_date)}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {formatDate(article.created_at)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "created_at",
      title: "Đăng lúc",
      render: (article) => (
        <span className="text-sm text-gray-500">
          {formatDate(article.created_at)}
        </span>
      ),
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
          </tr>
        ))}
      </tbody>
    </table>
  );

  const Pagination = () => {
    const handlePageSizeChange = (e) => {
      const newSize = parseInt(e.target.value, 10);
      setPageSize(newSize);
      setPage(1);
    };

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
              Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, articles.count)}</span> trong tổng số <span className="font-medium">{articles.count}</span>
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
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tin tức & sự kiện</h1>
        <div className="bg-white rounded-lg shadow-sm flex overflow-hidden">
          <button 
            className={`px-4 py-2 text-sm font-medium ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setFilterType('all')}
          >
            Tất cả
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium flex items-center ${filterType === 'news' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setFilterType('news')}
          >
            <FaNewspaper className="mr-1" /> Tin tức
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium flex items-center ${filterType === 'event' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setFilterType('event')}
          >
            <FaCalendarAlt className="mr-1" /> Sự kiện
          </button>
        </div>
      </div>

      <DataTableToolbar
        onAdd={handleAdd}
        onDeleteSelected={handleDeleteSelected}
        selectedRows={selectedArticles}
      />

      {loading && 
        <div className=" bg-white">
          <SkeletonTable />
        </div>
      }
      
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          {articles.results.length === 0 ? (
            <div className="bg-white p-8 text-center">
              <div className="mb-4 flex justify-center">
                {filterType === 'news' ? (
                  <FaNewspaper className="text-gray-400 text-5xl" />
                ) : filterType === 'event' ? (
                  <FaCalendarAlt className="text-gray-400 text-5xl" />
                ) : (
                  <div className="flex items-center gap-3">
                    <FaNewspaper className="text-gray-400 text-4xl" />
                    <FaCalendarAlt className="text-gray-400 text-4xl" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có bài viết nào</h3>
              <p className="text-gray-500 mb-4">
                {filterType === 'news' 
                  ? 'Chưa có tin tức nào được tạo. Bắt đầu bằng cách thêm tin tức mới.' 
                  : filterType === 'event' 
                  ? 'Chưa có sự kiện nào được tạo. Bắt đầu bằng cách thêm sự kiện mới.'
                  : 'Chưa có bài viết nào được tạo. Bắt đầu bằng cách thêm bài viết mới.'}
              </p>
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Thêm bài viết mới
              </button>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden">
              <DataTable 
                columns={columns} 
                data={articles.results} 
                actions={actions} 
              />
            </div>
          )}
        </>
      )}
      
      {articles.count > 0 && <Pagination />}

      {editModalOpen && (
        <Modal onClose={handleEditClose} title={editArticle ? `Chỉnh sửa: ${editArticle.title}` : 'Thêm bài viết mới'}>
          <GenericForm
            columns={formColumns}
            initialValues={editArticle || {type: 'news'}}
            onSubmit={handleEditSubmit}
            onCancel={handleEditClose}
            submitText={editArticle ? 'Cập nhật' : 'Thêm mới'}
          />
        </Modal>
      )}

      {viewModalOpen && selectedArticle && (
        <Modal 
          onClose={handleCloseViewModal} 
          title={
            <div className="flex items-center">
              <span className={`inline-flex items-center rounded-full mr-2 px-2.5 py-0.5 text-xs font-medium ${
                selectedArticle.type === 'event' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
              }`}>
                {selectedArticle.type === 'event' ? (
                  <><FaCalendarAlt className="mr-1" /> Sự kiện</>
                ) : (
                  <><FaNewspaper className="mr-1" /> Tin tức</>
                )}
              </span>
              <span className="font-semibold">{selectedArticle.title}</span>
            </div>
          }
        >
          <div className="space-y-4">
            {selectedArticle.cover_image_url && (
              <div className="mb-4">
                <img
                  src={selectedArticle.cover_image_url}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}
            
            {selectedArticle.type === 'event' && selectedArticle.event_date && (
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 flex items-center">
                <FaRegCalendarCheck className="text-purple-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-purple-700 font-medium">Thời gian diễn ra</p>
                  <p className="text-purple-800 font-semibold">{formatDate(selectedArticle.event_date)}</p>
                </div>
              </div>
            )}
            
            <div className="prose max-w-none border-t pt-4">
              <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border text-sm text-gray-500 mt-4">
              <div className="flex justify-between">
                <p>Đăng lúc: {formatDate(selectedArticle.created_at)}</p>
                <p>Cập nhật: {formatDate(selectedArticle.updated_at)}</p>
              </div>
              {selectedArticle.slug && (
                <p className="mt-2">
                  Đường dẫn: <span className="text-cyan-600 font-mono">{selectedArticle.slug}</span>
                </p>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  handleCloseViewModal();
                  handleEdit(selectedArticle);
                }}
                className="inline-flex items-center px-3 py-2 border border-yellow-300 text-sm font-medium rounded text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
              >
                <FaEdit className="mr-1" /> Chỉnh sửa
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}