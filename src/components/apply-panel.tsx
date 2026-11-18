"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Info, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { formatFee } from "@/lib/format";

interface ApplyPanelProps {
  tuitionId: string;
  monthlyFee: number;
}

type Errors = { phone?: string; schedule?: string };

export function ApplyPanel({ tuitionId, monthlyFee }: ApplyPanelProps) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [applied, setApplied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [phone, setPhone] = useState("");
  const [schedule, setSchedule] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const isStudent = user?.role === "student";

  // Find out if this student has already applied
  useEffect(() => {
    if (!isStudent) return;
    setChecking(true);
    apiFetch<{ applied: boolean }>(`/api/applications/check/${tuitionId}`, { auth: true })
      .then((result) => setApplied(result.applied))
      .catch(() => setApplied(false))
      .finally(() => setChecking(false));
  }, [isStudent, tuitionId]);

  function validate() {
    const next: Errors = {};
    if (!/^[0-9+\-\s]{10,15}$/.test(phone.trim())) next.phone = "Please enter a valid phone number";
    if (!schedule.trim()) next.schedule = "Please tell us your preferred schedule";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await apiFetch("/api/applications", {
        method: "POST",
        auth: true,
        body: {
          tuitionId,
          studentPhone: phone.trim(),
          preferredSchedule: schedule.trim(),
          studentNote: note.trim(),
        },
      });
      toast.success("Application submitted successfully");
      setApplied(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your application");
    } finally {
      setSubmitting(false);
    }
  }

  function renderBody() {
    if (isPending || (isStudent && checking)) {
      return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
    }

    // Visitor is not signed in
    if (!user) {
      return (
        <div className="space-y-4 text-center">
          <Lock className="mx-auto size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Sign in as a student to apply for this tuition.</p>
          <Link href="/sign-in" className={`${buttonVariants({ size: "lg" })} w-full`}>
            Sign In to Apply
          </Link>
        </div>
      );
    }

    // Tutors and admins cannot apply
    if (!isStudent) {
      return (
        <div className="space-y-4">
          <Button size="lg" className="w-full" disabled>
            Apply Now
          </Button>
          <p className="flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" />
            Only student accounts can apply for tuitions. You are signed in as a {user.role}.
          </p>
        </div>
      );
    }

    if (applied) {
      return (
        <div className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto size-10 text-emerald-500" />
          <div>
            <p className="font-semibold">You have applied</p>
            <p className="mt-1 text-sm text-muted-foreground">The tutor will review your request soon.</p>
          </div>
          <Link
            href="/dashboard/student/my-applications"
            className={`${buttonVariants({ variant: "outline" })} w-full`}
          >
            View My Applications
          </Link>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="01XXXXXXXXX"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="schedule">Preferred Schedule</Label>
          <Input
            id="schedule"
            placeholder="e.g. Sat, Mon, Wed - 6:00 PM"
            value={schedule}
            onChange={(event) => setSchedule(event.target.value)}
          />
          {errors.schedule && <p className="text-sm text-destructive">{errors.schedule}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Learning Note (optional)</Label>
          <Textarea
            id="note"
            rows={3}
            placeholder="Tell the tutor about your goals"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {submitting ? "Submitting..." : "Apply for Tuition"}
        </Button>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-3xl font-bold">
        {formatFee(monthlyFee)}
        <span className="text-base font-normal text-muted-foreground"> /month</span>
      </p>
      <div className="my-5 h-px bg-border" />
      {renderBody()}
    </div>
  );
}