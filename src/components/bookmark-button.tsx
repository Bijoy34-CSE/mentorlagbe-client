"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useBookmarks } from "@/components/bookmarks-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  tuitionId: string;
  variant?: "icon" | "button";
  className?: string;
}

export function BookmarkButton({ tuitionId, variant = "icon", className }: BookmarkButtonProps) {
  const router = useRouter();
  const { ready, isSignedIn, isStudent, isSaved, toggle } = useBookmarks();
  const [busy, setBusy] = useState(false);

  // Tutors and admins cannot save tuitions
  if (!ready || (isSignedIn && !isStudent)) return null;

  const saved = isSaved(tuitionId);

  async function handleClick() {
    if (!isSignedIn) {
      toast.info("Sign in as a student to save tuitions");
      router.push("/sign-in");
      return;
    }
    if (busy) return;

    setBusy(true);
    await toggle(tuitionId);
    setBusy(false);
  }

  if (variant === "button") {
    return (
      <Button type="button" variant="outline" size="lg" className={cn("w-full", className)} onClick={handleClick}>
        <Bookmark className={cn("size-4", saved && "fill-current text-primary")} />
        {saved ? "Saved" : "Save for later"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from saved tuitions" : "Save this tuition"}
      aria-pressed={saved}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-background/90 shadow backdrop-blur transition-colors hover:bg-background",
        className
      )}
    >
      <Bookmark className={cn("size-4", saved ? "fill-primary text-primary" : "text-foreground")} />
    </button>
  );
}