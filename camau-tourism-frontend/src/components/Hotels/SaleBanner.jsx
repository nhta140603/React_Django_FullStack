import React from "react";

export default function SaleBanner() {
  return (
    <div className="w-[913px] rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-base px-6 py-4 flex items-center justify-between shadow">
      <span>🔥 EPIC SALE GIẢM ĐẾN <span className="text-yellow-300">50%</span> ĐỘC QUYỀN TRÊN APP!</span>
      <button className="ml-4 rounded-full bg-white/20 px-3 py-1.5 text-white hover:bg-white/40 text-lg font-extrabold transition">›</button>
    </div>
  );
}