import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ReviewsList({ refresh }: { refresh: boolean }) {
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async () => {
    const { data } = await supabase.from("Reviews").select("*").order("id", { ascending: false });
    if (data) setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, [refresh]);

  return (
    <div>
      <h2>All Reviews</h2>
      {reviews.map((r) => (
        <div key={r.id} style={{ border: "1px solid #ccc", margin: "1rem 0", padding: "0.5rem" }}>
          <strong>{r.name}</strong> reviewed <em>{r.cafe_name}</em>
          <p>{r.notes}</p>
        </div>
      ))}
    </div>
  );
}
