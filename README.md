# Wedflix

A Netflix-style interactive UI for showing wedding videos. Runs as a single static HTML file — open it in a browser and it works.

## The problem

Friends of ours are getting married, and our group wanted to make them a wedding video — a set of funny Netflix-style trailers about their life. The editor in the group asked me if it'd be possible to fake the Netflix interface exactly, so we could embed the trailers inside it like you're browsing a real streaming app.

Doing that the usual way means rebuilding the whole UI by hand in After Effects — every hover, click, and transition as keyframes — a multi-hour editing session just to mimic an interface.

## The method

So I suggested a different split of the work. Instead of embedding the actual videos, the app just renders a chroma-key green plate where each trailer plays. That meant I didn't have to vibe-code a real video-streaming app, and it cut about 95% of his editing: he keys out the green in After Effects and drops the finished trailers in.

I screen-record a real click-through of the app once. The interface is genuinely interactive — no faked button presses, no keyframed UI.

## The solution

A self-contained Netflix clone: no server, no build step, no dependencies. One folder you can open locally or host anywhere static — this one's on GitHub Pages. A companion editor lets the non-technical people in the group fill in the content without touching code.

I built it in under a day, entirely vibe-coded with Claude Code.

## What's in it

Four screens, all clickable:

- **Profile picker** — who's watching, names and colors come from `data.js`
- **Home** — hero banner plus scrollable category rows with hover cards
- **Detail** — video info, match %, awards, cast, "More Like This"
- **Playback** — chroma-key green plate for the footage, with the full streaming HUD on top (scrubber, controls, Skip Intro, Up Next)

The green (`#00B140`, changeable) is the only thing that matters for compositing — key it out and the video sits underneath the HUD.

### Content editor

`editor.html` is a form UI for editing all the trailer metadata — titles, descriptions, cast, tags, awards — with validation, then exporting a ready `data.js` plus any poster images you drop in, as a ZIP. There's a dropdown to pick the featured hero, drop zones at 16:9 to match the tiles, and Hebrew/RTL support in both the editor and the app.

## Tech

- React 18 over CDN, JSX transpiled in the browser by Babel standalone — no bundler
- Plain CSS with custom properties
- Poster art generated procedurally per video ID, so there are no image assets to manage
- Fonts: Anton, Heebo (Hebrew), Helvetica Neue
- Built with [Claude Code](https://claude.ai/code), hosted on GitHub Pages

## Run it

```bash
# just open it
open index.html

# or with live-reload
npx serve .
```

## After Effects workflow

1. Open `index.html` and go to a video's playback screen
2. The viewport fills with `#00B140` where the footage goes
3. Screen-record the full session
4. In After Effects, key out the green and place the real footage under the UI layer
5. Done — real interaction, captured once, no UI animation
