'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Bookmark,
  Clock,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { href: '/history', label: 'History', icon: Clock },
  { href: '/profile', label: 'Profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-lg border-t border-surface-elevated z-50">
      <ul className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors',
                  isActive ? 'text-primary' : 'text-text-secondary'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
