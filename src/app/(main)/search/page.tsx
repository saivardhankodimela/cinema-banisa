'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { TMDB } from '@/lib/tmdb';
import { MovieCard } from '@/components/cards/MovieCard';
import { Input } from '@/components/ui/Input';
import { MovieRowSkeleton } from '@/components/ui/Skeleton';
import { SearchResult } from '@/types';
import { Search, Film, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'movie' | 'tv';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setError('');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setError('');

    try {
      const data = await TMDB.search(searchQuery, filter);
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, filter, handleSearch]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          Search
        </h1>
        <p className="text-text-secondary mt-1">
          Find movies and TV shows to add to your list
        </p>
      </header>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search movies, TV shows..."
            value={query}
            onChange={handleQueryChange}
            className="w-full pl-12 pr-4 py-4 bg-surface border border-surface-elevated rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            autoFocus
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'all'
                ? 'bg-primary text-background'
                : 'bg-surface text-text-secondary hover:text-text-primary'
            )}
          >
            <Search className="w-4 h-4" />
            All
          </button>
          <button
            onClick={() => handleFilterChange('movie')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'movie'
                ? 'bg-primary text-background'
                : 'bg-surface text-text-secondary hover:text-text-primary'
            )}
          >
            <Film className="w-4 h-4" />
            Movies
          </button>
          <button
            onClick={() => handleFilterChange('tv')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'tv'
                ? 'bg-primary text-background'
                : 'bg-surface text-text-secondary hover:text-text-primary'
            )}
          >
            <Tv className="w-4 h-4" />
            TV Shows
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <MovieRowSkeleton />
      ) : hasSearched && results.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
          <p className="text-text-secondary">No results found for &quot;{query}&quot;</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((item, i) => (
            <div
              key={`${item.media_type}-${item.id}`}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <MovieCard
                id={item.id}
                mediaType={item.media_type}
                title={item.title || item.name || ''}
                posterPath={item.poster_path}
                releaseDate={item.release_date}
                rating={item.vote_average}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
          <p className="text-text-secondary">Search for movies and TV shows</p>
        </div>
      )}
    </div>
  );
}
