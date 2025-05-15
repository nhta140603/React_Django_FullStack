import React, { useState, useMemo } from "react";
import DestinationCard from "../../components/DestinationCard";
import FilterBars from "../../components/FilterBars";
import { getList } from "../../api/user_api";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function SkeletonDestinationCard() {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg animate-pulse bg-gray-100 flex flex-col h-full">
      <div className="w-full h-48 sm:h-52 bg-gray-300"></div>
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="h-5 sm:h-6 bg-gray-300 rounded w-2/3 mb-3 sm:mb-4"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
        <div className="mt-auto h-8 sm:h-9 w-full bg-cyan-200/60 rounded-xl"></div>
      </div>
    </div>
  );
}

export default function DestinationList() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const navigate = useNavigate();

  const { data: destinations = [], isLoading, error } = useQuery({
    queryKey: ["destinations"],
    queryFn: () => getList("destinations"),
    staleTime: 5 * 60 * 1000,
  });

  const typeOptions = useMemo(
    () => Array.from(new Set(destinations.map((d) => d.type).filter(Boolean))),
    [destinations]
  );

  const destinationsByType = useMemo(
    () =>
      destinations.reduce((value, { type, ...dest }) => {
        if (!value[type]) {
          value[type] = [];
        }
        value[type].push(dest);
        return value;
      }, {}),
    [destinations]
  );

  const filteredDestinations = useMemo(
    () =>
      destinations.filter((dest) => {
        const matchType = !selectedType || dest.type === selectedType;
        const matchSearch = dest.name
          .toLowerCase()
          .includes(search.toLowerCase());
        return matchType && matchSearch;
      }),
    [destinations, selectedType, search]
  );

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-4 max-w-7xl mx-auto">
      <div className="mb-8 animate-fadeIn">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-cyan-800 mb-2 leading-tight">
          <span className="inline-block animate-float">Các địa điểm Cà Mau Nổi Bật </span>
        </h2>
        <p className="text-center text-blue-900 max-w-2xl mx-auto mb-6 text-base sm:text-lg px-4 leading-relaxed">
          Khám phá các địa điểm du lịch hấp dẫn, trải nghiệm cảnh đẹp thiên nhiên, văn hóa & ẩm thực Cà Mau. Đặt tour để tận hưởng chuyến đi trọn vẹn!
        </p>
      </div>

      <div className="md:hidden mb-4 px-2">
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="w-full flex items-center justify-between bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-lg shadow-md active:shadow-sm transition-all duration-300"
        >
          <span className="font-medium flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            Lọc và tìm kiếm
          </span>
          <svg className={`w-5 h-5 transition-transform duration-300 ${isMobileFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>

      <div className={`md:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-cyan-100 transition-all duration-300">
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm địa điểm</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                placeholder="Tìm kiếm theo tên, địa danh..."
                className="pl-10 w-full px-4 py-2 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none transition bg-cyan-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại địa điểm</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType("")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedType === "" 
                    ? "bg-cyan-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              {typeOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedType === type 
                      ? "bg-cyan-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonDestinationCard key={i} />
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-center bg-red-50 text-red-600 py-6 px-4 rounded-xl shadow-sm border border-red-100 mb-6">
          <svg className="w-12 h-12 mx-auto text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="font-medium">{error.message || "Có lỗi xảy ra khi tải dữ liệu"}</p>
          <p className="text-sm mt-1">Vui lòng thử lại sau</p>
        </div>
      )}

      {/* Destinations Grid */}
      <div className="space-y-8">
        {Object.entries(destinationsByType).map(([type, destList]) => {
          if (selectedType && type !== selectedType) return null;
          const filteredGroup = destList.filter((d) =>
            d.name.toLowerCase().includes(search.toLowerCase())
          );
          if (!filteredGroup.length) return null;

          return (
            <div key={type} className="animate-fadeInUp">
              {/* Type Header */}
              <div className="relative overflow-hidden rounded-xl mb-4 group">
                <div className="bg-gradient-to-r from-cyan-100 to-blue-200 flex justify-between items-center px-4 sm:px-5 py-3 shadow-lg border-l-4 sm:border-l-8 border-cyan-400 rounded-xl">
                  <div className="flex items-center gap-2 z-10 relative">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="drop-shadow-lg text-xl sm:text-2xl font-extrabold tracking-wide text-cyan-800">{type}</span>
                  </div>
                  
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/loai-dia-diem/${encodeURIComponent(type)}`);
                    }}
                    className="z-10 relative text-sm sm:text-base font-medium text-cyan-700 hover:text-cyan-900 transition-colors duration-200 flex items-center"
                  >
                    Xem thêm
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                </div>
              </div>

              <div className="sm:hidden overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex space-x-4 px-1 w-max">
                  {filteredGroup.map((dest, idx) => (
                    <div 
                      key={dest.id || idx} 
                      className="w-72 flex-shrink-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-100"
                      onClick={() => navigate(`/dia-diem/${dest.slug}`)}
                    >
                      <div className="relative h-44 overflow-hidden">
                        {dest.image_url && (
                          <img 
                            src={dest.image_url} 
                            alt={dest.name} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                        )}
                        <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-2 py-1 m-2 rounded-lg">
                          {dest.type}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-cyan-800 line-clamp-1 mb-1">{dest.name}</h3>
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span className="line-clamp-1">{dest.address || 'Cà Mau'}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {dest.description || 'Địa điểm du lịch hấp dẫn tại Cà Mau'}
                        </p>
                        <button className="w-full py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredGroup.slice(0, 4).map((dest, idx) => (
                  <div 
                    key={dest.id || idx}
                    className="flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group border border-gray-100"
                    onClick={() => navigate(`/dia-diem/${dest.slug}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      {dest.image_url && (
                        <img 
                          src={dest.image_url} 
                          alt={dest.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start">
                        <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                          {dest.type}
                        </span>
                        {dest.featured && (
                          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                            Nổi bật
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-cyan-800 mb-1 line-clamp-1 group-hover:text-cyan-600 transition-colors">{dest.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="line-clamp-1">{dest.address || 'Cà Mau'}</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {dest.description || 'Địa điểm du lịch hấp dẫn tại Cà Mau'}
                      </p>
                      <div className="mt-auto">
                        <button className="w-full py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {!isLoading && !filteredDestinations.length && (
          <div className="text-center bg-blue-50 p-8 rounded-xl border border-blue-100 shadow-sm">
            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy địa điểm phù hợp</h3>
            <p className="text-gray-500 mb-4">Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc</p>
            {(search || selectedType) && (
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedType('');
                }}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors duration-200"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </div>

      <button 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        className="fixed bottom-6 right-6 p-2 bg-cyan-600 text-white rounded-full shadow-lg hover:bg-cyan-700 transition-colors duration-300 z-50"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
        </svg>
      </button>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
            opacity: 0;
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 1s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}