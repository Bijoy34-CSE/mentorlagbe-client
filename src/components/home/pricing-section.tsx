import { Container } from "@/components/container";
import { PricingPlans } from "@/components/pricing-plans";
import { SectionHeading } from "@/components/section-heading";

export function PricingSection() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Simple plans for students and tutors"
          description="Start for free and upgrade to Pro with a single payment when you are ready."
        />
        <PricingPlans />
      </Container>
    </section>
  );
}