'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useUser';
import { TMDB } from '@/lib/tmdb';
import { createClient } from '@/lib/supabase';
import { MovieCard } from '@/components/cards/MovieCard';
import { Movie, TVShow, UserHistory } from '@/types';
import { Rating } from '@/components/ui/Rating';
import { formatDate, cn } from '@/lib/utils';
import { Loader2, Trash2, Star } from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<(UserHistory & { mediaData?: Movie | TVShow })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      const { data: watchHistory } = await supabase
        .from('user_watch_history')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false });

      if (watchHistory) {
        const itemsWithMedia = await Promise.all(
          watchHistory.map(async (item) => {
            const media = item.media_type === 'movie'
              ? await TMDB.getMovie(item.tmdb_id)
              : await TMDB.getTVShow(item.tmdb_id);
            return { ...item, mediaData: media };
          })
        );
        setHistory(itemsWithMedia);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user, supabase]);

  const handleRemove = async (id: string) => {
    await supabase
      .from('user_watch_history')
      .delete()
      .eq('id', id);
    setHistory(history.filter((i) => i.id !== id));
  };

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.media_type === filter;
  });

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
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          Watch History
        </h1>
        <p className="text-text-secondary mt-1">
          Your viewing history
        </p>
      </header>

      <div className="flex gap-2">
        {(['all', 'movie', 'tv'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              filter === f
                ? 'bg-primary text-background'
                : 'bg-surface text-text-secondary hover:text-text-primary'
            )}
          >
            {f === 'all' ? 'All' : f === 'movie' ? 'Movies' : 'TV Shows'}
          </button>
        ))}
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">No watch history yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-xl bg-surface group"
            >
              <div className="w-24 flex-shrink-0">
                <MovieCard
                  id={item.tmdb_id}
                  mediaType={item.media_type}
                  title={item.mediaData?.title || item.mediaData?.name || ''}
                  posterPath={item.mediaData?.poster_path || null}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-text-primary">
                      {item.mediaData?.title || item.mediaData?.name}
                    </h3>
                    <p className="text-sm text-text-secondary capitalize">
                      {item.media_type} • Watched {formatDate(item.watched_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {item.rating && (
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 fill-accent-rating text-accent-rating" />
                    <span className="text-sm text-accent-rating font-medium">
                      {item.rating}/10
                    </span>
                  </div>
                )}

                {item.review && (
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                    &quot;{item.review}&quot;
                  </p>
                )}

                {item.liked !== null && (
                  <div className="mt-2">
                    {item.liked ? (
                      <span className="text-xs text-accent-like">❤️ Liked</span>
                    ) : (
                      <span className="text-xs text-accent-dislike">👎 Disliked</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
