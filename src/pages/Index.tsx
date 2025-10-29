import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Review, SavedCafe } from "@/types/review";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { NavBar } from "@/components/NavBar";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewModal } from "@/components/ReviewModal";
import { SubmitReviewModal } from "@/components/SubmitReviewModal";
import { Toast } from "@/components/Toast";
import { SavedPagePlaceholder } from "@/components/SavedPagePlaceholder";
import { AccountPagePlaceholder } from "@/components/AccountPagePlaceholder";
import { MyReviewsPage } from "@/components/MyReviewsPage";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

type Page = 'feed' | 'saved' | 'account' | 'my-reviews';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('feed');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch reviews from Supabase
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('Reviews Table')
        .select(`
          *,
          cafe:Cafes Table!Reviews Table_cafe_id_fkey (
            id,
            name,
            address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match Review type
      const transformedReviews: Review[] = (data || []).map((row: any) => ({
        id: row.id,
        cafe_name: row.cafe?.name || 'Unknown Café',
        address: row.cafe?.address || 'Address not provided',
        noise: row.noise_level,
        wifi: row.wifi,
        outlets: row.outlets === 'yes' || row.outlets === true,
        laptop_friendly: true,
        rush_hours: row.rush_hours,
        ambience: row.ambience,
        overall: row.overall_rating,
        notes: row.notes,
        image_url: null,
        created_at: row.created_at,
      }));

      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side search filtering
  const filteredReviews = searchQuery.trim()
    ? reviews.filter((review) =>
        review.cafe_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : reviews;

  // Sort by newest first
  const sortedReviews = [...filteredReviews].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleCardClick = (review: Review) => {
    setSelectedReview(review);
    setIsReviewModalOpen(true);
  };

  const handleToggleSave = (review: Review) => {
    // TODO: replace localStorage with Supabase
    const savedItems = localStorage.getItem('cafeCompanionSaved');
    const saved: SavedCafe[] = savedItems ? JSON.parse(savedItems) : [];
    
    const existingIndex = saved.findIndex((item) => item.id === review.id);
    
    if (existingIndex > -1) {
      saved.splice(existingIndex, 1);
      setToastMessage("Removed from saved");
    } else {
      saved.push({
        id: review.id,
        cafe_name: review.cafe_name,
        address: review.address,
        overall: review.overall,
        notes: review.notes,
      });
      setToastMessage("Saved");
    }
    
    localStorage.setItem('cafeCompanionSaved', JSON.stringify(saved));
  };

  const handleAddReview = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setIsSubmitModalOpen(true);
  };

  const handleSubmitReview = async (newReview: Review) => {
    setIsSubmitModalOpen(false);
    setToastMessage("Submitting review...");
    await fetchReviews();
    setToastMessage("Review added successfully!");
  };

  if (currentPage === 'saved') {
    return <SavedPagePlaceholder onNavigateToFeed={() => setCurrentPage('feed')} />;
  }

  if (currentPage === 'my-reviews') {
    return <MyReviewsPage onNavigateToFeed={() => setCurrentPage('account')} />;
  }

  if (currentPage === 'account') {
    return <AccountPagePlaceholder onNavigateToFeed={() => setCurrentPage('feed')} onNavigateToMyReviews={() => setCurrentPage('my-reviews')} />;
  }

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

      <NavBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddReview={handleAddReview}
        onNavigateToSaved={() => setCurrentPage('saved')}
        onNavigateToAccount={() => setCurrentPage('account')}
      />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold mb-2">
              Discover Study-Friendly Cafés
            </h2>
            <p className="text-muted-foreground">
              Real reviews from people who work and study in these spaces
            </p>
          </div>

          {/* Feed */}
          {isLoading ? (
            <div className="text-center py-16">
              <Coffee size={64} className="mx-auto mb-4 text-muted-foreground animate-pulse" />
              <p className="text-muted-foreground">Loading reviews...</p>
            </div>
          ) : sortedReviews.length > 0 ? (
            <div className="space-y-4">
              {sortedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onCardClick={() => handleCardClick(review)}
                  onToggleSave={() => handleToggleSave(review)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Coffee size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-serif text-2xl font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to add a study-friendly café!
              </p>
              <Button onClick={handleAddReview}>
                Add Review
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ReviewModal
        review={selectedReview}
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedReview(null);
        }}
        onToggleSave={handleToggleSave}
      />

      <SubmitReviewModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitReview}
      />

      {/* Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default Index;
