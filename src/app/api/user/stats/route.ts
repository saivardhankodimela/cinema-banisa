import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/supabase-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  const supabase = createApiClient();

  const { data: history, error } = await supabase
    .from('user_watch_history')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to fetch history:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!history || history.length === 0) {
    return NextResponse.json({
      totalMovies: 0,
      totalShows: 0,
      averageRating: 0,
      favoriteGenres: [],
      totalHours: 0,
    });
  }

  const movies = history.filter((h) => h.media_type === 'movie');
  const shows = history.filter((h) => h.media_type === 'tv');
  const rated = history.filter((h) => h.rating);
  
  const averageRating = rated.length > 0
    ? rated.reduce((sum, h) => sum + (h.rating || 0), 0) / rated.length
    : 0;

  return NextResponse.json({
    totalMovies: movies.length,
    totalShows: shows.length,
    averageRating: Math.round(averageRating * 10) / 10,
    favoriteGenres: [],
    totalHours: 0,
  });
}
