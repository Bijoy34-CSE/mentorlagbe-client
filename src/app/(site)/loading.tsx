import { Container } from "@/components/container";

// Shown while any public page is loading
export default function Loading() {
  return (
    <Container className="py-16">
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
        <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    </Container>
  );
}