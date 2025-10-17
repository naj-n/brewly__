import { useEffect, useState } from "react";
import { SavedCafe } from "@/types/review";
import { StarRating } from "./StarRating";
import { MapPin, Heart, Coffee, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedPagePlaceholderProps {
  onNavigateToFeed?: () => void;
}

export const SavedPagePlaceholder = ({ onNavigateToFeed }: SavedPagePlaceholderProps) => {
  const [savedCafes, setSavedCafes] = useState<SavedCafe[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cafeCompanionSaved');
    if (saved) {
      setSavedCafes(JSON.parse(saved));
    }
  }, []);

  const handleRemoveSaved = (cafeId: string) => {
    const updated = savedCafes.filter(cafe => cafe.id !== cafeId);
    setSavedCafes(updated);
    localStorage.setItem('cafeCompanionSaved', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating background elements - same as homepage */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[hsl(180_50%_88%)] opacity-30 blur-3xl animate-float" style={{ animationDuration: '20s', animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-[hsl(120_25%_80%)] opacity-25 blur-3xl animate-float" style={{ animationDuration: '25s', animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-72 h-72 rounded-full bg-[hsl(10_70%_88%)] opacity-40 blur-3xl animate-float" style={{ animationDuration: '18s', animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 rounded-full bg-[hsl(20_75%_75%)] opacity-35 blur-2xl animate-float" style={{ animationDuration: '22s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-[hsl(180_55%_85%)] opacity-20 blur-3xl animate-float" style={{ animationDuration: '30s', animationDelay: '3s' }} />
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
          {savedCafes.length > 0 ? (
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
