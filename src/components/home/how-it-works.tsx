import { ClipboardCheck, Rocket, Search, UserPlus } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const steps = [
  {
    icon: UserPlus,
    title: "Create your account",
    text: "Sign up as a student or a tutor. It takes less than a minute.",
  },
  {
    icon: Search,
    title: "Post or discover",
    text: "Tutors post their batches. Students search by subject, class level and budget.",
  },
  {
    icon: ClipboardCheck,
    title: "Apply and get approved",
    text: "Admins review every listing. Students apply and tutors accept the best fit.",
  },
  {
    icon: Rocket,
    title: "Learn and grow",
    text: "Start classes online or offline and upgrade to Pro whenever you need more.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-y bg-muted/30 py-20">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="From sign up to first class in four steps"
          description="One simple workflow for students who want to learn and tutors who want to teach."
        />

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Line that connects the steps on large screens */}
          <div className="absolute top-14 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block" />

          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.1} className="h-full">
              <div className="relative flex h-full flex-col items-center rounded-2xl border bg-card p-6 text-center">
                <span className="absolute top-4 right-4 text-xs font-bold text-muted-foreground">0{index + 1}</span>
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                  <step.icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}