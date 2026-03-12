'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({ value, onChange, readonly = false, size = 'md' }: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const displayValue = hoverValue || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => onChange?.(star)}
          className={cn(
            'transition-transform duration-150',
            !readonly && 'hover:scale-110 cursor-pointer',
            readonly && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              sizes[size],
              star <= displayValue
                ? 'fill-accent-rating text-accent-rating'
                : 'fill-transparent text-text-secondary/30'
            )}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-accent-rating">
          {value}/10
        </span>
      )}
    </div>
  );
}
