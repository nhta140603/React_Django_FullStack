import React, { useEffect, useState, useMemo } from "react";
import DataTable from "../../components/DataTable";
import { getList, updateItem, deleteItem, getPage } from "../../api/api_generics";
import { FaTrash, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Badge from "../../components/Badge";
import Modal from "../../components/Modal";
import DataTableToolbar from '../../components/DataTableToolbar';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getDefaultAvatar = (gender) => {
  if (gender === "Nam") return "/default-avatar-male.png";
  if (gender === "Nữ") return "/default-avatar-female.png";
  return "/default-avatar.png";
};

export default function ClientPage() {
  // State chính
  const [clients, setClients] = useState({count: 0, results: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal chi tiết
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Đổi trạng thái hoạt động
  const [activeLoadingId, setActiveLoadingId] = useState(null);

  // Modal xóa
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [clientToDelete, setClientToDelete] = useState(null);

  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);
  const [clientToToggle, setClientToToggle] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGender, setFilterGender] = useState("");

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPage("clients", page, pageSize);
      setTotalPages(Math.ceil(data.count / pageSize))
      setClients(data);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      toast.error(err.message || "Có lỗi xảy ra khi tải danh sách khách hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, pageSize]);

  const statusBadge = (is_active) => (
    <Badge color={is_active ? "green" : "gray"}>
      {is_active ? (
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
          Đang hoạt động
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
          Đã vô hiệu hóa
        </span>
      )}
    </Badge>
  );

  const handleToggleActive = async (client) => {
    setActiveLoadingId(client.id);
    try {
      await updateItem("users", client.user.id, {
        is_active: !client.user.is_active,
      });
      toast.success("Cập nhật trạng thái thành công!");
      fetchClients();
    } catch (err) {
      toast.error("Không thể cập nhật trạng thái!");
    } finally {
      setActiveLoadingId(null);
    }
  };

  const handleShowDetail = (client) => {
    setSelectedClient(client);
    setDetailOpen(true);
  };

  // Xóa
  const handleDelete = (client) => {
    setDeleteError(null);
    setDeleteInput("");
    setClientToDelete(client);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (
      deleteInput.trim() !==
      (clientToDelete.user.full_name || clientToDelete.user.username)
    ) {
      setDeleteError("Tên không khớp, vui lòng nhập chính xác.");
      toast.error("Tên không khớp, vui lòng nhập chính xác.");
      return;
    }
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteItem("clients", clientToDelete.id);
      setConfirmDeleteOpen(false);
      setClientToDelete(null);
      toast.success("Xóa khách hàng thành công!");
      fetchClients();
    } catch (err) {
      toast.error("Xóa khách hàng thất bại!");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openConfirmToggleActive = (client) => {
    setClientToToggle(client);
    setConfirmStatusOpen(true);
  };

  const filteredClients = useMemo(() => {
    let data = clients.results || [];
    if (filterStatus === "active") {
      data = data.filter(c => c.user.is_active);
    } else if (filterStatus === "inactive") {
      data = data.filter(c => !c.user.is_active);
    }
    if (filterGender) {
      data = data.filter(c => c.gender === filterGender);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(c =>
        (c.user.full_name && c.user.full_name.toLowerCase().includes(s)) ||
        (c.user.username && c.user.username.toLowerCase().includes(s)) ||
        (c.phone && c.phone.includes(s)) ||
        (c.user.email && c.user.email.toLowerCase().includes(s))
      );
    }
    return data;
  }, [clients, search, filterStatus, filterGender]);

  const columns = [
    {
      key: "avatar",
      title: "Avatar",
      render: (client) => (
        <img
          src={client.avatar || getDefaultAvatar(client.gender)}
          alt=""
          className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover"
        />
      ),
    },
    {
      key: "full_name",
      title: "Tên",
      render: (client) => client.user.full_name || client.user.username,
      className: "font-medium",
    },
    {
      key: "gender",
      title: "Giới tính",
      render: (client) => (
        <Badge color={client.gender === "Nam" ? "cyan" : client.gender === "Nữ" ? "pink" : "gray"}>
          {client.gender || "Chưa rõ"}
        </Badge>
      ),
    },
    {
      key: "phone",
      title: "SĐT",
      render: (client) => client.phone || "--",
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (client) => (
        <button
          onClick={() => openConfirmToggleActive(client)}
          disabled={activeLoadingId === client.id}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors duration-200 flex items-center gap-1
            ${client.user.is_active
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          {activeLoadingId === client.id
            ? "Đang cập nhật..."
            : statusBadge(client.user.is_active)}
        </button>
      ),
    },
    {
      key: "created_at",
      title: "Ngày tạo",
      render: (client) =>
        new Date(client.created_at).toLocaleDateString(),
    },
  ];

  const actions = [
    {
      key: "view",
      title: "Xem Chi Tiết",
      onClick: handleShowDetail,
      icon: () => <FaEye />,
      className: "text-cyan-600 hover:text-cyan-900",
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
              Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, clients.count)}</span> trong tổng số <span className="font-medium">{clients.count}</span>
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
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Danh sách khách hàng</h1>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
      >
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border bg-cyan-50 outline-none rounded-lg  px-3 py-2 md:w-44 w-full "
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Đã vô hiệu hóa</option>
        </select>
        <select
          value={filterGender}
          onChange={e => setFilterGender(e.target.value)}
          className="border bg-cyan-50 outline-none rounded-lg  px-3 py-2 md:w-45 w-full "
        >
          <option value="">Tất cả giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </DataTableToolbar>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      {loading ? (
        <div className="rounded-lg border bg-white">
          <SkeletonTable />
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filteredClients}
            actions={actions}
            emptyText="Không có khách hàng nào phù hợp."
          />
        </>
      )}
      {clients.count > 0 && <Pagination/>}

      <Modal
        open={!detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Chi tiết khách hàng"
      >
        {selectedClient ? (
          <div className="space-y-2">
            <div className="flex justify-center">
              <img
                src={selectedClient.avatar || getDefaultAvatar(selectedClient.gender)}
                alt=""
                className="w-20 h-20 rounded-full border-2 border-cyan-400 object-cover mb-2"
              />
            </div>
            <div><b>Tên:</b> {selectedClient.user.full_name || selectedClient.user.username}</div>
            <div><b>Giới tính:</b> {selectedClient.gender || "Chưa rõ"}</div>
            <div><b>Ngày sinh:</b> {selectedClient.date_of_birth || "--"}</div>
            <div><b>SĐT:</b> {selectedClient.phone || "--"}</div>
            <div><b>SĐT Khẩn Cấp:</b> {selectedClient.emergency_contact || "--"}</div>
            <div><b>Email:</b> {selectedClient.user.email || "--"}</div>
            <div><b>Trạng thái:</b> {statusBadge(selectedClient.user.is_active)}</div>
            <div><b>Ngày tạo:</b> {new Date(selectedClient.created_at).toLocaleDateString()}</div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={!confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setClientToDelete(null);
          setDeleteError(null);
          setDeleteInput("");
        }}
        title="Xác nhận xóa khách hàng"
      >
        {clientToDelete && (
          <div>
            <p>
              Để xác nhận xóa, hãy nhập lại tên khách hàng: <b>{clientToDelete.user.full_name || clientToDelete.user.username}</b>
            </p>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full mt-2"
              placeholder="Nhập lại tên khách hàng"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              disabled={deleteLoading}
            />
            {deleteError && <div className="text-red-500 text-sm mt-1">{deleteError}</div>}
            <div className="flex justify-end space-x-2 mt-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setConfirmDeleteOpen(false)}
                disabled={deleteLoading}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={!confirmStatusOpen}
        onClose={() => {
          setConfirmStatusOpen(false);
          setClientToToggle(null);
        }}
        title="Xác nhận thay đổi trạng thái"
      >
        {clientToToggle && (
          <div>
            <p>
              Bạn có chắc chắn muốn {clientToToggle.user.is_active ? 'vô hiệu hóa' : 'kích hoạt'} khách hàng <b>{clientToToggle.user.full_name || clientToToggle.user.username}</b>?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setConfirmStatusOpen(false)}
              >
                Hủy
              </button>
              <button
                className={`px-4 py-2 ${clientToToggle.user.is_active ? 'bg-gray-500' : 'bg-green-600'} text-white rounded hover:opacity-80`}
                onClick={async () => {
                  setActiveLoadingId(clientToToggle.id);
                  try {
                    await updateItem("users", clientToToggle.user.id, {
                      is_active: !clientToToggle.user.is_active,
                    });
                    toast.success("Cập nhật trạng thái thành công!");
                    fetchClients();
                  } catch (err) {
                    toast.error("Không thể cập nhật trạng thái!");
                  } finally {
                    setActiveLoadingId(null);
                    setConfirmStatusOpen(false);
                    setClientToToggle(null);
                  }
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </Modal>
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}