'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { TMDB } from '@/lib/tmdb';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { MovieCard } from '@/components/cards/MovieCard';
import { Movie, TVShow, Credits, UserHistory, SearchResult } from '@/types';
import { formatDate, formatRuntime, cn } from '@/lib/utils';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Play,
  Heart,
  ThumbsDown,
  Star,
  Clock,
  Calendar,
  Loader2,
} from 'lucide-react';

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const mediaType = params.mediaType as 'movie' | 'tv';

  const [data, setData] = useState<Movie | TVShow | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [similar, setSimilar] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [userHistory, setUserHistory] = useState<UserHistory | null>(null);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const media = mediaType === 'movie' 
        ? await TMDB.getMovie(id) 
        : await TMDB.getTVShow(id);
      
      const [creditsData, similarData] = await Promise.all([
        TMDB.getCredits(id, mediaType),
        TMDB.getSimilar(id, mediaType),
      ]);

      setData(media);
      setCredits(creditsData);
      setSimilar(similarData);
      setLoading(false);
    };

    fetchData();
  }, [id, mediaType]);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [historyRes, watchlistRes] = await Promise.all([
        supabase
          .from('user_watch_history')
          .select('*')
          .eq('user_id', user.id)
          .eq('tmdb_id', id)
          .eq('media_type', mediaType)
          .single(),
        supabase
          .from('user_watchlist')
          .select('*')
          .eq('user_id', user.id)
          .eq('tmdb_id', id)
          .eq('media_type', mediaType)
          .maybeSingle(),
      ]);

      if (historyRes.data) setUserHistory(historyRes.data);
      if (watchlistRes.data) setIsWatchlist(true);
    };

    checkStatus();
  }, [id, mediaType, supabase]);

  const handleWatched = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updates = {
      user_id: user.id,
      tmdb_id: id,
      media_type: mediaType,
      rating: userHistory?.rating || null,
      liked: userHistory?.liked || null,
      review: userHistory?.review || null,
      watched_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('user_watch_history')
      .upsert(updates, { onConflict: 'user_id,tmdb_id,media_type' });

    if (!error) {
      const { data } = await supabase
        .from('user_watch_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('tmdb_id', id)
        .eq('media_type', mediaType)
        .single();
      setUserHistory(data);
    }
    setSaving(false);
  };

  const handleRating = async (rating: number) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updates = {
      user_id: user.id,
      tmdb_id: id,
      media_type: mediaType,
      rating,
      liked: userHistory?.liked || null,
      review: userHistory?.review || null,
      watched_at: userHistory?.watched_at || new Date().toISOString(),
    };

    await supabase
      .from('user_watch_history')
      .upsert(updates, { onConflict: 'user_id,tmdb_id,media_type' });

    setUserHistory((prev: any) => ({ ...prev, rating }));
    setSaving(false);
  };

  const handleLike = async (liked: boolean) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updates = {
      user_id: user.id,
      tmdb_id: id,
      media_type: mediaType,
      rating: userHistory?.rating || null,
      liked,
      review: userHistory?.review || null,
      watched_at: userHistory?.watched_at || new Date().toISOString(),
    };

    await supabase
      .from('user_watch_history')
      .upsert(updates, { onConflict: 'user_id,tmdb_id,media_type' });

    setUserHistory((prev: any) => ({ ...prev, liked }));
    setSaving(false);
  };

  const handleReview = async (review: string) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updates = {
      user_id: user.id,
      tmdb_id: id,
      media_type: mediaType,
      rating: userHistory?.rating || null,
      liked: userHistory?.liked || null,
      review,
      watched_at: userHistory?.watched_at || new Date().toISOString(),
    };

    await supabase
      .from('user_watch_history')
      .upsert(updates, { onConflict: 'user_id,tmdb_id,media_type' });

    setUserHistory((prev: any) => ({ ...prev, review }));
    setSaving(false);
  };

  const handleWatchlist = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isWatchlist) {
      await supabase
        .from('user_watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('tmdb_id', id)
        .eq('media_type', mediaType);
      setIsWatchlist(false);
    } else {
      await supabase
        .from('user_watchlist')
        .insert({
          user_id: user.id,
          tmdb_id: id,
          media_type: mediaType,
        });
      setIsWatchlist(true);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const title = data.title || data.name || '';
  const releaseDate = data.release_date || data.first_air_date;
  const runtime = 'runtime' in data ? data.runtime : (data as TVShow).episode_run_time?.[0];
  const genres = data.genres || [];
  const director = credits?.crew?.find((c) => c.job === 'Director');

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="relative rounded-2xl overflow-hidden mb-8">
        {data.backdrop_path && (
          <div className="absolute inset-0">
            <Image
              src={TMDB.getImageUrl(data.backdrop_path, 'w1280')!}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        )}

        <div className="relative flex flex-col md:flex-row gap-8 p-6 md:p-8">
          <div className="flex-shrink-0">
            <div className="relative w-48 md:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={TMDB.getImageUrl(data.poster_path, 'w500')!}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
                {title}
              </h1>
              {data.original_title && data.original_title !== title && (
                <p className="text-text-secondary mt-1">{data.original_title}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              {releaseDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(releaseDate)}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatRuntime(runtime)}
                </span>
              )}
              {data.vote_average > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent-rating text-accent-rating" />
                  {data.vote_average.toFixed(1)} TMDB
                </span>
              )}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 rounded-full bg-surface-elevated text-sm text-text-secondary"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-text-secondary max-w-xl">{data.overview}</p>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleWatched} disabled={saving}>
                {userHistory ? '✓ Watched' : 'Mark as Watched'}
              </Button>
              <Button variant="secondary" onClick={handleWatchlist} disabled={saving}>
                {isWatchlist ? (
                  <>
                    <BookmarkCheck className="w-5 h-5 mr-2" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Bookmark className="w-5 h-5 mr-2" />
                    Add to Watchlist
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-heading font-semibold text-text-primary">
          Your Rating
        </h2>
        <div className="p-4 rounded-xl bg-surface">
          <Rating
            value={userHistory?.rating || 0}
            onChange={handleRating}
            size="lg"
          />

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => handleLike(true)}
              disabled={!userHistory}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                userHistory?.liked === true
                  ? 'bg-accent-like/20 text-accent-like'
                  : 'bg-surface-elevated text-text-secondary hover:text-accent-like'
              )}
            >
              <Heart className={cn('w-5 h-5', userHistory?.liked === true && 'fill-accent-like')} />
              Like
            </button>
            <button
              onClick={() => handleLike(false)}
              disabled={!userHistory}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                userHistory?.liked === false
                  ? 'bg-accent-dislike/20 text-accent-dislike'
                  : 'bg-surface-elevated text-text-secondary hover:text-accent-dislike'
              )}
            >
              <ThumbsDown className="w-5 h-5" />
              Dislike
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-text-secondary mb-2">
              Your Review
            </label>
            <textarea
              value={userHistory?.review || ''}
              onChange={(e) => handleReview(e.target.value)}
              placeholder="Write your thoughts..."
              disabled={!userHistory}
              className="w-full p-3 bg-surface-elevated rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24"
            />
          </div>
        </div>
      </section>

      {credits?.cast && credits.cast.length > 0 && (
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-heading font-semibold text-text-primary">
            Cast
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {credits.cast.slice(0, 10).map((actor) => (
              <div
                key={actor.id}
                className="flex-shrink-0 w-24 text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-surface-elevated mb-2">
                  {actor.profile_path ? (
                    <Image
                      src={TMDB.getImageUrl(actor.profile_path, 'w185')!}
                      alt={actor.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary">
                      {actor.name[0]}
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-text-primary truncate">
                  {actor.name}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {actor.character}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-heading font-semibold text-text-primary">
            Similar {mediaType === 'movie' ? 'Movies' : 'Shows'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similar.slice(0, 10).map((item) => (
              <MovieCard
                key={item.id}
                id={item.id}
                mediaType={item.media_type}
                title={item.title || item.name || ''}
                posterPath={item.poster_path}
                releaseDate={item.release_date}
                rating={item.vote_average}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
