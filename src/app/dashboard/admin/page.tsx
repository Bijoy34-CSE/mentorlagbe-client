"use client";

import Link from "next/link";
import { ArrowRight, CircleDollarSign, GraduationCap, Hourglass, Receipt, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard, StatsCardSkeleton } from "@/components/dashboard/stats-card";
import { ErrorState } from "@/components/dashboard/states";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { formatDate, formatFee } from "@/lib/format";
import type { AdminStats, Payment, Tuition } from "@/lib/types";

export default function AdminOverviewPage() {
  const stats = useApi<AdminStats>("/api/admin/stats");
  const tuitions = useApi<Tuition[]>("/api/admin/tuitions");
  const payments = useApi<Payment[]>("/api/admin/transactions");

  const loading = stats.loading || tuitions.loading || payments.loading;
  const error = stats.error ?? tuitions.error ?? payments.error;

  const data = stats.data;
  const pendingList = (tuitions.data ?? []).filter((item) => item.approvalStatus === "pending").slice(0, 5);
  const recentPayments = (payments.data ?? []).slice(0, 5);

  // Used for the progress bars in the tuition status card
  const totalTuitions = tuitions.data?.length ?? 0;
  const rejected = (tuitions.data ?? []).filter((item) => item.approvalStatus === "rejected").length;
  const percent = (value: number) => (totalTuitions ? Math.round((value / totalTuitions) * 100) : 0);

  function retry() {
    stats.reload();
    tuitions.reload();
    payments.reload();
  }

  return (
    <>
      <PageHeader
        title="Admin Overview"
        description="Platform statistics, pending reviews and recent revenue."
        action={
          <Link href="/dashboard/admin/tuitions" className={buttonVariants()}>
            Review Tuitions
          </Link>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading || !data ? (
              Array.from({ length: 4 }).map((_, index) => <StatsCardSkeleton key={index} />)
            ) : (
              <>
                <StatsCard
                  label="Total Users"
                  value={data.totalUsers}
                  icon={Users}
                  tone="primary"
                  hint={`${data.totalStudents} students`}
                />
                <StatsCard label="Total Tutors" value={data.totalTutors} icon={GraduationCap} tone="emerald" />
                <StatsCard
                  label="Pending vs Approved"
                  value={`${data.pendingTuitions} / ${data.approvedTuitions}`}
                  icon={Hourglass}
                  tone="amber"
                  hint="Tuitions waiting / live"
                />
                <StatsCard
                  label="Total Stripe Revenue"
                  value={`$${data.totalRevenue}`}
                  icon={CircleDollarSign}
                  tone="sky"
                  hint="From Pro plan payments"
                />
              </>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Pending tuitions */}
            <section className="rounded-2xl border bg-card lg:col-span-2">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="font-semibold">Waiting for approval</h2>
                <Link
                  href="/dashboard/admin/tuitions"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Review all <ArrowRight className="size-4" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3 p-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-14 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : pendingList.length === 0 ? (
                <p className="px-6 py-14 text-center text-sm text-muted-foreground">
                  All caught up. There are no tuitions waiting for review.
                </p>
              ) : (
                <ul className="divide-y">
                  {pendingList.map((item) => (
                    <li key={item._id} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.title}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {item.tutorName} · {formatFee(item.monthlyFee)}/month · {formatDate(item.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status="pending" />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Tuition status breakdown */}
            <section className="rounded-2xl border bg-card p-6">
              <h2 className="font-semibold">Tuition status</h2>
              <p className="mt-1 text-sm text-muted-foreground">{totalTuitions} tuitions in total</p>

              <div className="mt-6 space-y-5">
                {[
                  { label: "Approved", value: data?.approvedTuitions ?? 0, color: "bg-emerald-500" },
                  { label: "Pending", value: data?.pendingTuitions ?? 0, color: "bg-amber-500" },
                  { label: "Rejected", value: rejected, color: "bg-rose-500" },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{row.label}</span>
                      <span className="font-medium">{row.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${row.color}`}
                        style={{ width: `${percent(row.value)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Recent payments */}
          <section className="rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="font-semibold">Recent payments</h2>
              <Link
                href="/dashboard/admin/transactions"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                All transactions <ArrowRight className="size-4" />
              </Link>
            </div>

            {loading ? (
              <div className="h-32 animate-pulse bg-muted/50" />
            ) : recentPayments.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                <Receipt className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No payments yet. Pro plan purchases will show up here.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {recentPayments.map((item) => (
                  <li key={item._id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.userName}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {item.planName} · {formatDate(item.paidAt)}
                      </p>
                    </div>
                    <p className="font-semibold">${item.amount}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </>
  );
}