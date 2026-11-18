"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { ImageUpload } from "@/components/image-upload";
import { RoleBadge } from "@/components/role-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/format";
import type { UserProfile } from "@/lib/types";

type Errors = { name?: string; phone?: string; bio?: string };

const BIO_LIMIT = 300;

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const { refetch } = authClient.useSession();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [image, setImage] = useState(profile.image ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  function validate() {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Name must be at least 2 characters";
    if (phone.trim() && !/^[0-9+\-\s]{10,15}$/.test(phone.trim())) next.phone = "Please enter a valid phone number";
    if (bio.length > BIO_LIMIT) next.bio = `Bio must be ${BIO_LIMIT} characters or less`;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await apiFetch("/api/users/me", {
        method: "PATCH",
        auth: true,
        body: { name: name.trim(), phone: phone.trim(), bio: bio.trim(), image },
      });
      toast.success("Profile updated successfully");
      await refetch(); // updates the name and photo in the navbar and sidebar
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your profile");
    } finally {
      setSaving(false);
    }
  }

  const canUpgrade = profile.role !== "admin" && profile.plan !== "pro";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-2xl border bg-card p-6 lg:col-span-2">
        <div className="space-y-2">
          <Label>Profile Photo</Label>
          <ImageUpload variant="avatar" value={image} onChange={setImage} fallbackName={name || profile.name} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} disabled />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="01XXXXXXXXX"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bio">Bio</Label>
            <span className="text-xs text-muted-foreground">
              {bio.length}/{BIO_LIMIT}
            </span>
          </div>
          <Textarea
            id="bio"
            rows={5}
            placeholder="Tell others a little about yourself"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
          {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
        </div>

        <Button type="submit" size="lg" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      <aside className="h-fit space-y-5 rounded-2xl border bg-card p-6">
        <h2 className="font-semibold">Account</h2>
        <dl className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Role</dt>
            <dd>
              <RoleBadge role={profile.role} />
            </dd>
          </div>
          {profile.role !== "admin" && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Plan</dt>
              <dd>
                <PlanBadge plan={profile.plan} />
              </dd>
            </div>
          )}
          {profile.createdAt && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="font-medium">{formatDate(profile.createdAt)}</dd>
            </div>
          )}
        </dl>

        {canUpgrade && (
          <div className="rounded-xl bg-primary/5 p-4">
            <p className="text-sm font-medium">Want more from MentorLagbe?</p>
            <p className="mt-1 text-xs text-muted-foreground">Upgrade to Pro with a single secure Stripe payment.</p>
            <Link href="/pricing" className={buttonVariants({ size: "sm", className: "mt-3 w-full" })}>
              Upgrade to Pro
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}