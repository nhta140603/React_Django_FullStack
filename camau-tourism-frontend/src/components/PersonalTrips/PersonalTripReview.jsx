export default function PersonalTripReview({ reviews }) {
    return (
      <div>
        <h3 className="font-semibold text-lg mb-2">Đánh giá lộ trình</h3>
        <ul>
          {reviews.length === 0 && <li>Chưa có đánh giá nào.</li>}
          {reviews.map((review, i) => (
            <li key={i} className="border-b py-2">{review.comment}</li>
          ))}
        </ul>
        <button className="mt-3 bg-yellow-500 text-white px-3 py-1 rounded">+ Thêm đánh giá</button>
      </div>
    );
  }