import PersonalTripDestinations from './PersonalTripDestinations';
import PersonalTripBooking from './PersonalTripBooking';
import PersonalTripReview from './PersonalTripReview';
import PersonalTripSummary from './PersonalTripSummary';

export default function PersonalTripDetail({ tripId }) {
  if (!tripId) {
    return <div className="text-gray-400 text-center mt-20">Chọn một lộ trình để xem chi tiết hoặc tạo mới.</div>;
  }

  // Dữ liệu mock cho 1 lộ trình, bạn sẽ fetch thực tế
  const trip = {
    id: tripId,
    name: "Khám phá rừng U Minh",
    destinations: [
      { id: 1, name: "Rừng U Minh Hạ", date: "02/07/2024" },
      { id: 2, name: "Nhà công tử Bạc Liêu", date: "03/07/2024" }
    ],
    bookings: [],
    reviews: []
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{trip.name}</h1>
      <PersonalTripSummary trip={trip} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <PersonalTripDestinations destinations={trip.destinations} />
        <PersonalTripBooking bookings={trip.bookings} />
      </div>
      <div className="mt-8">
        <PersonalTripReview reviews={trip.reviews} />
      </div>
    </div>
  );
}