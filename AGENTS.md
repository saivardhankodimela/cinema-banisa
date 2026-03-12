# AGENTS.md - Cinema Banisa

## Overview

Personal movie/TV tracker built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase.

---

## Build Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Code Style Guidelines

### TypeScript
- **Strict mode** enabled - avoid `any`, use explicit types
- Use `interface` for objects, `type` for unions
- Optional chaining (`?.`) and nullish coalescing (`??`)
```typescript
interface MovieProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating?: number;
}
```

### React Components
- Use functional components with `'use client'` for client-side logic
- Use `forwardRef` when refs needed
- Define props with interfaces, set `displayName`
```typescript
'use client';
import { useState } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary' }: ButtonProps) {
  const [loading, setLoading] = useState(false);
  return <button className={variant}>{children}</button>;
}
```

### Imports (in order)
1. React/Next imports
2. External libraries (lucide-react, swr)
3. Internal imports (@/lib, @/components)
4. Type imports
```typescript
import { useState } from 'react';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Movie } from '@/types';
```

### Naming
| Type | Convention | Example |
|------|------------|---------|
| Variables/functions | camelCase | `userId`, `handleSubmit` |
| Components | PascalCase | `MovieCard`, `Sidebar` |
| Interfaces | PascalCase | `MovieProps` |
| Files | kebab-case | `movie-card.tsx` |

### CSS/Tailwind
- Use Tailwind utilities
- Custom colors: `primary` (#F59E0B), `background` (#0A0A0B), `surface` (#18181B)
- Use `cn()` utility for conditional classes
```tsx
<div className={cn('flex gap-4', isActive && 'bg-primary/10')} />
```

### Error Handling
```typescript
try {
  const data = await fetchData();
} catch (error) {
  console.error('Failed:', error);
  setError('Something went wrong');
}
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/        # login, signup
│   ├── (main)/         # dashboard, search, watchlist, history, recommendations, profile
│   │   ├── movie/[id]/
│   │   └── tv/[id]/
│   └── api/            # API routes
├── components/
│   ├── ui/            # Button, Input, Rating, Skeleton
│   ├── cards/          # MovieCard
│   └── layout/         # Sidebar, MobileNav
├── hooks/              # useUser.ts
├── lib/                # supabase.ts, tmdb.ts, utils.ts
└── types/             # index.ts
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `TMDB_API_KEY` | TMDB API key |

---

## Database (Supabase)

Tables: `profiles`, `movies`, `tv_shows`, `user_watch_history`, `user_watchlist`

- RLS enabled on all user tables
- Users can only access their own data via RLS policies
- Use `upsert` for insert-or-update

---

## Common Tasks

### Adding a new page
1. Create folder in `src/app/(main)/` or `src/app/(auth)/`
2. Add `page.tsx`
3. Update `Sidebar.tsx` and `MobileNav.tsx` links

### Adding a new component
1. Create in `src/components/`
2. Use `'use client'` if using hooks
3. Export with PascalCase

### API Routes
1. Create folder in `src/app/api/`
2. Add `route.ts` with GET/POST handlers

---

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Movie Data**: TMDB API
- **Icons**: Lucide React
