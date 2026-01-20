'use client';

export function TaskRowSkeleton() {
  return (
    <div className="flex h-14 md:h-12 items-center gap-4 rounded-lg px-4 animate-pulse">
      <div className="h-6 w-6 rounded-md bg-muted" />
      <div className="h-4 flex-1 rounded bg-muted" />
      <div className="h-4 w-16 rounded-full bg-muted" />
    </div>
  );
}
