import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  label: string;
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({ label, rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{label}</span>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="transition-transform active:scale-90"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onRatingChange(star)}
          >
            <Star
              size={28}
              className={cn(
                "transition-colors",
                (hover || rating) >= star
                  ? "fill-[var(--color-primary)] text-[var(--color-primary)] shadow-[var(--shadow-glow)]"
                  : "text-[var(--color-text-muted)]"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
