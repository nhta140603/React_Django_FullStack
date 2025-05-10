import React from "react";

export default function FilterBar({
  types = [],
  selectedType,
  onTypeChange,
  children,
}) {
  return (
    <div className="relative mb-8">
      {/* Sóng nước động */}
      {/* <div className="absolute -bottom-2 left-0 w-full h-6 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 500 40"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,15 Q125,40 250,15 T500,15 V40 H0 Z"
            fill="#3ec6e079"
          >
            <animate
              attributeName="d"
              dur="2.5s"
              repeatCount="indefinite"
              values="
                M0,15 Q125,40 250,15 T500,15 V40 H0 Z;
                M0,20 Q125,10 250,20 T500,15 V40 H0 Z;
                M0,15 Q125,40 250,15 T500,15 V40 H0 Z
              "
            />
          </path>
        </svg>
      </div> */}

      <div className="flex flex-wrap gap-4 items-center bg-gradient-to-r from-[#e0f7fa] via-[#b2ebf2] to-[#80deea] rounded-2xl shadow-xl px-6 py-5 justify-between relative z-10 overflow-hidden border border-cyan-100">
        {/* <div className="flex-shrink-0 mr-2 animate-cua-wave">
        </div> */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-cyan-800 drop-shadow">Loại địa điểm:</span>
          <div className="relative group transition-all">
            <select
              className="px-4 py-2 rounded-xl border border-cyan-200 focus:ring-2 focus:ring-cyan-400 transition-all text-cyan-900 bg-cyan-50 font-medium shadow-sm
                group-hover:scale-105 group-hover:border-cyan-400
                group-focus-within:scale-105 group-focus-within:border-cyan-400"
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
            >
              <option value="">Tất cả</option>
              {types.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-[#3ec6e0] to-[#65e0a6] rounded opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 blur-sm"></span>
          </div>
        </div>
        {children}
      </div>

      <style>{`
        @keyframes cua-wave {
          0%, 100% { transform: rotate(-8deg) scale(1.07);}
          50% { transform: rotate(10deg) scale(1.13);}
        }
        .animate-cua-wave { animation: cua-wave 2.5s infinite alternate; }
      `}</style>
    </div>
  );
}

// function CrabSVG() {
//   return (
//     <svg width="54" height="40" viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
//       {/* Thân cua */}
//       <ellipse cx="27" cy="27" rx="18" ry="10" fill="#ff884d" />
//       {/* Mắt cua */}
//       <ellipse cx="17" cy="16" rx="2.5" ry="2.5" fill="#fff"/>
//       <ellipse cx="37" cy="16" rx="2.5" ry="2.5" fill="#fff"/>
//       {/* Tròng mắt */}
//       <ellipse cx="17.7" cy="16.7" rx="1.1" ry="1.1" fill="#222" />
//       <ellipse cx="37.7" cy="16.7" rx="1.1" ry="1.1" fill="#222" />
//       {/* Miệng cười */}
//       <path d="M22 25 Q27 29 32 25" stroke="#fff" strokeWidth="2" fill="none" />
//       {/* Càng cua trái */}
//       <path d="M9,24 Q2,12 15,17 Q8,5 17,13" stroke="#ff884d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
//       {/* Càng cua phải */}
//       <path d="M45,24 Q52,12 39,17 Q46,5 37,13" stroke="#ff884d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
//       {/* Chân cua */}
//       <path d="M13,31 Q7,35 14,36" stroke="#ff884d" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
//       <path d="M41,31 Q47,35 40,36" stroke="#ff884d" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
//       <path d="M17,34 Q13,38 19,39" stroke="#ff884d" strokeWidth="1.7" fill="none" strokeLinecap="round"/>
//       <path d="M37,34 Q41,38 35,39" stroke="#ff884d" strokeWidth="1.7" fill="none" strokeLinecap="round"/>
//     </svg>
//   );
// }