import { Search, Plus, Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddReview: () => void;
  onNavigateToSaved: () => void;
  onNavigateToAccount: () => void;
}

export const NavBar = ({
  searchQuery,
  onSearchChange,
  onAddReview,
  onNavigateToSaved,
  onNavigateToAccount,
}: NavBarProps) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <h1 className="font-sail text-2xl font-bold text-primary whitespace-nowrap">
          brewly
        </h1>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="search"
            placeholder="Search café name"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            aria-label="Search cafés"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button onClick={onAddReview} className="hidden sm:flex">
            <Plus size={18} className="mr-2" />
            Add Review
          </Button>
          <Button onClick={onAddReview} size="icon" className="sm:hidden" aria-label="Add review">
            <Plus size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigateToSaved}
            aria-label="Saved cafés"
          >
            <Bookmark size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigateToAccount}
            aria-label="Account settings"
          >
            <User size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="search"
            placeholder="Search café name"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            aria-label="Search cafés"
          />
        </div>
      </div>
    </nav>
  );
};
