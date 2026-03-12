-- Cinema Banisa Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movies cache table
CREATE TABLE IF NOT EXISTS movies (
  tmdb_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  original_title TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  overview TEXT,
  release_date DATE,
  genres JSONB,
  runtime INTEGER,
  vote_average DECIMAL(3,1),
  language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TV Shows cache table
CREATE TABLE IF NOT EXISTS tv_shows (
  tmdb_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  original_name TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  overview TEXT,
  first_air_date DATE,
  genres JSONB,
  episode_runtime INTEGER[],
  vote_average DECIMAL(3,1),
  language TEXT,
  number_of_seasons INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User watch history
CREATE TABLE IF NOT EXISTS user_watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT CHECK (media_type IN ('movie', 'tv')) NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  liked BOOLEAN,
  review TEXT,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tmdb_id, media_type)
);

-- User watchlist
CREATE TABLE IF NOT EXISTS user_watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT CHECK (media_type IN ('movie', 'tv')) NOT NULL,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tmdb_id, media_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_watch_history_user ON user_watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_date ON user_watch_history(watched_at DESC);
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON user_watchlist(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for watch history
CREATE POLICY "Users can view own watch history" ON user_watch_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own watch history" ON user_watch_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own watch history" ON user_watch_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own watch history" ON user_watch_history FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for watchlist
CREATE POLICY "Users can view own watchlist" ON user_watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own watchlist" ON user_watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own watchlist" ON user_watchlist FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own watchlist" ON user_watchlist FOR DELETE USING (auth.uid() = user_id);

-- Movies and TV shows are public (read-only from TMDB cache)
CREATE POLICY "Anyone can view movies" ON movies FOR SELECT USING (true);
CREATE POLICY "Anyone can view tv shows" ON tv_shows FOR SELECT USING (true);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
