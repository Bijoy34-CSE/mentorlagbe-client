"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Logo />
        <TriangleAlert className="size-16 text-amber-500" />
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="max-w-md text-muted-foreground">
          We hit an unexpected problem. Please try again, or go back to the home page.
        </p>
        <div className="flex gap-3">
          <Button size="lg" onClick={reset}>
            Try Again
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Back to Home
          </Link>
        </div>
      </Container>
    </div>
  );
}