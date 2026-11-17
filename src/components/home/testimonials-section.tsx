import { Quote, Star } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { UserAvatar } from "@/components/user-avatar";

const testimonials = [
  {
    name: "Ayesha Siddika",
    role: "HSC Student",
    text: "I found a Higher Math tutor in two days. The filters made it easy to compare fees and schedules.",
  },
  {
    name: "Rahim Uddin",
    role: "Math & Physics Tutor",
    text: "Posting my batch took only five minutes. The applicant dashboard keeps every request in one place.",
  },
  {
    name: "Maliha Rahman",
    role: "IELTS Candidate",
    text: "Clear fees, clear schedules and quick replies from the tutor. My speaking score improved in a month.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t bg-muted/30 py-20">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by students and tutors"
          description="Hear from the people who already use MentorLagbe every week."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.1} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border bg-card p-6">
                <Quote className="size-8 text-primary/30" />
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 leading-relaxed text-muted-foreground">{item.text}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                  <UserAvatar name={item.name} />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}