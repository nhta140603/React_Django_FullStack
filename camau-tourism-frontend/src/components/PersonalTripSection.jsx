import React from 'react';

function PersonalTripSection() {
  return (
    <section className="py-12 px-6 bg-blue-50 text-center">
      <h2 className="text-3xl font-bold mb-4">Tạo Hành Trình Cá Nhân Của Bạn</h2>
      <p className="mb-6 text-gray-700">Tự do lựa chọn địa điểm, thời gian và dịch vụ phù hợp với bạn.</p>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-500 transition">
        Bắt đầu lên kế hoạch
      </button>
    </section>
  );
}

export default PersonalTripSection;