# AGENTS.md - Cinema Banisa

This file contains guidelines for AI agents working on the Cinema Banisa project.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Movie Data** | TMDB API |
| **Icons** | Lucide React |
| **State/Fetch** | React hooks + SWR |
| **Deployment** | Vercel |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `TMDB_API_KEY` | TMDB API key |

---

## Rules for AI Agents

### 1. Git & Commits

- **NEVER** configure git user identity without explicit permission
- **NEVER** guess or assume user's email
- **NEVER** commit on behalf of the user
- If git rejects due to missing identity, inform the user and let them configure it
- Only prepare changes (stage, show diff) - never push

### 2. Security

- Never expose API keys or secrets in code
- Always use environment variables for sensitive data
- Never commit `.env` files or files containing keys
- Keep `.gitignore` updated with sensitive file patterns

### 3. Code Quality

- Follow TypeScript strict mode
- Use explicit types - avoid `any`
- Use the `@/` path alias for imports
- Group imports: React → External → Internal → Types
- Use functional components with `'use client'` directive for client-side logic

### 4. Building & Testing

- Always test builds locally before asking user to push
- Run `npm run build` to check for TypeScript errors
- Run `npm run lint` to check for linting issues
- Fix all errors before asking user to deploy

### 5. Communication

- Ask for confirmation before making significant changes
- Explain what changes will be made before doing them
- Never make assumptions - ask when unsure
- Be clear about what the user needs to do (e.g., configure git, push to GitHub)

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
├── app/           # Next.js App Router pages
│   ├── (auth)/    # Auth pages (login, signup)
│   ├── (main)/    # Protected pages (dashboard, search, etc.)
│   │   ├── movie/[id]/
│   │   └── tv/[id]/
│   └── api/       # API routes
├── components/    # React components
│   ├── ui/        # Reusable UI (Button, Input, Rating)
│   ├── cards/     # Card components
│   └── layout/    # Layout components
├── hooks/         # Custom React hooks
├── lib/           # Utilities (supabase, tmdb, utils)
└── types/         # TypeScript types
```

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

## Important Notes

- The user is new to frontend development - explain things clearly
- Keep responses concise and actionable
- When something breaks, provide step-by-step fixes
- Always verify the fix works locally before asking user to push
