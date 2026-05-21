# Wedflix

A Netflix-style wedding video showcase for displaying filmed trailers at a wedding reception. Built as a static HTML/CSS/JS app — no backend, no build step.

## Quick Start

Open `Wedflix.html` in a browser. That's it.

For a local dev server with live-reload:
```bash
npx serve .
# or
python -m http.server
```

## How It Works

The app simulates a Netflix streaming UI with 4 screens:

1. **Profile Picker** — choose who's watching
2. **Home** — hero banner + scrollable category rows of trailer tiles
3. **Detail** — trailer info, awards, cast, "More Like This"
4. **Playback** — chroma-key green screen + full streaming HUD (scrubber, controls, Skip Intro, Up Next)

The green screen is designed for **After Effects compositing** — replace `#00B140` with real footage using chroma key after the event.

## Customizing Content

All trailer data lives in `data.js`. Edit it to swap in real titles, descriptions, cast, and awards:

```js
{ id: 't01', title: 'How They Met', year: 2016, mins: 4, ... }
```

Fields per trailer: `id`, `title`, `year`, `mins`, `rating`, `tags`, `match`, `award`, `awardSub`, `desc`, `cast`, `genres`.

Row order and which trailers appear in each row are also configured in `data.js` under `rows[]`.

## Tweaks Panel

A floating tweaks panel (activated from the Claude Design toolbar) lets you adjust:
- Brand accent color and wordmark text
- HUD density: Minimal / Standard / Loaded
- Green screen color
- Featured hero trailer

## Tech Stack

| | |
|---|---|
| Framework | React 18 (CDN, no build) |
| Transpiler | Babel standalone (in-browser JSX) |
| Fonts | Anton (display), Helvetica Neue (body) via Google Fonts |
| Assets | None — poster art is procedurally generated per trailer |

## File Overview

```
Wedflix.html        Entry point
data.js             All content: trailers, profiles, rows
styles.css          All styles (CSS custom properties for theming)
components.jsx      Header, Tile, Row, HoverCard, Icons
screens.jsx         ProfileScreen, HomeScreen, DetailScreen, PlaybackScreen
app.jsx             Root app, routing, tweaks wiring
tweaks-panel.jsx    Tweaks UI shell and controls
```

## After Effects Workflow

1. Open `Wedflix.html` and navigate to a trailer's playback screen
2. The green screen (`#00B140`) fills the viewport where video goes
3. In After Effects, use the HUD overlay as a reference layer and key out the green with real footage underneath
