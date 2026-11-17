import Link from "next/link";
import { ArrowRight, CalendarDays, GraduationCap, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { formatFee } from "@/lib/format";
import type { Tuition } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TuitionCard({ tuition }: { tuition: Tuition }) {
  const isOnline = tuition.mode === "Online";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      {/* Banner with a fixed ratio, so every card has the same image size */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tuition.bannerImage}
          alt={tuition.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold",
            isOnline ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
          )}
        >
          {tuition.mode}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          {tuition.subject}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-lg leading-snug font-semibold">{tuition.title}</h3>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <GraduationCap className="size-4 shrink-0 text-primary" />
            <span className="truncate">{tuition.classLevel}</span>
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-primary" />
            {tuition.daysPerWeek} days/week
          </li>
          <li className="col-span-2 flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="truncate">{tuition.location}</span>
          </li>
        </ul>

        <div className="mt-auto space-y-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <UserAvatar name={tuition.tutorName} className="size-7 text-xs" />
            <span className="truncate text-sm font-medium">{tuition.tutorName}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xl font-bold">
              {formatFee(tuition.monthlyFee)}
              <span className="text-sm font-normal text-muted-foreground"> /month</span>
            </p>
            <Link href={`/tuitions/${tuition._id}`} className={buttonVariants({ size: "sm" })}>
              View Details
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

// Loading placeholder with the same shape as the real card
export function TuitionCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="aspect-video animate-pulse bg-muted" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-9 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}