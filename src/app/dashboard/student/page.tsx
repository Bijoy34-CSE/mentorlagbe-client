"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, Clock, Crown, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard, StatsCardSkeleton } from "@/components/dashboard/stats-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { buttonVariants } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/format";
import type { Application } from "@/lib/types";

export default function StudentOverviewPage() {
  const { data: session } = authClient.useSession();
  const { data: applications, loading, error, reload } = useApi<Application[]>("/api/applications/mine");

  const user = session?.user;
  const total = applications?.length ?? 0;
  const accepted = applications?.filter((item) => item.status === "accepted").length ?? 0;
  const pending = applications?.filter((item) => item.status === "pending").length ?? 0;
  const isPro = user?.plan === "pro";
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here is a quick look at your tuition applications."
        action={
          <Link href="/tuitions" className={buttonVariants()}>
            <Search className="size-4" /> Browse Tuitions
          </Link>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => <StatsCardSkeleton key={index} />)
            ) : (
              <>
                <StatsCard label="Total Applied Tuitions" value={total} icon={ClipboardList} tone="primary" />
                <StatsCard label="Accepted Applications" value={accepted} icon={CheckCircle2} tone="emerald" />
                <StatsCard label="Pending Applications" value={pending} icon={Clock} tone="amber" />
                <StatsCard
                  label="Current Plan"
                  value={isPro ? "Pro" : "Free"}
                  icon={Crown}
                  tone="sky"
                  hint={isPro ? "Priority booking active" : "Upgrade for priority booking"}
                />
              </>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-2xl border bg-card lg:col-span-2">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="font-semibold">Recent applications</h2>
                <Link
                  href="/dashboard/student/my-applications"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View all <ArrowRight className="size-4" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3 p-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-14 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : total === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={ClipboardList}
                    title="No applications yet"
                    text="Find a tuition that fits you and apply in a few clicks."
                    actionHref="/tuitions"
                    actionLabel="Browse Tuitions"
                  />
                </div>
              ) : (
                <ul className="divide-y">
                  {applications!.slice(0, 5).map((item) => (
                    <li key={item._id} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.tuitionTitle}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {item.tutorName} · Applied {formatDate(item.appliedAt)}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="flex flex-col justify-between rounded-2xl border bg-card p-6">
              <div>
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Crown className="size-5" />
                </span>
                <h2 className="mt-4 font-semibold">{isPro ? "You are a Pro student" : "Upgrade to Pro"}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {isPro
                    ? "Your applications get priority booking and your profile shows a Pro badge."
                    : "Get priority booking on your applications and a Pro badge on your profile for a one time $10."}
                </p>
              </div>
              {!isPro && (
                <Link href="/pricing" className={buttonVariants({ className: "mt-6 w-full" })}>
                  See Pro Plan
                </Link>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}