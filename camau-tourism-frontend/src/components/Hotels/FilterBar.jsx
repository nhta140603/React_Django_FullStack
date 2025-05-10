import { useState, useEffect } from "react";
import { FaThLarge, FaListUl } from "react-icons/fa";
import { CgMenuGridO } from "react-icons/cg";
import {getList} from "../../api/user_api"
export default function FilterBar({ onFilter, count = 0 }) {
  const [popular, setPopular] = useState([])
  const popularOption = [
    { label: 'Giá thấp đến cao', value: 'price-asc' },
    { label: 'Giá cao đến thấp', value: 'price-desc' }
  ]
  const [view, setView] = useState("list")

  const handlePopularChange = (value) => {
    setPopular([value])
  }

  useEffect(() => {
    onFilter({
      popular,
      view
    });
  }, [popular, view]);
  return (
    <div className="flex items-center flex-wrap r-1ihkh82  h-[55px] gap-[240px]">
      <div className="flex flex-col w-[293px]">
        <span className="font-bold ">Tỉnh Cà Mau</span>
        <span className="text-xs">{count} nơi lưu trú được tìm thấy</span>
      </div>
      <div className="flex flex-row items-center gap-4">
        <span className="text-sm text-gray-700 font-medium">Xếp theo:</span>
        <select
          onChange={e => handlePopularChange?.(e.target.value)}
          className="appearance-none r-14lw9ot border border-transparent rounded-full px-4 py-1.5 text-sm font-semibold text-sky-600 hover:border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-100 transition cursor-pointer min-w-[140px]"
        >
          <option value="popularity">Độ phổ biến</option>
          {popularOption.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          )
          )}
        </select>

        <span className="text-gray-300 select-none px-2 hidden md:inline">|</span>

        <span className="text-sm text-gray-700 font-medium">Xem:</span>
        <div className="flex bg-gray-100 rounded-md p-1">
          <button
            onClick={() => setView("grid")}
            aria-label="Chế độ lưới"
            className={`rounded-md p-1.5 transition-all ${view === "grid"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <CgMenuGridO className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="Chế độ danh sách"
            className={`rounded-md p-1.5 transition-all ${view === "list"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <FaListUl className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}