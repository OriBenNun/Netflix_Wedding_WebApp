# Wedflix Next.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert Wedflix from a flat CDN-React static HTML app to a Next.js 15 TypeScript project with static export, deployed via Vercel native GitHub integration with GitHub Actions CI.

**Architecture:** Single Next.js route (`app/page.tsx`) renders a `'use client'` `App` component. All 6 source files become typed TypeScript modules under `lib/`, `components/`, and `app/`. Static export produces `out/` at build time. Tweaks panel removed; defaults hardcoded in `App.tsx`.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, ESLint (next/core-web-vitals), next/font/google (Anton), GitHub Actions, Vercel native GitHub integration.

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `.eslintrc.json`
- Create: `.gitignore`
- Create: `app/page.tsx` (stub)
- Create: `app/layout.tsx` (stub)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "wedflix",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^15",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": [
    "next-env.d.ts",
    "app/**/*.ts",
    "app/**/*.tsx",
    "components/**/*.ts",
    "components/**/*.tsx",
    "lib/**/*.ts",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules", "_design"]
}
```

- [ ] **Step 3: Create `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
}

export default nextConfig
```

- [ ] **Step 4: Create `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 5: Create `.gitignore`** (append to existing if present, or create new)

```
/node_modules
/.next
/out
```

- [ ] **Step 6: Create stub `app/layout.tsx`**

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 7: Create stub `app/page.tsx`**

```tsx
export default function Page() {
  return <div>Wedflix</div>
}
```

- [ ] **Step 8: Install dependencies**

Run: `npm install`

Expected: `node_modules/` created, no errors.

- [ ] **Step 9: Verify build passes**

Run: `npm run build`

Expected: Build completes, `out/` directory created containing `index.html`.

- [ ] **Step 10: Commit**

```bash
git add package.json tsconfig.json next.config.ts .eslintrc.json .gitignore app/
git commit -m "feat: scaffold Next.js 15 TypeScript project"
```

---

### Task 2: Globals CSS and layout

**Files:**
- Create: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create `app/globals.css`**

Copy `styles.css` verbatim with one change: remove the `--font-display` line from `:root` (Next.js will inject it via the Anton font variable). The `:root` block should become:

```css
:root {
  --bg: #0a0a0a;
  --bg-elevated: #181818;
  --bg-hover: #232323;
  --fg: #f5f5f5;
  --fg-muted: #b3b3b3;
  --fg-dim: #737373;
  --brand: #C8102E;
  --brand-hover: #e0203e;
  --green-screen: #00B140;
  --border: rgba(255,255,255,0.08);
  --shadow-card: 0 12px 32px rgba(0,0,0,0.7);
  --font-sans: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
```

All other CSS content is copied verbatim from `styles.css`.

- [ ] **Step 2: Update `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Anton } from 'next/font/google'
import './globals.css'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Wedflix',
  description: 'A Netflix-style wedding video showcase.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={anton.variable}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add globals CSS and root layout with Anton font"
```

---

### Task 3: Data layer

**Files:**
- Create: `lib/data.ts`

- [ ] **Step 1: Create `lib/data.ts`**

```ts
export interface Trailer {
  id: string;
  title: string;
  year: number;
  mins: number;
  rating: string;
  tags: string[];
  match: number;
  award: string;
  awardSub: string;
  desc: string;
  cast: string[];
  genres: string[];
}

export interface Profile {
  id: string;
  name: string;
  color: string;
  kid?: boolean;
  add?: boolean;
}

export interface Row {
  id: string;
  title: string;
  ids: string[];
  top10?: boolean;
}

export const trailers: Trailer[] = [
  // All 20 entries — copy the `trailers` array from `data.js` lines 13–34 verbatim,
  // replacing the JS object literal syntax with typed TS. Each entry matches the Trailer
  // interface above exactly (no extra or missing fields). First entry shown as reference:
  { id: 't01', title: 'How They Met', year: 2016, mins: 4, rating: 'TV-MA', tags: ['Unhinged', 'Mildly Romantic', 'Tinder-Adjacent'], match: 98, award: 'Critically Roasted', awardSub: 'Winner: Best Use of Pickup Line', desc: 'A chance encounter at a dive bar leads to the romance of the century — or so the unreliable narrators claim. Witnesses dispute every detail.', cast: ['Sarah M.', 'Daniel K.', 'A suspicious mojito'], genres: ['Romance', 'Documentary', 'Comedy'] },
  // Copy t02–t20 from data.js lines 15–33, same structure.
]

export const profiles: Profile[] = [
  // Copy the 5 entries from data.js window.WEDFLIX_DATA.profiles verbatim.
  { id: 'p1', name: 'The Bride',       color: '#C8102E' },
  { id: 'p2', name: 'The Groom',       color: '#3B82F6' },
  { id: 'p3', name: 'Bridesmaids',     color: '#F59E0B' },
  { id: 'p4', name: 'Kids',            color: '#10B981', kid: true },
  { id: 'p5', name: '+ Add Profile',   color: '#404040', add: true },
]

export const rows: Row[] = [
  // Copy the 7 entries from data.js window.WEDFLIX_DATA.rows verbatim.
  { id: 'r1', title: 'Continue Watching',        ids: ['t02', 't09', 't16', 't19', 't08', 't20'] },
  { id: 'r2', title: 'Critically Roasted',       ids: ['t03', 't04', 't06', 't13', 't11', 't17', 't07'] },
  { id: 'r3', title: 'Top 10 Wedflix Originals', ids: ['t20', 't19', 't02', 't16', 't01', 't09', 't08', 't18', 't05', 't10'], top10: true },
  { id: 'r4', title: 'Romantic Disasters',       ids: ['t01', 't12', 't15', 't14', 't06', 't11'] },
  { id: 'r5', title: 'Because You Watched "The Proposal"', ids: ['t19', 't20', 't16', 't18', 't08', 't09'] },
  { id: 'r6', title: 'Unhinged Comedies',        ids: ['t03', 't04', 't13', 't17', 't07', 't11', 't12'] },
  { id: 'r7', title: 'New Releases',             ids: ['t19', 't20', 't18', 't03', 't04', 't16', 't17'] },
]

export function posterGradient(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  const h2 = (h + 40) % 360;
  return `linear-gradient(135deg, oklch(0.35 0.18 ${h}) 0%, oklch(0.18 0.12 ${h2}) 100%)`;
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/data.ts
git commit -m "feat: add typed data layer"
```

