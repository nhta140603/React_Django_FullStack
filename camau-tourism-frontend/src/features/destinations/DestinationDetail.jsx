import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDetail } from "../../api/user_api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HeroSection({ name, images }) {
  return (
    <div className="relative min-h-[280px] md:min-h-[350px] rounded-3xl overflow-hidden shadow-lg flex items-end">
      <img
        src={images[0] || "/demo-destination-1.jpg"}
        alt={name}
        className="absolute inset-0 object-cover w-full h-full z-0"
        style={{ filter: "brightness(0.74)" }}
      />
      <div className="relative z-10 px-6 py-10 md:py-16 w-full">
        <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-1">{name}</h1>
      </div>
    </div>
  );
}

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const [currentImg, setCurrentImg] = useState(0);
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
  const phone = destination.phone || "";
  const website = destination.website || "";
  const openHour = destination.open_hour || "07:00 - 17:00";
  const ticket = destination.ticket || "Miễn phí";
  const bestSeason = destination.best_season || "Tháng 12 - 4";

  return (
    <div className=" min-h-screen pb-10">
      <div className="max-w-7xl mx-auto p-3 md:p-7 bg-white rounded-3xl ">
        <HeroSection name={destination.name} images={images} />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b pb-4 mt-8 md:mt-12">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block bg-cyan-600 text-white text-xs px-3 py-1 rounded-full shadow">
                Địa điểm nổi bật
              </span>
              {destination.rating && (
                <span className="flex items-center text-yellow-500 ml-2">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.973a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.973c.3.921-.755 1.688-1.538 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.783.57-1.838-.197-1.538-1.118l1.287-3.973a1 1 0 00-.364-1.118l-3.388-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.973z" /></svg>
                  <span className="font-semibold">{destination.rating}</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-3 text-sm">
              <span className="bg-cyan-50 px-3 py-1 rounded-xl shadow-sm text-cyan-700">
                Giờ mở cửa: {openHour}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
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