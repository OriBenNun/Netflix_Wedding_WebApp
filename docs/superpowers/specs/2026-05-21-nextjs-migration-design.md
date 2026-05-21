# Wedflix: Next.js Migration Design

**Date:** 2026-05-21
**Status:** Approved

## Overview

Convert the Wedflix static CDN-React app (single HTML file + 6 flat JS/JSX files) to a proper Next.js 14 project with TypeScript, deployed as a static export on Vercel with GitHub Actions CI.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Rendering | Static Export (`output: 'export'`) | App is 100% client-side; no server features needed |
| Language | TypeScript | Type safety, industry standard for Next.js |
| Tweaks panel | Removed | Claude Design postMessage integration no longer needed; defaults hardcoded |
| Deploy | Vercel native GitHub integration | Zero token management; simpler than full Actions deploy |
| CI | GitHub Actions (lint + tsc + build) | Validates every push/PR before Vercel sees it |
| Migration approach | Direct 1:1 port (Approach A) | Clean TS migration without over-engineering a single-page app |

## Project Structure

```
wedflix/
├── app/
│   ├── layout.tsx              # Root layout: <html>, imports globals.css
│   ├── page.tsx                # Single route — renders <App /> (server component shell)
│   └── globals.css             # Renamed from styles.css; no CSS changes
├── lib/
│   └── data.ts                 # data.js → typed TS exports, no window.*
├── components/
│   ├── App.tsx                 # 'use client' root; routing state, navTo, toggleMyList
│   ├── Header.tsx
│   ├── Tile.tsx
│   ├── Row.tsx
│   ├── HoverCard.tsx
│   └── screens/
│       ├── ProfileScreen.tsx
│       ├── HomeScreen.tsx
│       ├── DetailScreen.tsx
│       └── PlaybackScreen.tsx
├── next.config.ts              # output: 'export', images: { unoptimized: true }
├── tsconfig.json
├── package.json
└── .github/
    └── workflows/
        └── ci.yml
```

## Data Layer

`lib/data.ts` exports typed constants directly. No `window.*`, no globals.

```ts
export interface Trailer {
  id: string; title: string; year: number; mins: number;
  rating: string; tags: string[]; match: number;
  award: string; awardSub: string; desc: string;
  cast: string[]; genres: string[];
}

export interface Profile {
  id: string; name: string; color: string;
  kid?: boolean; add?: boolean;
}

export interface Row {
  id: string; title: string; ids: string[]; top10?: boolean;
}

export const trailers: Trailer[] = [...];
export const profiles: Profile[] = [...];
export const rows: Row[] = [...];
export function posterGradient(id: string): string { ... }
```

`WEDFLIX_DEFAULTS` moves into `App.tsx` as a plain typed const:

```ts
const WEDFLIX_DEFAULTS = {
  brand: '#C8102E',
  brandText: 'WEDFLIX',
  green: '#00B140',
  hudVariant: 'standard' as const,
  heroId: 't02',
  showHudTags: true,
};
```

## Component Migration

**Rules applied to every file:**
- Remove all `window.*` assignments and reads — replaced by imports/exports
- Add typed prop interfaces for every component
- `'use client'` on `App.tsx` only — propagates to all children
- `tweaks-panel.jsx` deleted; `useTweaks` removed; defaults inlined in `App.tsx`

**`App.tsx` state** stays identical in shape: `screen`, `profile`, `currentTrailerId`, `myList`, `navTo`, `toggleMyList`. Brand/green CSS vars still applied via `useEffect` against the hardcoded defaults.

**`app/page.tsx`** is a server component that only renders `<App />`. All interactivity lives inside `App` and its children.

**`app/globals.css`** is `styles.css` verbatim, imported once in `layout.tsx`.

**`posterGradient`** is imported from `lib/data.ts` wherever needed, not called via `window.*`.

## CI/CD Pipeline

### Vercel (deploy)
- Connect repo in Vercel dashboard; set framework = Next.js, output dir = `out`
- Every push to `main` → production deploy
- Every PR → preview URL
- No secrets required in GitHub — Vercel GitHub App handles authentication

### GitHub Actions (CI)
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check   # tsc --noEmit
      - run: npm run build        # next build — validates static export
```

Vercel deploys only after GitHub commit status is green, so a failing CI implicitly blocks deploy.

## Out of Scope

- URL-based routing (app stays single-page with state-based navigation)
- Server components beyond the thin `page.tsx` shell
- API routes
- Real video assets (green-screen placeholder preserved as-is)
- Authentication
