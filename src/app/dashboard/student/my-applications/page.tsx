"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipboardList, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import { formatDate, formatFee } from "@/lib/format";
import type { Application } from "@/lib/types";

export default function MyApplicationsPage() {
  const { data, loading, error, reload } = useApi<Application[]>("/api/applications/mine");
  const [target, setTarget] = useState<Application | null>(null);
  const [cancelling, setCancelling] = useState(false);

  async function confirmCancel() {
    if (!target) return;
    setCancelling(true);
    try {
      await apiFetch(`/api/applications/${target._id}`, { method: "DELETE", auth: true });
      toast.success("Application cancelled");
      setTarget(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel the application");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <PageHeader title="My Applications" description="Track every tuition you have applied for." />

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
          icon={ClipboardList}
          title="You have not applied yet"
          text="When you apply for a tuition, it will show up here with its status."
          actionHref="/tuitions"
          actionLabel="Browse Tuitions"
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Tuition</th>
                <th className="px-5 py-3 font-medium">Tutor</th>
                <th className="px-5 py-3 font-medium">Monthly Fee</th>
                <th className="px-5 py-3 font-medium">Applied On</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((item) => (
                <tr key={item._id} className="transition-colors hover:bg-muted/30">
                  <td className="max-w-64 px-5 py-4">
                    <Link href={`/tuitions/${item.tuitionId}`} className="line-clamp-1 font-medium hover:text-primary">
                      {item.tuitionTitle}
                    </Link>
                    <p className="text-xs text-muted-foreground">{item.subject}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{item.tutorName}</p>
                    <p className="text-xs text-muted-foreground">{item.tutorEmail}</p>
                  </td>
                  <td className="px-5 py-4 font-medium">{formatFee(item.monthlyFee)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{formatDate(item.appliedAt)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    {item.status === "pending" ? (
                      <Button variant="outline" size="sm" onClick={() => setTarget(item)}>
                        <Trash2 className="size-4" /> Cancel
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(target)}
        title="Cancel this application?"
        description={`Your application for "${target?.tuitionTitle ?? ""}" will be removed. You can apply again later.`}
        confirmLabel="Yes, cancel it"
        destructive
        loading={cancelling}
        onConfirm={confirmCancel}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}