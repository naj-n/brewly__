import { useState } from "react";
import ReviewForm from "./components/ReviewForm";
import ReviewsList from "./components/ReviewsList";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1>Café Companion</h1>

      {/* Form for submitting reviews */}
      <ReviewForm onSubmitted={() => setRefresh(!refresh)} />

      {/* Dynamic display of all reviews */}
      <ReviewsList refresh={refresh} />
    </div>
  );
}
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default function App() {
  const [refresh, setRefresh] = useState(false); // state to refresh the reviews

  return (
    <div>
      <h1>Café Companion</h1>

      {/* 1️⃣ Add the form component */}
      <ReviewForm onSubmitted={() => setRefresh(!refresh)} />

      {/* 2️⃣ Add the list component */}
      <ReviewsList refresh={refresh} />
    </div>
  );
}
