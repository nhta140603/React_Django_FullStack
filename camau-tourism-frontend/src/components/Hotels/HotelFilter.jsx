import React, { useState, useEffect } from "react";
import { FaThLarge, FaListUl, FaMapMarkerAlt, FaStar, FaChevronDown } from "react-icons/fa";
export default function FilterSidebar({ onFilter }) {
  const [priceInRange, setPriceInRange] = useState([]);
  const [hotelRatingStar, setHotelRatingStar] = useState([]);
  const [expanded, setExpanded] = useState({
    price: true,
    popular: true,
    stars: true,
    amenities: false
  });
  
  const priceOptions = [
    { label: "Dưới 500K", value: "under500k" },
    { label: "500K - 1 triệu", value: "500k-1m"},
    { label: "1 triệu - 2 triệu", value: "1m-2m"},
    { label: "Trên 2 triệu", value: "over2m"},
  ];
  
  const amenityOptions = [
    { label: "Hồ bơi", value: "pool" },
    { label: "Bữa sáng miễn phí", value: "breakfast" },
    { label: "Wifi miễn phí", value: "wifi" },
    { label: "Phòng tập gym", value: "gym" },
    { label: "Đưa đón sân bay", value: "airport-shuttle" },
  ];
  
  const starOptions = [5, 4, 3, 2, 1];
  const MIN = 0;
  const MAX = 5000000;
  const DEFAULT = 2000000;
  const [price, setPrice] = useState(DEFAULT);
  const [amenities, setAmenities] = useState([]);

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleReset = () => {
    setPrice(DEFAULT);
    setPriceInRange([]);
    setHotelRatingStar([]);
    setAmenities([]);
  };
  
  const handlePriceChange = (value) => {
    setPriceInRange(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleStarChange = (star) => {
    setHotelRatingStar(prev =>
      prev.includes(star)
        ? prev.filter(s => s !== star)
        : [...prev, star]
    );
  };

  const handleAmenityChange = (value) => {
    setAmenities(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handlePriceRangeChange = (value) => {
    setPrice(Number(value));
  };
  
  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  useEffect(() => {
    onFilter({
      priceInRange,
      hotelRatingStar,
      price,
      amenities
    });
  }, [priceInRange, hotelRatingStar, price, amenities]);

  return (
    <aside className="w-full md:w-80 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col sticky top-4 h-fit overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <h3 className="font-bold text-lg">Bộ lọc tìm kiếm</h3>
        <p className="text-sm text-blue-100">Tìm nơi lưu trú phù hợp nhất với bạn</p>
      </div>
      
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-gray-700">Bộ lọc đã chọn:</span>
          <button 
            onClick={handleReset}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition flex items-center gap-1"
          >
            Đặt lại tất cả
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {priceInRange.length > 0 && priceInRange.map(option => (
            <span key={option} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              {priceOptions.find(o => o.value === option)?.label}
              <button 
                onClick={() => handlePriceChange(option)}
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                ×
              </button>
            </span>
          ))}
          {hotelRatingStar.length > 0 && hotelRatingStar.map(star => (
            <span key={star} className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              {star} sao
              <button 
                onClick={() => handleStarChange(star)}
                className="ml-1 text-yellow-500 hover:text-yellow-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        
        <div className="bg-blue-50 rounded-xl mb-6 overflow-hidden">
          <div className="h-32 w-full bg-blue-200 relative">
            <img 
              src="https://ik.imagekit.io/tvlk/image/imageResource/2024/09/05/1725509884357-7c1a5596fb0e685b4d41bee6ba3b3edd.svg" 
              alt="Map background" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
              <div className="bg-white rounded-full p-3 shadow-md">
                <FaMapMarkerAlt className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-blue-800">Xem trên bản đồ</span>
            </div>
          </div>
          <div className="p-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-2.5 rounded-lg shadow-sm">
              Hiển thị kết quả trên bản đồ
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <button 
            className="flex justify-between items-center w-full font-semibold text-gray-800 mb-3"
            onClick={() => toggleSection('price')}
          >
            <span>Khoảng giá</span>
            <FaChevronDown className={`transition-transform ${expanded.price ? 'rotate-180' : ''}`} />
          </button>
          
          {expanded.price && (
            <>
              <div className="flex items-center gap-2 my-3">
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  step={100000}
                  value={price}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{formatPrice(0)}</span>
                <span className="font-medium text-blue-600">{formatPrice(price)}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="mb-6">
          <button 
            className="flex justify-between items-center w-full font-semibold text-gray-800 mb-3"
            onClick={() => toggleSection('popular')}
          >
            <span>Lọc phổ biến</span>
            <FaChevronDown className={`transition-transform ${expanded.popular ? 'rotate-180' : ''}`} />
          </button>
          
          {expanded.popular && (
            <div className="flex flex-col gap-2.5 ml-1">
              {priceOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      value={option.value}
                      checked={priceInRange.includes(option.value)}
                      onChange={() => handlePriceChange(option.value)}
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors"></div>
                    <svg className="absolute left-0.5 top-0.5 w-4 h-4 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <button 
            className="flex justify-between items-center w-full font-semibold text-gray-800 mb-3"
            onClick={() => toggleSection('stars')}
          >
            <span>Xếp hạng sao</span>
            <FaChevronDown className={`transition-transform ${expanded.stars ? 'rotate-180' : ''}`} />
          </button>
          
          {expanded.stars && (
            <div className="flex flex-col gap-2.5 ml-1">
              {starOptions.map(star => (
                <label key={star} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      value={star}
                      checked={hotelRatingStar.includes(star)}
                      onChange={() => handleStarChange(star)}
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-yellow-400 peer-checked:border-yellow-400 transition-colors"></div>
                    <svg className="absolute left-0.5 top-0.5 w-4 h-4 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex items-center">
                    <span className="flex text-yellow-500">
                      {[...Array(star)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <button 
            className="flex justify-between items-center w-full font-semibold text-gray-800 mb-3"
            onClick={() => toggleSection('amenities')}
          >
            <span>Tiện nghi</span>
            <FaChevronDown className={`transition-transform ${expanded.amenities ? 'rotate-180' : ''}`} />
          </button>
          
          {expanded.amenities && (
            <div className="flex flex-col gap-2.5 ml-1">
              {amenityOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      value={option.value}
                      checked={amenities.includes(option.value)}
                      onChange={() => handleAmenityChange(option.value)}
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors"></div>
                    <svg className="absolute left-0.5 top-0.5 w-4 h-4 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-2.5 rounded-lg shadow-sm">
          Áp dụng bộ lọc
        </button>
      </div>
    </aside>
  );
}