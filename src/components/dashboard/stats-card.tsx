import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "emerald" | "amber" | "sky" | "rose";

const tones: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

interface StatsCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone?: Tone;
  hint?: string;
}

// One reusable card for all dashboard numbers
export function StatsCard({ label, value, icon: Icon, tone = "primary", hint }: StatsCardProps) {
  return (
    <div className="flex h-full items-center justify-between gap-4 rounded-2xl border bg-card p-5">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-3xl font-bold tracking-tight">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="size-6" />
      </span>
    </div>
  );
}

export function StatsCardSkeleton() {
  return <div className="h-[106px] animate-pulse rounded-2xl border bg-muted" />;
}