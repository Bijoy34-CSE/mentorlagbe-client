"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Crown, Library, PlusCircle, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard, StatsCardSkeleton } from "@/components/dashboard/stats-card";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { authClient } from "@/lib/auth-client";
import { FREE_POST_LIMIT } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { Application, Tuition } from "@/lib/types";

export default function TutorOverviewPage() {
  const { data: session } = authClient.useSession();
  const tuitions = useApi<Tuition[]>("/api/tuitions/mine");
  const applicants = useApi<Application[]>("/api/applications/tutor");

  const user = session?.user;
  const isPro = user?.plan === "pro";
  const loading = tuitions.loading || applicants.loading;
  const error = tuitions.error ?? applicants.error;

  const posted = tuitions.data?.length ?? 0;
  const live = tuitions.data?.filter((item) => item.approvalStatus === "approved" && item.isActive).length ?? 0;
  const totalApplicants = applicants.data?.length ?? 0;
  const usagePercent = Math.min(100, Math.round((posted / FREE_POST_LIMIT) * 100));
  const firstName = user?.name?.split(" ")[0] ?? "there";

  function retry() {
    tuitions.reload();
    applicants.reload();
  }

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Manage your tuitions and the students who applied."
        action={
          <Link href="/dashboard/tutor/post-tuition" className={buttonVariants()}>
            <PlusCircle className="size-4" /> Post a Tuition
          </Link>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => <StatsCardSkeleton key={index} />)
            ) : (
              <>
                <StatsCard label="Total Tuitions Posted" value={posted} icon={Library} tone="primary" />
                <StatsCard label="Active & Approved" value={live} icon={CheckCircle2} tone="emerald" />
                <StatsCard label="Total Applicants" value={totalApplicants} icon={UsersRound} tone="amber" />
                <StatsCard
                  label="Current Plan"
                  value={isPro ? "Pro" : "Free"}
                  icon={Crown}
                  tone="sky"
                  hint={isPro ? "Unlimited tuition posts" : `${FREE_POST_LIMIT} tuition posts included`}
                />
              </>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-2xl border bg-card lg:col-span-2">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="font-semibold">Latest applicants</h2>
                <Link
                  href="/dashboard/tutor/applicants"
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
              ) : totalApplicants === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={UsersRound}
                    title="No applicants yet"
                    text="Once students apply to your approved tuitions, they will show up here."
                  />
                </div>
              ) : (
                <ul className="divide-y">
                  {applicants.data!.slice(0, 5).map((item) => (
                    <li key={item._id} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.studentName}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {item.tuitionTitle} · {formatDate(item.appliedAt)}
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
                <h2 className="mt-4 font-semibold">{isPro ? "You are a Pro tutor" : "Tuition post usage"}</h2>

                {isPro ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    You can post unlimited tuitions and your profile shows a verified badge.
                  </p>
                ) : (
                  <>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You have used <span className="font-semibold text-foreground">{posted}</span> of {FREE_POST_LIMIT}{" "}
                      free posts.
                    </p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usagePercent}%` }} />
                    </div>
                  </>
                )}
              </div>

              {!isPro && (
                <Link href="/pricing" className={buttonVariants({ className: "mt-6 w-full" })}>
                  Go Pro for $15
                </Link>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}