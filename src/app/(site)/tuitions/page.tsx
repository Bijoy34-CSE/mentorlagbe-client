import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { Container } from "@/components/container";
import { Pagination } from "@/components/pagination";
import { TuitionCard, TuitionCardSkeleton } from "@/components/tuition-card";
import { TuitionFilters } from "@/components/tuition-filters";
import { serverFetch } from "@/lib/server-api";
import type { TuitionList, TuitionMeta } from "@/lib/types";

export const metadata: Metadata = { title: "Browse Tuitions | MentorLagbe" };

type SearchParams = Promise<Record<string, string | undefined>>;

async function BrowseContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  // Only these keys are sent to the server
  const query = new URLSearchParams();
  for (const key of ["search", "subject", "classLevel", "mode", "page"]) {
    if (params[key]) query.set(key, params[key]!);
  }
  query.set("limit", "9");

  const [list, meta] = await Promise.all([
    serverFetch<TuitionList>(`/api/tuitions?${query.toString()}`),
    serverFetch<TuitionMeta>("/api/tuitions/meta"),
  ]);

  return (
    <div className="space-y-8">
      <TuitionFilters subjects={meta.subjects} classLevels={meta.classLevels} />

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{list.data.length}</span> of{" "}
        <span className="font-semibold text-foreground">{list.total}</span> tuitions
      </p>

      {list.data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-20 text-center">
          <SearchX className="size-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">No tuitions found</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try a different keyword or clear some filters to see more results.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.data.map((tuition) => (
            <TuitionCard key={tuition._id} tuition={tuition} />
          ))}
        </div>
      )}

      <Pagination page={list.page} totalPages={list.totalPages} params={params} />
    </div>
  );
}

function BrowseSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <TuitionCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default function TuitionsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <section className="border-b bg-muted/30">
        <Container className="py-12">
          <p className="mb-2 text-sm font-semibold tracking-widest text-primary uppercase">Browse Tuitions</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Find the right tuition for you</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Search by title or subject, then narrow the list by class level and mode.
          </p>
        </Container>
      </section>

      <Container className="py-10">
        <Suspense fallback={<BrowseSkeleton />}>
          <BrowseContent searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}