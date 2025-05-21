import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useRef } from "react";
import { postComment } from "../../api/user_api";
export default function ReviewForm({ entityType, entityId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef();

  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: (reviewData) => postComment(entityType, entityId, reviewData),
    onSuccess: () => {
      toast.success("Đánh giá của bạn đã được ghi nhận!");
      setContent("");
      setImages([]);
      setPreviews([]);
      setIsExpanded(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      queryClient.invalidateQueries([`${entityType}-detail`, entityId]);
      queryClient.invalidateQueries([`${entityType}-reviews`, entityId]);
      if (onReviewAdded) onReviewAdded();
    },
    onError: (error) => {
      toast.error(error.message || "Không thể gửi đánh giá. Vui lòng thử lại sau.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.warning("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("content", content);
    images.forEach(image => {
      formData.append("image", images[0]);
    });

    reviewMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-3 flex">
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-medium">
            B
          </div>
        </div>
        <div className="flex-1">
          <div
            className={`border border-gray-200 rounded-full px-4 py-2 bg-gray-50 text-gray-500 text-sm cursor-pointer hover:bg-gray-100 ${isExpanded ? 'hidden' : 'block'}`}
            onClick={() => setIsExpanded(true)}
          >
            Viết đánh giá của bạn...
          </div>

          <div className={isExpanded ? 'block' : 'hidden'}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  rows="3"
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  autoFocus
                ></textarea>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                  <span className="text-xs font-medium text-gray-700 mr-2">Xếp hạng:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <span className={`${rating >= star ? "text-yellow-400" : "text-gray-300"}`}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="cursor-pointer bg-gray-50 px-3 py-1.5 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">Thêm ảnh</span>
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
              </div>

              {previews.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative w-16 h-16">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-600 text-xs"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang gửi
                    </span>
                  ) : "Đăng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}