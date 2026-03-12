import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

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
