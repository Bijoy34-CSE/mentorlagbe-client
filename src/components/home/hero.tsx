"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, CheckCircle2, Search, ShieldCheck, Sparkles, Star, Wifi } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

const popularSubjects = ["Math", "Physics", "Programming", "IELTS"];

const trustPoints = ["Admin verified listings", "Online & offline tuition", "Secure Stripe payments"];

// A small card that floats up and down
function FloatingChip({ className, delay, children }: { className: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      className={`absolute flex items-center gap-2 rounded-xl border bg-card px-3.5 py-2.5 text-sm font-medium shadow-lg ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const text = query.trim();
    router.push(text ? `/tuitions?search=${encodeURIComponent(text)}` : "/tuitions");
  }

  return (
    <section className="relative overflow-hidden border-b">
      {/* Soft background decoration */}
      <div className="absolute -top-32 right-0 -z-10 size-[32rem] rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <Container className="grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
        {/* Left side: text and search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium">
            <Sparkles className="size-4 text-primary" />
            Smart tuition & mentorship platform
          </span>

          <h1 className="text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Find your <span className="text-primary">ideal tutor</span> or mentorship batch today
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Compare verified tutors by subject, class level, mode and monthly budget, then apply in a few clicks.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex max-w-xl items-center gap-2 rounded-xl border bg-card p-2 shadow-lg shadow-primary/5"
          >
            <Search className="ml-3 size-5 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by subject or tuition title"
              aria-label="Search tuitions"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="lg">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            {popularSubjects.map((subject) => (
              <Link
                key={subject}
                href={`/tuitions?subject=${encodeURIComponent(subject)}`}
                className="rounded-full border px-3 py-1 transition-colors hover:border-primary hover:text-primary"
              >
                {subject}
              </Link>
            ))}
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right side: tutor card preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md py-10"
        >
          <div className="absolute inset-4 rotate-3 rounded-3xl bg-primary/10" />

          <div className="relative rounded-3xl border bg-card p-6 shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                RU
              </div>
              <div>
                <p className="flex items-center gap-1.5 font-semibold">
                  Rahim Uddin <BadgeCheck className="size-4 text-primary" />
                </p>
                <p className="text-sm text-muted-foreground">HSC Math & Physics Mentor</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Higher Math", "Physics", "Admission"].map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 divide-x rounded-xl border text-center">
              <div className="p-3">
                <p className="flex items-center justify-center gap-1 font-semibold">
                  4.9 <Star className="size-3.5 fill-amber-400 text-amber-400" />
                </p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="p-3">
                <p className="font-semibold">6 yrs</p>
                <p className="text-xs text-muted-foreground">Experience</p>
              </div>
              <div className="p-3">
                <p className="font-semibold">3 days</p>
                <p className="text-xs text-muted-foreground">Per week</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <p className="text-2xl font-bold">
                ৳3,000<span className="text-sm font-normal text-muted-foreground"> /month</span>
              </p>
              <span className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Apply Now
              </span>
            </div>
          </div>

          <FloatingChip className="top-0 -right-2 sm:-right-6" delay={0}>
            <CheckCircle2 className="size-4 text-emerald-500" /> Application accepted
          </FloatingChip>
          <FloatingChip className="-bottom-1 left-6" delay={1.2}>
            <ShieldCheck className="size-4 text-primary" /> Verified by admin
          </FloatingChip>
          <FloatingChip className="-bottom-1 right-6" delay={2.2}>
            <Wifi className="size-4 text-emerald-500" /> Online classes
          </FloatingChip>
        </motion.div>
      </Container>
    </section>
  );
}