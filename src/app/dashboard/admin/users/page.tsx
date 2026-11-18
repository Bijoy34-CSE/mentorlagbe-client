"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { UserAvatar } from "@/components/user-avatar";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/format";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type Role = "student" | "tutor" | "admin";
type RoleFilter = "all" | Role;

const roles: Role[] = ["student", "tutor", "admin"];
const filters: RoleFilter[] = ["all", ...roles];

interface RoleChange {
  user: UserProfile;
  role: Role;
}

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const { data, loading, error, reload } = useApi<UserProfile[]>("/api/admin/users");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RoleFilter>("all");
  const [change, setChange] = useState<RoleChange | null>(null);
  const [saving, setSaving] = useState(false);

  const text = search.trim().toLowerCase();
  const list = (data ?? []).filter((user) => {
    const matchesRole = filter === "all" || user.role === filter;
    const matchesText = !text || user.name.toLowerCase().includes(text) || user.email.toLowerCase().includes(text);
    return matchesRole && matchesText;
  });

  async function confirmChange() {
    if (!change) return;
    setSaving(true);
    try {
      await apiFetch(`/api/admin/users/${change.user._id}/role`, {
        method: "PATCH",
        auth: true,
        body: { role: change.role },
      });
      toast.success(`${change.user.name} is now a ${change.role}`);
      setChange(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change the role");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Users" description="See every registered user and manage their roles." />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Users} title="No users yet" text="Registered users will appear here." />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
                    {item === "all" ? data.length : data.filter((user) => user.role === item).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email"
                aria-label="Search users"
                className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          {list.length === 0 ? (
            <p className="rounded-2xl border border-dashed py-14 text-center text-sm text-muted-foreground">
              No users match your search.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border bg-card">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">User</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Plan</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {list.map((user) => {
                    const isMe = user.email === session?.user?.email;
                    return (
                      <tr key={user._id} className="transition-colors hover:bg-muted/30">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={user.name} image={user.image} />
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {user.name}
                                {isMe && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">{user.phone || "-"}</td>
                        <td className="px-5 py-4">
                          {user.role === "admin" ? (
                            <span className="text-xs text-muted-foreground">-</span>
                          ) : (
                            <PlanBadge plan={user.plan} />
                          )}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {user.createdAt ? formatDate(user.createdAt) : "-"}
                        </td>
                        <td className="px-5 py-4">
                          <select
                            aria-label={`Role of ${user.name}`}
                            value={user.role}
                            disabled={isMe}
                            title={isMe ? "You cannot change your own role" : undefined}
                            onChange={(event) => setChange({ user, role: event.target.value as Role })}
                            className="h-9 rounded-lg border bg-background px-3 text-sm capitalize outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(change)}
        title="Change this user's role?"
        description={`${change?.user.name ?? "This user"} will become a ${change?.role ?? ""}. Their dashboard and permissions will change right away.`}
        confirmLabel="Yes, change role"
        loading={saving}
        onConfirm={confirmChange}
        onCancel={() => setChange(null)}
      />
    </>
  );
}