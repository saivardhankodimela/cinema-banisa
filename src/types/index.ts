export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  genres: Genre[];
  runtime: number | null;
  vote_average: number;
  vote_count: number;
  language: string;
  adult?: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  original_name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  genres: Genre[];
  episode_run_time: number[];
  vote_average: number;
  vote_count: number;
  language: string;
  number_of_seasons: number;
  number_of_episodes: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface SearchResult {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  original_title?: string;
  original_name?: string;
}

export interface UserHistory {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  rating: number | null;
  liked: boolean | null;
  review: string | null;
  watched_at: string;
  created_at: string;
  movie?: Movie;
  tv?: TVShow;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  priority: number;
  created_at: string;
  movie?: Movie;
  tv?: TVShow;
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface UserStats {
  totalMovies: number;
  totalShows: number;
  averageRating: number;
  favoriteGenres: { genre: string; count: number }[];
  totalHours: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}