---

### Task 4: Icon components

**Files:**
- Create: `components/icons.tsx`

- [ ] **Step 1: Create `components/icons.tsx`**

```tsx
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export const Icon = {
  play: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M8 5v14l11-7z"/></svg>
  ),
  pause: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
  ),
  plus: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...props}><path d="M12 5v14M5 12h14"/></svg>
  ),
  check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="4 12 10 18 20 6"/></svg>
  ),
  thumb: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h13.4a2 2 0 0 0 2-1.7l1.3-8a2 2 0 0 0-2-2.3H14V4a3 3 0 0 0-3-3l-4 9z"/></svg>
  ),
  chevDown: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9"/></svg>
  ),
  chevLeft: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6"/></svg>
  ),
  chevRight: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"/></svg>
  ),
  info: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  ),
  search: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
  ),
  bell: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/></svg>
  ),
  volume: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>
  ),
  volumeMute: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
  ),
  fullscreen: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4"/></svg>
  ),
  skipBack: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="11 19 2 12 11 5"/><polyline points="22 19 13 12 22 5"/></svg>
  ),
  skipFwd: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="13 19 22 12 13 5"/><polyline points="2 19 11 12 2 5"/></svg>
  ),
  subtitles: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="7" y1="14" x2="13" y2="14"/><line x1="15" y1="14" x2="17" y2="14"/><line x1="7" y1="10" x2="9" y2="10"/><line x1="11" y1="10" x2="17" y2="10"/></svg>
  ),
  episodes: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/icons.tsx
git commit -m "feat: add Icon component map"
```

---

### Task 5: TileArt component

**Files:**
- Create: `components/TileArt.tsx`

- [ ] **Step 1: Create `components/TileArt.tsx`**

