import { Search, Plus, Bookmark, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 w-full bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <h1 className="font-sail text-2xl font-bold text-primary whitespace-nowrap">
          Brewly
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
          {user ? (
            <>
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

              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                aria-label="Sign out"
              >
                <LogOut size={20} />
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate('/auth')} className="flex items-center">
              <LogIn size={18} className="mr-2" />
              Sign In
            </Button>
          )}
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
