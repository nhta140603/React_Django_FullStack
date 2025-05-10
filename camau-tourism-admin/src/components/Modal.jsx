import React from "react";

export default function Modal({ open, onClose, title, children, footer }) {
  if (open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-colors">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 sm:mx-0 animate-fadeIn flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-cyan-100 to-blue-50">
          <h2 className="text-xl font-bold text-cyan-800 truncate">{title}</h2>
          <button
            className="ml-2 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>
        {footer !== undefined ? (
          <div className="px-6 py-3 border-t bg-gray-50 flex flex-row-reverse gap-2">
            {footer}
          </div>
        ) : (
          <div className="px-6 py-3 border-t bg-gray-50 flex flex-row-reverse">
            <button
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        )}
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