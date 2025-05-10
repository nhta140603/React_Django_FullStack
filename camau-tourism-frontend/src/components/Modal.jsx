import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-fadeIn">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold z-10"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>
        <div className="">{children}</div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity:0; transform: translateY(40px);}
          to { opacity:1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.22s;
        }
      `}</style>
    </div>
  );
}