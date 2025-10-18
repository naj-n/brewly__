import { User, Lock, Bell, HelpCircle, LogOut, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountPagePlaceholderProps {
  onNavigateToFeed?: () => void;
}

export const AccountPagePlaceholder = ({ onNavigateToFeed }: AccountPagePlaceholderProps) => {
  const menuItems = [
    { icon: User, label: "Edit Profile", onClick: () => console.log("Edit Profile") },
    { icon: Lock, label: "Change Password", onClick: () => console.log("Change Password") },
    { icon: Bell, label: "Notifications", onClick: () => console.log("Notifications") },
    { icon: HelpCircle, label: "Help / Support", onClick: () => console.log("Help") },
    { icon: LogOut, label: "Log Out", onClick: () => console.log("Log Out"), danger: true },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating background elements - same as homepage */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[hsl(195_55%_90%)] opacity-40 blur-[120px] animate-float" style={{ animationDuration: '25s', animationDelay: '0s' }} />
        <div className="absolute top-0 right-0 w-[550px] h-[650px] rounded-full bg-[hsl(280_45%_88%)] opacity-35 blur-[120px] animate-float" style={{ animationDuration: '30s', animationDelay: '3s' }} />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(345_65%_88%)] opacity-45 blur-[120px] animate-float" style={{ animationDuration: '28s', animationDelay: '5s' }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[hsl(345_60%_90%)] opacity-40 blur-[130px] animate-float" style={{ animationDuration: '32s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] rounded-full bg-[hsl(40_40%_93%)] opacity-30 blur-[100px] animate-float" style={{ animationDuration: '26s', animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <nav className="sticky top-0 z-40 w-full bg-card/80 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigateToFeed}
            aria-label="Back to feed"
            className="hover:bg-primary/10"
          >
            <ArrowLeft size={20} />
          </Button>
          
          <h1 className="font-sail text-3xl font-bold text-primary">
            Brewly
          </h1>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Profile Section */}
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border mb-6">
            <div className="flex flex-col items-center text-center">
              {/* Profile Photo */}
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-primary/20">
                <User size={40} className="text-primary" />
              </div>
              
              {/* Username */}
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-1">
                Coffee Lover
              </h2>
              
              {/* Email */}
              <p className="text-sm text-muted-foreground">
                coffee.lover@brewly.com
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`w-full flex items-center justify-between px-6 py-4 transition-all hover:bg-muted/50 ${
                    index !== menuItems.length - 1 ? 'border-b border-border' : ''
                  } ${item.danger ? 'text-destructive hover:bg-destructive/5' : 'text-foreground'}`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={20} className={item.danger ? 'text-destructive' : 'text-muted-foreground'} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
