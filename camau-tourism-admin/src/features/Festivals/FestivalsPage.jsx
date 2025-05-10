import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { getPage, getDetail, updateItem, deleteItem, createItem } from "../../api/api_generics";
import { FaUserEdit, FaEye, FaStar, FaRegStar, FaTrash, FaMapMarkerAlt, FaRegFileAlt } from "react-icons/fa";
import Badge from "../../components/Badge";
import Modal from "../../components/Modal";
import GenericForm from "../../components/EditForm";
import DataTableToolbar from '../../components/DataTableToolbar';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function FestivalPage() {
  const [festivals, setFestivals] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false);
  const [editFestival, setEditFestival] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPage("festivals", page, pageSize);
      setFestivals(data);
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (err) {
      setError("Không thể tải danh sách lễ hội!");
      toast.error("Không thể tải danh sách lễ hội!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, [page, pageSize]);

  const formColumns = [
    {
      key: "title",
      title: "Tên lễ hội",
      inputType: "text",
      required: true,
      validation: v => v?.trim().length > 0 || "Vui lòng nhập tên lễ hội"
    },
    {
      key: "image_url",
      title: "Ảnh lễ hội",
      inputType: "file",
      required: false
    },
    {
      key: "event_date",
      title: "Ngày diễn ra",
      inputType: "text",
      required: false
    },
    {
      key: "address",
      title: "Địa chỉ",
      inputType: "text",
      required: false
    },
    {
      key: "is_featured",
      title: "Nổi bật",
      inputType: "checkbox",
      required: false
    }
  ];

  const columns = [
    {
      key: "checkbox",
      title: (
        <input
          type="checkbox"
          checked={selectedRowIds.length === festivals.results.length && festivals.results.length > 0}
          onChange={e => {
            if (e.target.checked) {
              setSelectedRowIds(festivals.results.map(e => e.id));
            } else {
              setSelectedRowIds([]);
            }
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedRowIds.includes(row.id)}
          onChange={e => {
            if (e.target.checked) {
              setSelectedRowIds(prev => [...prev, row.id]);
            } else {
              setSelectedRowIds(prev => prev.filter(id => id !== row.id));
            }
          }}
        />
      )
    },
    {
      key: "image_url",
      title: "Ảnh",
      render: (festival) => (
        <img
          src={festival.image_url || "/default-image.png"}
          alt={festival.title}
          className="w-14 h-14 rounded-lg border object-cover"
          onError={e => { e.target.src = "/default-image.png"; }}
        />
      ),
    },
    {
      key: "title",
      title: "Tên lễ hội",
      dataIndex: "title",
      render: (festival) => <span className="font-semibold">{festival.title}</span>
    },
    {
      key: "event_date",
      title: "Ngày diễn ra",
      render: (festival) => (
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="inline text-cyan-600" />
          <span>{festival.event_date || "--"}</span>
        </div>
      )
    },
    {
      key: "address",
      title: "Địa chỉ",
      render: (festival) => (
        <span>{festival.address || "--"}</span>
      )
    },
    {
      key: "is_featured",
      title: "Nổi bật",
      render: (festival) =>
        festival.is_featured ? (
          <Badge color="yellow"><FaStar className="inline mb-1 mr-1" />Nổi bật</Badge>
        ) : (
          <Badge color="gray">Bình thường</Badge>
        ),
    }
  ];

  const actions = [
    {
      key: "edit_description",
      title: "Thêm/Chỉnh sửa mô tả",
      icon: () => <FaRegFileAlt />,
      onClick: (festival) => navigate(`/festivals/detail_page/${festival.id}`),
      className: "text-green-600 hover:text-green-800",
    },
    {
      key: "toggle_featured",
      title: (festival) => festival.is_featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật",
      onClick: async (festival) => {
        try {
          await updateItem("festivals", festival.id, { is_featured: !festival.is_featured });
          toast.success(festival.is_featured ? "Đã bỏ nổi bật" : "Đã đánh dấu nổi bật");
          fetchFestivals();
        } catch {
          toast.error("Có lỗi khi cập nhật nổi bật!");
        }
      },
      icon: (festival) => festival.is_featured ? <FaStar className="text-yellow-500" /> : <FaRegStar />,
      className: (festival) => festival.is_featured ? "text-yellow-500 hover:text-yellow-700" : "text-gray-500 hover:text-yellow-500"
    },
    {
      key: "view",
      title: "Xem chi tiết",
      onClick: async (festival) => {
        const detail = await getDetail("festivals", festival.id);
        setSelectedFestival(detail);
        setDetailModalOpen(true);
      },
      icon: () => <FaEye />,
      className: "text-cyan-600 hover:text-cyan-900",
    },
    {
      key: "edit",
      title: "Chỉnh sửa",
      onClick: (festival) => {
        setEditFestival(festival);
        setModalOpen(true);
      },
      icon: () => <FaUserEdit />,
      className: "text-yellow-600 hover:text-yellow-900",
    },
    {
      key: "delete",
      title: "Xóa",
      onClick: async (festival) => {
        if (window.confirm(`Xóa lễ hội "${festival.title}"?`)) {
          await deleteItem("festivals", festival.id);
          toast.success("Đã xóa lễ hội");
          fetchFestivals();
        }
      },
      icon: () => <FaTrash />,
      className: "text-red-600 hover:text-red-900",
    },
  ];

  const handleFormSubmit = async (values) => {
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
      }
      if (!editFestival) {
        await createItem('festivals', payload, values.image_url instanceof File);
        toast.success("Thêm lễ hội thành công");
      } else {
        await updateItem('festivals', editFestival.id, payload, values.image_url instanceof File);
        toast.success("Cập nhật lễ hội thành công");
      }
      setModalOpen(false);
      setEditFestival(null);
      fetchFestivals();
    } catch (err) {
      toast.error("Có lỗi khi thêm/cập nhật: " + (err.message || "Lỗi không xác định"));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRowIds.length === 0) {
      toast.info("Vui lòng chọn lễ hội để xóa");
      return;
    }
    if (window.confirm(`Bạn có muốn xóa ${selectedRowIds.length} lễ hội đã chọn?`)) {
      try {
        await Promise.all(selectedRowIds.map(id => deleteItem("festivals", id)));
        toast.success("Đã xóa thành công");
        fetchFestivals();
        setSelectedRowIds([]);
      } catch {
        toast.error("Có lỗi khi xóa!");
      }
    }
  };

  const SkeletonTable = () => (
    <table className="min-w-full">
      <tbody>
        {[...Array(pageSize)].map((_, i) => (
          <tr key={i} className="animate-pulse">
            {[...Array(7)].map((__, j) => (
              <td key={j} className="py-2 px-2">
                <div className="h-5 bg-gray-200 rounded w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const Pagination = () => (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg">
      <div>
        <p className="text-sm text-gray-700">
          Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, festivals.count)}</span> trong <span className="font-medium">{festivals.count}</span> lễ hội
        </p>
      </div>
      <div className="flex items-center">
        <select
          value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          className="rounded border-gray-300 text-sm mr-6"
        >
          {[5, 10, 20, 50, 100].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-2 py-1 text-sm"
        >Trước</button>
        <span className="mx-2">{page}/{totalPages}</span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-2 py-1 text-sm"
        >Sau</button>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách lễ hội</h1>
      <DataTableToolbar
        onAdd={() => { setModalOpen(true); setEditFestival(null); }}
        selectedRows={selectedRowIds}
        onDeleteSelected={handleDeleteSelected}
        selectedCount={selectedRowIds.length}
      />
      {loading &&
        <div className="rounded-lg border bg-white">
          <SkeletonTable />
        </div>
      }
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          <DataTable columns={columns} data={festivals.results} actions={actions} />
          {festivals.results.length === 0 && (
            <div className="text-center py-4 bg-white rounded-lg border mt-2">
              <p className="text-gray-500">Không có lễ hội nào</p>
            </div>
          )}
        </>
      )}
      {festivals.count > 0 && <Pagination />}
      {modalOpen && (
        <Modal
          onClose={() => { setModalOpen(false); setEditFestival(null); }}
          title={editFestival ? `Chỉnh sửa lễ hội: ${editFestival.title}` : "Thêm lễ hội mới"}
        >
          <GenericForm
            columns={formColumns}
            initialValues={editFestival || {}}
            onSubmit={handleFormSubmit}
            onCancel={() => { setModalOpen(false); setEditFestival(null); }}
            submitText={editFestival ? "Cập nhật" : "Thêm mới"}
          />
        </Modal>
      )}
      {detailModalOpen && selectedFestival && (
        <Modal
          onClose={() => { setDetailModalOpen(false); setSelectedFestival(null); }}
          title={<span>Chi tiết lễ hội: <b>{selectedFestival.title}</b></span>}
        >
          <div className="space-y-2 text-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={selectedFestival.image_url || "/default-image.png"}
                alt={selectedFestival.title}
                className="w-32 h-32 object-cover rounded border mb-2"
              />
              <div className="flex-1 space-y-2">
                <div><span className="font-medium">Tên:</span> {selectedFestival.title}</div>
                <div><span className="font-medium">Ngày:</span> {selectedFestival.event_date || "--"}</div>
                <div><span className="font-medium">Địa chỉ:</span> {selectedFestival.address || "--"}</div>
                <div><span className="font-medium">Nổi bật:</span> {selectedFestival.is_featured ? "Có" : "Không"}</div>
              </div>
            </div>
            <div>
              <span className="font-medium">Mô tả:</span>
              <div className="border p-2 rounded bg-gray-50 mt-1" dangerouslySetInnerHTML={{__html: selectedFestival.description}} style={{ whiteSpace: "pre-line" }}>
              </div>
            </div>
          </div>
        </Modal>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}