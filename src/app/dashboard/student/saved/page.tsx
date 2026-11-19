"use client";

import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/components/bookmarks-provider";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { TuitionCard, TuitionCardSkeleton } from "@/components/tuition-card";
import { useApi } from "@/hooks/use-api";
import type { Tuition } from "@/lib/types";

export default function SavedTuitionsPage() {
  const { data, loading, error, reload } = useApi<Tuition[]>("/api/bookmarks");
  const { isSaved, loaded } = useBookmarks();

  // When a bookmark is removed, the card disappears right away
  const list = (data ?? []).filter((tuition) => isSaved(tuition._id));
  const waiting = loading || !loaded;

  return (
    <>
      <PageHeader title="Saved Tuitions" description="Tuitions you saved to check or apply later." />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : waiting ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <TuitionCardSkeleton key={index} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved tuitions yet"
          text="Tap the bookmark icon on any tuition card and it will show up here."
          actionHref="/tuitions"
          actionLabel="Browse Tuitions"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((tuition) => (
            <TuitionCard key={tuition._id} tuition={tuition} />
          ))}
        </div>
      )}
    </>
  );
}