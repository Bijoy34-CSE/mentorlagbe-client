"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { ErrorState } from "@/components/dashboard/states";
import { useApi } from "@/hooks/use-api";
import type { UserProfile } from "@/lib/types";
import { ProfileForm } from "./profile-form";

export default function ProfilePage() {
  const { data, loading, error, reload } = useApi<UserProfile>("/api/users/me");

  return (
    <>
      <PageHeader title="Update Profile" description="Keep your details and profile photo up to date." />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading || !data ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-96 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      ) : (
        <ProfileForm profile={data} />
      )}
    </>
  );
}