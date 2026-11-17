import { Suspense } from "react";
import { BookOpenCheck, GraduationCap, Handshake, Users } from "lucide-react";
import { Container } from "@/components/container";
import { CountUp } from "@/components/count-up";
import { serverFetch } from "@/lib/server-api";
import type { PlatformStats } from "@/lib/types";

async function StatsGrid() {
  let stats: PlatformStats | null = null;
  try {
    stats = await serverFetch<PlatformStats>("/api/public/stats");
  } catch {
    return null;
  }

  const items = [
    { label: "Verified Tutors", value: stats.tutors, icon: GraduationCap },
    { label: "Active Students", value: stats.students, icon: Users },
    { label: "Live Tuitions", value: stats.tuitions, icon: BookOpenCheck },
    { label: "Accepted Applications", value: stats.accepted, icon: Handshake },
  ];

  return (
    <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:divide-x lg:divide-primary-foreground/20">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2 px-4 text-center">
          <item.icon className="size-6 text-primary-foreground/70" />
          <p className="text-4xl font-bold">
            <CountUp value={item.value} suffix="+" />
          </p>
          <p className="text-sm text-primary-foreground/80">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl bg-primary px-6 py-12 text-primary-foreground shadow-xl shadow-primary/20 sm:px-10">
          <Suspense fallback={<div className="h-28" />}>
            <StatsGrid />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}