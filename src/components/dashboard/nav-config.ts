import type { LucideIcon } from "lucide-react";
import {
  Bookmark,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Library,
  PlusCircle,
  ShieldCheck,
  UserCog,
  Users,
  UsersRound,
} from "lucide-react";

export type DashboardRole = "student" | "tutor" | "admin";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const profile: NavItem = { href: "/dashboard/profile", label: "Update Profile", icon: UserCog };

// Sidebar links for each role
export const navByRole: Record<DashboardRole, NavItem[]> = {
    student: [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/student/my-applications", label: "My Applications", icon: ClipboardList },
    { href: "/dashboard/student/saved", label: "Saved Tuitions", icon: Bookmark },
    profile,
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/tutor/post-tuition", label: "Post a Tuition", icon: PlusCircle },
    { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", icon: Library },
    { href: "/dashboard/tutor/applicants", label: "Applicants", icon: UsersRound },
    profile,
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/tuitions", label: "Tuition Approval", icon: ShieldCheck },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
    profile,
  ],
};