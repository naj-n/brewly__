import { useEffect, useState } from "react";
import { Review } from "@/types/review";
import { StarRating } from "./StarRating";
import { ArrowLeft, Edit, MapPin, Volume2, Wifi, Zap, Laptop, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditReviewModal } from "./EditReviewModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MyReviewsPageProps {
  onNavigateToFeed?: () => void;
}

export const MyReviewsPage = ({ onNavigateToFeed }: MyReviewsPageProps) => {
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyReviews();
    }
  }, [user]);

  const fetchMyReviews = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Reviews Table')
        .select(`
          *,
          cafe:Cafes Table (
            name,
            address
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedReviews: Review[] = data.map((row: any) => ({
        id: row.id,
        cafe_name: row.cafe?.name || 'Unknown Café',
        address: row.cafe?.address || 'Address not provided',
        noise: row.noise_level,
        wifi: row.wifi,
        outlets: row.outlets === 'yes',
        laptop_friendly: true,
        rush_hours: row.rush_hours || 'Random',
        ambience: row.ambience,
        overall: row.overall_rating,
        notes: row.notes || '',
        image_url: null,
        created_at: row.created_at,
      }));

      setMyReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = async () => {
    // Refresh the list after edit
    await fetchMyReviews();
    setIsEditModalOpen(false);
    setSelectedReview(null);
  };

  const openEditModal = (review: Review) => {
    setSelectedReview(review);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating background elements */}
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
            aria-label="Back to account"
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
              My Reviews
            </h2>
            <p className="text-muted-foreground">
              Reviews you've submitted
            </p>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading your reviews...</p>
            </div>
          ) : myReviews.length > 0 ? (
            <div className="space-y-4">
              {myReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-card rounded-2xl p-5 shadow-lg border border-border hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                        {review.cafe_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin size={14} />
                        <span>{review.address}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(review)}
                      className="hover:bg-primary/10"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                  </div>

                  <div className="mb-3">
                    <StarRating rating={review.overall} readonly size={18} />
                  </div>

                  {/* Review Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Volume2 size={14} />
                      <span className="capitalize">{review.noise}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Wifi size={14} />
                      <span>{review.wifi ? 'Wi-Fi' : 'No Wi-Fi'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Zap size={14} />
                      <span>{review.outlets ? 'Outlets' : 'No Outlets'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Laptop size={14} />
                      <span>{review.laptop_friendly ? 'Laptop OK' : 'No Laptops'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>Rush: {review.rush_hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} />
                      <span className="capitalize">{review.ambience}</span>
                    </div>
                  </div>

                  {review.notes && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-foreground leading-relaxed">
                        {review.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <Edit size={64} className="mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-serif text-2xl font-semibold mb-2">
                No reviews yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start sharing your café discoveries!
              </p>
              <Button onClick={onNavigateToFeed}>
                Back to Feed
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {selectedReview && (
        <EditReviewModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedReview(null);
          }}
          onSubmit={handleEditReview}
          review={selectedReview}
        />
      )}
    </div>
  );
};