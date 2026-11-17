import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  image?: string | null;
  className?: string;
}

// Shows the profile photo, or the first letters of the name if there is no photo
export function UserAvatar({ name, image, className }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt={name} className={cn("size-9 rounded-full object-cover", className)} />
    );
  }

  return (
    <span
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary",
        className
      )}
    >
      {initials || "U"}
    </span>
  );
}