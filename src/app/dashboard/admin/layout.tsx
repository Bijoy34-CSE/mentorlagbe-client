import { RoleGuard } from "@/components/dashboard/role-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard role="admin">{children}</RoleGuard>;
}