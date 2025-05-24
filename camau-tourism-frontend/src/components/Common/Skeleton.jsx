export function SkeletonBox({ height = "4", width = "full", rounded = "md", className = "" }) {
  const hClass = height.startsWith("h-") ? height : `h-${height}`;
  const wClass = width.startsWith("w-") ? width : `w-${width}`;

  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${className} rounded-${rounded} ${hClass} ${wClass}`}
    />
  );
}
export function EventsListSkeleton() {
  return (
    <div className="space-y-4 md:space-y-8">
      {[0].map((_, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[0, 1].map((idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-lg md:rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 min-h-[268px] p-4"
            >
              <div className="flex flex-col md:flex-row space-x-4">
                <SkeletonBox
                  height="32"
                  width="2/5"
                  rounded="2xl"
                  className="md:rounded-l-2xl md:rounded-t-none"
                />
                <div className="md:w-3/5 flex flex-col space-y-2">
                  <SkeletonBox height="6" width="2/3" />
                  <div className="flex items-center gap-2">
                    <SkeletonBox height="8" width="8" rounded="full" />
                    <SkeletonBox height="4" width="1/3" />
                  </div>
                  <SkeletonBox height="4" width="1/2" />
                  <SkeletonBox height="4" width="1/3" />
                  <div className="flex justify-end mt-auto">
                    <SkeletonBox height="10" width="32" rounded="full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function DestinationDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 space-y-6">
      <SkeletonBox height="10" width="1/2" rounded="lg" />
      <SkeletonBox height="64" rounded="xl" />
      <SkeletonBox height="6" width="1/3" rounded="md" />
      <SkeletonBox height="40" rounded="xl" />
      <SkeletonBox height="20" rounded="xl" />
    </div>
  );
}