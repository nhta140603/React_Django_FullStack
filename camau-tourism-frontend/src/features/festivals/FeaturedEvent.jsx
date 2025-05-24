import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getList } from "../../api/user_api";
import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"
import { useFetchList } from "../../hooks/useFetchList"
export default function EventsList() {
  const { data: events = [], isLoading: loading, error} = useFetchList('festivals')

  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  const getMonthFromDate = (dateString) => {
    if (!dateString) return 0;
    const [day, month] = dateString.split("/");
    return parseInt(month);
  };

  const filterEvents = (filter) => {
    setActiveFilter(filter);
  };

  const filteredEvents = events.filter((event) => {
    if (activeFilter === "all") return true;
    const currentMonth = new Date().getMonth() + 1;
    const eventMonth = getMonthFromDate(event.event_date);
    if (activeFilter === "upcoming" && eventMonth >= currentMonth) return true;
    if (activeFilter === "past" && eventMonth < currentMonth) return true;
    return false;
  });

  const eventPairs = [];
  for (let i = 0; i < filteredEvents.length; i += 2) {
    if (i + 1 < filteredEvents.length) {
      eventPairs.push([filteredEvents[i], filteredEvents[i + 1]]);
    } else {
      eventPairs.push([filteredEvents[i]]);
    }
  }

  function EventsListSkeleton() {
    const skeletonPairs = Array.from({ length: 1 }, (_, i) => i);
    return (
      <div className="space-y-4 md:space-y-8">
        {skeletonPairs.map((pairIdx) => (
          <div key={pairIdx} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[0, 1].map((idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-lg md:rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 min-h-[268px]"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-2/5 h-32 md:h-52 bg-gray-300 rounded-t-lg md:rounded-l-2xl md:rounded-t-none overflow-hidden">
                    <div className="absolute top-3 left-3 h-5 w-16 md:h-6 md:w-20 bg-yellow-200 rounded-full"></div>
                  </div>
                  <div className="relative flex flex-col p-3 md:p-6 w-full md:w-3/5 space-y-2 md:space-y-3">
                    <div className="h-5 md:h-6 w-1/2 md:w-2/3 bg-gray-300 rounded"></div>
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                      <div className="h-7 md:h-8 w-7 md:w-8 bg-gray-200 rounded-full"></div>
                      <div className="h-3 md:h-4 w-1/4 md:w-1/3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-3 md:h-4 w-1/2 md:w-2/3 bg-gray-200 rounded"></div>
                    <div className="h-3 md:h-4 w-1/3 md:w-1/2 bg-gray-200 rounded"></div>
                    <div className="flex justify-end mt-auto">
                      <div className="h-8 md:h-10 w-24 md:w-32 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pb-10 md:pb-16 max-w-full mx-auto">
      <div className="w-full h-40 md:h-96 relative overflow-hidden mb-4 md:mb-10">
        <img
          src="https://fileapidulich.surelrn.vn/Upload/Banner/Festival/30/Picture/R637122681115439248.png"
          alt="Cà Mau"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-2 md:px-4">
          <h1 className="text-2xl md:text-6xl font-bold text-white mb-2 md:mb-4 text-center drop-shadow-lg">Lễ Hội Tại Cà Mau</h1>
          <p className="text-sm md:text-xl text-white text-center max-w-xs md:max-w-2xl drop-shadow-md">
            Khám phá các sự kiện văn hóa, lễ hội và hoạt động độc đáo tại vùng đất mũi
          </p>
          <div className="mt-4 md:mt-8">
            <div className="inline-flex p-0.5 md:p-1 bg-white/20 backdrop-blur-sm rounded-full">
              <button
                onClick={() => filterEvents("all")}
                className={`px-3 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors duration-200 ${activeFilter === "all"
                    ? "bg-white text-indigo-700 shadow-md"
                    : "text-white hover:bg-white/10"
                  }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => filterEvents("upcoming")}
                className={`px-3 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors duration-200 ${activeFilter === "upcoming"
                    ? "bg-white text-indigo-700 shadow-md"
                    : "text-white hover:bg-white/10"
                  }`}
              >
                Sắp diễn ra
              </button>
              <button
                onClick={() => filterEvents("past")}
                className={`px-3 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors duration-200 ${activeFilter === "past"
                    ? "bg-white text-indigo-700 shadow-md"
                    : "text-white hover:bg-white/10"
                  }`}
              >
                Đã diễn ra
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-10 md:pb-16 max-w-2xl md:max-w-7xl mx-auto px-4">
        <Breadcrumb className="mb-4 px-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Lễ hội</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="px-2 md:px-4">
          {loading && <EventsListSkeleton />}
          {error && (
            <div className="text-center text-red-500 py-4 md:py-6">{error}</div>
          )}
          {!loading && events.length === 0 && (
            <div className="bg-indigo-50 rounded-lg md:rounded-xl p-6 md:p-10 text-center mt-6 md:mt-8">
              <svg
                className="w-10 h-10 md:w-16 md:h-16 mx-auto text-indigo-300 mb-2 md:mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-base md:text-xl font-bold text-indigo-700 mb-1 md:mb-2">
                Hiện chưa có sự kiện nào
              </h3>
              <p className="text-sm md:text-indigo-600">
                Vui lòng quay lại sau để khám phá các sự kiện hấp dẫn sắp tới tại Cà Mau.
              </p>
            </div>
          )}

          {!loading && filteredEvents.length > 0 && (
            <div className="space-y-4 md:space-y-8">
              {eventPairs.map((pair, pairIndex) => (
                <div key={pairIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {pair.map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative overflow-hidden group cursor-pointer transition-all duration-500 rounded-lg md:rounded-2xl hover:shadow-xl ${(pairIndex + index) % 3 === 0
                          ? "bg-gradient-to-r from-indigo-50 to-indigo-100"
                          : (pairIndex + index) % 3 === 1
                            ? "bg-gradient-to-r from-teal-50 to-teal-100"
                            : "bg-gradient-to-r from-amber-50 to-amber-100"
                        }`}
                      onClick={() => navigate(`/le-hoi/${event.slug}`)}
                    >
                      <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-indigo-200 to-indigo-300 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-2/5 h-32 md:min-h-[250px] overflow-hidden">
                          <img
                            src={
                              event.image_url ||
                              "https://placehold.co/400x200/indigo/white?text=Sự+Kiện"
                            }
                            alt={event.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            style={{ minHeight: "8rem" }}
                          />
                          {pairIndex === 0 && index === 0 && (
                            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-amber-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-bold shadow-lg z-10">
                              Nổi bật
                            </div>
                          )}
                        </div>
                        <div className="relative flex flex-col p-3 md:p-6 w-full md:w-3/5">
                          <h3 className="text-base md:text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300 mb-2 md:mb-3">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
                            <div
                              className={`flex items-center justify-center p-1.5 md:p-2 rounded-full ${(pairIndex + index) % 3 === 0
                                  ? "bg-indigo-200"
                                  : (pairIndex + index) % 3 === 1
                                    ? "bg-teal-200"
                                    : "bg-amber-200"
                                }`}
                            >
                              <svg
                                className="w-4 h-4 md:w-5 md:h-5 text-indigo-700"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-indigo-700">
                              {event.event_date}
                            </span>
                          </div>
                          <div className="mt-auto space-y-2 md:space-y-4">
                            {event.address && (
                              <div className="flex items-start gap-1 md:gap-2 text-gray-600 text-xs md:text-sm">
                                <svg
                                  className="w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>{event.address}</span>
                              </div>
                            )}
                            <div className="flex justify-end">
                              <div
                                className={`inline-flex items-center gap-1 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full font-medium group-hover:scale-105 transition-all duration-300 ${(pairIndex + index) % 3 === 0
                                    ? "bg-indigo-600 text-white"
                                    : (pairIndex + index) % 3 === 1
                                      ? "bg-teal-600 text-white"
                                      : "bg-amber-600 text-white"
                                  }`}
                              >
                                <span className="text-xs md:text-base">
                                  Xem chi tiết
                                </span>
                                <svg
                                  className="w-3 h-3 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {!loading && filteredEvents.length > 0 && (
            <div className="mt-10 md:mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 md:w-64 md:h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 md:w-40 md:h-40 bg-white opacity-10 rounded-full translate-y-1/3 -translate-x-1/4"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
                <div className="md:w-2/3">
                  <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3">
                    Không bỏ lỡ sự kiện nào tại Cà Mau!
                  </h3>
                  <p className="text-indigo-100 text-xs md:text-base">
                    Đăng ký nhận thông báo về các sự kiện mới và hấp dẫn nhất. Chúng tôi sẽ gửi thông tin trực tiếp đến email của bạn.
                  </p>
                </div>
                <div className="md:w-1/3 w-full">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-0.5 md:p-1 rounded-full flex">
                    <input
                      type="email"
                      placeholder="Email của bạn"
                      className="flex-1 bg-transparent px-2 py-1 md:px-4 md:py-2 text-white placeholder-indigo-200 outline-none text-xs md:text-base"
                    />
                    <button className="bg-white text-indigo-600 px-3 md:px-6 py-1 md:py-2 rounded-full font-medium hover:bg-indigo-50 transition-colors text-xs md:text-base">
                      Đăng ký
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}