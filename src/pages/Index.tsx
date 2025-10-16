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

import { useState } from "react";
import { Review, SavedCafe } from "@/types/review";
import { seedReviews } from "@/data/seedReviews";
import { NavBar } from "@/components/NavBar";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewModal } from "@/components/ReviewModal";
import { SubmitReviewModal } from "@/components/SubmitReviewModal";
import { Toast } from "@/components/Toast";
import { SavedPagePlaceholder } from "@/components/SavedPagePlaceholder";
import { AccountPagePlaceholder } from "@/components/AccountPagePlaceholder";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

type Page = 'feed' | 'saved' | 'account';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('feed');
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      });
      setToastMessage("Saved");
    }
    
    localStorage.setItem('cafeCompanionSaved', JSON.stringify(saved));
  };

  const handleSubmitReview = (newReview: Review) => {
    // Add to top of feed
    setReviews([newReview, ...reviews]);
    setIsSubmitModalOpen(false);
    setToastMessage("Thanks — review added to feed (saved locally)");
  };

  if (currentPage === 'saved') {
    return <SavedPagePlaceholder />;
  }

  if (currentPage === 'account') {
    return <AccountPagePlaceholder />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddReview={() => setIsSubmitModalOpen(true)}
        onNavigateToSaved={() => setCurrentPage('saved')}
        onNavigateToAccount={() => setCurrentPage('account')}
      />

      <main className="container mx-auto px-4 py-8">
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
