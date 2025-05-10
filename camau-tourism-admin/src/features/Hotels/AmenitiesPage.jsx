import React, { useEffect, useState, useMemo } from "react";
import DataTable from "../../components/DataTable";
import { getList, createItem, updateItem, deleteItem, getPage } from "../../api/api_generics";
import {
  FaWifi, FaEdit, FaTrash, FaCar, FaSwimmingPool, FaUtensils, FaDumbbell, FaConciergeBell,
  FaBroom, FaBell, FaSpa, FaGlassMartiniAlt, FaTree, FaLock, FaSnowflake, FaUmbrellaBeach,
  FaShuttleVan, FaChalkboardTeacher, FaTv, FaIceCream, FaWind, FaMugHot, FaSoap, FaClock,
  FaBreadSlice, FaChild, FaSuitcaseRolling, FaCarSide, FaMoneyBillWave, FaSmokingBan, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import Modal from "../../components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Bổ sung các icon bị thiếu
const AMENITY_ICONS = {
  "fa-wifi": FaWifi,
  "fa-car": FaCar,
  "fa-swimming-pool": FaSwimmingPool,
  "fa-utensils": FaUtensils,
  "fa-dumbbell": FaDumbbell,
  "fa-concierge-bell": FaConciergeBell,
  "fa-broom": FaBroom,
  "fa-bell": FaBell,
  "fa-spa": FaSpa,
  "fa-glass-martini-alt": FaGlassMartiniAlt,
  "fa-tree": FaTree,
  "fa-lock": FaLock,
  "fa-snowflake": FaSnowflake,
  "fa-umbrella-beach": FaUmbrellaBeach,
  "fa-shuttle-van": FaShuttleVan,
  "fa-chalkboard-teacher": FaChalkboardTeacher,
  "fa-tv": FaTv,
  "fa-ice-cream": FaIceCream,
  "fa-wind": FaWind,
  "fa-mug-hot": FaMugHot,
  "fa-soap": FaSoap,
  "fa-clock": FaClock,
  "fa-bread-slice": FaBreadSlice,
  "fa-child": FaChild,
  "fa-suitcase-rolling": FaSuitcaseRolling,
  "fa-car-side": FaCarSide,
  "fa-money-bill-wave": FaMoneyBillWave,
  "fa-ban-smoking": FaSmokingBan,
};
import { FaElevator } from "react-icons/fa6";
// Danh sách icon cho select và lựa chọn trực tiếp
const ICON_OPTIONS = [
  { label: "Wifi miễn phí", value: "fa-wifi", icon: FaWifi, description: "Kết nối Internet tốc độ cao miễn phí toàn khách sạn" },
  { label: "Nhà hàng", value: "fa-utensils", icon: FaUtensils, description: "Phục vụ các món ăn đa dạng, buffet sáng mỗi ngày" },
  { label: "Bể bơi ngoài trời", value: "fa-swimming-pool", icon: FaSwimmingPool, description: "Bể bơi ngoài trời cho khách thư giãn" },
  { label: "Bãi đỗ xe miễn phí", value: "fa-car", icon: FaCar, description: "Bãi đỗ xe an toàn, miễn phí cho khách lưu trú" },
  { label: "Phòng gym", value: "fa-dumbbell", icon: FaDumbbell, description: "Phòng tập thể dục hiện đại, trang bị đầy đủ thiết bị" },
  { label: "Lễ tân 24/7", value: "fa-concierge-bell", icon: FaConciergeBell, description: "Dịch vụ lễ tân phục vụ 24/7" },
  { label: "Dọn phòng hàng ngày", value: "fa-broom", icon: FaBroom, description: "Phòng được dọn dẹp, làm sạch mỗi ngày" },
  { label: "Dịch vụ phòng (Room Service)", value: "fa-bell", icon: FaBell, description: "Gọi món, phục vụ tại phòng 24/7" },
  { label: "Spa & Massage", value: "fa-spa", icon: FaSpa, description: "Dịch vụ spa, massage thư giãn chuyên nghiệp" },
  { label: "Quầy bar", value: "fa-glass-martini-alt", icon: FaGlassMartiniAlt, description: "Thưởng thức đồ uống và cocktail tại quầy bar" },
  { label: "Sân vườn", value: "fa-tree", icon: FaTree, description: "Không gian xanh, sân vườn thư giãn" },
  { label: "Két sắt", value: "fa-lock", icon: FaLock, description: "Két sắt an toàn trong phòng" },
  { label: "Điều hoà nhiệt độ", value: "fa-snowflake", icon: FaSnowflake, description: "Hệ thống điều hoà nhiệt độ tại phòng" },
  { label: "Thang máy", value: "fa-elevator", icon: FaElevator, description: "Thang máy tiện lợi cho khách" },
  { label: "Ban công", value: "fa-umbrella-beach", icon: FaUmbrellaBeach, description: "Ban công riêng với view đẹp" },
  { label: "Dịch vụ đưa đón sân bay", value: "fa-shuttle-van", icon: FaShuttleVan, description: "Xe đưa đón sân bay tiện lợi" },
  { label: "Phòng hội nghị", value: "fa-chalkboard-teacher", icon: FaChalkboardTeacher, description: "Phòng họp, hội nghị trang bị hiện đại" },
  { label: "Truyền hình cáp", value: "fa-tv", icon: FaTv, description: "TV, truyền hình cáp tại phòng" },
  { label: "Tủ lạnh mini", value: "fa-ice-cream", icon: FaIceCream, description: "Tủ lạnh mini trong phòng" },
  { label: "Máy sấy tóc", value: "fa-wind", icon: FaWind, description: "Trang bị máy sấy tóc tại phòng tắm" },
  { label: "Ấm siêu tốc", value: "fa-mug-hot", icon: FaMugHot, description: "Ấm đun nước siêu tốc tiện lợi" },
  { label: "Dịch vụ giặt là", value: "fa-soap", icon: FaSoap, description: "Dịch vụ giặt là, ủi quần áo chuyên nghiệp" },
  { label: "Phòng không hút thuốc", value: "fa-ban-smoking", icon: FaSmokingBan, description: "Phòng dành riêng cho khách không hút thuốc" },
  { label: "Nhận/trả phòng nhanh", value: "fa-clock", icon: FaClock, description: "Nhận và trả phòng nhanh chóng" },
  { label: "Bữa sáng miễn phí", value: "fa-bread-slice", icon: FaBreadSlice, description: "Bữa sáng miễn phí mỗi ngày" },
  { label: "Bãi biển riêng", value: "fa-umbrella-beach", icon: FaUmbrellaBeach, description: "Bãi biển riêng cho khách nghỉ dưỡng" },
  { label: "Sân chơi trẻ em", value: "fa-child", icon: FaChild, description: "Khu vui chơi dành cho trẻ em" },
  { label: "Dịch vụ giữ hành lý", value: "fa-suitcase-rolling", icon: FaSuitcaseRolling, description: "Nhận giữ hành lý cho khách" },
  { label: "Hệ thống báo cháy", value: "fa-bell", icon: FaBell, description: "Hệ thống báo cháy, an toàn phòng chống cháy nổ" },
  { label: "Dịch vụ cho thuê xe", value: "fa-car-side", icon: FaCarSide, description: "Dịch vụ cho thuê xe tiện lợi" },
  { label: "ATM trong khuôn viên", value: "fa-money-bill-wave", icon: FaMoneyBillWave, description: "Cây ATM ngay trong khách sạn" },
  { label: "Wifi khu vực công cộng", value: "fa-wifi", icon: FaWifi, description: "Wifi miễn phí mọi khu vực" },
];

export default function HotelAmenityPage() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Modal xóa
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingAmenity, setDeletingAmenity] = useState(null);
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [totalPages, setTotalPages] = useState(1)
  // Tìm kiếm
  const [search, setSearch] = useState("");

  // State cho icon đang chọn trong form
  const [selectedIcon, setSelectedIcon] = useState("");

  // Lấy danh sách tiện ích
  const fetchAmenities = async () => {
    setLoading(true);
    const data = await getPage("hotel-amenities", page, pageSize);
    setTotalPages(Math.ceil(data.count / pageSize))
    setAmenities(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAmenities();
  }, [page, pageSize]);

  // Reset icon khi mở modal
  useEffect(() => {
    if (modalOpen) {
      if (editData && editData.icon) setSelectedIcon(editData.icon);
      else setSelectedIcon("");
    }
  }, [modalOpen, editData]);

  // Thêm/sửa tiện ích
  const handleSave = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const description = e.target.description.value.trim() || null;
    const icon = selectedIcon;
    if (!name || !icon) {
      toast.warn("Vui lòng nhập tên và chọn biểu tượng!");
      return;
    }
    const payload = { name, icon, description };
    try {
      if (editData) {
        await updateItem("hotel-amenities", editData.id, payload);
        toast.success("Đã cập nhật tiện ích!");
      } else {
        await createItem("hotel-amenities", payload);
        toast.success("Đã thêm tiện ích mới!");
      }
      setModalOpen(false);
      setEditData(null);
      fetchAmenities();
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  // Hiển thị tiện ích đã lọc theo search
  const filteredAmenities = useMemo(() => {
    if (!search.trim()) return amenities;
    const s = search.trim().toLowerCase();
    return amenities.filter(a =>
      a.name.toLowerCase().includes(s) ||
      (a.description && a.description.toLowerCase().includes(s))
    );
  }, [amenities, search]);

  // Xóa tiện ích
  const handleDelete = async () => {
    if (!deletingAmenity) return;
    setDeleting(true);
    try {
      await deleteItem("hotel-amenities", deletingAmenity.id);
      toast.success("Đã xóa tiện ích!");
      setDeleteOpen(false);
      setDeletingAmenity(null);
      fetchAmenities();
    } catch {
      toast.error("Không thể xóa!");
    } finally {
      setDeleting(false);
    }
  };

  // DataTable columns
  const columns = [
    {
      key: "icon",
      title: "Icon",
      render: (am) => {
        const IconComp = AMENITY_ICONS[am.icon] || FaUtensils;
        return (
          <span className="text-cyan-600 text-2xl flex justify-center">
            <IconComp />
          </span>
        );
      },
      className: "text-center",
    },
    {
      key: "name",
      title: "Tên tiện ích",
      render: (am) => <span className="font-semibold">{am.name}</span>,
    },
    {
      key: "description",
      title: "Mô tả",
      render: (am) => <span className="text-gray-500">{am.description || "--"}</span>,
    },
  ];

  // DataTable actions
  const actions = [
    {
      key: "edit",
      title: "Sửa",
      onClick: (am) => {
        setEditData(am);
        setModalOpen(true);
      },
      icon: () => <FaEdit />,
      className: "text-blue-600 hover:text-blue-800",
    },
    {
      key: "delete",
      title: "Xoá",
      onClick: (am) => {
        setDeletingAmenity(am);
        setDeleteOpen(true);
      },
      icon: () => <FaTrash />,
      className: "text-red-600 hover:text-red-800",
    },
  ];
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
                Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, amenities.count)}</span> trong tổng số <span className="font-medium">{amenities.count}</span>
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
    <div className="p-4 max-w-3xl mx-auto">
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <h1 className="text-2xl font-bold">Tiện ích khách sạn</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm tên hoặc mô tả..."
            className="border px-3 py-2 rounded-lg bg-cyan-50 w-full md:w-60 focus:border-cyan-400 outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow active:scale-95 transition-transform"
            onClick={() => {
              setEditData(null);
              setModalOpen(true);
            }}
          >
            Thêm tiện ích
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredAmenities.results}
          actions={actions}
          loading={loading}
          emptyText="Chưa có tiện ích nào phù hợp!"
        />
      </div>
          {filteredAmenities.count > 0 && <Pagination />}
      {/* Modal Thêm/Sửa */}
      {modalOpen && (
        <Modal
          onClose={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          title={editData ? "Cập nhật tiện ích" : "Thêm tiện ích"}
        >
          <form className="space-y-4" onSubmit={handleSave} autoComplete="off">
            <div>
              <label className="block font-medium mb-1">Tên tiện ích</label>
              <input
                name="name"
                required
                className="border px-3 py-2 w-full rounded focus:border-cyan-500 outline-none"
                defaultValue={editData?.name || ""}
                placeholder="Nhập tên tiện ích"
                autoFocus
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Chọn biểu tượng</label>
              <div className="flex gap-3 flex-wrap">
                {ICON_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      title={opt.label}
                      className={`flex flex-col items-center border rounded-lg p-2 w-20 hover:border-cyan-400 focus:border-cyan-600 transition 
                        ${selectedIcon === opt.value ? "border-cyan-600 bg-cyan-50 shadow" : "border-gray-200"}
                      `}
                      onClick={() => setSelectedIcon(opt.value)}
                    >
                      <Icon className="text-2xl mb-1" />
                      <span className="text-xs text-center">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              {!selectedIcon && (
                <p className="text-red-500 text-sm mt-2">* Hãy chọn một biểu tượng!</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Mô tả</label>
              <textarea
                name="description"
                rows={2}
                className="border px-3 py-2 w-full rounded focus:border-cyan-500 outline-none resize-none"
                placeholder="Mô tả ngắn về tiện ích (không bắt buộc)"
                defaultValue={editData?.description || ""}
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded hover:bg-gray-100"
              >Huỷ</button>
              <button
                type="submit"
                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
              >
                {editData ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal xác nhận xóa */}
      {deleteOpen && (
        <Modal
          onClose={() => {
            setDeleteOpen(false);
            setDeletingAmenity(null);
          }}
          title="Xác nhận xoá"
        >
          <div className="p-3">
            <p>Bạn có chắc chắn muốn xoá tiện ích <b>{deletingAmenity?.name}</b> không?</p>
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  setDeleteOpen(false);
                  setDeletingAmenity(null);
                }}
                className="px-4 py-2 rounded hover:bg-gray-100"
                disabled={deleting}
              >Huỷ</button>
              <button
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Đang xoá..." : "Xoá"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}