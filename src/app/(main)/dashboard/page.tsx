'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useUser';
import { TMDB } from '@/lib/tmdb';
import { MovieCard } from '@/components/cards/MovieCard';
import { MovieRowSkeleton } from '@/components/ui/Skeleton';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Clock, Star } from 'lucide-react';
import { UserStats, SearchResult } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [trending, setTrending] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching trending data...');
        const [trendingData] = await Promise.all([
          TMDB.getTrending('all'),
        ]);
        console.log('Trending data:', trendingData);
        setTrending(trendingData.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`/api/user/stats?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(console.error);
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">
            Welcome back! 👋
          </h1>
          <p className="text-text-secondary mt-1">
            What are you watching today?
          </p>
        </div>
      </header>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {stats.totalMovies + stats.totalShows}
                </p>
                <p className="text-xs text-text-secondary">Watched</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-like/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent-like" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
                </p>
                <p className="text-xs text-text-secondary">Avg Rating</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-success/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {stats.totalHours > 0 ? Math.round(stats.totalHours) : 0}h
                </p>
                <p className="text-xs text-text-secondary">Watch Time</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-lg">🎬</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {stats.totalMovies}
                </p>
                <p className="text-xs text-text-secondary">Movies</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {stats && stats.favoriteGenres && stats.favoriteGenres.length > 0 && (
        <div className="p-4 rounded-xl bg-surface">
          <h2 className="text-lg font-heading font-semibold text-text-primary mb-3">
            Your Favorite Genres
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.favoriteGenres.slice(0, 5).map((g, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
              >
                {g.genre}
              </span>
            ))}
          </div>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-text-primary">
            Trending Now
          </h2>
          <Link
            href="/search"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Search more <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <MovieRowSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trending.map((item, i) => (
              <div
                key={item.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <MovieCard
                  id={item.id}
                  mediaType={item.media_type}
                  title={item.title || item.name || ''}
                  posterPath={item.poster_path}
                  releaseDate={item.release_date}
                  rating={item.vote_average}
                  priority={i < 4}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
