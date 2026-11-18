"use client";

import { useState } from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import { formatDate, formatFee } from "@/lib/format";
import type { Tuition } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "pending" | "approved" | "rejected";

const filters: Filter[] = ["all", "pending", "approved", "rejected"];

export default function AdminTuitionsPage() {
  const { data, loading, error, reload } = useApi<Tuition[]>("/api/admin/tuitions");
  const [filter, setFilter] = useState<Filter>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const list = (data ?? []).filter((item) => filter === "all" || item.approvalStatus === filter);

  async function review(tuition: Tuition, status: "approved" | "rejected") {
    setBusyId(tuition._id);
    try {
      await apiFetch(`/api/admin/tuitions/${tuition._id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status },
      });
      toast.success(`Tuition ${status}`);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the tuition");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageHeader title="Tuition Approval" description="Approve or reject tuitions posted by tutors." />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No tuitions submitted"
          text="When tutors post tuitions, they will show up here for review."
        />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                  filter === item ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                {item}
                <span className="ml-1.5 opacity-70">
                  {item === "all" ? data.length : data.filter((entry) => entry.approvalStatus === item).length}
                </span>
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <p className="rounded-2xl border border-dashed py-14 text-center text-sm text-muted-foreground">
              No {filter} tuitions.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border bg-card">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">Tuition</th>
                    <th className="px-5 py-3 font-medium">Tutor</th>
                    <th className="px-5 py-3 font-medium">Monthly Fee</th>
                    <th className="px-5 py-3 font-medium">Posted On</th>
                    <th className="px-5 py-3 font-medium">Approval</th>
                    <th className="px-5 py-3 text-right font-medium">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {list.map((item) => (
                    <tr key={item._id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.bannerImage}
                            alt=""
                            className="h-11 w-16 shrink-0 rounded-md bg-muted object-cover"
                          />
                          <div className="min-w-0">
                            <p className="max-w-64 truncate font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.subject} · {item.classLevel} · {item.mode}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium">{item.tutorName}</p>
                        <p className="text-xs text-muted-foreground">{item.tutorEmail}</p>
                      </td>
                      <td className="px-5 py-4 font-medium">{formatFee(item.monthlyFee)}</td>
                      <td className="px-5 py-4 text-muted-foreground">{formatDate(item.createdAt)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.approvalStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            disabled={busyId === item._id || item.approvalStatus === "approved"}
                            onClick={() => review(item, "approved")}
                          >
                            <Check className="size-4" /> Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busyId === item._id || item.approvalStatus === "rejected"}
                            onClick={() => review(item, "rejected")}
                          >
                            <X className="size-4" /> Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}