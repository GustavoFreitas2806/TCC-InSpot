import type { Review } from '../../types';
import { StarRating } from '../ui/StarRating';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = new Date(review.date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-3">
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{review.userName}</p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
        <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full shrink-0">
          {review.event}
        </span>
      </div>
      <StarRating rating={review.rating} size={13} />
      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
}
