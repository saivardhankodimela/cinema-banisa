'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { TMDB } from '@/lib/tmdb';
import { formatYear, cn } from '@/lib/utils';

interface MovieCardProps {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  releaseDate?: string;
  rating?: number;
  className?: string;
  priority?: boolean;
}

export function MovieCard({
  id,
  mediaType,
  title,
  posterPath,
  releaseDate,
  rating = 0,
  className,
  priority = false,
}: MovieCardProps) {
  const href = mediaType === 'movie' ? `/movie/${id}` : `/tv/${id}`;
  const posterUrl = TMDB.getImageUrl(posterPath, 'w500');

  return (
    <Link href={href}>
      <div
        className={cn(
          'group relative flex flex-col gap-2 cursor-pointer',
          'transition-transform duration-200 hover:scale-[1.03]',
          className
        )}
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-elevated poster-glow transition-shadow duration-300">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
              No Poster
            </div>
          )}
          
          {rating > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 fill-accent-rating text-accent-rating" />
              <span className="text-xs font-medium text-text-primary">
                {rating.toFixed(1)}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {releaseDate && (
            <span className="text-xs text-text-secondary">
              {formatYear(releaseDate)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
