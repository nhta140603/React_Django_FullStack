import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment, postRating } from "../../api/user_api";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed z-[9999] inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-[96vw] max-w-md mx-auto p-0 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-gray-200"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export default function ReviewForm({ entityType, entityId, onReviewAdded }) {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [ratingValue, setRatingValue] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [userRatingId, setUserRatingId] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentExpanded, setCommentExpanded] = useState(false);
  const fileInputRef = useRef();
  const textareaRef = useRef();
  const [loginModal, setLoginModal] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const ratingLabels = {
    1: "Rất tệ",
    2: "Tệ",
    3: "Bình thường",
    4: "Tốt",
    5: "Tuyệt vời"
  };

  // Lấy rating user đã đánh giá với entity này (nếu có)

  useEffect(() => {
    if (commentExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [commentExpanded]);

  const ratingMutation = useMutation({
    mutationFn: (ratingData) => postRating(entityType, entityId, ratingData),
    onSuccess: (data) => {
      toast.success(hasRated ? "Cập nhật đánh giá thành công!" : "Đánh giá sao thành công!");
      setHasRated(true);
      queryClient.invalidateQueries([`${entityType}-detail`, entityId]);
      queryClient.invalidateQueries([`${entityType}-ratings`, entityId]);
      queryClient.invalidateQueries(['user-rating', entityType, entityId, user?.id]);
      if (data && data.id) setUserRatingId(data.id);
    },
    onError: (error) => {
      toast.error(error.message || "Không thể gửi đánh giá sao. Vui lòng thử lại sau.");
    }
  });

  const reviewMutation = useMutation({
    mutationFn: (reviewData) => postComment(entityType, entityId, reviewData),
    onSuccess: () => {
      toast.success("Bình luận của bạn đã được ghi nhận!");
      setContent("");
      setImages([]);
      setPreviews([]);
      setCommentExpanded(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      queryClient.invalidateQueries([`${entityType}-detail`, entityId]);
      queryClient.invalidateQueries([`${entityType}-reviews`, entityId]);
      if (onReviewAdded) onReviewAdded();
    },
    onError: (error) => {
      toast.error(error.message || "Không thể gửi bình luận. Vui lòng thử lại sau.");
      setIsSubmitting(false);
    }
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.warning("Chỉ được tải lên tối đa 5 ảnh.");
      return;
    }

    setImages(files);
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const gotoLogin = () => {
    setLoginModal(false);
    navigate('/login');
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);

    if (newImages.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRatingSubmit = () => {
    if (!isAuthenticated) {
      setLoginModal(true);
      return;
    }
    if (ratingValue === 0) {
      toast.warning("Vui lòng chọn số sao đánh giá.");
      return;
    }
    ratingMutation.mutate(
      userRatingId
        ? { rating: ratingValue, id: userRatingId }
        : { rating: ratingValue }
    );
  };

  const handleCommentSubmit = async (e) => {
    if (!isAuthenticated) {
      setLoginModal(true);
      return;
    }
    e.preventDefault();
    if (!content.trim()) {
      toast.warning("Vui lòng nhập nội dung bình luận.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      images.forEach(image => {
        formData.append("image", image);
      });
      await reviewMutation.mutateAsync(formData);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 transition-all overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Đánh giá của bạn</h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingValue(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none px-1 transition-transform hover:scale-110"
                  disabled={ratingMutation.isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={(hoverRating || ratingValue) >= star ? "#FFD700" : "#E5E7EB"}
                    stroke={(hoverRating || ratingValue) >= star ? "#F59E0B" : "#9CA3AF"}
                    strokeWidth="0.5"
                    className={`w-8 h-8 transition-all ${ratingMutation.isLoading ? 'opacity-60' : ''}`}
                  >
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
              {(hoverRating || ratingValue) > 0 && (
                <span className={`text-sm font-medium ml-3 inline-block px-3 py-1 rounded-full ${(hoverRating || ratingValue) >= 4 ? 'bg-green-50 text-green-700' :
                  (hoverRating || ratingValue) >= 3 ? 'bg-blue-50 text-blue-700' :
                    'bg-orange-50 text-orange-700'
                  }`}>
                  {ratingLabels[hoverRating || ratingValue]}
                </span>
              )}
            </div>
            {hasRated && (
              <div className="mt-1 text-xs text-green-700">
                Bạn đã đánh giá <span className="font-bold">{ratingValue} sao</span>
              </div>
            )}
          </div>
          <button
            onClick={handleRatingSubmit}
            disabled={ratingValue === 0 || ratingMutation.isLoading}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${ratingValue === 0 || ratingMutation.isLoading
              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white'
              }`}
          >
            {ratingMutation.isLoading
              ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </span>
              )
              : hasRated ? "Cập nhật đánh giá" : "Gửi đánh giá"
            }
          </button>
        </div>
        {hasRated && (
          <div className="mt-2 text-sm text-green-700">
            Bạn đã đánh giá {ratingValue} sao. Bạn có thể cập nhật lại số sao nếu muốn!
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-3 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Bình luận của bạn</h3>
          <button
            onClick={() => setCommentExpanded(!commentExpanded)}
            className="text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
          >
            {commentExpanded ? 'Thu gọn' : 'Mở rộng'}
            <svg
              className={`ml-1 w-4 h-4 transition-transform ${commentExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {!commentExpanded ? (
          <div
            className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500 text-sm cursor-pointer hover:bg-gray-100 transition-all"
            onClick={() => setCommentExpanded(true)}
          >
            Nhấn vào đây để viết bình luận...
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              rows="4"
              placeholder="Chia sẻ chi tiết trải nghiệm của bạn tại đây..."
              maxLength={1000}
            ></textarea>
            <div className="text-xs text-right text-gray-500">
              {content.length}/1000 ký tự
            </div>
            {previews.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Hình ảnh đính kèm ({previews.length}/5)</div>
                <div className="flex flex-wrap gap-2">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={preview}
                          alt={`Ảnh ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-all"
                        aria-label="Xóa ảnh"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {previews.length < 5 && (
                    <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-cyan-500 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                        multiple
                        max="5"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {previews.length === 0 && (
                <label className="cursor-pointer bg-gray-50 px-3 py-2 rounded-full flex items-center hover:bg-gray-100 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Thêm ảnh (tối đa 5)</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                    multiple
                    max="5"
                  />
                </label>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setCommentExpanded(false);
                  setContent("");
                  setImages([]);
                  setPreviews([]);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleCommentSubmit}
                className={`px-4 py-2 text-sm font-medium text-white ${!content.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'} rounded-full transition-all disabled:opacity-50`}
                disabled={isSubmitting || !content.trim()}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </span>
                ) : "Gửi bình luận"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal open={loginModal} onClose={() => setLoginModal(false)}>
        <div className="p-6 flex flex-col items-center">
          <svg className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Đăng nhập để tiếp tục</h3>
          <p className="text-gray-600 text-center mb-6">Bạn cần đăng nhập để có thể đánh giá và bình luận.</p>
          <button
            onClick={gotoLogin}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded-lg hover:from-blue-600 hover:to-teal-500 transition">
            Đăng nhập ngay
          </button>
        </div>
      </Modal>
    </div>
  );
}