```tsx
import type { Trailer } from '@/lib/data'
import { posterGradient } from '@/lib/data'

interface TileArtProps {
  trailer: Trailer
  brand: string
  large?: boolean
  noTitle?: boolean
}

export function TileArt({ trailer, brand, large, noTitle }: TileArtProps) {
  let h = 0;
  for (let i = 0; i < trailer.id.length; i++) h = (h * 31 + trailer.id.charCodeAt(i)) % 360;
  const template = h % 3;
  const patternType = (h >> 3) % 3;
  const patternBg = patternType === 0
    ? 'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 14px)'
    : patternType === 1
      ? 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 2px) 0 0 / 12px 12px'
      : 'repeating-linear-gradient(45deg, rgba(0,0,0,0.12) 0 4px, transparent 4px 18px)';

  const baseStyle: React.CSSProperties = {
    background: posterGradient(trailer.id),
    width: '100%', height: '100%',
    position: 'relative',
    display: 'flex',
    overflow: 'hidden',
  };
  const titleFs = large ? 'clamp(28px, 4vw, 56px)' : '28px';
  const titleFsSmall = large ? '34px' : '22px';

  const Pattern = () => (
    <div style={{ position: 'absolute', inset: 0, background: patternBg, pointerEvents: 'none' }} />
  );
  const Vignette = () => (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />
  );
  const Watermark = () => (
    <div style={{ position: 'absolute', top: 10, left: 12, fontFamily: 'var(--font-display)', color: brand, fontSize: large ? 22 : 14, fontWeight: 900, letterSpacing: 0, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>W</div>
  );
  const YearBadge = ({ pos = 'br' }: { pos?: string }) => (
    <div style={{ position: 'absolute', [pos[0] === 't' ? 'top' : 'bottom']: 10, [pos[1] === 'l' ? 'left' : 'right']: 12, fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.7)', fontSize: large ? 12 : 10, letterSpacing: '0.2em', fontWeight: 600 }}>{trailer.year}</div>
  );

  if (template === 0) {
    return (
      <div className="tile-art" style={baseStyle}>
        <Pattern />
        <Vignette />
        <Watermark />
        <YearBadge pos="br" />
        {!noTitle && (
          <div style={{ margin: 'auto', textAlign: 'center', padding: large ? 40 : 14, zIndex: 1 }}>
            <div className="tile-art-title" style={{ fontSize: titleFs, lineHeight: 0.92 }}>{trailer.title}</div>
            <div style={{ marginTop: 10, color: 'rgba(255,255,255,0.85)', fontSize: large ? 13 : 10, letterSpacing: '0.22em', fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>— A WEDFLIX ORIGINAL —</div>
          </div>
        )}
      </div>
    );
  }

  if (template === 1) {
    return (
      <div className="tile-art" style={baseStyle}>
        <Pattern />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <Watermark />
        <div style={{ position: 'absolute', top: 10, right: 12, padding: '2px 8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.3)', fontSize: large ? 11 : 9, letterSpacing: '0.12em', fontWeight: 700, color: 'white' }}>{trailer.rating}</div>
        {!noTitle && (
          <div style={{ marginTop: 'auto', padding: large ? 40 : '0 14px 14px', zIndex: 1, alignSelf: 'flex-start', textAlign: 'left' }}>
            <div className="tile-art-title" style={{ fontSize: titleFsSmall, textAlign: 'left', lineHeight: 0.92 }}>{trailer.title}</div>
            <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.75)', fontSize: large ? 12 : 9, letterSpacing: '0.2em', fontWeight: 600 }}>{trailer.year} · {trailer.tags[0]}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="tile-art" style={baseStyle}>
      <Pattern />
      <Vignette />
      <div style={{ position: 'absolute', top: 8, left: 0, right: 0, textAlign: 'center', color: brand, fontSize: large ? 12 : 9, letterSpacing: '0.32em', fontWeight: 800, textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
        ★ Wedflix Original ★
      </div>
      <Watermark />
      <YearBadge pos="bl" />
      <div style={{ position: 'absolute', bottom: 10, right: 12, color: '#46d369', fontWeight: 800, fontSize: large ? 13 : 10, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{trailer.match}% Match</div>
      {!noTitle && (
        <div style={{ margin: 'auto', textAlign: 'center', padding: large ? 40 : 14, zIndex: 1 }}>
          <div className="tile-art-title" style={{ fontSize: titleFs, lineHeight: 0.92 }}>{trailer.title}</div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/TileArt.tsx
git commit -m "feat: add TileArt component"
```

---

### Task 6: Header component

**Files:**
- Create: `components/Header.tsx`

- [ ] **Step 1: Create `components/Header.tsx`**

```tsx
import { useState, useEffect } from 'react'
import type { Profile } from '@/lib/data'
import { Icon } from './icons'

interface HeaderProps {
  screen: string
  navTo: (screen: string, trailerId?: string) => void
  profile: Profile
  brand: string
}

export function Header({ screen, navTo, profile, brand }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tabs = ['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <button className="wedflix-logo" onClick={() => navTo('home')}>{brand || 'WEDFLIX'}</button>
      <nav>
        {tabs.map((t, i) => (
          <button key={t} className={i === 0 && screen === 'home' ? 'active' : ''} onClick={() => navTo('home')}>{t}</button>
        ))}
      </nav>
      <div className="header-right">
        <div className={`search-bar ${searchOpen ? 'open' : ''}`}>
          <Icon.search style={{ width: 18, height: 18, color: 'white' }} />
          <input placeholder="Titles, people, vibes…" autoFocus={searchOpen} />
        </div>
        <button onClick={() => setSearchOpen(s => !s)}><Icon.search /></button>
        <button>Kids</button>
        <button><Icon.bell /></button>
        <div className="avatar" style={{ background: profile.color }}>
          {profile.name[0]}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: add Header component"
```

---

### Task 7: Tile and Top10Tile components

**Files:**
- Create: `components/Tile.tsx`

- [ ] **Step 1: Create `components/Tile.tsx`**

