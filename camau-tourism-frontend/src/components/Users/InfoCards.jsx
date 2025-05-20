export default function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-2 sm:space-x-3 bg-white rounded-lg shadow p-3 sm:p-4">
      <div className="text-xl sm:text-2xl text-blue-500">{icon}</div>
      <div>
        <div className="text-gray-500 text-xs sm:text-sm">{label}</div>
        <div className="font-bold text-sm sm:text-base line-clamp-2">{value}</div>
      </div>
    </div>
  );
}