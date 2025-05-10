export default function PersonalTripBooking({ bookings }) {
    return (
      <div>
        <h3 className="font-semibold text-lg mb-2">Đặt dịch vụ</h3>
        <ul>
          <li><button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Đặt khách sạn</button></li>
          <li><button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Thuê xe</button></li>
          <li><button className="bg-blue-500 text-white px-3 py-1 rounded">Thuê hướng dẫn viên</button></li>
        </ul>
      </div>
    );
  }