```tsx
import { useRef } from 'react'
import type { Trailer } from '@/lib/data'
import { TileArt } from './TileArt'

interface TileProps {
  trailer: Trailer
  onClick: () => void
  onHover?: (trailer: Trailer, el: HTMLElement) => void
  onLeave?: () => void
  progress?: number | null
  brand: string
}

export function Tile({ trailer, onClick, onHover, onLeave, progress, brand }: TileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={tileRef}
      className="tile"
      onClick={onClick}
      onMouseEnter={() => onHover && tileRef.current && onHover(trailer, tileRef.current)}
      onMouseLeave={onLeave}
    >
      <TileArt trailer={trailer} brand={brand} />
      {progress != null && (
        <div className="tile-progress">
          <div className="tile-progress-fill" style={{ width: `${progress}%`, background: brand }} />
        </div>
      )}
    </div>
  );
}

interface Top10TileProps {
  trailer: Trailer
  rank: number
  onClick: () => void
  onHover?: (trailer: Trailer, el: HTMLElement) => void
  onLeave?: () => void
  brand: string
}

export function Top10Tile({ trailer, rank, onClick, onHover, onLeave, brand }: Top10TileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  return (
    <div className="tile-top10">
      <div className="rank-num">{rank}</div>
      <div
        ref={tileRef}
        className="tile"
        onClick={onClick}
        onMouseEnter={() => onHover && tileRef.current && onHover(trailer, tileRef.current)}
        onMouseLeave={onLeave}
      >
        <TileArt trailer={trailer} brand={brand} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/Tile.tsx
git commit -m "feat: add Tile and Top10Tile components"
```

---

### Task 8: Row component

**Files:**
- Create: `components/Row.tsx`

- [ ] **Step 1: Create `components/Row.tsx`**

```tsx
import { useRef } from 'react'
import type { Row as RowData, Trailer } from '@/lib/data'
import { trailers as allTrailers } from '@/lib/data'
import { Tile, Top10Tile } from './Tile'
import { Icon } from './icons'

interface RowProps {
  row: RowData
  onTileClick: (trailer: Trailer) => void
  onTileHover: (trailer: Trailer, el: HTMLElement) => void
  onTileLeave: () => void
  brand: string
}

export function Row({ row, onTileClick, onTileHover, onTileLeave, brand }: RowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rowTrailers = row.ids
    .map(id => allTrailers.find(t => t.id === id))
    .filter((t): t is Trailer => Boolean(t));
  const isContinue = row.id === 'r1';

  const scroll = (dir: number) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: dir * 720, behavior: 'smooth' });
  };

  return (
    <section className="row">
      <h2 className="row-title">{row.title}</h2>
      <button className="row-arrow left" onClick={() => scroll(-1)} aria-label="scroll left"><Icon.chevLeft /></button>
      <div className="row-scroller" ref={scrollerRef}>
        {rowTrailers.map((t, i) => {
          if (row.top10) {
            return (
              <Top10Tile
                key={t.id}
                trailer={t}
                rank={i + 1}
                onClick={() => onTileClick(t)}
                onHover={onTileHover}
                onLeave={onTileLeave}
                brand={brand}
              />
            );
          }
          const progress = isContinue ? 20 + (i * 11) % 80 : null;
          return (
            <Tile
              key={t.id}
              trailer={t}
              onClick={() => onTileClick(t)}
              onHover={onTileHover}
              onLeave={onTileLeave}
              progress={progress}
              brand={brand}
            />
          );
        })}
      </div>
      <button className="row-arrow right" onClick={() => scroll(1)} aria-label="scroll right"><Icon.chevRight /></button>
    </section>
  );
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/Row.tsx
git commit -m "feat: add Row component"
```

---

### Task 9: HoverCard component

**Files:**
- Create: `components/HoverCard.tsx`

- [ ] **Step 1: Create `components/HoverCard.tsx`**

```tsx
import { useState, useEffect, useRef } from 'react'
import type { Trailer } from '@/lib/data'
import { TileArt } from './TileArt'
import { Icon } from './icons'

interface TileRect {
  left: number
  top: number
  width: number
  height: number
}

interface HoverCardProps {
  trailer: Trailer
  rect: TileRect
  onClose: () => void
  onPlay: () => void
  onMore: () => void
  brand: string
  inMyList: boolean
  toggleMyList: () => void
  onMouseEnter: () => void
}

export function HoverCard({ trailer, rect, onClose, onPlay, onMore, brand, inMyList, toggleMyList, onMouseEnter }: HoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!rect) return;
    const cardW = 360;
    const tileCx = rect.left + rect.width / 2;
    let left = tileCx - cardW / 2;
    left = Math.max(20, Math.min(window.innerWidth - cardW - 20, left));
    const top = Math.max(80, rect.top - 30);
    setPos({ left, top });
  }, [rect]);

  if (!pos) return null;

  return (
    <div
      ref={cardRef}
      className="hover-card"
      style={{ left: pos.left, top: pos.top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="hover-card-art" style={{ overflow: 'hidden' }}>
        <TileArt trailer={trailer} brand={brand} />
      </div>
      <div className="hover-card-body">
        <div className="hover-card-actions">
          <button className="icon-btn primary" onClick={onPlay}><Icon.play /></button>
          <button className="icon-btn" onClick={toggleMyList} title={inMyList ? 'Remove from list' : 'Add to list'}>
            {inMyList ? <Icon.check /> : <Icon.plus />}
          </button>
          <button className="icon-btn"><Icon.thumb /></button>
          <button className="icon-btn more" onClick={onMore}><Icon.chevDown /></button>
        </div>
        <div className="hover-card-meta">
          <span className="match-pct">{trailer.match}% Match</span>
          <span className="rating-chip">{trailer.rating}</span>
          <span>{trailer.mins}m</span>
          <span style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '0 5px', fontSize: 11 }}>HD</span>
        </div>
        <div className="hover-card-tags">
          {trailer.tags.map(tag => <span key={tag}>{tag}</span>)}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/HoverCard.tsx
git commit -m "feat: add HoverCard component"
```

