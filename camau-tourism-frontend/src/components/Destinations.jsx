import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getList } from '../api/user_api';
import { MotionItem } from '../components/MotionItem';

function SkeletonDestinationCard() {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg animate-pulse bg-gray-100 flex flex-col">
      <div className="w-full h-72 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

function Destinations() {
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
  
  const skeletonCount = 3;

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
    hover: { scale: 1.04, boxShadow: "0 10px 24px rgba(16,185,129,0.15)", y: -8 },
  };

  return (
    <section id="destination-section" className="py-20 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4">
        <MotionItem y={40}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-3 relative inline-block">
              <span>Điểm Đến Nổi Bật</span>
              <div className="w-24 h-1 bg-emerald-500 mx-auto mt-2 rounded-full"></div>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Khám phá những điểm đến tuyệt vời nhất tại Cà Mau với cảnh quan thiên nhiên tuyệt đẹp và trải nghiệm văn hóa độc đáo
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: skeletonCount }).map((_, i) => <SkeletonDestinationCard key={i} />)
              : error
                ? <div className="col-span-full text-center text-red-500 py-6">{error.message}</div>
                : (
                  <AnimatePresence>
                    {featuredDestinations?.map((destination, idx) => (
                      <motion.a
                        key={destination.id}
                        href={`/dia-diem/${destination.slug}`}
                        className="relative group rounded-xl overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        whileFocus="hover"
                        transition={{ delay: idx * 0.08 }}
                        onMouseEnter={() => setHoveredId(destination.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        tabIndex={0}
                        aria-label={`Điểm đến: ${destination.name}`}
                      >
                        <div className="relative h-72 overflow-hidden">
                          <motion.img
                            src={destination.image_url}
                            alt={destination.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.4 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                          <motion.div
                            className={`absolute bottom-0 left-0 w-full p-6 text-white transition-all duration-300 ${hoveredId === destination.id ? 'translate-y-0' : 'translate-y-4'}`}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                          >
                            <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                            <motion.p
                              className={`text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2`}
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ delay: 0.12 }}
                            >
                              {destination.description}
                            </motion.p>
                            <motion.span
                              className="mt-4 inline-flex bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center"
                              initial={{ opacity: 0, y: 8 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <span>Khám phá</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </motion.span>
                          </motion.div>
                        </div>
                      </motion.a>
                    ))}
                  </AnimatePresence>
                )}
          </div>

          <div className="text-center mt-12">
            <a 
              href="/danh-sach-dia-diem" 
              className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 gap-2"
            >
              <span>Xem tất cả điểm đến</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </MotionItem>
      </div>
    </section>
  );
}

export default Destinations;