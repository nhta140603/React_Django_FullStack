import React, { useState, useEffect } from 'react';
import { getList } from "../api/user_api";
import {useQuery} from "@tanstack/react-query"
function SkeletonDestinationCard() {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg animate-pulse bg-gray-100 flex flex-col">
      <div className="w-full h-72 bg-gray-300"></div>
    </div>
  );
}

export default function Destinations() {
  const [hoveredId, setHoveredId] = useState(null);
  const {data: destination = [], isLoading:loading, error } = useQuery({
      queryKey: ['destination'],
      queryFn: () => getList('destinations'),
      staleTime: 5 * 60 * 1000,
      retry: 2
  })

  const destinationFeatures = Array.isArray(destination)
    ? destination.filter(d => d.is_featured === true)
    : [];
  const skeletonCount = 3;

  return (
    <>
      {error && <div className="text-center text-red-500 py-6">{error}</div>}
      <section className="container max-w-7xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 relative inline-block">
            <span className="text-emerald-600">Điểm Đến Nổi Bật</span>
            <div className="absolute w-full h-1 bg-emerald-500 bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          </h2>
          <div className="w-20 h-1 bg-emerald-500 mx-auto mt-2 rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Khám phá những điểm đến tuyệt vời nhất tại Cà Mau với cảnh quan thiên nhiên tuyệt đẹp và trải nghiệm văn hóa độc đáo
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => <SkeletonDestinationCard key={i} />)
            : destinationFeatures.map((destination) => (
              <a
                key={destination.id}
                href={`dia-diem/${destination.slug}`}
                className="relative group rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onMouseEnter={() => setHoveredId(destination.id)}
                onMouseLeave={() => setHoveredId(null)}
                tabIndex={0}
                aria-label={`Điểm đến: ${destination.name}`}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={destination.image_url}
                    alt={destination.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-70"></div>
                  <div className={`absolute bottom-0 left-0 w-full p-6 text-white transition-all duration-300 ${hoveredId === destination.id ? 'translate-y-0' : 'translate-y-4'}`}>
                    <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                    <p className={`text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 truncate text-overflow`}>
                      {destination.description}
                    </p>
                    <span className="mt-4 inline-flex bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center">
                      <span>Khám phá</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-emerald-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>{destination.id}</span>
                </div>
              </a>
            ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex mx-auto items-center gap-2">
            <a href={`danh-sach-dia-diem/`}>
              <span>Xem tất cả điểm đến</span>
            </a>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}