'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useUser';
import { TMDB } from '@/lib/tmdb';
import { createClient } from '@/lib/supabase-client';
import { MovieCard } from '@/components/cards/MovieCard';
import { SearchResult } from '@/types';
import { Loader2, Sparkles } from 'lucide-react';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;

      const supabase = createClient();

      const { data: history } = await supabase
        .from('user_watch_history')
        .select('*')
        .eq('user_id', user.id)
        .gte('rating', 7)
        .order('rating', { ascending: false })
        .limit(10);

      if (!history || history.length === 0) {
        const trending = await TMDB.getTrending('all');
        setRecommendations(trending.slice(0, 10));
        setLoading(false);
        return;
      }

      const allSimilar: SearchResult[] = [];
      
      for (const item of history.slice(0, 5)) {
        const similar = await TMDB.getSimilar(item.tmdb_id, item.media_type);
        allSimilar.push(...similar);
      }

      const seen = new Set<number>();
      const unique = allSimilar.filter((r) => {
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return r.vote_average >= 6;
      });

      unique.sort((a, b) => b.vote_average - a.vote_average);
      setRecommendations(unique.slice(0, 12));
      setLoading(false);
    };

    fetchRecommendations();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">
              Recommended for You
            </h1>
            <p className="text-text-secondary mt-1">
              Based on your high-rated movies and shows
            </p>
          </div>
        </div>
      </header>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">
            Rate more movies to get personalized recommendations!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recommendations.map((item, i) => (
            <div
              key={`${item.media_type}-${item.id}`}
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
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
