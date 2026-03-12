'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useUser';
import { TMDB } from '@/lib/tmdb';
import { createClient } from '@/lib/supabase-client';
import { MovieCard } from '@/components/cards/MovieCard';
import { Movie, TVShow, WatchlistItem } from '@/types';
import { Loader2, Trash2 } from 'lucide-react';

function getMediaTitle(media: Movie | TVShow | undefined): string {
  if (!media) return '';
  return 'title' in media ? media.title : media.name;
}

function getMediaReleaseDate(media: Movie | TVShow | undefined): string | undefined {
  if (!media) return undefined;
  return 'release_date' in media ? media.release_date : media.first_air_date;
}

export default function WatchlistPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<(WatchlistItem & { mediaData?: Movie | TVShow })[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;

      const { data: watchlist } = await supabase
        .from('user_watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (watchlist) {
        const itemsWithMedia = await Promise.all(
          watchlist.map(async (item) => {
            const media = item.media_type === 'movie'
              ? await TMDB.getMovie(item.tmdb_id)
              : await TMDB.getTVShow(item.tmdb_id);
            return { ...item, mediaData: media };
          })
        );
        setItems(itemsWithMedia);
      }
      setLoading(false);
    };

    fetchWatchlist();
  }, [user, supabase]);

  const handleRemove = async (id: string) => {
    await supabase
      .from('user_watchlist')
      .delete()
      .eq('id', id);
    setItems(items.filter((i) => i.id !== id));
  };

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
          Watchlist
        </h1>
        <p className="text-text-secondary mt-1">
          Movies and shows you want to watch
        </p>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">Your watchlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <MovieCard
                id={item.tmdb_id}
                mediaType={item.media_type}
                title={getMediaTitle(item.mediaData)}
                posterPath={item.mediaData?.poster_path || null}
                releaseDate={getMediaReleaseDate(item.mediaData)}
                rating={item.mediaData?.vote_average}
              />
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