---

### Task 10: ProfileScreen

**Files:**
- Create: `components/screens/ProfileScreen.tsx`

- [ ] **Step 1: Create `components/screens/ProfileScreen.tsx`**

```tsx
import type { Profile } from '@/lib/data'
import { profiles, posterGradient } from '@/lib/data'

interface ProfileScreenProps {
  onPick: (profile: Profile) => void
  brand: string
  brandText: string
}

export function ProfileScreen({ onPick, brand, brandText }: ProfileScreenProps) {
  return (
    <div className="profile-screen fade-in">
      <div className="wedflix-logo" style={{ color: brand }}>{brandText}</div>
      <h1>Who&apos;s watching?</h1>
      <div className="profile-grid">
        {profiles.map((p) => (
          <button key={p.id} className="profile-card" onClick={() => !p.add && onPick(p)}>
            <div
              className={`profile-tile ${p.add ? 'add' : ''}`}
              style={!p.add ? { background: posterGradient(p.id) } : {}}
            >
              {p.add ? '+' : p.name[0]}
            </div>
            <div className="profile-name">{p.name.replace('+ Add Profile', 'Add Profile')}</div>
            {p.kid && <div className="profile-kid-tag">Kids</div>}
          </button>
        ))}
      </div>
      <button className="manage-btn">Manage Profiles</button>
    </div>
  );
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/screens/ProfileScreen.tsx
git commit -m "feat: add ProfileScreen"
```

---

### Task 11: HomeScreen

**Files:**
- Create: `components/screens/HomeScreen.tsx`

- [ ] **Step 1: Create `components/screens/HomeScreen.tsx`**

```tsx
import { useState, useRef } from 'react'
import type { Profile, Trailer } from '@/lib/data'
import { trailers, rows } from '@/lib/data'
import { Header } from '../Header'
import { TileArt } from '../TileArt'
import { Row } from '../Row'
import { HoverCard } from '../HoverCard'
import { Icon } from '../icons'

interface HoverState {
  trailer: Trailer
  rect: { left: number; top: number; width: number; height: number }
}

interface HomeScreenProps {
  profile: Profile
  navTo: (screen: string, trailerId?: string) => void
  brand: string
  brandText: string
  heroId: string
  myList: string[]
  toggleMyList: (id: string) => void
}

export function HomeScreen({ profile, navTo, brand, brandText, heroId, myList, toggleMyList }: HomeScreenProps) {
  const hero = trailers.find(t => t.id === heroId) ?? trailers[1];
  const [hover, setHover] = useState<HoverState | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showHover = (trailer: Trailer, el: HTMLElement) => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      setHover({ trailer, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } });
    }, 280);
  };

  const hideHover = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    leaveTimerRef.current = setTimeout(() => setHover(null), 220);
  };

  const cancelHide = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
  };

  return (
    <div className="home-screen fade-in">
      <Header screen="home" navTo={navTo} profile={profile} brand={brandText} />

      <section className="hero">
        <div className="hero-bg">
          <TileArt trailer={hero} brand={brand} large noTitle />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="w-mark" style={{ color: brand }}>W</span> WEDFLIX ORIGINAL TRAILER
          </div>
          <h1 className="hero-title" style={{ letterSpacing: '1.1px', lineHeight: '1.1' }}>{hero.title}</h1>
          <div className="hero-meta">
            <span className="match-pct">{hero.match}% Match</span>
            <span>{hero.year}</span>
            <span className="rating-chip">{hero.rating}</span>
            <span>{hero.mins}m</span>
          </div>
          <p className="hero-desc">{hero.desc}</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navTo('playback', hero.id)}>
              <Icon.play /> Play
            </button>
            <button className="btn btn-secondary" onClick={() => navTo('detail', hero.id)}>
              <Icon.info /> More Info
            </button>
          </div>
        </div>
      </section>

      <div className="rows">
        {rows.map(row => (
          <Row
            key={row.id}
            row={row}
            onTileClick={t => navTo('detail', t.id)}
            onTileHover={showHover}
            onTileLeave={hideHover}
            brand={brand}
          />
        ))}
      </div>

      {hover && (
        <HoverCard
          trailer={hover.trailer}
          rect={hover.rect}
          onClose={hideHover}
          onMouseEnter={cancelHide}
          onPlay={() => navTo('playback', hover.trailer.id)}
          onMore={() => navTo('detail', hover.trailer.id)}
          brand={brand}
          inMyList={myList.includes(hover.trailer.id)}
          toggleMyList={() => toggleMyList(hover.trailer.id)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/screens/HomeScreen.tsx
git commit -m "feat: add HomeScreen"
```

