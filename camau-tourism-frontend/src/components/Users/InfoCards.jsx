export default function InfoCard({ icon, label, value }) {
    return (
      <div className="flex items-center space-x-3 bg-white rounded-lg shadow p-4">
        <div className="text-2xl text-blue-500">{icon}</div>
        <div>
          <div className="text-gray-500 text-sm">{label}</div>
          <div className="font-bold">{value}</div>
        </div>
      </div>
    );
  }