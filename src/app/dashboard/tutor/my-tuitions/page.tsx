"use client";

import Link from "next/link";
import { useState } from "react";
import { Library, Lock, Pencil, PlusCircle, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EditTuitionDialog } from "@/components/dashboard/edit-tuition-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { TuitionPayload } from "@/components/dashboard/tuition-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import { formatDate, formatFee } from "@/lib/format";
import type { Tuition } from "@/lib/types";

export default function MyTuitionsPage() {
  const { data, loading, error, reload } = useApi<Tuition[]>("/api/tuitions/mine");

  const [editing, setEditing] = useState<Tuition | null>(null);
  const [deleting, setDeleting] = useState<Tuition | null>(null);
  const [removing, setRemoving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleUpdate(payload: TuitionPayload) {
    if (!editing) return;
    try {
      await apiFetch(`/api/tuitions/${editing._id}`, { method: "PATCH", auth: true, body: payload });
      toast.success("Tuition updated and sent for review");
      setEditing(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the tuition");
    }
  }

  async function handleToggle(tuition: Tuition) {
    setBusyId(tuition._id);
    try {
      const result = await apiFetch<{ message: string }>(`/api/tuitions/${tuition._id}/toggle`, {
        method: "PATCH",
        auth: true,
      });
      toast.success(result.message);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change the status");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setRemoving(true);
    try {
      await apiFetch(`/api/tuitions/${deleting._id}`, { method: "DELETE", auth: true });
      toast.success("Tuition deleted");
      setDeleting(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the tuition");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="My Tuitions"
        description="Edit, close or delete the tuitions you have posted."
        action={
          <Link href="/dashboard/tutor/post-tuition" className={buttonVariants()}>
            <PlusCircle className="size-4" /> Post a Tuition
          </Link>
        }
      />

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
          icon={Library}
          title="You have not posted any tuition"
          text="Create your first tuition and it will appear here after admin approval."
          actionHref="/dashboard/tutor/post-tuition"
          actionLabel="Post a Tuition"
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Tuition</th>
                <th className="px-5 py-3 font-medium">Monthly Fee</th>
                <th className="px-5 py-3 font-medium">Posted On</th>
                <th className="px-5 py-3 font-medium">Approval</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((item) => (
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
                  <td className="px-5 py-4 font-medium">{formatFee(item.monthlyFee)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{formatDate(item.createdAt)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={item.approvalStatus} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={item.isActive ? "active" : "closed"} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(item)}>
                        <Pencil className="size-4" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" disabled={busyId === item._id} onClick={() => handleToggle(item)}>
                        {item.isActive ? <Lock className="size-4" /> : <Power className="size-4" />}
                        {item.isActive ? "Close" : "Reopen"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleting(item)}>
                        <Trash2 className="size-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditTuitionDialog tuition={editing} onClose={() => setEditing(null)} onSubmit={handleUpdate} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this tuition?"
        description={`"${deleting?.title ?? ""}" and all of its applications will be removed. This cannot be undone.`}
        confirmLabel="Yes, delete it"
        destructive
        loading={removing}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}