---

### Task 12: DetailScreen

**Files:**
- Create: `components/screens/DetailScreen.tsx`

- [ ] **Step 1: Create `components/screens/DetailScreen.tsx`**

```tsx
import { useEffect } from 'react'
import type { Profile } from '@/lib/data'
import { trailers } from '@/lib/data'
import { Header } from '../Header'
import { TileArt } from '../TileArt'
import { Icon } from '../icons'

interface DetailScreenProps {
  trailerId: string | null
  profile: Profile
  navTo: (screen: string, trailerId?: string) => void
  brand: string
  brandText: string
  myList: string[]
  toggleMyList: (id: string) => void
}

export function DetailScreen({ trailerId, profile, navTo, brand, brandText, myList, toggleMyList }: DetailScreenProps) {
  const t = trailers.find(x => x.id === trailerId);
  if (!t) return null;

  const moreLike = trailers
    .filter(x => x.id !== t.id && x.genres.some(g => t.genres.includes(g)))
    .slice(0, 6);
  const inList = myList.includes(t.id);

  useEffect(() => { window.scrollTo(0, 0); }, [trailerId]);

  return (
    <div className="detail-screen fade-in">
      <Header screen="detail" navTo={navTo} profile={profile} brand={brandText} />
      <button className="detail-back" onClick={() => navTo('home')} aria-label="back"><Icon.chevLeft /></button>

      <div className="detail-hero">
        <div className="hero-bg">
          <TileArt trailer={t} brand={brand} large noTitle />
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-left">
          <div className="hero-badge">
            <span className="w-mark" style={{ color: brand }}>W</span> WEDFLIX ORIGINAL
          </div>
          <h1 style={{ letterSpacing: '0px', lineHeight: '1.1' }}>{t.title}</h1>
          <div className="detail-meta-row">
            <span className="match-pct">{t.match}% Match</span>
            <span>{t.year}</span>
            <span className="rating-chip">{t.rating}</span>
            <span>{t.mins}m</span>
            <span style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '0 5px', fontSize: 11 }}>HD</span>
          </div>
          <div className="award-block">
            <div className="award-name">🏆 {t.award}</div>
            <div className="award-sub">{t.awardSub}</div>
          </div>
          <p className="detail-desc">{t.desc}</p>
          <div className="detail-actions">
            <button className="btn btn-primary" onClick={() => navTo('playback', t.id)}><Icon.play /> Play</button>
            <button className="btn btn-secondary" onClick={() => toggleMyList(t.id)}>
              {inList ? <Icon.check /> : <Icon.plus />} {inList ? 'On My List' : 'My List'}
            </button>
            <button className="btn btn-secondary"><Icon.thumb /> Rate</button>
          </div>
        </div>

        <div className="detail-right">
          <div className="row-item"><span className="label">Cast:</span> <span>{t.cast.join(', ')}</span></div>
          <div className="row-item"><span className="label">Genres:</span> <span>{t.genres.join(', ')}</span></div>
          <div className="row-item"><span className="label">This trailer is:</span> <span>{t.tags.join(', ')}</span></div>
          <div className="row-item"><span className="label">Maturity rating:</span> <span>{t.rating} — Strong language, mild inside jokes</span></div>
        </div>
      </div>

      <h2 className="section-title">More Like This</h2>
      <div style={{ padding: '0 56px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {moreLike.map(mt => (
            <div key={mt.id} className="tile" style={{ width: '100%', cursor: 'pointer' }} onClick={() => navTo('detail', mt.id)}>
              <TileArt trailer={mt} brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/screens/DetailScreen.tsx
git commit -m "feat: add DetailScreen"
```

---

### Task 13: PlaybackScreen

**Files:**
- Create: `components/screens/PlaybackScreen.tsx`

- [ ] **Step 1: Create `components/screens/PlaybackScreen.tsx`**

