/**
 * NEXT STEPS:
 * Run Lovable again to generate the full Saved and Account pages.
 * Prompt title: "Generate full Saved and Account pages for Café Companion"
 * 
 * TODO for future integration:
 * - Replace localStorage with Supabase for persistent storage
 * - Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables
 * - Implement image upload for café photos
 * - Add user authentication for personalized saved lists
 */

import { useState, useEffect } from "react";
import { Review } from "@/types/review";
import { NavBar } from "@/components/NavBar";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewModal } from "@/components/ReviewModal";
import { SubmitReviewModal } from "@/components/SubmitReviewModal";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from Supabase on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data: reviewsData, error } = await supabase
        .from('Reviews Table')
        .select(`
          *,
          cafe:Cafes Table!inner(name, address)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedReviews: Review[] = (reviewsData || []).map((r: any) => ({
        id: r.id,
        reviewer_name: r.reviewer_name || 'Anonymous',
        reviewer_email: r.reviewer_email || '',
        cafe_name: r.cafe.name,
        address: r.cafe.address,
        noise: r.noise_level as 'quiet' | 'medium' | 'loud',
        wifi: r.wifi,
        outlets: r.outlets === 'Yes',
        laptop_friendly: true,
        rush_hours: r.rush_hours || 'Random',
        ambience: r.ambience as 'cozy' | 'bright' | 'minimal' | 'busy',
        overall: r.overall_rating,
        notes: r.notes || '',
        image_url: null,
        created_at: r.created_at,
      }));

      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error loading reviews",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const handleSubmitReview = (newReview: Review) => {
    // Add to top of feed and refetch to ensure sync
    setReviews([newReview, ...reviews]);
    setIsSubmitModalOpen(false);
    fetchReviews(); // Refetch to get accurate data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Coffee className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
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
        onAddReview={() => setIsSubmitModalOpen(true)}
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
          {sortedReviews.length > 0 ? (
            <div className="space-y-4">
              {sortedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onCardClick={() => handleCardClick(review)}
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
              <Button onClick={() => setIsSubmitModalOpen(true)}>
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
      />

      <SubmitReviewModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default Index;
