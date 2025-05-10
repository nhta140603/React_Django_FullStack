import React, { useState, useEffect } from "react";

export default function FilterSidebar({ onFilter }) {
  const [priceInRange, setPriceInRange] = useState([]);
  const [hotelRatingStar, seHotelRatingStar] = useState([]);
  const priceOptions = [
    { label: "Giá trên 1 triệu", value: "over1m" },
    { label: "Giá trên 2 triệu", value: "over2m" },
    { label: "Dưới 500k", value: "under500k" },
  ];
  const starOptions = [1, 2, 3, 4, 5];
  const MIN = 0;
  const MAX = 24000000;
  const DEFAULT = 0;
  const [price, setPrice] = useState(DEFAULT);

  const handleReset = () => {
    setPrice(DEFAULT);
    setPriceInRange([]);
    seHotelRatingStar([]);
  };
  const handlePriceChange = (value) => {
    setPriceInRange(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleStarChange = (star) => {
    seHotelRatingStar(prev =>
      prev.includes(star)
        ? prev.filter(s => s !== star)
        : [...prev, star]
    );
  };

  const handlePriceRangeChange = (value) =>{
    setPrice(Number(value))
  }
  
  useEffect(() => {
    onFilter({
      priceInRange,
      hotelRatingStar,
      price,
    });
  }, [priceInRange, hotelRatingStar, price]);

  return (
    <aside className="w-full md:w-80 p-4 bg-white rounded-2xl shadow border border-blue-100 flex flex-col gap-4 sticky top-19 h-fit">
      <div className="bg-blue-50 rounded-2xl flex flex-col items-center justify-center p-6 gap-2 mb-2" style={{backgroundImage:`url(https://ik.imagekit.io/tvlk/image/imageResource/2024/09/05/1725509884357-7c1a5596fb0e685b4d41bee6ba3b3edd.svg?tr=q-75)`}}>
        <div className="bg-white shadow rounded-full p-3 mb-2">
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M17.657 16.657L13.414 12.414A4 4 0 1 0 12 16a4 4 0 0 0 1.414-1.414l4.243 4.243a1 1 0 0 0 1.414-1.414z" />
          </svg>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 transition text-white font-bold px-4 py-2 rounded-full shadow">
          Explore on Map
        </button>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-gray-700">Khoảng giá</span>
          <button className="text-blue-500 text-sm font-medium hover:underline" onClick={handleReset}>Đặt lại</button>
        </div>
        <div className="flex items-center gap-2 my-3">
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={price}
          onChange={(e) => handlePriceRangeChange(e.target.value)}
          className="w-full"
        />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>VND 0</span>
          <span>VND {price}</span>
        </div>
      </div>
      <div>
        <div className="font-semibold text-blue-600 mb-2">Lọc phổ biến</div>
        <div className="flex flex-col gap-2 text-sm">
          {priceOptions.map(option => (
            <label key={option.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-blue-500"
                value={option.value}
                checked={priceInRange.includes(option.value)}
                onChange={() => handlePriceChange(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="font-semibold text-blue-600 mb-2">Khách sạn</div>
        {starOptions.map(star => (
          <label key={star} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-yellow-400"
              value={star}
              checked={hotelRatingStar.includes(star)}
              onChange={() => handleStarChange(star)}
            />
            <span className="flex gap-1 text-yellow-400">
              <span className="text-black">{star}</span>★
            </span>
          </label>
        ))}
      </div>
    </aside>
  );
}