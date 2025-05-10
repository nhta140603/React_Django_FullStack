export default function ArticleFilter({ activeType, onTypeChange }){
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-5">
        <h3 className="text-lg font-semibold mb-3">Danh mục</h3>
        <div className="flex flex-col space-y-2">
          <button 
            onClick={() => onTypeChange(null)}
            className={`px-4 py-2 rounded-md text-left ${!activeType ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => onTypeChange('news')}
            className={`px-4 py-2 rounded-md text-left ${activeType === 'news' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
          >
            Tin tức
          </button>
          <button 
            onClick={() => onTypeChange('event')}
            className={`px-4 py-2 rounded-md text-left ${activeType === 'event' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
          >
            Sự kiện
          </button>
        </div>
      </div>
    );
};