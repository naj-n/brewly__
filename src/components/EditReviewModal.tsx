import { useState, useEffect } from "react";
import { Review } from "@/types/review";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { Volume2, Wifi, Zap, Laptop, Clock, Sparkles } from "lucide-react";

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: Review) => void;
  review: Review;
}

type NoiseLevel = 'quiet' | 'medium' | 'loud';
type Ambience = 'cozy' | 'bright' | 'minimal' | 'busy';
type RushHours = 'Early morning' | 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Random';

export const EditReviewModal = ({ isOpen, onClose, onSubmit, review }: EditReviewModalProps) => {
  const [cafeName, setCafeName] = useState("");
  const [address, setAddress] = useState("");
  const [noise, setNoise] = useState<NoiseLevel | "">("");
  const [wifi, setWifi] = useState<boolean | null>(null);
  const [outlets, setOutlets] = useState<boolean | null>(null);
  const [laptopFriendly, setLaptopFriendly] = useState<boolean | null>(null);
  const [rushHours, setRushHours] = useState<RushHours | "">("");
  const [ambience, setAmbience] = useState<Ambience | "">("");
  const [overall, setOverall] = useState(0);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form with existing review data
  useEffect(() => {
    if (review) {
      setCafeName(review.cafe_name);
      setAddress(review.address);
      setNoise(review.noise);
      setWifi(review.wifi);
      setOutlets(review.outlets);
      setLaptopFriendly(review.laptop_friendly);
      setRushHours(review.rush_hours as RushHours);
      setAmbience(review.ambience);
      setOverall(review.overall);
      setNotes(review.notes);
    }
  }, [review]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!cafeName.trim()) newErrors.cafeName = "Café name is required";
    if (!noise) newErrors.noise = "Please select noise level";
    if (wifi === null) newErrors.wifi = "Please indicate Wi-Fi availability";
    if (outlets === null) newErrors.outlets = "Please indicate outlet availability";
    if (laptopFriendly === null) newErrors.laptopFriendly = "Please indicate if laptop-friendly";
    if (!ambience) newErrors.ambience = "Please select ambience";
    if (overall === 0) newErrors.overall = "Please provide a rating";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const updatedReview: Review = {
      ...review,
      cafe_name: cafeName.trim(),
      address: address.trim() || "Address not provided",
      noise: noise as NoiseLevel,
      wifi: wifi!,
      outlets: outlets!,
      laptop_friendly: laptopFriendly!,
      rush_hours: rushHours || "Random",
      ambience: ambience as Ambience,
      overall,
      notes: notes.trim(),
    };

    onSubmit(updatedReview);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Edit Review</DialogTitle>
          <DialogDescription>
            Update your café review
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Café Name */}
          <div>
            <Label htmlFor="cafeName" className="required">Café Name *</Label>
            <Input
              id="cafeName"
              value={cafeName}
              onChange={(e) => setCafeName(e.target.value)}
              placeholder="e.g., Kaffeine Fitzrovia"
              className={errors.cafeName ? "border-destructive" : ""}
            />
            {errors.cafeName && <p className="text-xs text-destructive mt-1">{errors.cafeName}</p>}
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address or landmark"
            />
            <p className="text-xs text-muted-foreground mt-1">Used to open Google Maps</p>
          </div>

          {/* Noise Level */}
          <div>
            <Label className="required">Noise Level *</Label>
            <div className="flex gap-2 mt-2">
              {(['quiet', 'medium', 'loud'] as NoiseLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setNoise(level)}
                  className={`flex-1 py-2.5 px-4 rounded-lg border-2 transition-all capitalize ${
                    noise === level
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Volume2 size={16} className="inline mr-2" />
                  {level}
                </button>
              ))}
            </div>
            {errors.noise && <p className="text-xs text-destructive mt-1">{errors.noise}</p>}
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="required">Wi-Fi *</Label>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setWifi(true)}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                    wifi === true ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                  }`}
                >
                  <Wifi size={14} className="inline mr-1" />
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setWifi(false)}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                    wifi === false ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                  }`}
                >
                  No
                </button>
              </div>
              {errors.wifi && <p className="text-xs text-destructive mt-1">{errors.wifi}</p>}
            </div>

            <div>
              <Label className="required">Outlets *</Label>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setOutlets(true)}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                    outlets === true ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                  }`}
                >
                  <Zap size={14} className="inline mr-1" />
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setOutlets(false)}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                    outlets === false ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                  }`}
                >
                  No
                </button>
              </div>
              {errors.outlets && <p className="text-xs text-destructive mt-1">{errors.outlets}</p>}
            </div>

            <div>
              <Label className="required">Laptop OK *</Label>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setLaptopFriendly(true)}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                    laptopFriendly === true ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                  }`}
                >
                  <Laptop size={14} className="inline mr-1" />
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setLaptopFriendly(false)}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                    laptopFriendly === false ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                  }`}
                >
                  No
                </button>
              </div>
              {errors.laptopFriendly && <p className="text-xs text-destructive mt-1">{errors.laptopFriendly}</p>}
            </div>
          </div>

          {/* Rush Hours */}
          <div>
            <Label htmlFor="rushHours">Rush Hours</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {(['Early morning', 'Morning', 'Afternoon', 'Evening', 'Night', 'Random'] as RushHours[]).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setRushHours(time)}
                  className={`py-2 px-4 rounded-lg border-2 transition-all text-sm ${
                    rushHours === time
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Clock size={14} className="inline mr-1" />
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Ambience */}
          <div>
            <Label className="required">Ambience *</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {(['cozy', 'bright', 'minimal', 'busy'] as Ambience[]).map((amb) => (
                <button
                  key={amb}
                  type="button"
                  onClick={() => setAmbience(amb)}
                  className={`py-2.5 px-4 rounded-lg border-2 transition-all capitalize ${
                    ambience === amb
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Sparkles size={14} className="inline mr-1" />
                  {amb}
                </button>
              ))}
            </div>
            {errors.ambience && <p className="text-xs text-destructive mt-1">{errors.ambience}</p>}
          </div>

          {/* Overall Rating */}
          <div>
            <Label className="required">Overall Rating *</Label>
            <div className="mt-2">
              <StarRating rating={overall} onChange={setOverall} size={32} />
            </div>
            {errors.overall && <p className="text-xs text-destructive mt-1">{errors.overall}</p>}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tip: best seat, peak times, or any quick advice."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};