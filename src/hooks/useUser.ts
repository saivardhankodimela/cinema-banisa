'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { Profile, UserHistory, WatchlistItem, UserStats } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
}

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (data) setProfile(data);
        setLoading(false);
      });
  }, [userId]);

  return { profile, loading };
}

export function useWatchHistory(userId: string | undefined) {
  const [history, setHistory] = useState<UserHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    
    supabase
      .from('user_watch_history')
      .select('*')
      .eq('user_id', userId)
      .order('watched_at', { ascending: false })
      .then(({ data }) => {
        setHistory(data || []);
        setLoading(false);
      });
  }, [userId]);

  return { history, loading };
}

export function useWatchlist(userId: string | undefined) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    
    supabase
      .from('user_watchlist')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setWatchlist(data || []);
        setLoading(false);
      });
  }, [userId]);

  return { watchlist, loading };
}

export function useUserStats(userId: string | undefined) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`/api/user/stats?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  return { stats, loading };
}
