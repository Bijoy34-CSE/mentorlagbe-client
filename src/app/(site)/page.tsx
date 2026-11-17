import { CtaSection } from "@/components/home/cta-section";
import { FeaturedTuitions } from "@/components/home/featured-tuitions";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PricingSection } from "@/components/home/pricing-section";
import { StatsSection } from "@/components/home/stats-section";
import { SubjectsSection } from "@/components/home/subjects-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedTuitions />
      <HowItWorks />
      <PricingSection />
      <SubjectsSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}