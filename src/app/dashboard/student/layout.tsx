import { RoleGuard } from "@/components/dashboard/role-guard";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard role="student">{children}</RoleGuard>;
}