"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

type State =
  | { status: "loading" }
  | { status: "done"; planName: string; amount: number }
  | { status: "error"; message: string };

export function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState<State>({ status: "loading" });
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!sessionId) {
      setState({ status: "error", message: "Payment session was not found." });
      return;
    }

    apiFetch<{ planName: string; amount: number }>(`/api/payments/verify?session_id=${sessionId}`, { auth: true })
      .then((result) => setState({ status: "done", planName: result.planName, amount: result.amount }))
      .catch((error) =>
        setState({ status: "error", message: error instanceof Error ? error.message : "Could not verify payment" })
      );
  }, [sessionId]);

  if (state.status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="size-10 animate-spin text-primary" />
        <h1 className="text-2xl font-bold">Confirming your payment...</h1>
        <p className="text-muted-foreground">Please do not close this page.</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <XCircle className="size-14 text-destructive" />
        <h1 className="text-2xl font-bold">We could not confirm the payment</h1>
        <p className="text-muted-foreground">{state.message}</p>
        <Link href="/pricing" className={buttonVariants()}>
          Back to Pricing
        </Link>
      </div>
    );
  }

  return (
    <div className="flex max-w-md flex-col items-center gap-4 text-center">
      <CheckCircle2 className="size-16 text-emerald-500" />
      <h1 className="text-3xl font-bold">Payment successful!</h1>
      <p className="text-muted-foreground">
        Thank you. Your <span className="font-semibold text-foreground">{state.planName}</span> is now active.
      </p>
      <p className="rounded-lg border bg-card px-5 py-3 text-sm">
        Amount paid: <span className="font-semibold">${state.amount}</span>
      </p>
      {/* A full page load makes sure the new plan is shown everywhere */}
      <button
        type="button"
        onClick={() => window.location.assign("/dashboard")}
        className={buttonVariants({ size: "lg" })}
      >
        Go to Dashboard
      </button>
    </div>
  );
}