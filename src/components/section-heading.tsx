import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

// Same heading style for every section of the site
export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto mb-12 max-w-2xl text-center", className)}>
      <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  );
}