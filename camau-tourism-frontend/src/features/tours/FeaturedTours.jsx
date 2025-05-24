import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MotionItem } from '../../components/MotionItem';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"
import { useFilterSearch } from "../../hooks/useFilterSearch";
import { useFetchList } from "../../hooks/useFetchList"
import { DataLoader } from '../../hooks/useDataLoader';
import { formatPrice } from "../../utils/formatPrice"
import  SkeletonCard  from "../../components/Common/SkeletonCard"
function TourList({ limit, showSearch = true, showBreadcrumb = true }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'popular', name: 'Phổ biến nhất' },
    { id: 'nature', name: 'Thiên nhiên' },
    { id: 'culture', name: 'Văn hóa' },
    { id: 'food', name: 'Ẩm thực' }
  ];

  const { data: tours = [], isLoading, error } = useFetchList('tours');
  const filterOptions = categories.map(cat => cat.id);
  const {
    search,
    setSearch,
    selectedFilter: activeFilter,
    setSelectedFilter,
    filteredData: filteredTours,
  } = useFilterSearch(tours, {
    searchFields: ["name"],
    filterField: "category",
    filterOptions,
  });

  const displayedTours = limit ? filteredTours.slice(0, limit) : filteredTours;

  return (
    <section id="tour-section" className=" bg-white">

      <div className="container max-w-7xl mx-auto sm:px-4 py-5 px-2">
        {showBreadcrumb && (
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tour du lịch</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <MotionItem y={40}>
          <div ref={headerRef} className="text-center mb-5 sm:mb-12">
            <h2 className="text-xl sm:text-4xl font-bold text-blue-900 mb-1.5 sm:mb-4">
              Tour Du Lịch Cà Mau Nổi Bật
              <div className="w-12 sm:w-24 h-1 bg-blue-500 mx-auto mt-1 sm:mt-2 rounded-full"></div>
            </h2>
            <p className="text-blue-800/80 max-w-xs sm:max-w-2xl mx-auto mb-2 sm:mb-6 text-sm sm:text-lg">
              Khám phá vẻ đẹp hoang sơ của Cà Mau qua các tour độc đáo, trải nghiệm cảnh đẹp thiên nhiên,
              văn hóa & ẩm thực đặc sắc nhất của vùng đất mũi Việt Nam!
            </p>
          </div>
        </MotionItem>

        {showSearch && (
          <div className="mb-4 sm:mb-10 space-y-2 sm:space-y-6">
            <div className="flex justify-center">
              <div className="relative w-full max-w-xs sm:max-w-xl">
                <input
                  type="text"
                  placeholder="Tìm kiếm tour theo tên, địa danh..."
                  className="w-full px-3 sm:px-6 py-2 sm:py-4 pr-9 sm:pr-12 border border-gray-200 rounded-full shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" // CHỈNH MOBILE
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute right-2 sm:right-3 top-2 sm:top-3 flex items-center">
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="mr-1 sm:mr-2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex justify-center flex-wrap gap-1 sm:gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedFilter(category.id)}
                  className={`px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${activeFilter === category.id
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
        <DataLoader
          isLoading={isLoading}
          error={error?.message || error}
          dataLength={displayedTours.length}
          skeleton={<SkeletonCard/>}
          noData={
            <div className="text-center py-4 sm:py-12 text-gray-500">
              <svg className="w-8 h-8 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-sm sm:text-xl font-bold text-gray-700 mb-1 sm:mb-2">Không tìm thấy tour phù hợp</h3>
              <p className="text-xs sm:text-base text-gray-500 max-w-xs sm:max-w-md mx-auto">Vui lòng thử lại với từ khóa khác hoặc xem tất cả các tour của chúng tôi.</p>
              <button
                onClick={() => { setSearch(''); setSelectedFilter('all'); }}
                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200 text-xs sm:text-base"
              >
                Xem tất cả tour
              </button>
            </div>
          }
        >
          <div className="grid gap-3 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayedTours.map((tour, index) => (
              <MotionItem key={index} y={40}>
                <div
                  className="tour-card-container"
                  onMouseEnter={() => setHoveredCard(tour.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className={`tour-card bg-white max-h-[380px] sm:max-h-[460px] rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full transform ${hoveredCard === tour.id ? 'scale-[1.02]' : ''}`} // CHỈNH MOBILE
                  >
                    <div className="relative overflow-hidden h-24 sm:h-56 bg-gradient-to-br from-blue-100 to-blue-50">
                      <img
                        src={tour.image}
                        alt={tour.name}
                        loading="lazy"
                        className={`h-full w-full object-cover transition-all duration-700 ${hoveredCard === tour.id ? 'scale-110' : ''}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-1 right-1 sm:top-4 sm:right-4 bg-white/90 text-blue-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold shadow-lg flex items-center gap-1 text-xs sm:text-base">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-3 h-3 sm:w-4 sm:h-4">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {tour.duration || "2 ngày 1 đêm"}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col p-2 sm:p-6 min-h-[180px] sm:min-h-[280px]">
                      <div className="space-y-1 sm:space-y-2 mb-1 sm:mb-4">
                        <h3 className="text-sm sm:text-xl font-bold text-blue-900 line-clamp-2 leading-tight">
                          {tour.name}
                        </h3>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-0.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{tour.location || "Cà Mau"}</span>
                        </div>
                      </div>
                      <p
                        dangerouslySetInnerHTML={{ __html: tour.description || "Khám phá vẻ đẹp nguyên sơ của vùng đất Cà Mau với nhiều trải nghiệm thú vị, đắm mình trong thiên nhiên hoang dã và thưởng thức ẩm thực đặc sắc vùng sông nước." }}
                        className="text-gray-600 text-xs sm:text-base flex-1 mb-1 sm:mb-4 line-clamp-2 sm:line-clamp-3"
                      ></p>
                      <div className="flex items-center justify-between mt-auto pt-1 sm:pt-4 border-t border-gray-100">
                        {tour.price && (
                          <div className="font-bold text-sm sm:text-lg">
                            <span className="text-blue-600">
                              {formatPrice(tour.price)}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => navigate(`/chuyen-du-lich/${tour.slug}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-200 flex items-center gap-1 text-xs sm:text-base"
                        >
                          <span>Chi tiết</span>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        </DataLoader>

        {!isLoading && !error && limit && tours.length > limit && (
          <div className="flex justify-center mt-6 sm:mt-12">
            <a
              href="/danh-sach-chuyen-du-lich"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-blue-200/50 transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <span>Xem tất cả tour</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
export default TourList;