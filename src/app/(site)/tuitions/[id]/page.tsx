import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, BadgeCheck, CalendarDays, GraduationCap, MapPin, MonitorSmartphone, BookOpen } from "lucide-react";
import { ApplyPanel } from "@/components/apply-panel";
import { Container } from "@/components/container";
import { UserAvatar } from "@/components/user-avatar";
import { ServerApiError, serverFetch } from "@/lib/server-api";
import type { TuitionDetail } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BookmarkButton } from "@/components/bookmark-button";
export const metadata: Metadata = { title: "Tuition Details | MentorLagbe" };

async function DetailsContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let tuition: TuitionDetail;
  try {
    tuition = await serverFetch<TuitionDetail>(`/api/tuitions/${id}`);
  } catch (error) {
    // Wrong id, or the tuition is not approved
    if (error instanceof ServerApiError && (error.status === 404 || error.status === 400)) notFound();
    throw error;
  }

  const info = [
    { icon: BookOpen, label: "Subject", value: tuition.subject },
    { icon: GraduationCap, label: "Class Level", value: tuition.classLevel },
    { icon: MonitorSmartphone, label: "Mode", value: tuition.mode },
    { icon: CalendarDays, label: "Schedule", value: `${tuition.daysPerWeek} days per week` },
    { icon: MapPin, label: "Location", value: tuition.location },
  ];

  const tutorName = tuition.tutor?.name ?? tuition.tutorName;

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div className="relative aspect-video overflow-hidden rounded-2xl border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tuition.bannerImage} alt={tuition.title} className="size-full object-cover" />
          <span
            className={cn(
              "absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold text-white",
              tuition.mode === "Online" ? "bg-emerald-500" : "bg-amber-500"
            )}
          >
            {tuition.mode}
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{tuition.title}</h1>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {info.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{item.label}</dt>
                  <dd className="truncate text-sm font-semibold">{item.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <section>
          <h2 className="mb-3 text-xl font-semibold">About this tuition</h2>
          <p className="leading-relaxed whitespace-pre-line text-muted-foreground">{tuition.description}</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Your tutor</h2>
          <div className="flex items-start gap-4 rounded-2xl border bg-card p-5">
            <UserAvatar name={tutorName} image={tuition.tutor?.image} className="size-14 text-lg" />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-semibold">
                {tutorName}
                {tuition.tutor?.plan === "pro" && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <BadgeCheck className="size-3.5" /> Verified
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tuition.tutor?.bio || "This tutor has not added a bio yet."}
              </p>
            </div>
          </div>
        </section>
      </div>

      <aside className="lg:col-span-1">
                <div className="space-y-3 lg:sticky lg:top-24">
          <ApplyPanel tuitionId={tuition._id} monthlyFee={tuition.monthlyFee} />
          <BookmarkButton tuitionId={tuition._id} variant="button" />
        </div>
      </aside>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="aspect-video animate-pulse rounded-2xl bg-muted" />
        <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

export default function TuitionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Container className="py-10">
      <Link
        href="/tuitions"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to all tuitions
      </Link>
      <Suspense fallback={<DetailsSkeleton />}>
        <DetailsContent params={params} />
      </Suspense>
    </Container>
  );
}