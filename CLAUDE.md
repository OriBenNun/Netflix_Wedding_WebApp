# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build Netflix-style wedding video showcase ("Wedflix"). Open `index.html` directly in a browser — no server, no npm, no bundler. React 18 + Babel standalone are loaded via CDN; JSX is transpiled in-browser at runtime.

## Running the app

Open `index.html` in any modern browser. No build step.

For local development with live-reload, any static file server works:
```
npx serve .
# or
python -m http.server
```

## Files

### Active (loaded by `index.html`)

| File | Role |
|---|---|
| `index.html` | Single-file app entry. Loads `data.js`, then inlines all JSX (tweaks panel, components, screens, app root) as `<script type="text/babel">` blocks. |
| `data.js` | All content: 20 trailers, 5 profiles, 7 row definitions, `posterGradient()` helper. Assigns to `window.WEDFLIX_DATA`. Edit this to swap in real wedding content. |
| `styles.css` | All CSS. CSS custom properties on `:root` (`--brand`, `--green-screen`, etc.) are mutated at runtime by the app. |
| `editor.html` | Content editor UI — lets you edit trailers/profiles/rows with form validation, then export a `data.js` + dropped images as a ZIP. |

### Legacy root files (not used by `index.html`)

`tweaks-panel.jsx`, `components.jsx`, `screens.jsx`, `app.jsx` — these are the original separate-file versions. `index.html` has their content inlined. They still exist as reference but are not loaded.

### Design sandbox (`_design/`)

Preserved original separate-file architecture used by Claude Design. Do not delete.

## Navigation model

`screen` state in `App` is one of `'profile' | 'home' | 'detail' | 'playback'`. `navTo(screen, trailerId?)` is passed down as a prop. There is no URL routing.

## Customizing content

Edit `data.js` (or use `editor.html`):
- `trailers[]` — swap placeholder titles, descriptions, cast, tags, awards
- `rows[]` — reorder/rename category rows and which trailer IDs appear
- `profiles[]` — rename profiles and colors
- `posterGradient(id)` — drives procedural poster art; deterministic from trailer `id`

## Tweaks panel

Activated from the Claude Design toolbar (postMessage protocol). Controls: brand accent color, wordmark text, HUD density (`minimal`/`standard`/`loaded`), green screen color, featured hero trailer. Defaults live in `WEDFLIX_DEFAULTS` inside `index.html`.

## Playback / green screen

`PlaybackScreen` renders a solid chroma-key green (`#00B140` by default, overridable via tweaks) where real footage goes. After Effects compositing replaces that color with actual video. HUD auto-hides after 3s; mouse-move reveals it. ESC exits playback.

## Planned: Next.js migration

A full migration plan to Next.js 15 + TypeScript + Vercel is documented at `docs/superpowers/plans/2026-05-21-nextjs-migration.md`. Not started. The migration removes the tweaks panel, hardcodes defaults, and produces a static export via `next build`.
