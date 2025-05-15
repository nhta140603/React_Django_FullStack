import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getList } from '../../api/user_api';
import { MotionItem } from '../../components/MotionItem';

function TourList({ limit, showSearch = true }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  const { data: tours = [], isLoading, error } = useQuery({
    queryKey: ['tours'],
    queryFn: () => getList('tours'),
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  const getFilteredTours = () => {
    let filtered = tours;
    if (search) {
      filtered = filtered.filter(tour =>
        tour.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (activeFilter !== 'all') {
      filtered = filtered.filter(tour =>
        tour.category?.toLowerCase() === activeFilter.toLowerCase() ||
        tour.location?.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }
    return limit ? filtered.slice(0, limit) : filtered;
  };

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'popular', name: 'Phổ biến nhất' },
    { id: 'nature', name: 'Thiên nhiên' },
    { id: 'culture', name: 'Văn hóa' },
    { id: 'food', name: 'Ẩm thực' }
  ];

  function SkeletonCard() {
    return (
      <div
        className="rounded-xl overflow-hidden shadow-lg animate-pulse bg-gray-100 flex flex-col"
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

  const displayedTours = getFilteredTours();

  return (
    <section id="tour-section" className="py-20 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <MotionItem y={40}>
          <div ref={headerRef} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">
              Tour Du Lịch Cà Mau Nổi Bật
              <div className="w-24 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
            </h2>
            <p className="text-blue-800/80 max-w-2xl mx-auto mb-6 text-lg">
              Khám phá vẻ đẹp hoang sơ của Cà Mau qua các tour độc đáo, trải nghiệm cảnh đẹp thiên nhiên,
              văn hóa & ẩm thực đặc sắc nhất của vùng đất mũi Việt Nam!
            </p>
          </div>

          {showSearch && (
            <div className="mb-10 space-y-6">
              <div className="flex justify-center">
                <div className="relative w-full max-w-xl">
                  <input
                    type="text"
                    placeholder="Tìm kiếm tour theo tên, địa danh..."
                    className="w-full px-6 py-4 pr-12 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="absolute right-3 top-3 flex items-center">
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="mr-2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex justify-center flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${activeFilter === category.id
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-100 shadow border border-gray-200"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: limit }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center py-12 text-red-500">
              <svg className="w-16 h-16 mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-center font-medium">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full transition-colors duration-200"
              >
                Thử lại
              </button>
            </div>
          )}

          {!isLoading && !error && displayedTours.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy tour phù hợp</h3>
              <p className="text-gray-500 max-w-md mx-auto">Vui lòng thử lại với từ khóa khác hoặc xem tất cả các tour của chúng tôi.</p>
              <button
                onClick={() => { setSearch(''); setActiveFilter('all'); }}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200"
              >
                Xem tất cả tour
              </button>
            </div>
          )}

          {!isLoading && !error && displayedTours.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {displayedTours.map((tour, index) => (
                <MotionItem y={40}>
                  <div
                    className="tour-card-container"
                    onMouseEnter={() => setHoveredCard(tour.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className={`tour-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full transform ${hoveredCard === tour.id ? 'scale-[1.02]' : ''}`}
                    >
                      <div className="relative overflow-hidden h-56 bg-gradient-to-br from-blue-100 to-blue-50">
                        <img
                          src={tour.image}
                          alt={tour.name}
                          loading="lazy"
                          className={`h-full w-full object-cover transition-all duration-700 ${hoveredCard === tour.id ? 'scale-110' : ''}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/400x300/0EA5E9/FFFFFF/?text=Cà+Mau+Tour";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="absolute top-4 right-4 bg-white/90 text-blue-700 px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {tour.duration || "2 ngày 1 đêm"}
                        </div>

                        <PromoBadge promo={tour.promo} />
                      </div>

                      <div className="flex-1 flex flex-col p-6">
                        <div className="space-y-2 mb-4">
                          <h3 className="text-xl font-bold text-blue-900 line-clamp-2 leading-tight">
                            {tour.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                          {tour.price && (
                            <div className="font-bold text-lg">
                              <span className="text-blue-600">
                                {Number(tour.price).toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                          )}
                          <button
                            onClick={() => navigate(`/chuyen-du-lich/${tour.slug}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                          >
                            <span>Chi tiết</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </MotionItem>
              ))}

            </div>
          )}

          {!isLoading && !error && limit && tours.length > limit && (
            <div className="flex justify-center mt-12">
              <a
                href="/danh-sach-chuyen-du-lich"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-blue-200/50 transition-all duration-300 flex items-center gap-2"
              >
                <span>Xem tất cả tour</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          )}
        </MotionItem>
      </div>
    </section>
  );
}

export default TourList;