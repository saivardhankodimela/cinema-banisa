import { Movie, TVShow, SearchResult, Credits } from '@/types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const API_KEY = process.env.TMDB_API_KEY || '';

export const TMDB = {
  getImageUrl: (path: string | null, size: 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500') => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  },

  search: async (query: string, mediaType: 'movie' | 'tv' | 'all' = 'all'): Promise<SearchResult[]> => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];

    if (mediaType === 'all' || mediaType === 'movie') {
      const movieRes = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );
      const movieData = await movieRes.json();
      results.push(...movieData.results?.map((m: any) => ({
        id: m.id,
        media_type: 'movie' as const,
        title: m.title,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        overview: m.overview,
        release_date: m.release_date,
        vote_average: m.vote_average,
      })) || []);
    }

    if (mediaType === 'all' || mediaType === 'tv') {
      const tvRes = await fetch(
        `${TMDB_BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );
      const tvData = await tvRes.json();
      results.push(...tvData.results?.map((t: any) => ({
        id: t.id,
        media_type: 'tv' as const,
        name: t.name,
        poster_path: t.poster_path,
        backdrop_path: t.backdrop_path,
        overview: t.overview,
        first_air_date: t.first_air_date,
        vote_average: t.vote_average,
      })) || []);
    }

    return results.sort((a, b) => b.vote_average - a.vote_average);
  },

  getMovie: async (id: number): Promise<Movie> => {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`
    );
    const data = await res.json();
    return {
      id: data.id,
      title: data.title,
      original_title: data.original_title,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      overview: data.overview,
      release_date: data.release_date,
      genres: data.genres,
      runtime: data.runtime,
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      language: data.original_language,
    };
  },

  getTVShow: async (id: number): Promise<TVShow> => {
    const res = await fetch(
      `${TMDB_BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits`
    );
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      original_name: data.original_name,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      overview: data.overview,
      first_air_date: data.first_air_date,
      genres: data.genres,
      episode_run_time: data.episode_run_time || [],
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      language: data.original_language,
      number_of_seasons: data.number_of_seasons,
      number_of_episodes: data.number_of_episodes,
    };
  },

  getCredits: async (id: number, mediaType: 'movie' | 'tv'): Promise<Credits> => {
    const type = mediaType === 'movie' ? 'movie' : 'tv';
    const res = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`
    );
    return await res.json();
  },

  getSimilar: async (id: number, mediaType: 'movie' | 'tv'): Promise<SearchResult[]> => {
    const type = mediaType === 'movie' ? 'movie' : 'tv';
    const res = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`
    );
    const data = await res.json();
    return data.results?.slice(0, 12).map((m: any) => ({
      id: m.id,
      media_type: mediaType,
      title: m.title,
      name: m.name,
      poster_path: m.poster_path,
      backdrop_path: m.backdrop_path,
      overview: m.overview,
      release_date: m.release_date || m.first_air_date,
      vote_average: m.vote_average,
    })) || [];
  },

  getTrending: async (mediaType: 'movie' | 'tv' | 'all' = 'all'): Promise<SearchResult[]> => {
    const res = await fetch(
      `${TMDB_BASE_URL}/trending/${mediaType === 'all' ? 'all' : mediaType}/week?api_key=${API_KEY}`
    );
    const data = await res.json();
    return data.results?.slice(0, 20).map((m: any) => ({
      id: m.id,
      media_type: m.media_type,
      title: m.title,
      name: m.name,
      poster_path: m.poster_path,
      backdrop_path: m.backdrop_path,
      overview: m.overview,
      release_date: m.release_date || m.first_air_date,
      vote_average: m.vote_average,
    })) || [];
  },

  getPopular: async (mediaType: 'movie' | 'tv'): Promise<SearchResult[]> => {
    const type = mediaType === 'movie' ? 'movie' : 'tv';
    const res = await fetch(
      `${TMDB_BASE_URL}/${type}/popular?api_key=${API_KEY}`
    );
    const data = await res.json();
    return data.results?.slice(0, 20).map((m: any) => ({
      id: m.id,
      media_type: mediaType,
      title: m.title,
      name: m.name,
      poster_path: m.poster_path,
      backdrop_path: m.backdrop_path,
      overview: m.overview,
      release_date: m.release_date || m.first_air_date,
      vote_average: m.vote_average,
    })) || [];
  },
};
