import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { TuitionCard, TuitionCardSkeleton } from "@/components/tuition-card";
import { buttonVariants } from "@/components/ui/button";
import { serverFetch } from "@/lib/server-api";
import type { Tuition } from "@/lib/types";

// Loads the 6 latest approved tuitions from the API
async function LatestTuitions() {
  let tuitions: Tuition[] = [];
  try {
    tuitions = await serverFetch<Tuition[]>("/api/tuitions/latest");
  } catch {
    // If the API is down, we show a friendly message below
  }

  if (tuitions.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
        No tuitions are available right now. Please check again soon.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tuitions.map((tuition, index) => (
        <Reveal key={tuition._id} delay={(index % 3) * 0.08} className="h-full">
          <TuitionCard tuition={tuition} />
        </Reveal>
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <TuitionCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function FeaturedTuitions() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Featured Tuitions"
          title="Fresh tuition batches from top tutors"
          description="Every listing is reviewed and approved by our team before it appears here."
        />

        <Suspense fallback={<GridSkeleton />}>
          <LatestTuitions />
        </Suspense>

        <div className="mt-12 text-center">
          <Link href="/tuitions" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Browse All Tuitions
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}