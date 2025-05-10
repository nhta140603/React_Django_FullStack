import PersonalTripsList from './PersonalTripsList';
import PersonalTripDetail from './PersonalTripDetail';
import { useState } from 'react';

// Giả lập dữ liệu lộ trình cá nhân
const mockTrips = [
  { id: 1, name: "Khám phá rừng U Minh", dates: "01/07/2024 - 04/07/2024" },
  { id: 2, name: "Du lịch Đất Mũi", dates: "15/07/2024 - 18/07/2024" }
];

export default function PersonalTripsPage() {
  const [selectedTripId, setSelectedTripId] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-1/4 bg-white shadow p-4">
        <PersonalTripsList 
          trips={mockTrips} 
          selectedTripId={selectedTripId} 
          onSelect={setSelectedTripId} 
        />
      </aside>
      <main className="flex-1 p-6">
        <PersonalTripDetail tripId={selectedTripId} />
      </main>
    </div>
  );
}