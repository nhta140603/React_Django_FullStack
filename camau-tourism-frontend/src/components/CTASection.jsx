import React from 'react';

function CTASection() {
  return (
    <section className="py-12 bg-yellow-400 text-center text-black">
      <h2 className="text-3xl font-bold mb-4">Sẵn sàng cho chuyến đi tiếp theo?</h2>
      <p className="mb-6">Đặt tour, khách sạn, phương tiện và hơn thế nữa chỉ với vài cú click.</p>
      <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
        Bắt đầu ngay
      </button>
    </section>
  );
}

export default CTASection;