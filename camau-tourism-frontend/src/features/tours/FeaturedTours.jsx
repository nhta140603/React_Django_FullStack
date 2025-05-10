import React, { useEffect, useState, useRef } from "react";
import { getList } from "../../api/user_api";
import { useNavigate } from "react-router-dom";
import {useQuery} from "@tanstack/react-query"
export default function TourList({ limit, showSearch = true }) {
  
  const {data: tours = [], isLoading: loading, error} = useQuery({
    queryKey: ['tours'],
    queryFn:() => getList('tours'),
    staleTime: 5 * 60 * 1000,
    retry: 2
  })
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.classList.add('animate-fade-in');
    }
  }, []);

  const getFilteredTours = () => {
    let filtered = tours;
    filtered = filtered.filter((tour) =>
      tour.name?.toLowerCase().includes(search.toLowerCase())
    );
    if (activeFilter !== "all") {
      filtered = filtered.filter(tour => 
        tour.category?.toLowerCase() === activeFilter.toLowerCase() ||
        tour.location?.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }
    return limit ? filtered.slice(0, limit) : filtered;
  };

  function SkeletonCard() {
    return (
      <div
        className="rounded-xl overflow-hidden shadow-xl animate-pulse bg-gray-100 flex flex-col"
        style={{ minHeight: 320 }}
        aria-hidden="true"
      >
        <div className="w-full h-56 bg-gray-300"></div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="mt-auto h-9 w-32 bg-cyan-200/60 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const displayedTours = getFilteredTours();

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "popular", name: "Phổ biến nhất" },
    { id: "nature", name: "Thiên nhiên" },
    { id: "culture", name: "Văn hóa" },
    { id: "food", name: "Ẩm thực" }
  ];

  const PromoBadge = ({ promo }) =>
    promo ? (
      <div className="absolute top-3 left-3 z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-full blur-sm opacity-70"></div>
          <span className="relative bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg inline-block">
            {promo}
          </span>
        </div>
      </div>
    ) : null;

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfStarGradient">
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="50%" stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
            <path fill="url(#halfStarGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm font-semibold text-gray-700">{rating}</span>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 min-h-screen pb-20">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-40 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-8 relative z-10">
        <div ref={headerRef} className="text-center mb-12 relative">
          <div className="inline-block relative mb-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <h2 className="relative text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-blue-800 to-indigo-700 mb-2 drop-shadow-sm">
              Tour Du Lịch Cà Mau Nổi Bật
            </h2>
          </div>
          <p className="text-blue-800/80 max-w-2xl mx-auto mb-6 text-lg font-medium">
            Khám phá vẻ đẹp hoang sơ của Cà Mau qua các tour độc đáo, trải nghiệm cảnh đẹp thiên nhiên, 
            văn hóa & ẩm thực đặc sắc nhất của vùng đất mũi Việt Nam!
          </p>
        </div>
        {showSearch && (
          <div className="mb-10 space-y-6">
            <div className="flex justify-center">
              <div className="relative w-full max-w-xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-200 group-focus-within:opacity-100"></div>
                <div className="relative bg-white rounded-full shadow-xl overflow-hidden flex items-center">
                  <svg className="w-5 h-5 ml-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm kiếm tour theo tên, địa danh..."
                    className="w-full px-4 py-4 border-0 outline-none focus:ring-0 text-gray-700 text-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button 
                      onClick={() => setSearch("")} 
                      className="mr-3 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    activeFilter === category.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-100 shadow"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: limit || 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center py-24 text-red-500 font-bold text-lg">
            <div className="w-20 h-20 mb-4 text-red-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-center">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full font-semibold transition-colors duration-200"
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && displayedTours.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-center text-gray-500 py-20">
            <div className="w-32 h-32 mb-6 text-cyan-300">
              <svg viewBox="0 0 64 64" fill="none">
                <path d="M32 58c15.464 0 28-4.698 28-10.5S47.464 37 32 37 4 41.698 4 47.5 16.536 58 32 58z" fill="#E0F2FE" />
                <path d="M25.5 20a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" fill="#0EA5E9" />
                <path d="M38.5 20a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" fill="#0EA5E9" />
                <path d="M32 42c6.627 0 12-8.954 12-20S38.627 2 32 2 20 10.954 20 22s5.373 20 12 20z" fill="#F0F9FF" stroke="#0EA5E9" strokeWidth="2" />
                <path d="M32 25c-3 0-6 1.5-6 4" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-cyan-800 mb-2">Không tìm thấy tour phù hợp</h3>
            <p className="text-gray-500 max-w-md">Vui lòng thử lại với từ khóa khác hoặc xem tất cả các tour của chúng tôi.</p>
            <button 
              onClick={() => {setSearch(""); setActiveFilter("all");}} 
              className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Xem tất cả tour
            </button>
          </div>
        )}

        {!loading && !error && displayedTours.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedTours.map((tour, index) => (
              <div 
                key={tour.id}
                className="tour-card-container"
                onMouseEnter={() => setHoveredCard(tour.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  className={`tour-card bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-blue-50 transition-all duration-300 flex flex-col h-full transform ${hoveredCard === tour.id ? 'scale-[1.03]' : ''}`}
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="relative overflow-hidden h-56 bg-gradient-to-br from-cyan-100 to-blue-100">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      loading="lazy"
                      className={`h-full w-full object-cover transition-all duration-700 ${hoveredCard === tour.id ? 'scale-110 saturate-150' : ''}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300/0EA5E9/FFFFFF/?text=Cà+Mau+Tour";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute top-4 right-4 bg-white/90 text-cyan-700 px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {tour.duration || "2 ngày 1 đêm"}
                    </div>
                    
                    <PromoBadge promo={tour.promo} />
                  </div>
                  
                  <div className="flex-1 flex flex-col p-6">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start">
                        <h3 className="text-xl font-extrabold text-cyan-900 line-clamp-2 leading-tight flex-1">
                          {tour.name}
                        </h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 text-cyan-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{tour.location || "Cà Mau"}</span>
                        <div className="ml-auto">
                          <RatingStars rating={tour.rating || 4.5} />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-base flex-1 mb-4 line-clamp-3">
                      {tour.description || "Khám phá vẻ đẹp nguyên sơ của vùng đất Cà Mau với nhiều trải nghiệm thú vị, đắm mình trong thiên nhiên hoang dã và thưởng thức ẩm thực đặc sắc vùng sông nước."}
                    </p>
                    <div className="flex items-center justify-end mt-auto">
                      {tour.price && (
                        <div className="font-bold text-lg">
                          <span className="text-cyan-700">
                            {Number(tour.price).toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/chuyen-du-lich/${tour.slug}`)}
                      className="relative mt-5 overflow-hidden group"
                    >
                      <div className="absolute inset-0 w-3 bg-cyan-600 transition-all duration-300 ease-out group-hover:w-full"></div>
                      <span className="relative py-3 px-5 block text-center text-cyan-600 font-extrabold border-2 border-cyan-600 rounded-xl group-hover:text-white transition duration-300">
                        Xem chi tiết
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && limit && tours.length > limit && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate("/danh-sach-chuyen-du-lich")}
              className="group relative py-3 px-8 text-lg font-bold text-white rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all group-hover:from-blue-500 group-hover:to-cyan-500"></div>
              <div className="absolute -inset-0 scale-0 rounded-xl group-hover:scale-100 transition-all bg-cyan-500 mix-blend-screen opacity-0 group-hover:opacity-30 duration-700"></div>
              <span className="relative flex items-center">
                Xem tất cả tour
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1) translate(10px, -10px); }
          66% { transform: scale(0.9) translate(-10px, 10px); }
          100% { transform: scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite alternate;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .tour-card-container {
          opacity: 0;
          animation: card-appear 0.5s ease-out forwards;
        }
        
        @keyframes card-appear {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}