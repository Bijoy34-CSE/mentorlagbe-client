"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type Audience = "student" | "tutor";

const plans = {
  student: {
    freeFeatures: ["Browse and search all tuitions", "Apply to tuitions", "Track application status"],
    proName: "Pro Student",
    proPrice: 10,
    proFeatures: ["Everything in Free", "Priority booking on applications", "Pro badge on your profile"],
  },
  tutor: {
    freeFeatures: ["Post up to 2 tuitions", "Manage student applicants", "Public tutor profile"],
    proName: "Pro Tutor",
    proPrice: 15,
    proFeatures: ["Everything in Free", "Unlimited tuition posts", "Verified badge on your profile"],
  },
};

export function PricingPlans() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [audience, setAudience] = useState<Audience>("student");
  const [loading, setLoading] = useState(false);

  // Show the plans of the signed in user's role first
  useEffect(() => {
    if (user?.role === "tutor") setAudience("tutor");
  }, [user?.role]);

  const plan = plans[audience];
  const isCurrentPro = user?.plan === "pro" && user.role === audience;

  async function handleUpgrade() {
    if (!user) {
      toast.info("Please sign in to upgrade your plan");
      router.push("/sign-in");
      return;
    }
    if (user.role === "admin") {
      toast.info("Admin accounts do not need a plan");
      return;
    }
    if (user.role !== audience) {
      toast.error(`This plan is only for ${audience}s`);
      return;
    }

    setLoading(true);
    try {
      const { url } = await apiFetch<{ url: string }>("/api/payments/checkout", {
        method: "POST",
        auth: true,
      });
      window.location.href = url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start the payment");
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Audience switch */}
      <div className="mx-auto mb-10 flex w-fit rounded-full border bg-muted/50 p-1">
        {(["student", "tutor"] as Audience[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setAudience(value)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium capitalize transition-colors",
              audience === value ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
            )}
          >
            For {value}s
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Free plan */}
        <div className="flex h-full flex-col rounded-2xl border bg-card p-8">
          <h3 className="text-lg font-semibold">Free</h3>
          <p className="mt-1 text-sm text-muted-foreground">Everything you need to get started.</p>
          <p className="mt-6 text-4xl font-bold">
            $0<span className="text-base font-normal text-muted-foreground"> /forever</span>
          </p>
          <ul className="mt-8 flex-1 space-y-3">
            {plan.freeFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href={user ? "/dashboard" : "/sign-up"}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-8 w-full")}
          >
            {user ? "Go to Dashboard" : "Get Started Free"}
          </Link>
        </div>

        {/* Pro plan */}
        <div className="relative flex h-full flex-col rounded-2xl border-2 border-primary bg-card p-8 shadow-xl shadow-primary/10">
          <span className="absolute -top-3 left-8 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            <Crown className="size-3" /> Most Popular
          </span>
          <h3 className="text-lg font-semibold">{plan.proName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Unlock the full MentorLagbe experience.</p>
          <p className="mt-6 text-4xl font-bold">
            ${plan.proPrice}
            <span className="text-base font-normal text-muted-foreground"> /one time</span>
          </p>
          <ul className="mt-8 flex-1 space-y-3">
            {plan.proFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <Button size="lg" className="mt-8 w-full" onClick={handleUpgrade} disabled={loading || isCurrentPro}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {isCurrentPro ? "Your Current Plan" : loading ? "Redirecting to Stripe..." : "Subscribe with Stripe"}
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">Secure payments powered by Stripe.</p>
    </div>
  );
}