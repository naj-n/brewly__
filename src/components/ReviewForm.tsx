// src/components/ReviewForm.tsx
import { useState } from 'react';
import { supabase } from '../SupabaseClient';

export default function ReviewForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cafeName, setCafeName] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.from('Reviews').insert([
      { name, email, cafe_name: cafeName, notes },
    ]);

    if (error) {
      alert('Error submitting review: ' + error.message);
    } else {
      alert('Review submitted!');
      setName(''); setEmail(''); setCafeName(''); setNotes('');
      if (onSubmitted) onSubmitted(); // refresh list
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input value={cafeName} onChange={(e) => setCafeName(e.target.value)} placeholder="Cafe Name" required />
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes"></textarea>
      <button type="submit">Submit Review</button>
    </form>
  );
}
