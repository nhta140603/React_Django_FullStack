export default function PersonalTripsList({ trips, selectedTripId, onSelect }) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-4">Lộ Trình Của Tôi</h2>
        <ul>
          {trips.map(trip => (
            <li 
              key={trip.id}
              className={`p-3 mb-2 rounded cursor-pointer hover:bg-blue-100 ${selectedTripId === trip.id ? 'bg-blue-200 font-semibold' : 'bg-gray-50'}`}
              onClick={() => onSelect(trip.id)}
            >
              <div>{trip.name}</div>
              <div className="text-xs text-gray-500">{trip.dates}</div>
            </li>
          ))}
        </ul>
        <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          + Tạo lộ trình mới
        </button>
      </div>
    );
  }