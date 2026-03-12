import { createServerClientFromCookies } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Star, Bookmark, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let session = null;
  
  try {
    const supabase = await createServerClientFromCookies();
    const { data } = await supabase.auth.getSession();
    session = data?.session;
  } catch (e) {
    console.error('Auth check error:', e);
  }

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xl">🎬</span>
            </div>
            <span className="text-xl font-heading font-bold text-text-primary">
              Cinema Banisa
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center pt-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Your personal movie companion
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold text-text-primary mb-6 animate-slide-up">
            Track. Rate.
            <span className="text-primary"> Discover.</span>
          </h1>

          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto animate-slide-up stagger-2">
            Keep track of every movie and show you&apos;ve watched. 
            Rate your favorites and get personalized recommendations 
            tailored to your taste.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
            <Link href="/signup">
              <Button size="lg" className="group">
                Start Tracking Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20 animate-slide-up stagger-4">
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-surface">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bookmark className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-text-primary">
                Build Your Watchlist
              </h3>
              <p className="text-text-secondary text-sm">
                Save movies and shows you want to watch and never lose track again.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-surface">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Star className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-text-primary">
                Rate & Review
              </h3>
              <p className="text-text-secondary text-sm">
                Rate on a 10-star scale and write reviews to remember your thoughts.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-surface">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-text-primary">
                Get Recommendations
              </h3>
              <p className="text-text-secondary text-sm">
                Discover new favorites based on what you love.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-text-secondary text-sm">
        <p>© 2026 Cinema Banisa. Built for movie lovers.</p>
      </footer>
    </main>
  );
}
