import { useState } from "react";
import ReviewForm from "./components/ReviewForm";
import ReviewsList from "./components/ReviewsList";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1>Café Companion</h1>
      <ReviewForm onSubmitted={() => setRefresh(!refresh)} />
      <ReviewsList refresh={refresh} />
    </div>
  );
}
