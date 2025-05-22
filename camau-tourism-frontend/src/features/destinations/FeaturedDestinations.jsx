import React, { useState, useMemo } from "react";
import { getList } from "../../api/user_api";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"; 
function MobileFilterSheet({ open, onClose, search, setSearch, typeOptions, selectedType, setSelectedType }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${open ? 'opacity-40' : 'opacity-0'}`} onClick={onClose} />
      <div className={`fixed left-0 bottom-0 w-full bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="px-4 pt-4 pb-2 flex items-center justify-between border-b">
          <span className="font-semibold text-lg">Bộ lọc</span>
          <button className="text-gray-500 text-2xl" onClick={onClose}>&times;</button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="search-mobile" className="block text-xs font-bold text-gray-600 mb-1">Tìm kiếm</label>
            <div className="relative">
              <input
                id="search-mobile"
                type="text"
                placeholder="Tên, địa danh..."
                className="pl-9 pr-9 w-full px-2 py-2 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none text-sm bg-cyan-50"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
              <span className="absolute left-2 top-2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>
              </span>
              {search && (
                <button
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearch("")}
                  aria-label="Xóa tìm kiếm"
                  tabIndex={0}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Loại địa điểm</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType("")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  selectedType === "" ? "bg-cyan-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              {typeOptions.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedType === type ? "bg-cyan-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating, reviewCount, small = false }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  const starSize = small ? "w-3 h-3" : "w-4 h-4";
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={`full-${i}`} className={`${starSize} text-amber-400`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }
  
  // Half star
  if (halfStar) {
    stars.push(
      <svg key="half" className={`${starSize} text-amber-400`} viewBox="0 0 20 20">
        <defs>
          <linearGradient id="halfGradient">
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#D1D5DB" />
          </linearGradient>
        </defs>
        <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg key={`empty-${i}`} className={`${starSize} text-gray-300`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }
  
  return (
    <div className="flex items-center">
      <div className="flex items-center mr-1">
        {stars}
      </div>
      <span className={`${small ? "text-xs" : "text-sm"} font-medium text-gray-600`}>
        {rating ? rating.toFixed(1) : "0.0"}
        {reviewCount !== undefined && (
          <span className="text-gray-400 ml-1">
            ({reviewCount})
          </span>
        )}
      </span>
    </div>
  );
}

function RatingBadge({ rating }) {
  let bgColor;
  if (rating >= 4.5) bgColor = "bg-green-500";
  else if (rating >= 4) bgColor = "bg-green-400";
  else if (rating >= 3.5) bgColor = "bg-amber-400";
  else if (rating >= 3) bgColor = "bg-amber-500";
  else bgColor = "bg-red-400";
  
  return (
    <div className={`${bgColor} text-white text-xs font-bold px-2 py-1 rounded flex items-center`}>
      <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {rating.toFixed(1)}
    </div>
  );
}

function SkeletonDestinationCard() {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg animate-pulse bg-gray-100 flex flex-col h-full min-w-[170px] max-w-[210px]">
      <div className="w-full h-28 bg-gray-300"></div>
      <div className="p-3 flex-1 flex flex-col">
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="flex space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-gray-200"></div>
          ))}
          <div className="w-8 h-3 bg-gray-200 rounded ml-1"></div>
        </div>
        <div className="mt-auto h-7 w-full bg-cyan-200/60 rounded-xl"></div>
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
    <div className="py-4 sm:py-10 px-2 sm:px-4 max-w-7xl mx-auto">
      <div className="mb-6 animate-fadeIn">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-center text-cyan-800 mb-2 leading-tight">
          <span className="inline-block animate-float">Các địa điểm Cà Mau Nổi Bật</span>
        </h2>
        <p className="text-center text-blue-900 max-w-2xl mx-auto mb-5 text-sm sm:text-lg px-2 leading-relaxed">
          Khám phá các địa điểm du lịch hấp dẫn, trải nghiệm cảnh đẹp thiên nhiên, văn hóa & ẩm thực Cà Mau. Đặt tour để tận hưởng chuyến đi trọn vẹn!
        </p>
      </div>

      <div className="hidden md:block mb-5">
        <div className="bg-white rounded-xl shadow p-4 border border-cyan-100 flex gap-6 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, địa danh..."
              className="px-4 py-2 w-full border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none transition bg-cyan-50 text-base"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 whitespace-nowrap">
            <button
              onClick={() => setSelectedType("")}
              className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                selectedType === "" ? "bg-cyan-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            {typeOptions.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  selectedType === type ? "bg-cyan-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        className="fixed md:hidden bottom-4 right-4 z-30 bg-cyan-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none active:bg-cyan-700 transition-colors"
        style={{ boxShadow: "0 6px 24px 0 rgba(0,0,0,0.11)" }}
        onClick={() => setIsMobileFilterOpen(true)}
        aria-label="Bộ lọc"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
        <span className="sr-only">Bộ lọc</span>
      </button>
      <MobileFilterSheet
        open={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        search={search}
        setSearch={setSearch}
        typeOptions={typeOptions}
        selectedType={selectedType}
        setSelectedType={type => { setSelectedType(type); setIsMobileFilterOpen(false); }}
      />

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonDestinationCard key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center bg-red-50 text-red-600 py-6 px-4 rounded-xl shadow-sm border border-red-100 mb-6">
          <svg className="w-12 h-12 mx-auto text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p className="font-medium">{error.message || "Có lỗi xảy ra khi tải dữ liệu"}</p>
          <p className="text-sm mt-1">Vui lòng thử lại sau</p>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(destinationsByType).map(([type, destList]) => {
          if (selectedType && type !== selectedType) return null;
          const filteredGroup = destList.filter((d) =>
            d.name.toLowerCase().includes(search.toLowerCase())
          );
          if (!filteredGroup.length) return null;

          return (
            <div key={type} className="animate-fadeInUp">
              <div className="relative overflow-hidden rounded-xl mb-3 group">
                <div className="bg-gradient-to-r from-cyan-100 to-blue-200 flex justify-between items-center px-3 py-2 sm:px-5 sm:py-3 shadow-lg border-l-4 sm:border-l-8 border-cyan-400 rounded-xl">
                  <div className="flex items-center gap-2 z-10 relative">
                    <svg className="w-5 h-5 sm:w-8 sm:h-8 text-cyan-500 mr-1 sm:mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="drop-shadow-lg text-base sm:text-2xl font-extrabold tracking-wide text-cyan-800">{type}</span>
                  </div>
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      navigate(`/loai-dia-diem/${encodeURIComponent(type)}`);
                    }}
                    className="z-10 relative text-xs sm:text-base font-medium text-cyan-700 hover:text-cyan-900 transition-colors duration-200 flex items-center"
                  >
                    Xem thêm
                    <svg className="w-3 h-3 ml-1 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </a>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                </div>
              </div>
              <div className="sm:hidden overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex space-x-3 pl-2 w-max">
                  {filteredGroup.map((dest, idx) => (
<Link
  key={dest.id || idx}
  to={`/dia-diem/${dest.slug}`}
  className="w-40 min-w-[160px] max-w-[200px] flex-shrink-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400"
  aria-label={dest.name}
  tabIndex={0}
>
  <div className="relative h-24 overflow-hidden">
    {dest.image_url && (
      <img
        src={dest.image_url}
        alt={dest.name}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
      />
    )}
    <div className="absolute top-1 right-1 bg-cyan-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
      {dest.type}
    </div>
    {dest.average_rating > 0 && (
      <div className="absolute bottom-1 left-1">
        <RatingBadge rating={dest.average_rating || 0} />
      </div>
    )}
  </div>
  <div className="p-2">
    <h3 className="font-bold text-sm text-cyan-800 line-clamp-1 mb-1">{dest.name}</h3>
    <div className="flex items-center text-gray-500 text-xs mb-1">
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      <span className="line-clamp-1">{dest.address || 'Cà Mau'}</span>
    </div>
    <div className="mb-1.5">
      <StarRating rating={dest.average_rating || 0} reviewCount={dest.review_count || 0} small={true} />
    </div>
    <p className="text-gray-600 text-xs line-clamp-2 mb-2" dangerouslySetInnerHTML={{__html:dest.description || 'Địa điểm du lịch hấp dẫn tại Cà Mau' }}></p>
    <span className="w-full py-1.5 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-md text-xs font-medium transition-colors duration-300 flex items-center justify-center">
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      Xem chi tiết
    </span>
  </div>
</Link>
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
                    <div className="relative h-44 sm:h-48 overflow-hidden">
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
                      {dest.average_rating > 0 && (
                        <div className="absolute bottom-2 left-2">
                          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md flex items-center">
                            <RatingBadge rating={dest.average_rating || 0} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg text-cyan-800 line-clamp-1 group-hover:text-cyan-600 transition-colors">{dest.name}</h3>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mb-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span className="line-clamp-1">{dest.address || 'Cà Mau'}</span>
                      </div>
                      <div className="mb-2 mt-1">
                        <StarRating rating={dest.average_rating || 0} reviewCount={dest.review_count || 0} />
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3" dangerouslySetInnerHTML={{__html:dest.description || 'Địa điểm du lịch hấp dẫn tại Cà Mau' }}>
                      </p>
                      <div className="mt-auto">
                        <button className="w-full py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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
            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 p-2 bg-cyan-600 text-white rounded-full shadow-lg hover:bg-cyan-700 transition-colors duration-300 z-50"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
      </button>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float { 0% { transform: translateY(0px); opacity: 0; } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); opacity: 1; } }
        .animate-float { animation: float 1s ease-in-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
      `}</style>
    </div>
  );
}