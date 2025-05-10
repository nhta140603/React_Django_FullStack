export default function TripList({ trips }) {
    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-green-700">Chuyến du lịch đã tham gia</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map((trip, idx) => (
            <li key={idx} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <div className="font-bold text-lg text-blue-700">{trip.destination}</div>
              <div className="text-gray-500 text-sm">{trip.date}</div>
              <div className="mt-2 text-gray-700">{trip.description}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }