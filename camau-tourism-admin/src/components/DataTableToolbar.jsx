import React from "react";

 export default function DataTableToolbar({
  onAdd,
  onExport,
  onDeleteSelected,
  selectedRows = [],
  searchValue = "",
  onSearchChange,
  placeholder = "Tìm kiếm...",
  children,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-gradient-to-r from-cyan-800 to-cyan-500 rounded-t-2xl shadow-lg">
      <div className="flex gap-2 flex-wrap items-center">
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-50 text-cyan-800 font-medium hover:bg-cyan-100 shadow-sm border border-cyan-200 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Thêm mới
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-50 text-cyan-800 font-medium hover:bg-cyan-100 shadow-sm border border-cyan-200 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 16l4-4m0 0l-4-4m4 4H8" />
            </svg>
            Xuất Excel
          </button>
        )}
        {onDeleteSelected && (
          <button
            onClick={onDeleteSelected}
            disabled={selectedRows.length === 0}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium shadow-sm border transition
              ${selectedRows.length === 0
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Xóa ({selectedRows.length})
          </button>
        )}
        {children}
      </div>
      <div className="relative flex-1 sm:flex-none max-w-[320px]">
        <input
          type="text"
          value={searchValue}
          onChange={e => onSearchChange && onSearchChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-white text-cyan-800 shadow-inner border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          placeholder={placeholder}
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-3.8-3.8" />
        </svg>
      </div>
    </div>
  );
}