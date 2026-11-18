"use client";

import { CircleDollarSign, Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { RoleBadge } from "@/components/role-badge";
import { useApi } from "@/hooks/use-api";
import { formatDate } from "@/lib/format";
import type { Payment } from "@/lib/types";

export default function AdminTransactionsPage() {
  const { data, loading, error, reload } = useApi<Payment[]>("/api/admin/transactions");

  const total = data?.reduce((sum, item) => sum + item.amount, 0) ?? 0;

  return (
    <>
      <PageHeader title="Transactions" description="All Pro plan payments made through Stripe." />

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
          icon={Receipt}
          title="No transactions yet"
          text="When a tutor or student buys a Pro plan, the payment will be listed here."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:max-w-2xl">
            <StatsCard label="Total Revenue" value={`$${total}`} icon={CircleDollarSign} tone="emerald" />
            <StatsCard label="Total Payments" value={data.length} icon={Receipt} tone="primary" />
          </div>

          <div className="overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Transaction ID</th>
                  <th className="px-5 py-3 font-medium">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.map((item) => (
                  <tr key={item._id} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <p className="font-medium">{item.userName}</p>
                      <p className="text-xs text-muted-foreground">{item.userEmail}</p>
                    </td>
                    <td className="px-5 py-4">
                      <RoleBadge role={item.userRole} />
                    </td>
                    <td className="px-5 py-4">{item.planName}</td>
                    <td className="px-5 py-4 font-semibold">
                      ${item.amount} <span className="text-xs font-normal uppercase text-muted-foreground">{item.currency}</span>
                    </td>
                    <td className="px-5 py-4">
                      <code className="rounded bg-muted px-2 py-1 text-xs" title={item.transactionId}>
                        {item.transactionId.length > 22 ? `${item.transactionId.slice(0, 22)}...` : item.transactionId}
                      </code>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{formatDate(item.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}