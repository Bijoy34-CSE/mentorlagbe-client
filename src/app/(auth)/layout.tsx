import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const points = [
  "Verified tutors for every subject and class level",
  "Online and offline tuition near you",
  "Track your applications in real time",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel (hidden on small screens) */}
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 text-xl font-bold">MentorLagbe</div>

        <div className="space-y-6">
          <h2 className="text-4xl leading-tight font-bold">Learn better with the right mentor by your side.</h2>
          <ul className="space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-primary-foreground/90">
                <CheckCircle2 className="size-5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

                <p className="text-sm text-primary-foreground/70">© 2026 MentorLagbe</p>
      </div>

      {/* Form area */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Logo className="lg:invisible" />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}