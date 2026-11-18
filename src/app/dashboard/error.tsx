"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

// Shown inside the dashboard layout when a page crashes
export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card px-6 py-20 text-center">
      <TriangleAlert className="size-12 text-amber-500" />
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        This page could not be loaded. Please try again or go back to your dashboard.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try Again</Button>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}