```tsx
import { useState, useEffect, useRef } from 'react'
import { trailers, posterGradient } from '@/lib/data'
import { Icon } from '../icons'

interface PlaybackScreenProps {
  trailerId: string | null
  navTo: (screen: string, trailerId?: string) => void
  brand: string
  hudVariant: 'minimal' | 'standard' | 'loaded'
  greenColor: string
  hudOptions?: { tags?: boolean }
}

export function PlaybackScreen({ trailerId, navTo, brand, hudVariant, greenColor, hudOptions }: PlaybackScreenProps) {
  const t = trailers.find(x => x.id === trailerId);
  if (!t) return null;

  const next = trailers[(trailers.indexOf(t) + 1) % trailers.length];
  const [showHud, setShowHud] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(8);
  const totalSec = t.mins * 60;
  const elapsedSec = Math.floor(totalSec * progress / 100);
  const remainingSec = totalSec - elapsedSec;

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bumpHud = () => {
    setShowHud(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => playing && setShowHud(false), 3000);
  };

  useEffect(() => {
    bumpHud();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [trailerId, playing]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress(p => {
        const np = p + 100 / totalSec * 0.4;
        return np >= 100 ? 100 : np;
      });
    }, 400);
    return () => clearInterval(id);
  }, [playing, totalSec]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${r}`;
  };

  const showSkipIntro = progress < 25 && hudVariant !== 'minimal';
  const showUpNext = progress > 85 && hudVariant === 'loaded';
  const showTags = hudOptions?.tags !== false && hudVariant !== 'minimal';

  return (
    <div
      className={`playback ${showHud ? 'show-hud' : ''}`}
      onMouseMove={bumpHud}
      onClick={e => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('playback') || target.classList.contains('playback-greenscreen')) {
          setPlaying(p => !p);
        }
      }}
    >
      <div className="playback-greenscreen" style={{ background: greenColor }}>
        <div className="gs-label">
          <div className="gs-title">[ GREEN SCREEN ]</div>
          <div>Replace with footage: {t.title}</div>
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.6 }}>Chroma key {greenColor} · {totalSec}s runtime</div>
        </div>
      </div>

      <div className="playback-hud">
        <div className="hud-top">
          <button className="back" onClick={() => navTo('home')} aria-label="back"><Icon.chevLeft /></button>
          <div className="hud-title">
            <small><span style={{ color: brand, fontFamily: 'var(--font-display)', fontWeight: 900, marginRight: 6 }}>W</span> A WEDFLIX ORIGINAL</small>
            {t.title}
          </div>
          {showTags && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              {t.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 10px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tag}</span>
              ))}
              <span style={{ background: 'rgba(200,16,46,0.85)', padding: '4px 10px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>🏆 {t.award}</span>
            </div>
          )}
        </div>

        {hudVariant !== 'minimal' && (
          <div style={{ position: 'absolute', top: 100, left: 40, display: 'flex', flexDirection: 'column', gap: 4, color: 'white' }}>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 12px', fontSize: 13, alignSelf: 'flex-start', fontVariantNumeric: 'tabular-nums' }}>
              <span className="match-pct">{t.match}% Match</span>
              <span style={{ marginLeft: 10, color: 'var(--fg-muted)' }}>{t.year} · {t.rating} · {t.mins}m</span>
            </div>
            {hudVariant === 'loaded' && (
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 12px', fontSize: 12, color: 'var(--fg-muted)', alignSelf: 'flex-start' }}>
                {t.awardSub}
              </div>
            )}
          </div>
        )}

        {showSkipIntro && <button className="hud-skipintro">Skip Intro</button>}

        {showUpNext && (
          <div className="hud-upnext">
            <div className="small-tile" style={{ background: posterGradient(next.id) }}>
              <div className="small-tile-art">{next.title.split(':')[0]}</div>
            </div>
            <div className="un-body">
              <small>Next Episode</small>
              <h4>{next.title}</h4>
              <p>{next.desc.slice(0, 90)}…</p>
            </div>
          </div>
        )}

        <div className="hud-bottom">
          <div className="hud-scrubber">
            <span>{fmt(elapsedSec)}</span>
            <div
              className="bar"
              onClick={e => {
                const r = e.currentTarget.getBoundingClientRect();
                setProgress((e.clientX - r.left) / r.width * 100);
              }}
            >
              <div className="bar-fill" style={{ width: `${progress}%`, background: brand }} />
              <div className="bar-knob" style={{ left: `${progress}%`, background: brand }} />
            </div>
            <span>-{fmt(remainingSec)}</span>
          </div>
          <div className="hud-controls">
            <button className="play" onClick={() => setPlaying(p => !p)}>
              {playing ? <Icon.pause /> : <Icon.play />}
            </button>
            <button onClick={() => setProgress(p => Math.max(0, p - 5))}><Icon.skipBack /></button>
            <button onClick={() => setProgress(p => Math.min(100, p + 5))}><Icon.skipFwd /></button>
            <button onClick={() => setMuted(m => !m)}>{muted ? <Icon.volumeMute /> : <Icon.volume />}</button>
            <div style={{ marginLeft: 8, fontSize: 16, fontWeight: 600 }}>{t.title}</div>
            <div className="right-cluster">
              <button className="hud-next" onClick={() => navTo('playback', next.id)}>
                <Icon.skipFwd /> Next Episode
              </button>
              <button title="Episodes & Info"><Icon.episodes /></button>
              <button title="Subtitles"><Icon.subtitles /></button>
              <button title="Fullscreen"><Icon.fullscreen /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/screens/PlaybackScreen.tsx
git commit -m "feat: add PlaybackScreen"
```

---

### Task 14: App root component and page

**Files:**
- Create: `components/App.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/App.tsx`**

```tsx
'use client'
import { useState, useEffect } from 'react'
import type { Profile } from '@/lib/data'
import { ProfileScreen } from './screens/ProfileScreen'
import { HomeScreen } from './screens/HomeScreen'
import { DetailScreen } from './screens/DetailScreen'
import { PlaybackScreen } from './screens/PlaybackScreen'

