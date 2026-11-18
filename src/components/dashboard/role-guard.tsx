"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { authClient } from "@/lib/auth-client";

// Lets only the given role see the pages inside
export function RoleGuard({ role, children }: { role: string; children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const current = session?.user?.role;

  useEffect(() => {
    if (current && current !== role) router.replace("/dashboard");
  }, [current, role, router]);

  if (current !== role) return <PageSkeleton />;
  return <>{children}</>;
}