import React, { useEffect, useState } from "react";
export default function SearchBar({ onSearch }){
    const [query, setQuery] = useState("");
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSearch(query);
    };
    
    return (
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tin tức, sự kiện..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
    );
  };