type Screen = 'profile' | 'home' | 'detail' | 'playback'

const DEFAULTS = {
  brand: '#C8102E',
  brandText: 'WEDFLIX',
  green: '#00B140',
  hudVariant: 'standard' as const,
  heroId: 't02',
  showHudTags: true,
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('profile')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [currentTrailerId, setCurrentTrailerId] = useState<string | null>(null)
  const [myList, setMyList] = useState<string[]>(['t02', 't09', 't20'])

  const navTo = (s: string, trailerId?: string) => {
    if (trailerId) setCurrentTrailerId(trailerId)
    setScreen(s as Screen)
    window.scrollTo(0, 0)
  }

  const toggleMyList = (id: string) => {
    setMyList(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id])
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && screen === 'playback') navTo('home')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen])

  useEffect(() => {
    document.documentElement.style.setProperty('--brand', DEFAULTS.brand)
    document.documentElement.style.setProperty('--green-screen', DEFAULTS.green)
  }, [])

  if (screen === 'profile' || !profile) {
    return (
      <ProfileScreen
        brand={DEFAULTS.brand}
        brandText={DEFAULTS.brandText}
        onPick={p => { setProfile(p); setScreen('home') }}
      />
    )
  }
  if (screen === 'home') {
    return (
      <HomeScreen
        profile={profile}
        navTo={navTo}
        brand={DEFAULTS.brand}
        brandText={DEFAULTS.brandText}
        heroId={DEFAULTS.heroId}
        myList={myList}
        toggleMyList={toggleMyList}
      />
    )
  }
  if (screen === 'detail') {
    return (
      <DetailScreen
        trailerId={currentTrailerId}
        profile={profile}
        navTo={navTo}
        brand={DEFAULTS.brand}
        brandText={DEFAULTS.brandText}
        myList={myList}
        toggleMyList={toggleMyList}
      />
    )
  }
  if (screen === 'playback') {
    return (
      <PlaybackScreen
        trailerId={currentTrailerId}
        navTo={navTo}
        brand={DEFAULTS.brand}
        hudVariant={DEFAULTS.hudVariant}
        greenColor={DEFAULTS.green}
        hudOptions={{ tags: DEFAULTS.showHudTags }}
      />
    )
  }
  return null
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import App from '@/components/App'

export default function Page() {
  return <App />
}
```

- [ ] **Step 3: Verify type-check passes**

Run: `npm run type-check`

Expected: No errors.

- [ ] **Step 4: Verify full build passes**

Run: `npm run build`

Expected: Build completes, `out/` directory contains `index.html` and static assets. No errors.

- [ ] **Step 5: Smoke test in browser**

Run: `npx serve out`

Open `http://localhost:3000`. Verify:
- Profile picker renders with 5 profiles
- Selecting a profile navigates to Home
- Hero section shows the featured trailer
- Tile rows scroll horizontally
- Hovering a tile shows the HoverCard after ~300ms
- Clicking a tile navigates to Detail screen
- Clicking Play navigates to Playback (green screen + HUD)
- ESC exits Playback to Home

- [ ] **Step 6: Commit**

```bash
git add components/App.tsx app/page.tsx
git commit -m "feat: add App root component and wire page"
```

---

### Task 15: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions CI workflow"
```

---

### Task 16: Remove legacy files

**Files:**
- Delete: `Wedflix.html`
- Delete: `data.js`
- Delete: `app.jsx`
- Delete: `components.jsx`
- Delete: `screens.jsx`
- Delete: `tweaks-panel.jsx`
- Delete: `styles.css`

- [ ] **Step 1: Delete legacy root files**

```bash
git rm Wedflix.html data.js app.jsx components.jsx screens.jsx tweaks-panel.jsx styles.css
```

- [ ] **Step 2: Verify build still passes**

Run: `npm run build`

Expected: Build completes without errors. The `_design/` folder is untouched and not scanned by TypeScript (excluded in tsconfig.json).

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove legacy CDN-React flat files"
```

---

### Task 17: Connect Vercel (manual steps)

No files — these are one-time UI steps in the Vercel dashboard.

- [ ] **Step 1: Push branch to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Connect repo to Vercel**

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import the GitHub repo (`Netflix_Wedding_WebApp` or whatever name it has)
3. Framework preset: **Next.js** (auto-detected)
4. Build command: `npm run build` (auto-detected)
5. Output directory: `out` (set this manually — Vercel may default to `.next`)
6. Click **Deploy**

- [ ] **Step 3: Verify production deploy**

After the first deploy, Vercel gives you a `*.vercel.app` URL. Open it and run the same smoke test from Task 14 Step 5.

- [ ] **Step 4: Verify PR preview**

Create a test branch, push a trivial change, open a PR. Vercel should automatically post a preview URL comment on the PR.
