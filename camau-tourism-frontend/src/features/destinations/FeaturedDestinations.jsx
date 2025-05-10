import React, { useState, useMemo } from "react";
import DestinationCard from "../../components/DestinationCard";
import FilterBars from "../../components/FilterBars";
import { getList } from "../../api/user_api";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function SkeletonDestinationCard() {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg animate-pulse bg-gray-100 flex flex-col h-full">
      <div className="w-full h-52 bg-gray-300"></div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="mt-auto h-9 w-full bg-cyan-200/60 rounded-xl"></div>
      </div>
    </div>
  );
}

export default function DestinationList() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
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
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-cyan-800 mb-2">
        Các địa điểm Du Lịch Cà Mau Nổi Bật
      </h2>
      <p className="text-center text-blue-900 max-w-2xl mx-auto mb-8 text-lg">
        Khám phá các địa điểm du lịch hấp dẫn, trải nghiệm cảnh đẹp thiên nhiên, văn hóa & ẩm thực Cà Mau. Đặt tour để tận hưởng chuyến đi trọn vẹn!
      </p>

      <FilterBars
        types={typeOptions}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, địa danh..."
            className="w-64 px-4 py-2 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none transition bg-cyan-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </FilterBars>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonDestinationCard key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-6">
          {error.message || "Có lỗi xảy ra"}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Object.entries(destinationsByType).map(([type, destList]) => {
          if (selectedType && type !== selectedType) return null;
          const filteredGroup = destList.filter((d) =>
            d.name.toLowerCase().includes(search.toLowerCase())
          );
          if (!filteredGroup.length) return null;

          return (
            <React.Fragment key={type}>
              <div className="col-span-4 flex justify-between items-center bg-gradient-to-r from-cyan-100 to-blue-200 rounded-xl px-5 py-3 mb-2 mt-6 shadow-lg border-l-8 border-cyan-400 text-cyan-800 text-2xl font-extrabold tracking-wide backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-8 h-8 text-cyan-500 mr-2"
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
                  <span className="drop-shadow-lg">{type}</span>
                </div>
                <span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/loai-dia-diem/${encodeURIComponent(type)}`);
                    }}
                    className="text-base font-medium text-cyan-700 hover:underline"
                  >
                    Xem thêm
                  </a>
                </span>
              </div>

              {filteredGroup.slice(0, 4).map((dest, idx) => (
                <DestinationCard
                  key={dest.id || idx}
                  destination={dest}
                  onClick={() => navigate(`/dia-diem/${dest.slug}`)}
                />
              ))}
            </React.Fragment>
          );
        })}

        {!isLoading && !filteredDestinations.length && (
          <div className="col-span-4 text-center text-gray-400 py-10">
            Không tìm thấy địa điểm phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}