"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crown, Info } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { ErrorState } from "@/components/dashboard/states";
import { TuitionForm, type TuitionPayload } from "@/components/dashboard/tuition-form";
import { buttonVariants } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { FREE_POST_LIMIT } from "@/lib/constants";
import type { Tuition } from "@/lib/types";

export default function PostTuitionPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data, loading, error, reload } = useApi<Tuition[]>("/api/tuitions/mine");

  const isPro = session?.user?.plan === "pro";
  const used = data?.length ?? 0;
  const limitReached = !isPro && used >= FREE_POST_LIMIT;

  async function handleCreate(payload: TuitionPayload) {
    try {
      await apiFetch("/api/tuitions", { method: "POST", auth: true, body: payload });
      toast.success("Tuition submitted for admin approval");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post the tuition");
    }
  }

  return (
    <>
      <PageHeader title="Post a Tuition" description="Share your batch or 1-on-1 mentorship with students." />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
      ) : limitReached ? (
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border bg-card px-6 py-14 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <Crown className="size-7" />
          </span>
          <h2 className="text-xl font-semibold">You have reached the free limit</h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Free tutors can post up to {FREE_POST_LIMIT} tuitions. Upgrade to Pro to post unlimited tuitions and get a
            verified badge.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/pricing" className={buttonVariants()}>
              Upgrade to Pro
            </Link>
            <Link href="/dashboard/tutor/my-tuitions" className={buttonVariants({ variant: "outline" })}>
              Manage My Tuitions
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {!isPro && (
            <p className="flex items-start gap-2 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" />
              You have used {used} of {FREE_POST_LIMIT} free tuition posts. Every post is reviewed by an admin before it
              goes public.
            </p>
          )}
          <div className="max-w-3xl rounded-2xl border bg-card p-6 sm:p-8">
            <TuitionForm submitLabel="Submit for Approval" onSubmit={handleCreate} />
          </div>
        </div>
      )}
    </>
  );
}