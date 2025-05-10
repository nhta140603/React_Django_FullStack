import React from "react";

export default function DestinationCard({ destination, onClick }) {
  return (
    <div
      className="group bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col relative transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <div
          className="h-56 bg-gray-200 bg-center bg-cover"
          style={{
            backgroundImage: `url(${destination.image_url})`,
            minHeight: 220,
          }}
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-white bg-opacity-80 rounded-full flex items-center gap-1 shadow text-[#1abc9c] font-semibold text-sm">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91 6.06 6.09 10 0l3.94 6.09 5.572.82-4.756 4.635 1.122 6.545z"/>
          </svg>
          <span>{destination.rating}</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col p-5 pt-4">
        <h3 className="font-bold text-xl text-[#34495e] min-h-[62px] mb-2 group-hover:text-[#1abc9c] transition-colors">{destination.name}</h3>
        <p className="text-gray-500 text-sm flex-1 line-clamp-2" dangerouslySetInnerHTML={{__html:destination.description}}></p>
        <button
          className="mt-5 w-full py-2.5 bg-gradient-to-r from-[#36d1c4] to-[#65e0a6] text-white font-bold rounded-xl text-base shadow transition-all duration-200 hover:from-[#1abc9c] hover:to-[#48ca99] focus:outline-none"
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          Xem chi tiết
        </button>
      </div>
      <span className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-[#65e0a6] opacity-10 group-hover:opacity-20 transition-opacity"></span>
    </div>
  );
}