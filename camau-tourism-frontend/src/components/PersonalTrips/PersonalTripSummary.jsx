export default function PersonalTripSummary({ trip }) {
    return (
      <div className="mb-4 border rounded p-3 bg-white shadow">
        <div className="flex items-center justify-between">
          <span>Lộ trình: <b>{trip.name}</b></span>
          <span className="text-blue-600">Tổng chi phí: <b>5.000.000đ</b></span>
        </div>
      </div>
    );
  }