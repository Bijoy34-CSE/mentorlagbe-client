import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  student: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  tutor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  admin: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

export function RoleBadge({ role, className }: { role?: string | null; className?: string }) {
  const value = role ?? "student";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        styles[value] ?? styles.student,
        className
      )}
    >
      {value}
    </span>
  );
}