import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDetail, postReview } from "../../api/user_api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReviewList from "../../components/Review_Rating/ReviewList"
import ReviewForm from "../../components/Review_Rating/ReviewForm"

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const [currentImg, setCurrentImg] = useState(0);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: destination,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["destination-detail", slug],
    queryFn: () => getDetail("destinations", slug),
    retry: false,
    onError: () => toast.error("Không tìm thấy địa điểm!"),
  });

  const handleReviewAdded = () => {
    setReviewsExpanded(true);
    setTimeout(() => {
      document.getElementById('reviews-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></span>
      </div>
    );

  if (isError || !destination)
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        Không tìm thấy địa điểm.
      </div>
    );

  let images = [];
  if (Array.isArray(destination.image_url)) {
    images = destination.image_url.filter(Boolean);
  } else if (typeof destination.image_url === "string" && destination.image_url) {
    images = [destination.image_url];
  }

  const address = destination.location || "";
  const hasAddress = address && address.trim().length > 4;
  const lat = destination.latitude || destination.lat;
  const lng = destination.longitude || destination.lng;
  const hasLatLng = lat && lng;
  const mapSrc = hasLatLng
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`
    : (hasAddress
      ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`
      : null);
  const description = destination.description || "";
  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-7xl mx-auto p-3 md:p-7 bg-white rounded-3xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b pb-4 md:mt-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <h1 className="font-semibold text-4xl">{destination.name}</h1>
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <div className="relative h-[210px] md:h-[290px] rounded-2xl overflow-hidden shadow-lg group mb-6">
              {images.length ? (
                <>
                  <img
                    src={images[currentImg]}
                    alt={`Địa điểm ${destination.name}`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    onClick={() => window.open(images[currentImg], "_blank")}
                    style={{ cursor: "zoom-in" }}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImg(currentImg === 0 ? images.length - 1 : currentImg - 1)}
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-cyan-200 p-2 rounded-full shadow z-10"
                        aria-label="Trước"
                      >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <button
                        onClick={() => setCurrentImg(currentImg === images.length - 1 ? 0 : currentImg + 1)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-cyan-200 p-2 rounded-full shadow z-10"
                        aria-label="Sau"
                      >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
                      </button>
                    </>
                  )}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImg(idx)}
                          className={`w-3 h-3 rounded-full border-2 border-white shadow ${idx === currentImg ? "bg-cyan-600" : "bg-gray-300"}`}
                          aria-label={`Chọn ảnh ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">Không có ảnh</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-cyan-900 mb-3">Chi tiết địa điểm</h2>
              <div
                className="prose max-w-none prose-img:rounded-xl prose-img:shadow-md prose-a:text-cyan-600 prose-a:underline prose-table:rounded-lg prose-table:shadow"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
            <div id="reviews-section" className="mt-8 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-cyan-900">Đánh giá về địa điểm</h2>
                <button
                  onClick={() => setReviewsExpanded(!reviewsExpanded)}
                  className="text-cyan-600 hover:text-cyan-800 flex items-center text-sm"
                >
                  {reviewsExpanded ? 'Thu gọn' : 'Xem tất cả'}
                  <svg
                    className={`ml-1 w-4 h-4 transition-transform ${reviewsExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <ReviewForm entityType="destination" entityId={destination.id || slug} onReviewAdded={handleReviewAdded}/>

              <div className={`mt-4 transition-all duration-300 overflow-hidden ${reviewsExpanded ? 'max-h-[2000px]' : 'max-h-[600px]'}`}>
                <ReviewList entityType="destination" entityId={destination.id || slug} />
              </div>

              {!reviewsExpanded && (
                <div className="h-20 bg-gradient-to-t from-white to-transparent w-full -mt-20 relative pointer-events-none"></div>
              )}

              {!reviewsExpanded && (
                <div className="text-center mt-2">
                  <button
                    onClick={() => setReviewsExpanded(true)}
                    className="text-cyan-600 hover:text-cyan-800 text-sm font-medium inline-flex items-center"
                  >
                    Xem tất cả đánh giá
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <h2 className="text-lg font-bold text-cyan-900 mb-3">Vị trí trên bản đồ</h2>
            <div className="sticky top-18 w-full h-[120px] md:h-[260px] rounded-2xl overflow-hidden shadow">
              {mapSrc ? (
                <iframe
                  src={mapSrc}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  aria-hidden="false"
                  tabIndex="0"
                  title="Google Map"
                  loading="lazy"
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">Không có bản đồ</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
}