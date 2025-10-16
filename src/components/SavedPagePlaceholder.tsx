import { useEffect, useState } from "react";
import { SavedCafe } from "@/types/review";
import { StarRating } from "./StarRating";
import { MapPin, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SavedPagePlaceholder = () => {
  const [savedCafes, setSavedCafes] = useState<SavedCafe[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cafeCompanionSaved');
    if (saved) {
      setSavedCafes(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Saved Cafés</h1>
          <p className="text-muted-foreground">
            Your collection of favorite study spots
          </p>
        </div>

        <div className="bg-card border-2 border-dashed border-border rounded-2xl p-8 text-center mb-8">
          <Coffee size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="font-serif text-2xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground mb-4">
            The full Saved page will be generated in a subsequent run to conserve Lovable credits.
          </p>
          <p className="text-sm text-muted-foreground">
            For now, here's a preview of how your saved cafés will appear:
          </p>
        </div>

        {savedCafes.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold mb-4">
              Preview ({savedCafes.length} saved)
            </h3>
            {savedCafes.slice(0, 3).map((cafe) => (
              <div
                key={cafe.id}
                className="bg-card rounded-2xl p-5 shadow-lg border border-border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-serif text-lg font-bold">{cafe.cafe_name}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        Saved
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin size={14} />
                      <span>{cafe.address}</span>
                    </div>
                    <StarRating rating={cafe.overall} readonly size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No saved cafés yet. Start exploring and save your favorites!
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <a href="/">Back to Feed</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
