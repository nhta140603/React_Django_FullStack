import React from 'react';

function TourSuggestions() {
  return (
    <section className="py-12 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-6">Tour Gợi Ý Cho Bạn</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[1, 2, 3].map((id) => (
          <div key={id} className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transition">
            <img src={`https://source.unsplash.com/400x250/?tour,travel,city${id}`} alt="Tour" className="rounded-md mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tour #{id}</h3>
            <p className="text-sm text-gray-600">Hành trình hấp dẫn, dịch vụ trọn gói.</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TourSuggestions;