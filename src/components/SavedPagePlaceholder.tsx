import { useEffect, useState } from "react";
import { SavedCafe } from "@/types/review";
import { StarRating } from "./StarRating";
import { MapPin, Heart, Coffee, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SavedPagePlaceholderProps {
  onNavigateToFeed?: () => void;
}

export const SavedPagePlaceholder = ({ onNavigateToFeed }: SavedPagePlaceholderProps) => {
  const [savedCafes, setSavedCafes] = useState<SavedCafe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedCafes();
    }
  }, [user]);

  const fetchSavedCafes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_cafes')
        .select(`
          id,
          cafe:Cafes Table (
            id,
            name,
            address
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Get the reviews for these cafes to get the overall rating
      const cafeIds = data.map((item: any) => item.cafe.id);
      const { data: reviews } = await supabase
        .from('Reviews Table')
        .select('cafe_id, overall_rating, notes')
        .in('cafe_id', cafeIds);

      const transformedCafes: SavedCafe[] = data.map((item: any) => {
        const cafeReviews = reviews?.filter((r: any) => r.cafe_id === item.cafe.id) || [];
        const avgRating = cafeReviews.length > 0
          ? cafeReviews.reduce((sum: number, r: any) => sum + r.overall_rating, 0) / cafeReviews.length
          : 0;
        const firstNote = cafeReviews[0]?.notes || '';

        return {
          id: item.cafe.id,
          cafe_name: item.cafe.name,
          address: item.cafe.address,
          overall: Math.round(avgRating),
          notes: firstNote,
        };
      });

      setSavedCafes(transformedCafes);
    } catch (error) {
      console.error('Error fetching saved cafes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (cafeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_cafes')
        .delete()
        .eq('user_id', user.id)
        .eq('cafe_id', cafeId);

      if (error) throw error;

      setSavedCafes(savedCafes.filter(cafe => cafe.id !== cafeId));
    } catch (error) {
      console.error('Error removing saved cafe:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating background elements - same as homepage */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[hsl(195_55%_90%)] opacity-40 blur-[120px] animate-float" style={{ animationDuration: '25s', animationDelay: '0s' }} />
        <div className="absolute top-0 right-0 w-[550px] h-[650px] rounded-full bg-[hsl(280_45%_88%)] opacity-35 blur-[120px] animate-float" style={{ animationDuration: '30s', animationDelay: '3s' }} />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(345_65%_88%)] opacity-45 blur-[120px] animate-float" style={{ animationDuration: '28s', animationDelay: '5s' }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[hsl(345_60%_90%)] opacity-40 blur-[130px] animate-float" style={{ animationDuration: '32s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] rounded-full bg-[hsl(40_40%_93%)] opacity-30 blur-[100px] animate-float" style={{ animationDuration: '26s', animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <nav className="sticky top-0 z-40 w-full bg-card/80 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigateToFeed}
            aria-label="Back to feed"
            className="hover:bg-primary/10"
          >
            <ArrowLeft size={20} />
          </Button>
          
          <h1 className="font-sail text-3xl font-bold text-primary">
            Brewly
          </h1>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold mb-2">
              Saved Cafés
            </h2>
            <p className="text-muted-foreground">
              Your collection of favorite study spots
            </p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading your saved cafés...</p>
            </div>
          ) : savedCafes.length > 0 ? (
            <div className="space-y-4">
              {savedCafes.map((cafe) => {
                const truncatedNotes = cafe.notes.length > 120 
                  ? cafe.notes.substring(0, 120) + '...' 
                  : cafe.notes;

                return (
                  <div
                    key={cafe.id}
                    className="group bg-card rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 border border-border"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                          {cafe.cafe_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin size={14} />
                          <span>{cafe.address}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveSaved(cafe.id)}
                        className="p-2 rounded-full transition-all text-primary bg-primary/10 hover:bg-primary/20"
                        aria-label="Remove from saved"
                      >
                        <Heart size={20} className="fill-current" />
                      </button>
                    </div>

                    <div className="mb-3">
                      <StarRating rating={cafe.overall} readonly size={18} />
                    </div>

                    {cafe.notes && (
                      <div className="relative">
                        <p className="text-sm text-foreground leading-relaxed">
                          {truncatedNotes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <Coffee size={80} className="mx-auto mb-6 text-muted-foreground/50" />
              <h3 className="font-serif text-2xl font-semibold mb-2">
                You haven't saved any cafés yet ☕
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Find your next favourite spot on the homepage!
              </p>
              <Button onClick={onNavigateToFeed} size="lg">
                Explore Cafés
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
