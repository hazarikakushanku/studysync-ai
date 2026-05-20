import { Skeleton } from "@/components/ui/skeleton";

// loading skeleton for dashboard pages
export function PageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}

// small card loading skeleton
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border p-6 space-y-3">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
