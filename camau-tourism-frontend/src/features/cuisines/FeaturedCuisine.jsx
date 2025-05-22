import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getList } from "../../api/user_api";
import { useQuery } from "@tanstack/react-query";

export default function CuisineList() {
  const { data: cuisines = [], isLoading: loading, error } = useQuery({
    queryKey: ['cuisines'],
    queryFn: () => getList('cuisines'),
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  const filteredCuisines = cuisines.filter(cuisine => {
    if (activeFilter === "all") return true;
    if (activeFilter === "seafood" && cuisine.tags?.includes("seafood")) return true;
    if (activeFilter === "specialty" && cuisine.tags?.includes("specialty")) return true;
    return false;
  });
  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
      function handler() {
        setIsMobile(window.innerWidth < 768);
      }
      window.addEventListener("resize", handler);
      return () => window.removeEventListener("resize", handler);
    }, []);
    return isMobile;
  }
  const isMobile = useIsMobile();
  function CuisineListSkeleton() {
    const skeletons = Array.from({ length: 3 }, (_, i) => i);
    return (
      <div>
        <h2 className="text-lg md:text-2xl font-bold text-gray-300 mb-6 md:mb-8 flex items-center animate-pulse">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-cyan-200 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" />
          </svg>
          Khám phá các đặc sản Cà Mau
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {skeletons.map(i => (
            <div key={i} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
              </div>
              <div className="p-4 md:p-6">
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 bg-amber-200 rounded-full"></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded mb-5"></div>
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-amber-100"></div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-300"></div>
                  </div>
                  <div className="h-4 w-20 bg-amber-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="pb-8 md:pb-16 max-w-full mx-auto">
      <div className="relative w-full h-48 xs:h-56 md:h-96 mb-10 md:mb-24 overflow-hidden rounded-b-3xl">
        <img
          src="https://fileapidulich.surelrn.vn/Upload/Banner/Cuisines/30/Picture/R637113334948765336.png"
          alt="Ẩm thực Cà Mau"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-3">
          <div className="max-w-xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-yellow-400 text-black font-medium rounded-full text-xs md:text-sm mb-3 animate-pulse">
              Khám phá ẩm thực
            </span>
            <h1 className="text-2xl xs:text-3xl md:text-5xl font-bold text-white mb-3 md:mb-6 drop-shadow-lg leading-tight">
              Hương Vị Đất Mũi Cà Mau
            </h1>
            <p className="text-sm xs:text-base md:text-xl text-white text-center max-w-2xl mx-auto mb-2 md:mb-8 drop-shadow-md">
              Nơi giao thoa của biển và rừng, tạo nên nét đặc trưng trong ẩm thực với hải sản tươi ngon và những món ăn dân dã đậm đà hương vị miền Tây
            </p>
          </div>
        </div>
      </div>
      <div className="pb-8 md:pb-16 max-w-7xl mx-auto -mt-8 md:-mt-20 relative z-10">
        <div className="px-3 xs:px-3 md:px-4">

          {loading && <CuisineListSkeleton />}

          {error && <div className="text-center text-red-500 py-6">{error}</div>}

          {!loading && cuisines.length === 0 && (
            <div className="rounded-xl p-8 md:p-10 text-center mt-8 bg-white/80">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-cyan-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-base md:text-xl font-bold text-cyan-700 mb-2">Hiện chưa có món ăn nào</h3>
              <p className="text-cyan-600 text-sm md:text-base">Vui lòng quay lại sau để khám phá các món ăn đặc sản của Cà Mau.</p>
            </div>
          )}

          {!loading && filteredCuisines.length > 0 && (
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6 md:mb-8 flex items-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" />
                </svg>
                Khám phá các đặc sản Cà Mau
              </h2>
              {isMobile ? (
                <div className="flex gap-2 min-h-auto">
                  {filteredCuisines.map((cuisine) => (
                    <div
                      key={cuisine.id}
                      className="group bg-white rounded-2xl shadow-md hover:shadow-xl active:scale-95 transition-all duration-200 overflow-hidden cursor-pointer" onClick={() => navigate(`/am-thuc/${cuisine.slug}`)}
                    >
                      <div className="aspect-[4/2] h-auto overflow-hidden">
                        <img
                          src={cuisine.image || "https://placehold.co/400x300/amber/white?text=Ẩm+Thực"}
                          alt={cuisine.name}
                          className="w-full h-full object-cover object-center rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-1">
                        <h3 className="text-xs font-bold text-gray-800 mb-1 line-clamp-1">
                          {cuisine.name}
                        </h3>
                        <div className="flex items-center text-yellow-600 text-xs gap-1 mb-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.381-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.786.57-1.84-.196-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                          <span>
                            {cuisine.average_rating != null ? cuisine.average_rating : "Chưa có đánh giá"}
                          </span>
                          <span className="text-gray-400 mx-1">|</span>
                          <span className="text-gray-600">{cuisine.review_count || "1,234"} đánh giá</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
                  {filteredCuisines.map((cuisine) => (
                    <div
                      key={cuisine.id}
                      className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-md md:shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 md:active:scale-100 cursor-pointer"
                      onClick={() => navigate(`/am-thuc/${cuisine.slug}`)}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={cuisine.image || "https://placehold.co/400x300/amber/white?text=Ẩm+Thực"}
                          alt={cuisine.name}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-2 xs:p-3 md:p-6">
                        <h3 className="text-base xs:text-lg md:text-xl font-bold text-gray-800 mb-1 xs:mb-2 md:mb-3 group-hover:text-amber-600 transition-colors line-clamp-1">
                          {cuisine.name}
                        </h3>
                        <div className="flex items-center gap-1 xs:gap-2 mb-1 xs:mb-2 md:mb-4 text-gray-600 text-xs xs:text-sm">
                          <svg className="w-3 h-3 xs:w-4 xs:h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>Cà Mau, Việt Nam</span>
                        </div>

                        <p className="text-gray-600 mb-2 md:mb-5 line-clamp-2 xs:line-clamp-2 md:line-clamp-3 text-xs xs:text-sm md:text-base">
                          {cuisine.description?.replace(/<[^>]*>?/gm, '') || "Món ăn đặc trưng của Cà Mau, mang đậm hương vị đất mũi phương Nam."}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-yellow-600 text-xs gap-1 mb-1 md:mb-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.381-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.786.57-1.84-.196-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                            </svg>
                            <span>
                              {cuisine.average_rating != null ? cuisine.average_rating : "Chưa có đánh giá"}
                            </span>
                            <span className="text-gray-400 mx-1">|</span>
                            <span className="text-gray-600">{cuisine.review_count || "0"} đánh giá</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500 group-hover:text-amber-600 font-medium text-xs xs:text-sm">
                            <span>Xem</span>
                            <svg className="w-4 h-4 xs:w-4 xs:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}