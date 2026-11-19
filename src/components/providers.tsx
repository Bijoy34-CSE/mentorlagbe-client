"use client";

import { ThemeProvider } from "next-themes";
import { BookmarksProvider } from "@/components/bookmarks-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <BookmarksProvider>{children}</BookmarksProvider>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}