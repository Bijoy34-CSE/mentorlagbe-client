import { Loader2 } from "lucide-react";

export function DashboardSplash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm">Loading your dashboard...</p>
      </div>
    </div>
  );
}