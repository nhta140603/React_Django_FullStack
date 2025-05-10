export default function PersonalTripDestinations({ destinations }) {
    return (
      <div>
        <h3 className="font-semibold text-lg mb-2">Các điểm đến</h3>
        <ul>
          {destinations.map(dest => (
            <li key={dest.id} className="py-2 border-b flex justify-between">
              <span>{dest.name}</span>
              <span className="text-xs text-gray-400">{dest.date}</span>
            </li>
          ))}
        </ul>
        <button className="mt-3 bg-green-500 text-white px-3 py-1 rounded">+ Thêm điểm đến</button>
      </div>
    );
  }