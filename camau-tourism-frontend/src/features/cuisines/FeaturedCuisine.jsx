import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getList } from "../../api/user_api";
import { useQuery } from "@tanstack/react-query";

export default function CuisineList() {
  const {data: cuisines = [], isLoading:loading, error} = useQuery({
    queryKey: ['cuisines'],
    queryFn: () => getList('cuisines'),
    staleTime: 5 * 60 * 1000, 
    retry: 2
  })
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  async function fetchCuisines() {
    try {
      setLoading(true);
      setError(null);
      const data = await getList("cuisines");
      setCuisines(data);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  const filterCuisines = (filter) => {
    setActiveFilter(filter);
  };

  const filteredCuisines = cuisines.filter(cuisine => {
    if (activeFilter === "all") return true;
    if (activeFilter === "seafood" && cuisine.tags?.includes("seafood")) return true;
    if (activeFilter === "specialty" && cuisine.tags?.includes("specialty")) return true;
    return false;
  });
  function CuisineListSkeleton() {
    const skeletons = Array.from({ length: 3 }, (_, i) => i);

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-300 mb-8 flex items-center animate-pulse">
          <svg className="w-6 h-6 text-cyan-200 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" />
          </svg>
          Khám phá các đặc sản Cà Mau
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skeletons.map(i => (
            <div key={i} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
              </div>
              <div className="p-6">
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
    <div className="pb-16 max-w-full mx-auto">
      <div className="w-full md:h-96 mb-24 relative overflow-hidden">
        <img
          src="https://fileapidulich.surelrn.vn/Upload/Banner/Cuisines/30/Picture/R637113334948765336.png"
          alt="Ẩm thực Cà Mau"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 bg-yellow-500 text-black font-medium rounded-full text-sm mb-4 animate-pulse">
              Khám phá ẩm thực
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Hương Vị Đất Mũi Cà Mau
            </h1>
            <p className="text-lg md:text-xl text-white text-center max-w-2xl mx-auto mb-8 drop-shadow-md">
              Nơi giao thoa của biển và rừng, tạo nên nét đặc trưng trong ẩm thực với hải sản tươi ngon và những món ăn dân dã đậm đà hương vị miền Tây
            </p>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg> */}
        </div>
      </div>
      <div className="pb-16 max-w-7xl mx-auto -mt-20 relative z-10">
        <div className="px-4">

          {loading && <CuisineListSkeleton />}

          {error && <div className="text-center text-red-500 py-6">{error}</div>}

          {!loading && cuisines.length === 0 && (

            <div className="rounded-xl p-10 text-center mt-8">
              <svg className="w-16 h-16 mx-auto text-cyan-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold text-cyan-700 mb-2">Hiện chưa có món ăn nào</h3>
              <p className="text-cyan-600">Vui lòng quay lại sau để khám phá các món ăn đặc sản của Cà Mau.</p>
            </div>
          )}

          {!loading && filteredCuisines.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <svg className="w-6 h-6 text-cyan-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" />
                </svg>
                Khám phá các đặc sản Cà Mau
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCuisines.map((cuisine, index) => (
                  <div
                    key={cuisine.id}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                    onClick={() => navigate(`/am-thuc/${cuisine.slug}`)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={cuisine.image || "https://placehold.co/400x300/amber/white?text=Ẩm+Thực"}
                        alt={cuisine.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">
                        {cuisine.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-4 text-gray-600 text-sm">
                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>Cà Mau, Việt Nam</span>
                      </div>

                      <p className="text-gray-600 mb-5 line-clamp-3">
                        {cuisine.description?.replace(/<[^>]*>?/gm, '') || "Món ăn đặc trưng của Cà Mau, mang đậm hương vị đất mũi phương Nam."}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-amber-100">
                              <img
                                src={cuisine.gallery?.[i] || `https://placehold.co/100/amber/white?text=${i + 1}`}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {(cuisine.gallery?.length > 3 || true) && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-500 flex items-center justify-center text-xs text-white font-medium">
                              +{(cuisine.gallery?.length - 3) || 3}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-amber-500 group-hover:text-amber-600 font-medium text-sm">
                          <span>Xem chi tiết</span>
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}