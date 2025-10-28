import { Review } from "@/types/review";
import { StarRating } from "./StarRating";
import { Heart, Volume2, Wifi, Zap, Laptop, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface ReviewCardProps {
  review: Review;
  onCardClick: () => void;
  onToggleSave?: () => void;
}

const ambienceIcons: Record<Review['ambience'], typeof Sparkles> = {
  cozy: Sparkles,
  bright: Sparkles,
  minimal: Sparkles,
  busy: Sparkles,
};

export const ReviewCard = ({ review, onCardClick, onToggleSave }: ReviewCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem('cafeCompanionSaved');
    if (savedItems) {
      const saved = JSON.parse(savedItems);
      setIsSaved(saved.some((item: { id: string }) => item.id === review.id));
    }
  }, [review.id]);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
      setIsSaved(!isSaved);
      onToggleSave();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCardClick();
    }
  };

  const AmbienceIcon = ambienceIcons[review.ambience];
  const truncatedNotes = review.notes.length > 120 
    ? review.notes.substring(0, 120) + '...' 
    : review.notes;
  const showReadMore = review.notes.length > 120;

  return (
    <div
      onClick={onCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="group bg-card rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 cursor-pointer border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={`View details for ${review.cafe_name}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-serif text-xl font-bold text-foreground mb-1">
            {review.cafe_name}
          </h3>
          <p className="text-sm text-muted-foreground">{review.address}</p>
          {review.reviewer_name && (
            <p className="text-xs text-muted-foreground mt-1">
              Reviewed by {review.reviewer_name}
            </p>
          )}
        </div>
        
        <button
          onClick={handleSaveClick}
          className={`p-2 rounded-full transition-all ${
            isSaved 
              ? 'text-primary bg-primary/10 hover:bg-primary/20' 
              : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
          }`}
          aria-label={isSaved ? "Remove from saved" : "Save café"}
        >
          <Heart size={20} className={isSaved ? 'fill-current animate-in zoom-in-50' : ''} />
        </button>
      </div>

      <div className="mb-3">
        <StarRating rating={review.overall} readonly size={18} />
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs bg-muted px-2.5 py-1.5 rounded-full">
          <Volume2 size={14} className="text-muted-foreground" />
          <span className="capitalize">{review.noise}</span>
        </div>
        
        {review.wifi && (
          <div className="flex items-center gap-1.5 text-xs bg-muted px-2.5 py-1.5 rounded-full">
            <Wifi size={14} className="text-muted-foreground" />
            <span>Wi-Fi</span>
          </div>
        )}
        
        {review.outlets && (
          <div className="flex items-center gap-1.5 text-xs bg-muted px-2.5 py-1.5 rounded-full">
            <Zap size={14} className="text-muted-foreground" />
            <span>Outlets</span>
          </div>
        )}
        
        {review.laptop_friendly && (
          <div className="flex items-center gap-1.5 text-xs bg-muted px-2.5 py-1.5 rounded-full">
            <Laptop size={14} className="text-muted-foreground" />
            <span>Laptop OK</span>
          </div>
        )}
        
        <div className="flex items-center gap-1.5 text-xs bg-muted px-2.5 py-1.5 rounded-full">
          <AmbienceIcon size={14} className="text-muted-foreground" />
          <span className="capitalize">{review.ambience}</span>
        </div>
      </div>

      <div className="relative">
        <p className="text-sm text-foreground leading-relaxed">
          {truncatedNotes}
        </p>
        {showReadMore && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCardClick();
            }}
            className="text-primary text-sm font-medium hover:underline mt-1 inline-block"
          >
            Read more
          </button>
        )}
      </div>
    </div>
  );
};
