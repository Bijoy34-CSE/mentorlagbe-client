import { RoleGuard } from "@/components/dashboard/role-guard";

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard role="tutor">{children}</RoleGuard>;
}