// src/components/ReviewsList.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';

export default function ReviewsList({ refresh }: { refresh?: boolean }) {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews();
  }, [refresh]); // re-fetch when refresh changes

  async function fetchReviews() {
    const { data, error } = await supabase.from('Reviews').select('*').order('id', { ascending: false });
    if (error) console.error(error);
    else setReviews(data);
  }

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
          <strong>{review.cafe_name}</strong> by {review.name}<br/>
          Notes: {review.notes || 'None'}
        </div>
      ))}
    </div>
  );
}
