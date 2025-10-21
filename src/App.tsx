import { useState } from "react";
import ReviewForm from "./components/ReviewForm";
import ReviewsList from "./components/ReviewsList";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  const [refresh, setRefresh] = useState(false); // state to refresh the reviews

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div style={{ padding: "2rem" }}>
            <h1>Café Companion</h1>

            {/* ✅ Review form */}
            <ReviewForm onSubmitted={() => setRefresh(!refresh)} />

            {/* ✅ Review list */}
            <ReviewsList refresh={refresh} />

            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
