import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  size = 14,
  showNumber = false,
  reviewCount,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map(star => {
          const filled = star <= Math.floor(rating);
          const partial = !filled && star === Math.ceil(rating) && rating % 1 > 0;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(star)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              <Star
                size={size}
                className={
                  filled
                    ? 'text-amber-400 fill-amber-400'
                    : partial
                    ? 'text-amber-400 fill-amber-200'
                    : 'text-gray-300 fill-gray-100'
                }
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-gray-800">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500">({reviewCount})</span>
      )}
    </div>
  );
}
