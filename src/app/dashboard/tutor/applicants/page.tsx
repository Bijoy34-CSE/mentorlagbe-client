"use client";

import { useState } from "react";
import { Check, UsersRound, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Application } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "pending" | "accepted" | "rejected";

const filters: Filter[] = ["all", "pending", "accepted", "rejected"];

export default function ApplicantsPage() {
  const { data, loading, error, reload } = useApi<Application[]>("/api/applications/tutor");
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const list = (data ?? []).filter((item) => filter === "all" || item.status === filter);

  async function updateStatus(application: Application, status: "accepted" | "rejected") {
    setBusyId(application._id);
    try {
      await apiFetch(`/api/applications/${application._id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status },
      });
      toast.success(`Application ${status}`);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the application");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageHeader title="Applicants" description="Review students who applied to your tuitions." />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No applicants yet"
          text="When a student applies to one of your approved tuitions, the request will show up here."
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
                  {item === "all" ? data.length : data.filter((entry) => entry.status === item).length}
                </span>
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <p className="rounded-2xl border border-dashed py-14 text-center text-sm text-muted-foreground">
              No {filter} applications.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border bg-card">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">Student</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Tuition</th>
                    <th className="px-5 py-3 font-medium">Preferred Schedule</th>
                    <th className="px-5 py-3 font-medium">Note</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {list.map((item) => (
                    <tr key={item._id} className="align-top transition-colors hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <p className="font-medium">{item.studentName}</p>
                        <p className="text-xs text-muted-foreground">{item.studentEmail}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Applied {formatDate(item.appliedAt)}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">{item.studentPhone}</td>
                      <td className="max-w-56 px-5 py-4">
                        <p className="line-clamp-2 font-medium">{item.tuitionTitle}</p>
                      </td>
                      <td className="max-w-48 px-5 py-4 text-muted-foreground">{item.preferredSchedule}</td>
                      <td className="max-w-64 px-5 py-4 text-muted-foreground">
                        <p className="line-clamp-2" title={item.studentNote}>
                          {item.studentNote || "-"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            disabled={busyId === item._id || item.status === "accepted"}
                            onClick={() => updateStatus(item, "accepted")}
                          >
                            <Check className="size-4" /> Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busyId === item._id || item.status === "rejected"}
                            onClick={() => updateStatus(item, "rejected")}
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