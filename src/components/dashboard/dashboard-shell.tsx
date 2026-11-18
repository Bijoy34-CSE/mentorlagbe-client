"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, GraduationCap, LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardSplash } from "@/components/dashboard/dashboard-splash";
import { navByRole, type DashboardRole } from "@/components/dashboard/nav-config";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { RoleBadge } from "@/components/role-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { clearToken } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [collapsed, setCollapsed] = useState(false); // desktop sidebar
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  // Go to sign in only AFTER we know there is no session.
  // This keeps the user logged in when a private page is reloaded.
  useEffect(() => {
    if (!isPending && !user) router.replace("/sign-in");
  }, [isPending, user, router]);

  async function handleSignOut() {
    await authClient.signOut();
    clearToken();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  if (isPending || !user) return <DashboardSplash />;

  const role = (user.role ?? "student") as DashboardRole;
  const items = navByRole[role] ?? navByRole.student;
  const hideOnCollapse = collapsed ? "lg:hidden" : "";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Dark overlay behind the mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-all duration-300 lg:translate-x-0",
          collapsed && "lg:w-[76px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <span className={cn("text-xl font-bold tracking-tight", hideOnCollapse)}>MentorLagbe</span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="flex size-8 items-center justify-center rounded-md hover:bg-muted lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => {
            const isOverview = item.href === `/dashboard/${role}`;
            const active = isOverview ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  collapsed && "lg:justify-center lg:px-0",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="size-5 shrink-0" />
                <span className={hideOnCollapse}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile summary */}
        <div className="space-y-2 border-t p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl bg-muted/60 p-3",
              collapsed && "lg:justify-center lg:bg-transparent lg:p-0"
            )}
          >
            <UserAvatar name={user.name} image={user.image} className="shrink-0" />
            <div className={cn("min-w-0", hideOnCollapse)}>
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <RoleBadge role={role} />
                {role !== "admin" && <PlanBadge plan={user.plan} />}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10",
              collapsed && "lg:justify-center lg:px-0"
            )}
          >
            <LogOut className="size-5 shrink-0" />
            <span className={hideOnCollapse}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className={cn("flex min-h-screen min-w-0 flex-col transition-all duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <Menu className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              aria-label="Toggle sidebar"
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
            </Button>
            <p className="hidden text-sm font-medium capitalize text-muted-foreground sm:block">{role} dashboard</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              Visit site <ExternalLink className="size-3.5" />
            </Link>
            <ThemeToggle />
            <div className="flex items-center gap-2 rounded-full border py-1 pr-3 pl-1">
              <UserAvatar name={user.name} image={user.image} className="size-8" />
              <span className="hidden max-w-28 truncate text-sm font-medium sm:block">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Full width content area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}