import React from 'react';
import { Link } from 'react-router-dom';
import { MotionItem } from '../components/MotionItem';

function CTASection() {
  return (
    <section className="py-8 md:py-16 bg-gradient-to-r from-yellow-400 to-amber-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 md:opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
          <path fill="#ffffff" fillOpacity="0.2" d="M0,864L80,864C160,864,320,864,480,827.7C640,792,800,720,960,685.3C1120,651,1280,653,1440,674.7C1600,696,1760,739,1840,760L1920,781L1920,1080L1840,1080C1760,1080,1600,1080,1440,1080C1280,1080,1120,1080,960,1080C800,1080,640,1080,480,1080C320,1080,160,1080,80,1080L0,1080Z"></path>
          <path fill="#ffffff" fillOpacity="0.2" d="M0,720L80,697C160,674,320,629,480,592C640,555,800,528,960,528C1120,528,1280,555,1440,565.3C1600,576,1760,571,1840,568.7L1920,566L1920,1080L1840,1080C1760,1080,1600,1080,1440,1080C1280,1080,1120,1080,960,1080C800,1080,640,1080,480,1080C320,1080,160,1080,80,1080L0,1080Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-6 sm:px-6 relative z-10">
        <MotionItem direction="right" x={30}>
          <div className="max-w-xl md:max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 drop-shadow-sm">
              Sẵn Sàng Cho Chuyến Đi Tiếp Theo?
            </h2>
            <p className="text-sm sm:text-base md:text-sm text-white/90 mb-5 md:mb-8 max-w-2xl mx-auto">
              Đặt tour, khách sạn, phương tiện và hơn thế nữa - tất cả chỉ trong một vài cú nhấp chuột. Khám phá Cà Mau theo cách của bạn!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link 
                to="/lien-he" 
                className="bg-white text-yellow-500 hover:bg-gray-100 font-bold px-6 py-3 md:px-8 md:py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                Liên hệ ngay
              </Link>
              <Link 
                to="/danh-sach-chuyen-du-lich" 
                className="bg-transparent hover:bg-white/20 text-white border-2 border-white/80 font-bold px-6 py-3 md:px-8 md:py-4 rounded-full transition-all duration-300 text-sm md:text-base"
              >
                Xem các tour
              </Link>
            </div>
          </div>
        </MotionItem>
      </div>
    </section>
  );
}

export default CTASection;