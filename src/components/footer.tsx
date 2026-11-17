import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";

// Small inline icons for social media (the X logo is the new one, not the bird)
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How It Works" },
];

const accountLinks = [
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Create Account" },
  { href: "/dashboard", label: "Dashboard" },
];

const socials = [
  { href: "https://x.com", label: "X", Icon: XIcon },
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedinIcon },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Find verified tutors and mentorship batches by subject, class level and budget, all in one place.
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Account</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {accountLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Contact</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" /> support@mentorlagbe.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" /> +880 1700-000000
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" /> Dhaka, Bangladesh
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t">
        <Container className="py-5 text-center text-sm text-muted-foreground">
                    © 2026 MentorLagbe. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}