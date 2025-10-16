import { User, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AccountPagePlaceholder = () => {
  const handleExportSaved = () => {
    const saved = localStorage.getItem('cafeCompanionSaved');
    if (saved) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(saved);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "cafe-companion-saved.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Account</h1>
          <p className="text-muted-foreground">
            Manage your preferences and data
          </p>
        </div>

        <div className="bg-card border-2 border-dashed border-border rounded-2xl p-8 text-center mb-8">
          <User size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="font-serif text-2xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground mb-4">
            The full Account page will be generated in a subsequent run to conserve Lovable credits.
          </p>
          <p className="text-sm text-muted-foreground">
            Below is a preview of planned account features:
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Username
              </CardTitle>
              <CardDescription>Set your display name (coming soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Authentication and user profiles will be integrated with Supabase in future updates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience (coming soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Settings for notifications, display preferences, and more will be available here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download size={20} />
                Export Data
              </CardTitle>
              <CardDescription>Download your saved cafés as JSON</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleExportSaved} variant="outline" className="w-full sm:w-auto">
                <Download size={16} className="mr-2" />
                Export Saved Cafés
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <a href="/">Back to Feed</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
