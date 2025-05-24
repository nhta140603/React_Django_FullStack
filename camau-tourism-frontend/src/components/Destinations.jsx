import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getList } from '../api/user_api';
import { MotionItem } from '../components/MotionItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
function SkeletonDestinationCard({ mobile }) {
  return (
    <div className={
      `rounded-xl overflow-hidden shadow-lg bg-gray-100 flex flex-col
      ${mobile ? "min-w-[80vw] max-w-[90vw] h-[288px] mx-auto" : ""}`
    }>
      <div className={mobile ? "w-full h-40 bg-gray-300" : "w-full h-72 bg-gray-300"}></div>
    </div>
  );
}

export default function Destinations() {
  const [hoveredId, setHoveredId] = useState(null);

  const { data: destinations = [], isLoading, error } = useQuery({
    queryKey: ['destination'],
    queryFn: () => getList('destinations'),
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  const featuredDestinations = Array.isArray(destinations)
    ? destinations.filter(d => d.is_featured === true)
    : [];

  return (
    <section id="destination-section" className="py-14 sm:py-20 bg-gray-50 relative">
      <div className="container max-w-7xl mx-auto px-2 sm:px-4">
        <MotionItem y={40}>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-900 mb-4 md:mb-6">
              Điểm Đến Nổi Bật
              <div className="w-20 sm:w-24 h-1 bg-emerald-500 mx-auto mt-2 rounded-full"></div>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Khám phá những điểm đến tuyệt vời nhất tại Cà Mau với cảnh quan thiên nhiên tuyệt đẹp và trải nghiệm văn hóa độc đáo
            </p>
          </div>

          <div className="block sm:hidden relative">
            {isLoading ? (
              <SkeletonDestinationCard mobile />
            ) : error ? (
              <div className="text-center text-red-500 py-6">{error.message}</div>
            ) : (
              <div className="relative">
                <button
                  className="swiper-button-prev absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-emerald-100 p-2 rounded-full shadow transition-all"
                  style={{ left: 5 }}
                  aria-label="Trước"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  className="swiper-button-next absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-emerald-100 p-2 rounded-full shadow transition-all"
                  style={{ right: 5 }}
                  aria-label="Tiếp theo"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                </button>
                <Swiper
                  modules={[Navigation, A11y]}
                  spaceBetween={13}
                  slidesPerView={1.13}
                  centeredSlides={true}
                  navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  }}
                  className="w-full"
                  style={{ minHeight: 180, padding: '0 10px' }}
                  a11y={{
                    prevSlideMessage: 'Trước',
                    nextSlideMessage: 'Tiếp theo',
                  }}
                  initialSlide={1}
                >
                  {featuredDestinations.map((destination, idx) => (
                    <SwiperSlide key={destination.id} className="!min-w-[80vw] !max-w-[90vw]">
                      <motion.a
                        href={`/dia-diem/${destination.slug}`}
                        className="block rounded-xl overflow-hidden shadow-lg bg-white min-w-[80vw] max-w-[90vw] mx-auto transition-all duration-400"
                        initial={{ x: 80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -80, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 120 }}
                        tabIndex={0}
                        aria-label={`Điểm đến: ${destination.name}`}
                      >
                        <div className="relative h-44 sm:h-72 overflow-hidden">
                          <img
                            src={destination.image_url}
                            alt={destination.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-70"></div>
                          <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                            <h3 className="text-lg font-bold mb-2">{destination.name}</h3>
                            <div
                              className="text-xs text-white/90 line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: destination.description }}
                            />
                          </div>
                        </div>
                      </motion.a>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonDestinationCard key={i} />)
              : error
                ? <div className="col-span-full text-center text-red-500 py-6">{error.message}</div>
                : (
                  <AnimatePresence>
                    {featuredDestinations?.map((destination, idx) => (
                      <motion.a
                        key={destination.id}
                        href={`/dia-diem/${destination.slug}`}
                        className="relative group rounded-xl overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        variants={{
                          initial: { y: 20, opacity: 0 },
                          animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
                          hover: { scale: 1.038, boxShadow: "0 10px 24px rgba(16,185,129,0.15)", y: -8 }
                        }}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: idx * 0.09 }}
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
                            transition={{ duration: 0.4 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                          <div
                            className={`absolute bottom-0 left-0 w-full p-6 text-white transition-all duration-300 ${hoveredId === destination.id ? 'translate-y-0' : 'translate-y-4'}`}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                          >
                            <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                            <p
                              className={`text-sm text-white/90 opacity-0 truncate group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2`}
                              initial={{ opacity: 0 }}
                              transition={{ delay: 0.12 }}
                              dangerouslySetInnerHTML={{ __html: destination.description }}
                            />
                            <span
                              className="mt-4 inline-flex bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center"
                              initial={{ opacity: 0, y: 8 }}
                              transition={{ delay: 0.2 }}
                            >
                              <span>Khám phá</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </AnimatePresence>
                )}
          </div>

          <div className="text-center mt-12">
            <a
              href="/danh-sach-dia-diem"
              className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 gap-2 text-sm sm:text-base"
            >
              <span>Xem tất cả điểm đến</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </MotionItem>
      </div>
    </section>
  );
}