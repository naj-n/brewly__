import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export const StarRating = ({ rating, onChange, readonly = false, size = 20 }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (value: number) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, value: number) => {
    if (!readonly && onChange) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange(value);
      } else if (e.key === 'ArrowRight' && value < 5) {
        e.preventDefault();
        onChange(value + 1);
      } else if (e.key === 'ArrowLeft' && value > 1) {
        e.preventDefault();
        onChange(value - 1);
      }
    }
  };

  return (
    <div className="flex gap-1" role={readonly ? "img" : "radiogroup"} aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const filled = (hoverRating !== null ? hoverRating : rating) >= value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => !readonly && setHoverRating(value)}
            onMouseLeave={() => setHoverRating(null)}
            onKeyDown={(e) => handleKeyDown(e, value)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded`}
            aria-label={`${value} star${value !== 1 ? 's' : ''}`}
            tabIndex={readonly ? -1 : 0}
          >
            <Star
              size={size}
              className={`${filled ? 'fill-primary text-primary' : 'text-muted-foreground'} transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
