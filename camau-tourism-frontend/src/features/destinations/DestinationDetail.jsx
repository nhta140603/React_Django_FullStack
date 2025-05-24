import React, { useState, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDetail } from "../../api/user_api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReviewList from "../../components/Review_Rating/ReviewList"
import ReviewForm from "../../components/Review_Rating/ReviewForm"
import { useDescriptionExpand } from "../../hooks/useDescriptionExpand";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"
import {DataLoader} from "../../hooks/useDataLoader"
export default function DestinationDetailPage() {
  const { slug } = useParams();
  const [currentImg, setCurrentImg] = useState(0);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [extraExpand, setExtraExpand] = useState(false);
  const {
    data: destination, isLoading, isError, } = useQuery({
      queryKey: ["destination-detail", slug],
      queryFn: () => getDetail("destinations", slug),
      retry: false,
      onError: () => toast.error("Không tìm thấy địa điểm!"),
    });

  const { descRef, descMaxHeight } = useDescriptionExpand(
    extraExpand,
    destination?.description,
    300
  );
  const handleReviewAdded = () => {
    setReviewsExpanded(true);
    setTimeout(() => {
      document.getElementById('reviews-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  let images = [];
  if (Array.isArray(destination?.image_url)) {
    images = destination?.image_url.filter(Boolean);
  } else if (typeof destination?.image_url === "string" && destination.image_url) {
    images = [destination?.image_url];
  }
    const address = destination?.location || "";
  const hasAddress = address && address.trim().length > 4;
  const lat = destination?.latitude || destination?.lat;
  const lng = destination?.longitude || destination?.lng;
  const hasLatLng = lat && lng;
  const mapSrc = hasLatLng
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`
    : (hasAddress
      ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`
      : null);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/danh-sach-dia-diem">Địa điểm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{destination?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <DataLoader
          isLoading={isLoading}
          isError={isError}>
          
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{destination?.name}</h1>
          {hasAddress && (
            <div className="flex items-center text-gray-600 mb-1">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{address}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-[280px] md:h-[380px] group">
                {images.length ? (
                  <>
                    <img
                      src={images[currentImg]}
                      alt={`Địa điểm ${destination?.name}`}
                      className="object-cover w-full h-full"
                      onClick={() => window.open(images[currentImg], "_blank")}
                      style={{ cursor: "zoom-in" }}
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImg(currentImg === 0 ? images.length - 1 : currentImg - 1)}
                          className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/90 hover:bg-gray-100 p-2 rounded-full shadow-md z-10 transition-all"
                          aria-label="Trước"
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>
                        <button
                          onClick={() => setCurrentImg(currentImg === images.length - 1 ? 0 : currentImg + 1)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/90 hover:bg-gray-100 p-2 rounded-full shadow-md z-10 transition-all"
                          aria-label="Sau"
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
                        </button>
                      </>
                    )}

                    {images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImg + 1}/{images.length}
                      </div>
                    )}

                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-4 flex gap-1.5">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImg(idx)}
                            className={`w-2.5 h-2.5 rounded-full ${idx === currentImg ? "bg-white" : "bg-white/50"} transition-all`}
                            aria-label={`Chọn ảnh ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center p-4">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400">Không có ảnh</p>
                    </div>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="hidden md:flex p-3 gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentImg(idx)}
                      className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${currentImg === idx ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thông tin chi tiết
              </h2>

              <div
                ref={descRef}
                className="prose max-w-none prose-p:text-gray-600 prose-headings:text-gray-800 prose-img:rounded-lg prose-img:shadow-sm prose-a:text-blue-600 transition-all duration-300 overflow-hidden"
                style={{
                  maxHeight: `${descMaxHeight}px`
                }}
                dangerouslySetInnerHTML={{
                  __html: destination?.description || "<p>Chưa có thông tin chi tiết về địa điểm này.</p>"
                }}
              />

              {!extraExpand && (
                <div className="h-20 bg-gradient-to-t from-white to-transparent w-full -mt-20 relative pointer-events-none"></div>
              )}

              <div className="text-center mt-2">
                <button
                  onClick={() => setExtraExpand(!extraExpand)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-all"
                >
                  {!extraExpand ? `Xem thêm` : `Thu gọn`}
                  <svg className={`ml-1.5 w-4 h-4 transition-transform ${extraExpand ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div id="reviews-section" className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Đánh giá từ du khách
                </h2>
                <button
                  onClick={() => setReviewsExpanded(!reviewsExpanded)}
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
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

              <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Chia sẻ trải nghiệm của bạn</h3>
                <ReviewForm entityType="destination" entityId={destination?.id || slug} onReviewAdded={handleReviewAdded} />
              </div>

              <div className={`transition-all duration-300 overflow-hidden ${reviewsExpanded ? 'max-h-[2000px]' : 'max-h-[600px]'}`}>
                <ReviewList entityType="destination" entityId={destination?.id || slug} />
              </div>

              {!reviewsExpanded && (
                <div className="h-20 bg-gradient-to-t from-white to-transparent w-full -mt-20 relative pointer-events-none"></div>
              )}

              {!reviewsExpanded && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setReviewsExpanded(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-all"
                  >
                    Xem tất cả đánh giá
                    <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Vị trí trên bản đồ
              </h2>

              <div className="h-[260px] rounded-lg overflow-hidden border border-gray-200">
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
                  <div className="h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center p-4">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <p className="text-gray-400">Không có thông tin vị trí</p>
                    </div>
                  </div>
                )}
              </div>

              {hasAddress && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-gray-600 text-sm">
                  <strong className="text-gray-700 block mb-1">Địa chỉ:</strong>
                  {address}
                </div>
              )}
            </div>

          </div>
        </div>
        </DataLoader>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
