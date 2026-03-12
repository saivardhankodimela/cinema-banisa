'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUserStats } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Loader2, TrendingUp, Film, Tv, Star } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useUserStats(user?.id);
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      if (data?.username) setUsername(data.username);
    };
    fetchProfile();
  }, [user, supabase]);

  const handleUpdate = async () => {
    if (!user) return;
    setSaving(true);
    await supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id);
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          Profile
        </h1>
        <p className="text-text-secondary mt-1">
          Manage your account
        </p>
      </header>

      <div className="p-6 rounded-xl bg-surface">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {user?.email?.split('@')[0]}
            </h2>
            <p className="text-text-secondary text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
          />
          <Button onClick={handleUpdate} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-surface">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Your Stats
        </h3>

        {statsLoading ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-surface-elevated">
              <div className="flex items-center gap-2 mb-1">
                <Film className="w-4 h-4 text-primary" />
                <span className="text-sm text-text-secondary">Movies</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {stats.totalMovies}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-elevated">
              <div className="flex items-center gap-2 mb-1">
                <Tv className="w-4 h-4 text-primary" />
                <span className="text-sm text-text-secondary">TV Shows</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {stats.totalShows}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-elevated">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-accent-rating" />
                <span className="text-sm text-text-secondary">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-elevated">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-accent-success" />
                <span className="text-sm text-text-secondary">Total Watched</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {stats.totalMovies + stats.totalShows}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-text-secondary">No stats yet. Start watching!</p>
        )}
      </div>
    </div>
  );
}
