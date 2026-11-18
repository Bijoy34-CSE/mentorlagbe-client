import Link from "next/link";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Logo />
        <p className="text-8xl font-bold text-primary">404</p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="max-w-md text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Back to Home
        </Link>
      </Container>
    </div>
  );
}