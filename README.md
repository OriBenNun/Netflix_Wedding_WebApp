# Wedflix

> A Netflix-style interactive UI for a wedding video showcase — vibe-coded with [Claude Code](https://claude.ai/code) in under a day.

![Profile picker → home → detail → playback](https://img.shields.io/badge/screens-4-red) ![No build step](https://img.shields.io/badge/build%20step-none-brightgreen) ![React 18 CDN](https://img.shields.io/badge/React-18%20CDN-61dafb)

---

## The Problem

Some friends asked me to help edit their wedding highlight videos. The plan was to screen them Netflix-style at the reception — full streaming UI, profile picker, category rows, trailer detail pages, the works.

The naive approach would have been to **fake all of that interaction inside Adobe After Effects** — animating every button press, hover state, and screen transition by hand. That's hundreds of keyframes for a UI that only needs to work for one night.

Instead, I built a real interactive web app, pointed a screen recorder at it, and used the browser as a compositing surface.

## The Solution

A fully functional Netflix clone that runs as a **single static HTML file** — no server, no npm, no build step. Open it in a browser and you have a live, clickable UI. Capture it with any screen recorder, then composite the actual video footage in After Effects using the chroma-key green screen the playback screen renders.

**The result:** real interactivity, zero After Effects animation work, and a reusable tool for anyone who wants to do the same thing.

## How It Was Built

This project was **vibe-coded with Claude Code** across a single day. The workflow was conversational: describe a screen, get working JSX back, tweak live in the browser, repeat. The app grew from a blank file to a polished 4-screen experience with a content editor and ZIP export — all without leaving the terminal.

It's a good example of what "AI-assisted development" actually looks like in practice: fast iteration on UI, instant feedback loop (no build = no wait), and the human staying in the director's seat while the model handles the boilerplate.

## What It Does

Four screens, fully interactive:

| Screen | What happens |
|---|---|
| **Profile Picker** | Choose who's watching — names and colors pulled from `data.js` |
| **Home** | Hero banner + horizontally scrollable category rows with hover cards |
| **Detail** | Trailer info, match %, awards, cast list, "More Like This" |
| **Playback** | Chroma-key green screen + full streaming HUD (scrubber, controls, Skip Intro, Up Next) |

The green screen (`#00B140` by default) is where real footage goes. In After Effects, key it out and drop the video underneath. The HUD renders on top.

## Content Editor

A companion `editor.html` lets non-technical users edit all trailer metadata — titles, descriptions, cast, tags, awards — through a form UI with validation, then export a ready-to-use `data.js` + any dropped poster images as a ZIP.

## Tech

No framework overhead. No bundler. Just the browser doing what browsers do.

| | |
|---|---|
| **UI** | React 18 via CDN — JSX transpiled in-browser by Babel standalone |
| **Styling** | CSS custom properties, no preprocessor |
| **Poster art** | Procedurally generated per trailer ID — no image assets needed |
| **Fonts** | Anton + Helvetica Neue via Google Fonts |
| **Distribution** | Drop the folder anywhere, open `index.html` |

## Quick Start

```bash
# Just open the file
open index.html

# Or with live-reload
npx serve .
```

## After Effects Workflow

1. Open `index.html`, navigate to a trailer's playback screen
2. The viewport fills with `#00B140` (chroma-key green) where the video goes
3. Screen-record the full interactive session
4. In After Effects: use the recording as the UI layer, key out the green, place real footage underneath
5. No UI animation. No fake keyframes. Just real interaction captured once.

---

*Built for [a real wedding](https://github.com/BmanStudio). Side project. One day. Fully vibe-coded.*
