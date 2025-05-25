import React, { useRef, useState, useEffect } from "react";
import Avatar from "../../components/Users/Avatar";
import { FaCamera, FaCheck, FaTimes } from "react-icons/fa";
import { Toaster, toast } from "sonner";
export default function ProfileHeader({ avatar, name, bio, onAvatarChange }) {
  const fileInputRef = useRef();
  const [previewImage, setPreviewImage] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  useEffect(() => {
    return () => {
      if (previewImage?.url) {
        URL.revokeObjectURL(previewImage.url);
      }
    };
  }, [previewImage]);

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage({ file, url });
      setShowConfirmation(true);
    }
  };

const confirmAvatarChange = async () => {
  try {
    await onAvatarChange(previewImage.file); 
    setShowConfirmation(false);
    setPreviewImage(null);
    toast.success("Ảnh đại diện đã được cập nhật!");
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error) {
    toast.error("Cập nhật ảnh đại diện thất bại.");
  }
};
  const cancelAvatarChange = () => {
    setShowConfirmation(false);
    setPreviewImage(null);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3 sm:gap-4 relative">
        <div className="relative group">
          <Avatar
            src={`https://res.cloudinary.com/deavaowp3/${avatar}`}
            size="small"
            sizeClasses="w-16 h-16 sm:w-24 sm:h-24"
          />
          <button
            type="button"
            title="Thay đổi ảnh đại diện"
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 bg-teal-600 p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-teal-800 text-white transition-opacity opacity-80 group-hover:opacity-100 text-xs sm:text-base"
          >
            <FaCamera />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-teal-700 drop-shadow">
          🌴 {name}
        </h2>
        <p className="text-gray-700 italic max-w-sm text-center text-sm sm:text-base">{bio || ""}</p>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-xs sm:max-w-md w-full">
              <h3 className="text-lg sm:text-xl font-bold text-teal-700 mb-3 sm:mb-4">
                Xác nhận thay đổi ảnh
              </h3>
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="border-2 sm:border-4 border-teal-500 rounded-full overflow-hidden w-24 h-24 sm:w-32 sm:h-32">
                  <img src={previewImage.url} alt="Ảnh đại diện mới" className="w-full h-full object-cover" />
                </div>
              </div>
              <p className="text-gray-600 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                Bạn có chắc chắn muốn thay đổi ảnh đại diện?
              </p>
              <div className="flex justify-center gap-3 sm:gap-4">
                <button
                  onClick={cancelAvatarChange}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <FaTimes /> Hủy bỏ
                </button>
                <button
                  onClick={confirmAvatarChange}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <FaCheck /> Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}