import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import Modal from "../../components/Modal";
import ProfileInfoForm from "./ProfileInfoForm";
import ProfileHeader from "./ProfileHeader";
import UserInfoCards from "./UserInfoCards";
import { toast } from "react-toastify";
import { updateAvatar } from "../../api/user_api";
export default function ProfileMain({ userData, onSaveInfo, onAvatarUploaded }) {
  const [modalOpen, setModalOpen] = useState(false);
  const handleEditClick = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleAvatarChange = async (file) => {
    console.log("Avatar file chọn:", file);
    try {
      const updated = await updateAvatar(file);
      toast.success("Đã cập nhật ảnh đại diện!");
      onAvatarUploaded && onAvatarUploaded(updated.avatar);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải ảnh");
    }
  };
  return (
    <div className="relative max-w-3xl mx-auto bg-white/90 rounded-xl shadow-2xl p-8 mt-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-emerald-100 to-yellow-100 rounded-xl -z-10"></div>
      <div className="flex justify-end">
        <button
          onClick={handleEditClick}
          className="flex items-center gap-2 px-4 py-2 mb-2 bg-teal-500 hover:bg-teal-700 text-white rounded-full font-semibold shadow transition"
        >
          <FaEdit /> Chỉnh sửa thông tin
        </button>
      </div>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ProfileInfoForm user={userData} onSave={(data) => { onSaveInfo(data); setModalOpen(false); }} />
      </Modal>
      <ProfileHeader avatar={userData.avatar} name={userData.name} onAvatarChange={handleAvatarChange} bio={userData.bio} />
      <UserInfoCards userData={userData} />
    </div>
  );
}