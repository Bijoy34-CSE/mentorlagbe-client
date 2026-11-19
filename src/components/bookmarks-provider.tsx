"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

interface BookmarksValue {
  ready: boolean; // we know whether the visitor is signed in
  isSignedIn: boolean;
  isStudent: boolean;
  loaded: boolean; // the saved list has been loaded
  isSaved: (tuitionId: string) => boolean;
  toggle: (tuitionId: string) => Promise<void>;
}

const BookmarksContext = createContext<BookmarksValue | null>(null);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isStudent = user?.role === "student";

  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  // Load the saved ids once a student is signed in
  useEffect(() => {
    if (!isStudent) {
      setIds(new Set());
      return;
    }

    let cancelled = false;
    setLoaded(false);
    apiFetch<string[]>("/api/bookmarks/ids", { auth: true })
      .then((list) => {
        if (!cancelled) setIds(new Set(list));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [isStudent, user?.id]);

  const isSaved = useCallback((tuitionId: string) => ids.has(tuitionId), [ids]);

  const toggle = useCallback(
    async (tuitionId: string) => {
      const wasSaved = ids.has(tuitionId);

      // Update the screen first, so the icon reacts instantly
      setIds((previous) => {
        const next = new Set(previous);
        if (wasSaved) next.delete(tuitionId);
        else next.add(tuitionId);
        return next;
      });

      try {
        await apiFetch(`/api/bookmarks/${tuitionId}`, {
          method: wasSaved ? "DELETE" : "POST",
          auth: true,
        });
        toast.success(wasSaved ? "Removed from saved tuitions" : "Saved to your list");
      } catch (error) {
        // Put the icon back if the server failed
        setIds((previous) => {
          const next = new Set(previous);
          if (wasSaved) next.add(tuitionId);
          else next.delete(tuitionId);
          return next;
        });
        toast.error(error instanceof Error ? error.message : "Could not update your saved list");
      }
    },
    [ids]
  );

  const value = useMemo<BookmarksValue>(
    () => ({ ready: !isPending, isSignedIn: Boolean(user), isStudent, loaded, isSaved, toggle }),
    [isPending, user, isStudent, loaded, isSaved, toggle]
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) throw new Error("useBookmarks must be used inside BookmarksProvider");
  return context;
}