export default function FilterBar({ onViewChange, count, view }){
    return (
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow mb-5">
        <div>
          <p className="text-sm text-gray-600">Hiển thị <span className="font-medium">{count}</span> kết quả</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onViewChange("grid")}
            className={`p-2 rounded ${view === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-500"}`}
            title="Xem dạng lưới"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            onClick={() => onViewChange("list")}
            className={`p-2 rounded ${view === "list" ? "bg-blue-100 text-blue-600" : "text-gray-500"}`}
            title="Xem dạng danh sách"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    );
  };