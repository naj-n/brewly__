import { useState, useEffect } from "react";
import { z } from "zod";
import { Review } from "@/types/review";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { Volume2, Wifi, Zap, Laptop, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  review: Review;
}

type NoiseLevel = 'quiet' | 'medium' | 'loud';
type Ambience = 'cozy' | 'bright' | 'minimal' | 'busy';
type RushHours = 'Early morning' | 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Random';

// Zod schema for validation
const editReviewSchema = z.object({
  cafeName: z.string().trim().min(1, "Café name is required").max(200, "Café name must be less than 200 characters"),
  address: z.string().max(500, "Address must be less than 500 characters").optional(),
  noise: z.enum(['quiet', 'medium', 'loud'], { errorMap: () => ({ message: "Please select noise level" }) }),
  wifi: z.boolean({ errorMap: () => ({ message: "Please indicate Wi-Fi availability" }) }),
  outlets: z.boolean({ errorMap: () => ({ message: "Please indicate outlet availability" }) }),
  laptopFriendly: z.boolean({ errorMap: () => ({ message: "Please indicate if laptop-friendly" }) }),
  rushHours: z.string().max(50, "Rush hours must be less than 50 characters").optional(),
  ambience: z.enum(['cozy', 'bright', 'minimal', 'busy'], { errorMap: () => ({ message: "Please select ambience" }) }),
  overall: z.number().int().min(1, "Please provide a rating").max(5, "Rating must be between 1 and 5"),
  notes: z.string().trim().max(2000, "Notes must be less than 2000 characters").optional(),
});

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
    try {
      editReviewSchema.parse({
        cafeName,
        address: address || undefined,
        noise: noise || undefined,
        wifi,
        outlets,
        laptopFriendly,
        rushHours: rushHours || undefined,
        ambience: ambience || undefined,
        overall,
        notes,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('Reviews Table')
        .update({
          noise_level: noise,
          wifi: wifi,
          outlets: outlets ? 'yes' : 'no',
          rush_hours: rushHours || "Random",
          ambience: ambience,
          overall_rating: overall,
          notes: notes.trim(),
        })
        .eq('id', review.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your review has been updated",
      });

      onSubmit();
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              className={errors.reviewerName ? "border-destructive" : ""}
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
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};