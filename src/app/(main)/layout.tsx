import { createServerClientFromCookies } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export const dynamic = 'force-dynamic';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  
  try {
    const supabase = await createServerClientFromCookies();
    const { data } = await supabase.auth.getSession();
    session = data?.session;
  } catch (e) {
    console.error('Auth check error:', e);
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userEmail={session.user.email} />
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
