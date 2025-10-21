import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ReviewForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [cafeName, setCafeName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase.from("Reviews").insert([
      {
        name,
        gmail,
        cafe_name: cafeName,
        notes,
      },
    ]);

    setName("");
    setGmail("");
    setCafeName("");
    setNotes("");

    onSubmitted(); // refresh the list
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="Gmail" value={gmail} onChange={(e) => setGmail(e.target.value)} required />
      <input placeholder="Cafe Name" value={cafeName} onChange={(e) => setCafeName(e.target.value)} required />
      <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button type="submit">Submit Review</button>
    </form>
  );
}
