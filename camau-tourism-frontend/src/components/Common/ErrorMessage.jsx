export default function ErrorMessage ({ message }){
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm my-4">
      <div className="w-16 h-16 mb-4 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-800 mb-2">Không thể tải dữ liệu</h3>
      <p className="text-red-600 text-center">{message || "Đã xảy ra lỗi khi tải thông tin. Vui lòng thử lại sau."}</p>
      <button 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={() => window.location.reload()}
      >
        Tải lại trang
      </button>
    </div>
  );
};