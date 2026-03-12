'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-surface-elevated animate-shimmer bg-gradient-to-r from-surface-elevated via-surface to-surface-elevated bg-[length:200%_100%]',
        className
      )}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-[2/3] rounded-lg" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
    </div>
  );
}

export function MovieRowSkeleton() {
  return (
    <div className="flex gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex-shrink-0 w-32">
          <MovieCardSkeleton />
        </div>
      ))}
    </div>
  );
}
