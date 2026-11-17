import Link from "next/link";
import { Atom, BookOpen, Calculator, Code, Dna, FlaskConical, Globe, Receipt } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const subjects = [
  { name: "Math", text: "SSC, HSC and admission", icon: Calculator },
  { name: "Physics", text: "Concepts and problem solving", icon: Atom },
  { name: "Chemistry", text: "Theory with MCQ practice", icon: FlaskConical },
  { name: "Biology", text: "Medical and college prep", icon: Dna },
  { name: "Programming", text: "From basics to projects", icon: Code },
  { name: "IELTS", text: "All four modules", icon: Globe },
  { name: "English", text: "Grammar and speaking", icon: BookOpen },
  { name: "Accounting", text: "Practical business studies", icon: Receipt },
];

export function SubjectsSection() {
  return (
    <section className="border-t bg-muted/30 py-20">
      <Container>
        <SectionHeading
          eyebrow="Top Subjects"
          title="Explore the most popular subjects"
          description="Pick a subject and see all the tutors and batches available right now."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {subjects.map((subject, index) => (
            <Reveal key={subject.name} delay={(index % 4) * 0.06} className="h-full">
              <Link
                href={`/tuitions?subject=${encodeURIComponent(subject.name)}`}
                className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <subject.icon className="size-6" />
                </span>
                <div>
                  <h3 className="font-semibold">{subject.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{subject.text}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}