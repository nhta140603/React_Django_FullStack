import React, { useState } from "react";
import { updateInfoUser } from "../../api/user_api";
import { toast } from "react-toastify";
import {
  FaUser, FaEnvelope, FaVenusMars, FaBirthdayCake, FaPhone, 
  FaMapMarkerAlt, FaExclamationTriangle, FaSave, FaSpinner
} from "react-icons/fa";

const GENDER_OPTIONS = [
  { value: "Nam", label: "Nam" },
  { value: "Nữ", label: "Nữ" },
  { value: "Khác", label: "Khác" },
];

export default function ProfileInfoForm({ user, onSave }) {
  const [form, setForm] = useState({
    first_name: user.user?.first_name || "",
    last_name: user.user?.last_name || "",
    email: user.user?.email || "",
    gender: user.gender || "",
    date_of_birth: user.date_of_birth || "",
    phone: user.phone || "",
    address: user.address || "",
    emergency_contact: user.emergency_contact || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const dataToSend = {
        user: {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
        },
        gender: form.gender,
        date_of_birth: form.date_of_birth,
        phone: form.phone,
        address: form.address,
        emergency_contact: form.emergency_contact,
      };
      const updated = await updateInfoUser(dataToSend);
      onSave && onSave(updated);
      toast.success("Cập nhật thành công!")
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-blue-50 via-emerald-50 to-yellow-50 rounded-xl shadow-xl p-4 sm:p-8 border border-teal-100 max-h-[90vh] overflow-y-auto"
    >
      <div className="bg-gradient-to-r from-teal-600 to-blue-500 text-white rounded-lg py-3 px-4 sm:py-4 sm:px-6 mb-6 sm:mb-8 shadow-md">
        <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
          <FaUser className="text-yellow-300" /> Cập nhật thông tin
        </h3>
        <p className="text-blue-100 mt-1 sm:mt-2 text-xs sm:text-sm">Điền đầy đủ thông tin để cập nhật hồ sơ</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="flex flex-col gap-1 sm:gap-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
            <FaUser className="text-teal-500" /> Họ
          </label>
          <input
            className="input-style"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
            placeholder="Nhập họ"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
            <FaUser className="text-teal-500" /> Tên
          </label>
          <input
            className="input-style"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
            placeholder="Nhập tên"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
            <FaEnvelope className="text-blue-500" /> Email
          </label>
          <div className="relative">
            <input
              className="input-style bg-gray-100 pl-10"
              name="email"
              type="email"
              value={form.email}
              required
              disabled
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaEnvelope />
            </span>
          </div>
          <p className="text-xs text-gray-500 italic">Email không thể thay đổi</p>
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
            <FaVenusMars className="text-pink-500" /> Giới tính
          </label>
          <select
            className="input-style"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Chọn giới tính...</option>
            {GENDER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
            <FaBirthdayCake className="text-orange-500" /> Ngày sinh
          </label>
          <input
            className="input-style"
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
            <FaPhone className="text-green-500" /> Số điện thoại
          </label>
          <input
            className="input-style"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="0123 456 789"
          />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2 md:col-span-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
            <FaMapMarkerAlt className="text-red-500" /> Địa chỉ
          </label>
          <input
            className="input-style"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="TP Cà Mau, Cà Mau"
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-1 sm:gap-2">
          <label className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
            <FaExclamationTriangle className="text-orange-500" /> Liên hệ khẩn cấp
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">Tùy chọn</span>
          </label>
          <input
            className="input-style"
            name="emergency_contact"
            value={form.emergency_contact}
            onChange={handleChange}
            placeholder="Tên & SĐT người thân"
          />
          <p className="text-xs text-gray-500">Thông tin này sẽ được sử dụng trong trường hợp khẩn cấp</p>
        </div>
      </div>
      
      {error && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded text-sm">
          <p className="font-medium">Lỗi:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex justify-end mt-6 sm:mt-8">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white font-bold px-5 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg transition flex items-center gap-2 disabled:opacity-70 text-sm sm:text-base"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Đang lưu...
            </>
          ) : (
            <>
              <FaSave /> Lưu thông tin
            </>
          )}
        </button>
      </div>
      
      <style>
        {`
          .input-style {
            @apply w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 outline-none shadow-sm bg-white transition text-sm sm:text-base;
          }
        `}
      </style>
    </form>
  );
}