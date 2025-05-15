import React, { useMemo, useState, useEffect } from "react";
import FilterSidebar from "../../components/Hotels/HotelFilter";
import HotelCard from "../../components/Hotels/HotelCard";
import { getList } from "../../api/user_api";
import FilterBar from "../../components/Hotels/FilterBar";
import SaleBanner from "../../components/Hotels/SaleBanner";
import { useQuery } from "@tanstack/react-query";
import { FaSortAmountDown } from "react-icons/fa";
export default function HotelListPage() {
  const { data: hotel = [], isLoading: loading, error } = useQuery({
    queryKey: ['hotel'],
    queryFn: () => getList('hotels'),
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  const [currentFilter, setCurrentFilter] = useState({
    priceInRange: [],
    hotelRatingStar: [],
    price: [],
    amenities: [],
    propertyType: [],
    guestRating: [],
  });

  const [filterPopulate, setFilterPopular] = useState({
    popular: [],
    view: "grid",
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [activeTab, setActiveTab] = useState("listing");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const filteredHotels = useMemo(() => {
    let result = [...hotel];
    if (currentFilter.priceInRange.length > 0) {
      result = result.filter(h => {
        let match = false;
        currentFilter.priceInRange.forEach(range => {
          if (range === "over2m" && h.min_price > 2000000) match = true
          if (range === "over1m" && h.min_price > 1000000) match = true
          if (range === "under500k" && h.min_price < 500000) match = true
        })
        return match
      })
    }
    if (currentFilter.hotelRatingStar.length > 0) {
      result = result.filter(h => {
        let match = false;
        currentFilter.hotelRatingStar.forEach(rating => {
          if (rating === 1 && h.star_rating == 1) match = true
          if (rating === 2 && h.star_rating == 2) match = true
          if (rating === 3 && h.star_rating == 3) match = true
          if (rating === 4 && h.star_rating == 4) match = true
          if (rating === 5 && h.star_rating == 5) match = true
        })
        return match
      })
    }
    if (typeof currentFilter.price === 'number' && currentFilter.price > 0) {
      result = result.filter(h => h.min_price <= currentFilter.price);
    }
    if (Array.isArray(filterPopulate.popular) && filterPopulate.popular.length > 0) {
      const sortType = filterPopulate.popular[0];
      if (sortType === "price-asc") {
        result.sort((a, b) => a.min_price - b.min_price);
      } else if (sortType === "price-desc") {
        result.sort((a, b) => b.min_price - a.min_price);
      } else if (sortType === "rating-desc") {
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
    }
    return result;
  }, [hotel, currentFilter, filterPopulate]);

  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    setFilterLoading(true);
    const timer = setTimeout(() => {
      setFilterLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentFilter, filterPopulate, hotel]);

  const handleFilter = (filter) => {
    setCurrentFilter(filter);
    if (isMobile && showMobileFilter) {
      setShowMobileFilter(false);
    }
  }

  const handleFilterPopular = (filter) => {
    setFilterPopular(filter);
    if (showSortOptions) {
      setShowSortOptions(false);
    }
  }

  const handleApplyFilters = () => {
    setShowMobileFilter(false);
  }

  const SkeletonCard = () => (
    <div className="animate-pulse rounded-xl bg-gray-100 h-40 mb-4 w-full" />
  );

  const MobileFilterButtons = () => (
    <div className="flex justify-between gap-2 px-3 py-2 bg-white">
      <button
        className={`flex-1 flex items-center justify-center gap-1 border rounded-full py-2 px-3 ${activeTab === "map" ? "bg-[#09a6e0] text-white border-[#09a6e0]" : "bg-[#e8f6fc] text-[#09a6e0] border-[#09a6e0]"
          }`}
        onClick={() => setActiveTab("map")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
          <line x1="8" y1="2" x2="8" y2="18"></line>
          <line x1="16" y1="6" x2="16" y2="22"></line>
        </svg>
        <span>Bản đồ</span>
      </button>
      <button
        className={`flex-1 flex items-center justify-center gap-1 border rounded-full py-2 px-3 ${showSortOptions ? "bg-[#09a6e0] text-white border-[#09a6e0]" : "bg-white text-gray-700 border-gray-300"
          }`}
        onClick={() => setShowSortOptions(!showSortOptions)}
      >
        <FaSortAmountDown />
        <span>Sắp xếp</span>
      </button>
      <button
        className={`flex-1 flex items-center justify-center gap-1 border rounded-full py-2 px-3 ${showMobileFilter ? "bg-[#09a6e0] text-white border-[#09a6e0]" : "bg-white text-gray-700 border-gray-300"
          }`}
        onClick={() => setShowMobileFilter(!showMobileFilter)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        <span>Bộ lọc</span>
      </button>
    </div>
  );

  const MobileSortOptions = () => {
    const sortOptions = [
      { label: 'Độ phổ biến', value: 'popularity' },
      { label: 'Giá thấp đến cao', value: 'price-asc' },
      { label: 'Giá cao đến thấp', value: 'price-desc' },
      { label: 'Đánh giá cao nhất', value: 'rating-desc' }
    ];

    const currentSort = filterPopulate.popular[0] || 'popularity';

    return (
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-lg z-50 transform transition-transform" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Sắp xếp theo</h3>
            <button
              onClick={() => setShowSortOptions(false)}
              className="p-1 rounded-full bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {sortOptions.map(option => (
              <div
                key={option.value}
                className={`p-3 rounded-lg flex justify-between items-center ${currentSort === option.value ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'}`}
                onClick={() => handleFilterPopular({ ...filterPopulate, popular: [option.value] })}
              >
                <span className={`font-medium ${currentSort === option.value ? 'text-blue-600' : 'text-gray-700'}`}>
                  {option.label}
                </span>
                {currentSort === option.value && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const MobileFilterPanel = () => {
    const [localFilter, setLocalFilter] = useState({ ...currentFilter });

    const updateLocalFilter = (key, value) => {
      setLocalFilter(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
      handleFilter(localFilter);
    };

    const handleReset = () => {
      setLocalFilter({
        priceInRange: [],
        hotelRatingStar: [],
        price: [],
        amenities: [],
        propertyType: [],
        guestRating: [],
      });
    };

    const priceOptions = [
      { label: "Giá trên 1 triệu", value: "over1m" },
      { label: "Giá trên 2 triệu", value: "over2m" },
      { label: "Dưới 500k", value: "under500k" },
    ];

    const starOptions = [1, 2, 3, 4, 5];

    const amenityOptions = [
      { label: "Hồ bơi", value: "pool" },
      { label: "Wifi miễn phí", value: "wifi" },
      { label: "Bãi đậu xe", value: "parking" },
      { label: "Điều hòa", value: "ac" },
      { label: "Nhà hàng", value: "restaurant" },
    ];

    const propertyTypeOptions = [
      { label: "Khách sạn", value: "hotel" },
      { label: "Resort", value: "resort" },
      { label: "Căn hộ", value: "apartment" },
      { label: "Biệt thự", value: "villa" },
      { label: "Nhà nghỉ", value: "homestay" },
    ];

    const ratingOptions = [
      { label: "Xuất sắc (9+)", value: "excellent" },
      { label: "Rất tốt (8+)", value: "very_good" },
      { label: "Tốt (7+)", value: "good" },
    ];

    const handlePriceInRangeChange = (value) => {
      const updated = localFilter.priceInRange.includes(value)
        ? localFilter.priceInRange.filter(v => v !== value)
        : [...localFilter.priceInRange, value];
      updateLocalFilter('priceInRange', updated);
    };

    const handleStarChange = (star) => {
      const updated = localFilter.hotelRatingStar.includes(star)
        ? localFilter.hotelRatingStar.filter(s => s !== star)
        : [...localFilter.hotelRatingStar, star];
      updateLocalFilter('hotelRatingStar', updated);
    };

    const handleAmenityChange = (value) => {
      const updated = localFilter.amenities?.includes(value)
        ? localFilter.amenities.filter(a => a !== value)
        : [...(localFilter.amenities || []), value];
      updateLocalFilter('amenities', updated);
    };

    const handlePropertyTypeChange = (value) => {
      const updated = localFilter.propertyType?.includes(value)
        ? localFilter.propertyType.filter(p => p !== value)
        : [...(localFilter.propertyType || []), value];
      updateLocalFilter('propertyType', updated);
    };

    const handleGuestRatingChange = (value) => {
      const updated = localFilter.guestRating?.includes(value)
        ? localFilter.guestRating.filter(r => r !== value)
        : [...(localFilter.guestRating || []), value];
      updateLocalFilter('guestRating', updated);
    };

    const activeFilterCount = Object.values(localFilter).reduce((count, filterArray) =>
      count + (Array.isArray(filterArray) ? filterArray.length : 0), 0);

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-medium">Bộ lọc</h2>
          <button onClick={() => setShowMobileFilter(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4 border-b">
            <div className="font-medium text-gray-800 mb-3">Khoảng giá</div>
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={24000000}
                value={localFilter.price || 0}
                onChange={(e) => updateLocalFilter('price', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>₫0</span>
                <span>₫{(localFilter.price || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="font-medium text-gray-800 mb-3">Lọc theo giá</div>
            <div className="grid grid-cols-1 gap-2">
              {priceOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-500"
                    checked={localFilter.priceInRange.includes(option.value)}
                    onChange={() => handlePriceInRangeChange(option.value)}
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="font-medium text-gray-800 mb-3">Hạng sao</div>
            <div className="flex flex-wrap gap-2">
              {starOptions.map(star => (
                <button
                  key={star}
                  className={`px-4 py-2 rounded-full border ${localFilter.hotelRatingStar.includes(star)
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  onClick={() => handleStarChange(star)}
                >
                  {star} <span className="text-yellow-400">★</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="font-medium text-gray-800 mb-3">Tiện nghi</div>
            <div className="grid grid-cols-2 gap-2">
              {amenityOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-500"
                    checked={localFilter.amenities?.includes(option.value)}
                    onChange={() => handleAmenityChange(option.value)}
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="font-medium text-gray-800 mb-3">Loại chỗ ở</div>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypeOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-500"
                    checked={localFilter.propertyType?.includes(option.value)}
                    onChange={() => handlePropertyTypeChange(option.value)}
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="font-medium text-gray-800 mb-3">Đánh giá khách hàng</div>
            <div className="space-y-2">
              {ratingOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-500"
                    checked={localFilter.guestRating?.includes(option.value)}
                    onChange={() => handleGuestRatingChange(option.value)}
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-between items-center sticky bottom-0 bg-white z-10">
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
          >
            Đặt lại
          </button>
          <button
            onClick={handleApply}
            className={`px-6 py-3 rounded-lg bg-blue-600 text-white font-medium flex items-center gap-2 ${activeFilterCount === 0 ? 'opacity-50' : ''
              }`}
          >
            <span>Áp dụng</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  const MobileHotelCard = ({ hotel }) => {
    const [showDetails, setShowDetails] = useState(false);
    const discount = ((hotel.original_price || 3733333) - (hotel.min_price || 2469136)) / (hotel.original_price || 3733333) * 100;

    return (
      <div className="border rounded-xl overflow-hidden shadow-sm bg-white mb-4">
        <div className="relative">
          <img
            src={hotel.image_cover || "https://via.placeholder.com/300x150"}
            alt={hotel.name}
            className="w-full h-48 object-cover"
          />
          {discount > 0 && (
            <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 text-sm font-bold">
              -{Math.round(discount)}%
            </div>
          )}
          <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>

          {hotel.promotions && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
              <div className="flex items-center gap-1 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="20 1 24 5 12 17 4 9 8 5 12 9 20 1"></polygon>
                  <path d="M5 19h-4v-4"></path>
                  <path d="M13 5v-4h4"></path>
                </svg>
                <span className="text-sm font-medium">Ưu đãi đặc biệt dành cho bạn</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{hotel.name || "Khách sạn Mường Thanh Luxury Cà Mau"}</h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                  Khách sạn
                </div>
                <div className="flex text-yellow-400">
                  {"★★★★★".substring(0, hotel.star_rating || 5)}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium flex items-center">
                {hotel.rating || '8.4'}
                <span className="text-xs text-green-600 ml-1">Tuyệt vời</span>
              </div>
              <div className="text-gray-500 text-sm">({hotel.review_count || '208'} đánh giá)</div>
            </div>
          </div>

          <div className="mt-2 text-gray-700 text-sm flex items-start gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Thành phố Cà Mau, Tỉnh Cà Mau</span>
          </div>

          {showDetails && (
            <div className="mt-3 border-t pt-3 space-y-2">
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Hồ bơi</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Wifi miễn phí</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Bữa sáng</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Điều hòa</span>
              </div>
              <p className="text-sm text-gray-600">
                Khách sạn tiện nghi với đầy đủ các dịch vụ cao cấp. Đội ngũ nhân viên thân thiện và chuyên nghiệp.
              </p>
            </div>
          )}

          <div className="mt-3 flex justify-between items-end">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 text-sm font-medium flex items-center gap-1"
            >
              {showDetails ? (
                <>
                  <span>Thu gọn</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </>
              ) : (
                <>
                  <span>Xem thêm</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </>
              )}
            </button>
            <div className="text-right">
              {hotel.original_price && (
                <div className="text-gray-500 line-through text-sm">
                  {hotel.original_price.toLocaleString()} ₫
                </div>
              )}
              <div className="text-red-500 font-bold text-xl">
                {(hotel.min_price || 2469136).toLocaleString()} ₫
              </div>
              <div className="text-gray-600 text-xs">
                /đêm (đã bao gồm thuế và phí)
              </div>
            </div>
          </div>

          <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition">
            Chọn phòng
          </button>
        </div>
      </div>
    );
  };

  const AppliedFilters = () => {
    const hasFilters = Object.values(currentFilter).some(filter =>
      Array.isArray(filter) && filter.length > 0 ||
      typeof filter === 'number' && filter > 0
    );

    if (!hasFilters) return null;

    return (
      <div className="px-3 pb-2 pt-1 overflow-x-auto flex gap-2 items-center">
        <div className="flex-shrink-0 text-gray-500 text-sm">Bộ lọc:</div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3">
          {currentFilter.priceInRange.map(range => (
            <div key={range} className="flex-shrink-0 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              {range === "over1m" && "Trên 1 triệu"}
              {range === "over2m" && "Trên 2 triệu"}
              {range === "under500k" && "Dưới 500k"}
              <button
                onClick={() => {
                  const updated = { ...currentFilter, priceInRange: currentFilter.priceInRange.filter(r => r !== range) };
                  handleFilter(updated);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}

          {currentFilter.hotelRatingStar.map(star => (
            <div key={star} className="flex-shrink-0 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              {star} Sao
              <button
                onClick={() => {
                  const updated = { ...currentFilter, hotelRatingStar: currentFilter.hotelRatingStar.filter(s => s !== star) };
                  handleFilter(updated);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}

          {typeof currentFilter.price === 'number' && currentFilter.price > 0 && (
            <div className="flex-shrink-0 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              Dưới {currentFilter.price.toLocaleString()} ₫
              <button
                onClick={() => {
                  const updated = { ...currentFilter, price: 0 };
                  handleFilter(updated);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          {(currentFilter.amenities || []).map(amenity => (
            <div key={amenity} className="flex-shrink-0 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              {amenity === "pool" && "Hồ bơi"}
              {amenity === "wifi" && "Wifi miễn phí"}
              {amenity === "parking" && "Bãi đậu xe"}
              {amenity === "ac" && "Điều hòa"}
              {amenity === "restaurant" && "Nhà hàng"}
              <button
                onClick={() => {
                  const updated = { ...currentFilter, amenities: currentFilter.amenities.filter(a => a !== amenity) };
                  handleFilter(updated);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleFilter({
            priceInRange: [],
            hotelRatingStar: [],
            price: [],
            amenities: [],
            propertyType: [],
            guestRating: [],
          })}
          className="flex-shrink-0 text-blue-600 text-xs font-medium"
        >
          Xóa tất cả
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex max-w-full mx-auto">
      {isMobile ? (
        <div className="flex flex-col w-full bg-gray-50">
          <div className="bg-white pb-1 sticky top-0 z-30 border-b">
            <div className="h-[56px] flex items-center px-4 border-b">
              <button className="mr-3" onClick={() => window.history.back()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div>
                <h1 className="font-semibold">Tỉnh Cà Mau</h1>
                <p className="text-xs text-gray-500">16 Th5, 2025 - 17 Th5, 2025 · 1 phòng · 2 khách</p>
              </div>
            </div>
            <MobileFilterButtons />
            <AppliedFilters />
          </div>

          <div className="px-3 py-2 flex items-center justify-between bg-white border-b">
            <div className="text-gray-800">
              <span className="font-medium">{filteredHotels.length}</span> khách sạn được tìm thấy
            </div>
            <div className="text-blue-600 text-sm font-medium flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>{filterPopulate.popular[0] === 'price-asc' ? 'Giá: Thấp đến cao' :
                filterPopulate.popular[0] === 'price-desc' ? 'Giá: Cao đến thấp' :
                  filterPopulate.popular[0] === 'rating-desc' ? 'Đánh giá cao nhất' : 'Phổ biến nhất'}</span>
            </div>
          </div>

          <div className="px-3 pt-3">
            {loading && (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-4">
                <div className="font-medium">Có lỗi xảy ra</div>
                <div className="text-sm">{error}</div>
              </div>
            )}
            {filterLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                {filteredHotels.length === 0 && !loading && (
                  <div className="bg-white rounded-xl p-6 text-center my-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy kết quả phù hợp</h3>
                    <p className="text-gray-600 mb-4">Vui lòng thử lại với bộ lọc khác hoặc điều chỉnh tiêu chí tìm kiếm của bạn</p>
                    <button
                      onClick={() => handleFilter({
                        priceInRange: [],
                        hotelRatingStar: [],
                        price: [],
                        amenities: [],
                        propertyType: [],
                        guestRating: [],
                      })}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                )}
                <div className="pb-4">
                  {filteredHotels.map((hotel) => (
                    <MobileHotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </>
            )}
          </div>
          {showMobileFilter && <MobileFilterPanel />}
          {showSortOptions && <MobileSortOptions />}
        </div>
      ) : (
        <div className="min-h-screen flex gap-3 max-w-7xl mx-auto py-5 px-4">
          <div className="hidden md:block w-80 ">
            <FilterSidebar onFilter={handleFilter} />
          </div>
          <main className="flex flex-col gap-3 w-full">
            <div
              className="sticky top-[60px] z-20 bg-white flex flex-col sm:flex-row sm:items-center justify-end gap-3 py-3"
            >
              <FilterBar onFilter={handleFilterPopular} count={filteredHotels.length} />
            </div>
            <SaleBanner />
            <div>
              {loading && <div></div>}
              {error && <div className="text-red-500">{error}</div>}
              {filterLoading ? (
                <>
                  <SkeletonCard className="max-w-full h-[172px]" />
                  <SkeletonCard className="max-w-full h-[172px]" />
                  <SkeletonCard className="max-w-full h-[172px]" />
                </>
              ) : (
                <>
                  {filteredHotels.length === 0 && !loading && (
                    <div className="mx-auto max-w-md mt-10 px-6 py-5 text-gray-800 rounded-xl text-center text-lg font-medium animate-fade-in">
                      Không tìm thấy khách sạn phù hợp
                    </div>
                  )}
                  <div
                    className={`grid ${filterPopulate.view === "grid"
                        ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3"
                        : "grid-cols-1"
                      }`}
                  >
                    {filteredHotels.map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} view={filterPopulate.view} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}