import { cn } from "@/lib/utils";

/** Skeleton loader for content placeholders */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse-soft rounded-lg bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
