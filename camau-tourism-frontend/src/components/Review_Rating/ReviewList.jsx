import { useQueries } from "@tanstack/react-query";
import React from "react";
import { getComments, getRatings } from "../../api/user_api";

export default function ReviewList({ entityType, entityId }) {
  const results = useQueries({
    queries: [
      {
        queryKey: [`${entityType}-comments`, entityId],
        queryFn: () => getComments(entityType, entityId),
        retry: 1,
      },
      {
        queryKey: [`${entityType}-ratings`, entityId],
        queryFn: () => getRatings(entityType, entityId),
        retry: 1,
      }
    ]
  });

  const isLoading = results.some(r => r.isLoading);
  const isError = results.some(r => r.isError);

  const comments = results[0]?.data || [];
  const ratings = results[1]?.data || [];

  const reviews = React.useMemo(() => {
    if (!comments) return [];
    return comments.map((item) => {
      const ratingObj = ratings.find(r => r.id === item.id || r.user_id === item.user_id);
      return {
        id: item.id,
        comment: item.content,
        user: {
          name: item.full_name,
        },
        rating: ratingObj?.rating || 0,
        images: item?.image ? [`http://res.cloudinary.com/deavaowp3/${item?.image}`] : [],
        created_at: item.created_at,
      };
    });
  }, [comments, ratings]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600"></span>
      </div>
    );
  }

  if (isError || !reviews) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        Không thể tải đánh giá. Vui lòng thử lại sau.
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex">
            <div className="flex-shrink-0 mr-2">
              <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-medium text-sm">
                {review.user?.name?.charAt(0) || "U"}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline">
                <h4 className="text-sm font-medium text-gray-900 mr-2">{review?.user.name}</h4>
                <div className="text-xs text-yellow-400 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(review.created_at).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                {review.comment}
              </div>
              {review.images && review.images.length > 0 && (
                <div className="mt-2 flex flex-wrap">
                  {review.images.length === 1 ? (
                    <div
                      className="relative cursor-pointer rounded-lg overflow-hidden"
                      onClick={() => window.open(review.images[0], "_blank")}
                    >
                      <img
                        src={review.images[0]}
                        alt="Review image"
                        className="max-h-60 object-cover rounded-lg hover:opacity-95 transition-opacity"
                      />
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-1">
                      {review.images.slice(0, 4).map((image, index) => (
                        <div
                          key={index}
                          className={`relative cursor-pointer rounded-md overflow-hidden ${review.images.length > 4 && index === 3 ? "relative" : ""
                            }`}
                          onClick={() => window.open(image, "_blank")}
                        >
                          <img
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="h-24 w-full object-cover hover:opacity-95 transition-opacity"
                          />
                          {review.images.length > 4 && index === 3 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white font-medium">+{review.images.length - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-2 flex items-center text-xs text-gray-500">
                <button className="flex items-center hover:text-cyan-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Hữu ích
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}