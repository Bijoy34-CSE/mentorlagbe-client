import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlanBadge({ plan, className }: { plan?: string | null; className?: string }) {
  const isPro = plan === "pro";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isPro
          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      {isPro && <Crown className="size-3" />}
      {isPro ? "Pro" : "Free"}
    </span>
  );
}