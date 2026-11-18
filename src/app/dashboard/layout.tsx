import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardSplash } from "@/components/dashboard/dashboard-splash";

export const metadata: Metadata = { title: "Dashboard | MentorLagbe" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DashboardSplash />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}