import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Container } from "@/components/container";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment Cancelled | MentorLagbe" };

export default function PaymentCancelPage() {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <XCircle className="size-16 text-amber-500" />
        <h1 className="text-3xl font-bold">Payment cancelled</h1>
        <p className="text-muted-foreground">No money was taken from your account. You can try again whenever you like.</p>
        <div className="flex gap-3">
          <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
            Try Again
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Back to Home
          </Link>
        </div>
      </div>
    </Container>
  );
}