import React, { useEffect, useRef } from "react";

function HeroSection() {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const offset = window.scrollY * 0.4;
        parallaxRef.current.style.transform = `translateY(-${offset}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRipple = (e) => {
    e.persist && e.persist();
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }
    button.appendChild(circle);
  };

  return (
    <section className="relative min-h-[540px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-200 via-cyan-100 to-white py-10 md:py-20">
      <div
        ref={parallaxRef}
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('src/assets/images/backgrounds/Section.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          willChange: "transform",
          transition: "transform 0.12s cubic-bezier(.4,0,.2,1)",
        }}
        decoding="async"
      />
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <path>
            <animate attributeName="d" dur="8s" repeatCount="indefinite"
              values="
                M0,80 Q360,60 720,80 T1440,80 V120H0Z;
                M0,90 Q360,110 720,90 T1440,110 V120H0Z;
                M0,80 Q360,100 720,80 T1440,60 V120H0Z;
                M0,80 Q360,60 720,80 T1440,80 V120H0Z
              "
            />
          </path>
          <path d="M0,80 Q360,60 720,80 T1440,80 V120H0Z" fill="url(#wave-gradient)" opacity="1"/>
        </svg>
      </div>

      <div className="container max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10 px-4 md:gap-14 relative z-20">
        <div className="md:w-1/2 w-full text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-blue-900 drop-shadow">
            Khám phá vẻ đẹp <span className="text-cyan-700">Cà Mau</span>
          </h1>
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start mb-4">
            <span className="border-l-4 border-cyan-500 h-8 sm:h-12 mr-0 md:mr-3 hidden md:inline-block"></span>
            <span className="italic text-cyan-600 text-base sm:text-md md:text-lg font-medium">
              <span className="hidden md:inline">"Tận cùng Tổ Quốc - Nơi đất gặp trời, biển ôm rừng"</span>
              <span className="md:hidden">"Tận cùng Tổ Quốc"</span>
            </span>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-blue-700 mb-6">
            Chạm tới cực Nam, đắm chìm trong thiên nhiên và văn hóa đặc sắc.
          </p>
          <a
            href="/tin-tuc-su-kien"
            className="cta-glow-btn inline-block px-7 py-3 font-semibold rounded-full mt-1 relative overflow-hidden shadow-lg"
            onClick={handleRipple}
            style={{ minWidth: 180, textAlign: 'center' }}
          >
            Xem tin tức mới nhất
          </a>
        </div>
        <div className="md:w-1/2 w-full flex justify-center relative mb-8 md:mb-0">
          <div className="relative">
            <svg
              className="absolute left-1/2 -top-8 -translate-x-1/2 w-24 h-10 animate-pulse text-cyan-400"
              viewBox="0 0 100 30"
              fill="none"
            >
              <path
                d="M0 20 Q 25 10 50 20 T 100 20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              >
                <animate
                  attributeName="d"
                  dur="3s"
                  repeatCount="indefinite"
                  values="
                    M0 20 Q 25 10 50 20 T 100 20;
                    M0 20 Q 25 25 50 15 T 100 20;
                    M0 20 Q 25 10 50 20 T 100 20
                  "
                />
              </path>
            </svg>
            <img
              src="src/assets/images/backgrounds/Section.jpg"
              alt="Cà Mau Nature"
              className="rounded-3xl shadow-2xl w-full object-cover border-4 border-cyan-200 aspect-[12/5] max-h-[300px]"
              style={{ background: "#e0f2fe" }}
            />
          </div>
        </div>
      </div>

      <style>
        {`
          .cta-glow-btn {
            background: linear-gradient(90deg, #22d3ee 0%, #38bdf8 100%);
            color: #fff;
            box-shadow: 0 0 20px #22d3ee99, 0 2px 8px #0ea5e955;
            transition: box-shadow 0.3s, background 0.25s;
            position: relative;
            z-index: 1;
            overflow: hidden;
          }
          .cta-glow-btn:hover {
            box-shadow: 0 0 40px #22d3eecc, 0 2px 16px #0ea5e9cc;
            background: linear-gradient(90deg, #38bdf8 0%, #22d3ee 100%);
          }
          .cta-glow-btn .ripple {
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.7s linear;
            background: rgba(255,255,255,0.45);
            pointer-events: none;
            z-index: 2;
          }
          @keyframes ripple {
            to {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}
      </style>
    </section>
  );
}

export default HeroSection;