import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { PaymentSuccess } from "./payment-success";

export const metadata: Metadata = { title: "Payment Successful | MentorLagbe" };

export default function PaymentSuccessPage() {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <Suspense fallback={null}>
        <PaymentSuccess />
      </Suspense>
    </Container>
  );
}