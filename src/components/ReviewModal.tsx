import { Review } from "@/types/review";
import { StarRating } from "./StarRating";
import { X, MapPin, Volume2, Wifi, WifiOff, Zap, ZapOff, Laptop, Clock, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface ReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleSave: (review: Review) => void;
}

const noiseIcons = {
  quiet: Volume2,
  medium: Volume2,
  loud: Volume2,
};

const ambienceLabels = {
  cozy: 'Cozy',
  bright: 'Bright',
  minimal: 'Minimal',
  busy: 'Busy',
};

export const ReviewModal = ({ review, isOpen, onClose, onToggleSave }: ReviewModalProps) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (review) {
      const savedItems = localStorage.getItem('cafeCompanionSaved');
      if (savedItems) {
        const saved = JSON.parse(savedItems);
        setIsSaved(saved.some((item: { id: string }) => item.id === review.id));
      }
    }
  }, [review]);

  if (!review) return null;

  const NoiseIcon = noiseIcons[review.noise];
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(review.address)}`;

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    onToggleSave(review);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="font-serif text-3xl mb-2">{review.cafe_name}</DialogTitle>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <MapPin size={16} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm underline">{review.address}</span>
              </a>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Overall Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={review.overall} readonly size={28} />
            <span className="text-2xl font-bold text-foreground">{review.overall}/5</span>
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <NoiseIcon size={20} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Noise Level</p>
                <p className="font-medium capitalize">{review.noise}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              {review.wifi ? <Wifi size={20} className="text-muted-foreground" /> : <WifiOff size={20} className="text-muted-foreground" />}
              <div>
                <p className="text-xs text-muted-foreground">Wi-Fi</p>
                <p className="font-medium">{review.wifi ? 'Available' : 'Not Available'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              {review.outlets ? <Zap size={20} className="text-muted-foreground" /> : <ZapOff size={20} className="text-muted-foreground" />}
              <div>
                <p className="text-xs text-muted-foreground">Power Outlets</p>
                <p className="font-medium">{review.outlets ? 'Available' : 'Limited'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Laptop size={20} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Laptop Friendly</p>
                <p className="font-medium">{review.laptop_friendly ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Clock size={20} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Rush Hours</p>
                <p className="font-medium">{review.rush_hours}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Sparkles size={20} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Ambience</p>
                <p className="font-medium">{ambienceLabels[review.ambience]}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-2">Notes</h3>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{review.notes}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleSaveClick}
              variant={isSaved ? "default" : "outline"}
              className="flex-1"
            >
              <Heart size={18} className={`mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save Café'}
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1"
            >
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin size={18} className="mr-2" />
                Open in Maps
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
