import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import section1 from "../assets/images/backgrounds/5.jpg";
import section2 from "../assets/images/backgrounds/4.jpg";
import section3 from "../assets/images/backgrounds/3.jpg";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
const slides = [
  {
    img: section3,
    title: "Khám phá Cà Mau",
    desc: "Thiên nhiên tươi đẹp, văn hóa độc đáo và ẩm thực đặc sắc.",
    button: "Tìm hiểu thêm",
    link: "/danh-sach-dia-diem"
  },
  {
    img: section2,
    title: "Trải nghiệm Sông Nước",
    desc: "Đến với vùng đất cuối trời Nam, cảm nhận nét đẹp sông nước miệt vườn.",
    button: "Khám phá ngay",
    link: "/danh-sach-chuyen-du-lich"
  },
  {
    img: section1,
    title: "Ẩm thực Đặc Sắc",
    desc: "Thưởng thức những món ăn chỉ có ở Cà Mau.",
    button: "Xem thực đơn",
    link: "/am-thuc"
  },
];

function HeroSection() {
  const navigate = useNavigate()
  return (
    <div className="w-full min-h-[500px]">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet custom-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active'
        }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        className="h-full hero-swiper"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-[565px] flex items-center justify-center">
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.img}')` }}
              />
              <div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)"
                }}
              />
              <div className="relative z-20 max-w-6xl text-left p-6">
                <h2 className="text-4xl md:text-8xl  text-blue-400 font-bold mb-4 drop-shadow-lg animate-fadeIn">{slide.title}</h2>
                <p className="mb-8 text-lg md:text-xl text-white drop-shadow-md animate-fadeIn animation-delay-300">{slide.desc}</p>
                <button onClick={() => navigate(slide.link)} className="px-6 py-3 rounded bg-yellow-500 hover:bg-yellow-600 text-lg font-semibold shadow-lg transition duration-300 transform hover:scale-105 animate-fadeIn animation-delay-600">
                  {slide.button}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style>{`
        .hero-swiper .swiper-pagination {
          position: absolute;
          bottom: 50px !important;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 30;
        }
        
        .custom-bullet {
          width: 12px;
          height: 12px;
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          margin: 0 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
          opacity: 0.7;
        }
        
        .custom-bullet-active {
          background-color: #1e88e5;
          width: 14px;
          height: 14px;
          opacity: 1;
          box-shadow: 0 0 8px rgba(30, 136, 229, 0.8);
        }
        
        .swiper-button-next, .swiper-button-prev {
          display: none !important;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
      `}</style>
    </div>
  );
}

export default HeroSection;