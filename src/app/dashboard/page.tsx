"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { authClient } from "@/lib/auth-client";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const role = session?.user?.role;

  useEffect(() => {
    if (role) router.replace(`/dashboard/${role}`);
  }, [role, router]);

  return <PageSkeleton />;
}