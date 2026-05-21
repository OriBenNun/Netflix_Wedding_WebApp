# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build Netflix-style wedding video showcase ("Wedflix"). Open `Wedflix.html` directly in a browser — no server, no npm, no bundler. React 18 + Babel standalone are loaded via CDN; JSX is transpiled in-browser at runtime.

## Running the app

Open `Wedflix.html` in any modern browser. No build step.

For local development with live-reload, any static file server works:
```
npx serve .
# or
python -m http.server
```

## File architecture

All logic is split across 6 files loaded by `Wedflix.html` in order:

| File | Role |
|---|---|
| `data.js` | All content: 20 trailers, 5 profiles, 7 row definitions, `posterGradient()` helper. Edit this to swap in real wedding content. |
| `tweaks-panel.jsx` | Generic tweaks UI shell (`TweaksPanel`, `useTweaks`, all `Tweak*` controls). Protocol-aware: communicates with Claude Design host via `postMessage`. |
| `components.jsx` | Shared UI: `Header`, `Tile`, `TileArt`, `Top10Tile`, `Row`, `HoverCard`, `Icon` map. All exported onto `window`. |
| `screens.jsx` | Four full screens: `ProfileScreen`, `HomeScreen`, `DetailScreen`, `PlaybackScreen`. All exported onto `window`. |
| `app.jsx` | Root `App` component: routing state, `useTweaks` wiring, `navTo()`, `toggleMyList()`, renders the tweaks panel. |
| `styles.css` | All CSS. CSS custom properties on `:root` (`--brand`, `--green-screen`, etc.) are mutated at runtime by `app.jsx`. |

Components communicate via props only — no context, no global state store. `window` is used as a poor-man's module system (each file assigns its exports to `window`).

## Navigation model

`screen` state in `App` is one of `'profile' | 'home' | 'detail' | 'playback'`. `navTo(screen, trailerId?)` is passed down as a prop. There is no URL routing.

## Customizing content

Edit `data.js`:
- `trailers[]` — swap placeholder titles, descriptions, cast, tags, awards
- `rows[]` — reorder/rename category rows and which trailer IDs appear
- `profiles[]` — rename profiles and colors
- `posterGradient(id)` — drives procedural poster art; deterministic from trailer `id`

## Tweaks panel

Activated from the Claude Design toolbar (postMessage protocol). Controls: brand accent color, wordmark text, HUD density (`minimal`/`standard`/`loaded`), green screen color, featured hero trailer. Defaults live in `WEDFLIX_DEFAULTS` in `app.jsx`.

## Playback / green screen

`PlaybackScreen` renders a solid chroma-key green (`#00B140` by default, overridable via tweaks) where real footage goes. After Effects compositing replaces that color with actual video. HUD auto-hides after 3s; mouse-move reveals it. ESC exits playback.
