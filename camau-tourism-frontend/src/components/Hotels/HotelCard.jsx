import React, { useState } from "react";
import {
  FaStar, FaMapMarkerAlt, FaRegBookmark, FaBolt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HotelCard({ hotel, view = "list" }) {
  const images = hotel.images || [hotel.image_cover || hotel.image];
  const [imgIdx, setImgIdx] = useState(0);  
  const navigate = useNavigate();

  if (view === "grid") {
    return (
      <div className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow hover:shadow-lg transition max-w-xs w-full mx-auto relative group">
        <div className="relative w-full h-48">
          <img
            src={images[imgIdx] || "/no-image.png"}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <FaRegBookmark className="absolute top-2 right-2 text-gray-400 text-xl bg-white/80 rounded-full p-1" />
        </div>
        <div className="flex px-2 py-2 gap-1">
          {images.slice(0, 4).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Thumb ${i + 1}`}
              className={`w-1/4 h-7 object-cover rounded cursor-pointer border
                ${imgIdx === i ? "border-blue-500" : "border-transparent"}
                hover:border-blue-300`}
              onMouseEnter={() => setImgIdx(i)}
            />
          ))}
        </div>
        <div className="flex-1 flex flex-col justify-between px-4 pb-4">
          <div>
            <div className="font-bold text-base text-gray-900 mt-2 truncate">{hotel.name}</div>
            <div className="flex items-center gap-2 mb-1 mt-1">
              <span className="text-sky-700 text-xs font-bold px-2 py-0.5 rounded bg-sky-100">Khách sạn</span>
              <span className="flex gap-0.5">{Array(hotel.star_rating).fill(0).map((_,i) => <FaStar key={i} className="text-yellow-400 text-xs" />)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
              <FaMapMarkerAlt className="text-blue-400" /> <span className="truncate">{hotel.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 mb-2">
            <div className="font-bold text-sky-600 text-sm">
              {hotel.rating?.toFixed(1) || "8.0"}
            </div>
            <span className="text-xs text-gray-500">
              ({hotel.reviews || "0"} đánh giá)
            </span>
            <span className="text-xs text-gray-500">{hotel.ratingText || "Rất tốt"}</span>
          </div>
          <div className="text-right">
            {hotel.price && (
              <div className="line-through text-gray-400 text-xs mb-1 animate-fadeIn">{hotel.min_price.toLocaleString()} VND</div>
            )}
            <div className="text-pink-600 font-black text-xl drop-shadow animate-bounce">{hotel.min_price.toLocaleString()} VND</div>
            {hotel.onlyOneLeft && (
              <div className="text-orange-500 text-xs font-semibold mt-1 animate-pulse">Chỉ còn 1 phòng giá sốc!</div>
            )}
            <div className="text-xs text-gray-400">Chưa bao gồm thuế và phí</div>
          </div>
          <button
            onClick={() => navigate(`/khach-san/${hotel.slug}`)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-400 transition text-white font-extrabold px-4 py-2 rounded-xl mt-2 shadow-lg text-base flex items-center gap-2 group-hover:scale-105 active:scale-95 duration-200 w-full"
          >
            <FaBolt className="animate-spin-slow" /> Chọn phòng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden transition relative group">
      <div className="flex flex-col min-w-[210px] w-[210px] h-[170px] mr-4 relative">
        <img
          src={images[imgIdx] || "/no-image.png"}
          alt={hotel.name}
          className="rounded-tl-xl rounded-bl-xl w-full h-[130px] object-cover"
        />
        <div className="flex mt-[2px] gap-[2px] px-1">
          {images.slice(0, 4).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Thumb ${i + 1}`}
              className={`w-1/4 h-[34px] object-cover rounded cursor-pointer border
                ${imgIdx === i ? "border-blue-500" : "border-transparent"}
                hover:border-blue-300`}
              onMouseEnter={() => setImgIdx(i)}
            />
          ))}
        </div>
        <FaRegBookmark className="absolute top-2 right-2 text-gray-400 text-xl bg-white/80 rounded-full p-1" />
      </div>
      <div className="flex-1 flex flex-col justify-between py-3 pr-4">
        <div>
          <div className="font-bold text-lg text-gray-900">{hotel.name}</div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sky-700 text-xs font-bold px-2 py-0.5 rounded bg-sky-100">Khách sạn</span>
            <span className="flex gap-0.5">{Array(hotel.star_rating).fill(0).map((_,i) => <FaStar key={i} className="text-yellow-400 text-xs" />)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm ">
            <FaMapMarkerAlt className="text-blue-400" /> {hotel.address}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="font-bold text-sky-600 text-base">
            {hotel.rating?.toFixed(1) || "8.0"}
          </div>
          <span className="text-xs text-gray-500">
            ({hotel.reviews || "0"} đánh giá)
          </span>
          <span className="text-xs text-gray-500">{hotel.ratingText || "Rất tốt"}</span>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between bg-white min-w-[185px] pl-6 pr-4 py-4 border-l border-gray-100">
        <div className="text-right">
          {hotel.price && (
            <div className="line-through text-gray-400 text-sm mb-1 animate-fadeIn">{hotel.min_price.toLocaleString()} VND</div>
          )}
          <div className="text-pink-600 font-black text-2xl drop-shadow animate-bounce">{hotel.min_price.toLocaleString()} VND</div>
          {hotel.onlyOneLeft && (
            <div className="text-orange-500 text-xs font-semibold mt-1 animate-pulse">Chỉ còn 1 phòng giá sốc!</div>
          )}
          <div className="text-xs text-gray-400">Chưa bao gồm thuế và phí</div>
        </div>
        <button onClick={() => navigate(`/khach-san/${hotel.slug}`)} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-400 transition text-white font-extrabold px-8 py-3 rounded-2xl mt-4 shadow-lg text-lg flex items-center gap-2 group-hover:scale-105 active:scale-95 duration-200">
          <FaBolt className="animate-spin-slow" /> Chọn phòng
        </button>
      </div>
    </div>
  );
}