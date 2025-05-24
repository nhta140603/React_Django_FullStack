export const SkeletonCardList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div>
            <div className="h-48 bg-gray-300 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                <div className="h-8 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonCardListItem = ({ className = "" }) => {
  return (
    <div
      className={`rounded-xl bg-gray-100 border border-gray-200 p-3 mb-4 w-full flex gap-3 items-center ${className} min-h-[172px]`}
      aria-hidden="true"
    >
      <div className="bg-gray-200 rounded-lg w-[210px] h-[170px] shrink-0 " />
      <div className="flex flex-col flex-1 gap-2">
        <div className="h-5 w-3/5 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-8 w-28 bg-gray-200 rounded mt-2" />
      </div>
    </div>
  );
};

export default SkeletonCardList;