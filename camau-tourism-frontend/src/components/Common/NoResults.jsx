export default function NoResults(){
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-blue-50 rounded-lg border border-blue-100 my-8">
      <div className="w-32 h-32 mb-6 text-blue-500">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="10" y="70" width="80" height="10" fill="#0C4A6E" />
          <rect x="20" y="80" width="60" height="5" fill="#0C4A6E" />
          <path d="M50,10 C60,25 70,20 75,35 C78,45 72,60 65,70 C60,75 55,85 50,90 C45,85 40,75 35,70 C28,60 22,45 25,35 C30,20 40,25 50,10" fill="#065F46" />
          <path d="M40,40 L60,40 L60,60 L40,60 Z" fill="white" />
          <rect x="35" y="50" width="30" height="3" fill="#065F46" />
          <rect x="48" y="42" width="4" height="16" fill="#065F46" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">Không tìm thấy kết quả</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        Không có thông tin nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các từ khóa khác.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
          Khám phá Cà Mau
        </button>
        <button className="px-4 py-2 border border-green-600 text-green-700 rounded-md hover:bg-green-50 transition-colors">
          Xem điểm du lịch
        </button>
      </div>
    </div>
  );
};