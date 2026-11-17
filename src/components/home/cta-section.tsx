import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-14 text-center sm:px-12">
            <div className="absolute -top-20 left-1/2 -z-0 size-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                Ready to start your learning journey?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join MentorLagbe today. Find the right tutor, or share your knowledge with students who need it.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/tuitions" className={buttonVariants({ size: "lg" })}>
                  Find a Tutor
                </Link>
                <Link href="/sign-up" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  Become a Tutor
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}