import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PricingPlans } from "@/components/pricing-plans";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = { title: "Pricing | MentorLagbe" };

const faqs = [
  {
    question: "Is it a monthly subscription?",
    answer: "No. The Pro plan is a single payment, and your account stays Pro after that.",
  },
  {
    question: "What happens after I pay?",
    answer: "Your account is upgraded right away and the payment is saved in your transaction history.",
  },
  {
    question: "Can I use the platform for free?",
    answer: "Yes. Free tutors can post 2 tuitions, and free students can browse and apply to any tuition.",
  },
];

export default function PricingPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Pricing"
        title="Choose the plan that fits you"
        description="Start for free. Upgrade to Pro when you need more power."
      />
      <PricingPlans />

      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="mb-6 text-center text-2xl font-bold">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}