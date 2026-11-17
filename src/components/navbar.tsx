"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, UserCog, X } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { RoleBadge } from "@/components/role-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { clearToken } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How It Works" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [userMenuOpen, setUserMenuOpen] = useState(false); // profile dropdown
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when the user clicks outside of it
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close both menus after moving to another page
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await authClient.signOut();
    clearToken();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Desktop auth area */}
          <div className="hidden items-center gap-2 md:flex">
            {isPending ? (
              <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 transition-colors hover:bg-muted"
                >
                  <UserAvatar name={user.name} image={user.image} />
                  <span className="max-w-28 truncate text-sm font-medium">{user.name}</span>
                  <RoleBadge role={user.role} />
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-popover p-2 shadow-lg">
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <LayoutDashboard className="size-4" /> Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <UserCog className="size-4" /> Update Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
                    >
                      <LogOut className="size-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
                  Sign In
                </Link>
                <Link href="/sign-up" className={buttonVariants()}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-9 items-center justify-center rounded-md hover:bg-muted md:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-border" />

            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <UserAvatar name={user.name} image={user.image} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <RoleBadge role={user.role} />
                  </div>
                </div>
                <Link href="/dashboard" className="rounded-md px-3 py-2 text-sm hover:bg-muted">
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" className="rounded-md px-3 py-2 text-sm hover:bg-muted">
                  Update Profile
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-muted"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link href="/sign-in" className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
                  Sign In
                </Link>
                <Link href="/sign-up" className={cn(buttonVariants(), "flex-1")}>
                  Sign Up
                </Link>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}