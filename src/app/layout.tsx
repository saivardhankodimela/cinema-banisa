import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cinema Banisa - Track Your Movies & Shows',
  description: 'Your personal movie and TV show tracker with intelligent recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-background">{children}</body>
    </html>
  );
}
