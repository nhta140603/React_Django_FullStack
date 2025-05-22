import { useState, useEffect, useRef } from "react";
import { FaListUl } from "react-icons/fa";
import { CgMenuGridO } from "react-icons/cg";

export default function FilterBar({ onFilter, count = 0 }) {
  const [popular, setPopular] = useState([]);
  const [showOption, setShowOption] = useState(false);
  const popularOption = [
    { label: "Giá thấp đến cao", value: "price-asc" },
    { label: "Giá cao đến thấp", value: "price-desc" },
  ];
  const [view, setView] = useState("list");
  const dropdownRef = useRef(null);

  const handlePopularChange = (value) => {
    setPopular([value]);
    setShowOption(false);
  };

  const handleShowOption = () => setShowOption((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowOption(false);
      }
    };
    if (showOption) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOption]);

  useEffect(() => {
    onFilter({
      popular,
      view,
    });
  }, [popular, view]);

  return (
    <div className="flex items-center flex-wrap h-[55px] gap-44">
      <div className="flex flex-col w-[300px]">
        <span className="font-bold ">Tỉnh Cà Mau</span>
        <span className="text-xs">{count} nơi lưu trú được tìm thấy</span>
      </div>
      <div className="flex flex-row items-center gap-4">
        <span className="text-sm text-gray-700 font-medium">Xếp theo:</span>
        <div className="relative bg-gray-100 rounded-full" ref={dropdownRef}>
          <button
            onClick={handleShowOption}
            className="flex items-center space-x-1 px-3 py-2 transition-all duration-300 font-bold w-44 justify-between"
          >
            <span className="text-sm text-gray-700 font-medium">
              Sắp xếp theo
            </span>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              className={`transition-transform duration-300 ${showOption ? "rotate-180" : ""
                }`}
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
            </svg>
          </button>
          <div
            className={`
      absolute left-0 mt-1 
      w-44
      bg-white text-gray-800 shadow-xl rounded-xl z-50 
      overflow-hidden
      origin-top 
      transition-all duration-300 ease-in-out
      ${showOption
                ? "opacity-100 scale-y-100 pointer-events-auto"
                : "opacity-0 scale-y-75 pointer-events-none"
              }
    `}
            style={{ minHeight: "40px" }}
          >
            <ul className="">
              {popularOption.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handlePopularChange(item.value)}
                  className={`px-4 py-3 hover:bg-gray-100 cursor-pointer text-base transition rounded-md ${popular[0] === item.value
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : ""
                    }`}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <span className="text-gray-300 select-none px-2 hidden md:inline">
          |
        </span>

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