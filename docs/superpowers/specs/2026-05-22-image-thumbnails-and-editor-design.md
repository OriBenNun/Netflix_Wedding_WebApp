# Image Thumbnails + Non-Developer Content Editor

**Date:** 2026-05-22
**Status:** Approved

## Overview

Two connected changes:

1. **Image thumbnails** — replace procedural gradient posters with real JPG/PNG files in `images/`. Graceful fallback to gradients when no image is set.
2. **editor.html** — a standalone browser-based content editor non-developers can use to edit all Wedflix content and export a ZIP containing updated `data.js` + image files.

---

## Section 1: Image system

### data.js changes

Each trailer gains an optional `image` field:

```js
{ id: 't01', title: 'How They Met', image: 'images/t01.jpg', ... }
```

- Field is optional — omitting it falls back to the existing procedural gradient.
- Path is always relative: `images/tXX.jpg`.
- Placeholder images: 20 real Netflix-style poster images (2:3 ratio, ~300px wide JPGs) fetched from TMDB public CDN, saved as `images/t01.jpg` through `images/t20.jpg`.

### TileArt changes (components.jsx)

`TileArt` checks `trailer.image` first:
- If present: renders `<img src={trailer.image} style={{ width:'100%', height:'100%', objectFit:'cover' }} />`
- If absent: existing procedural gradient logic unchanged

The `large` prop still applies (used for hero banner sizing).

### images/ folder

- Lives at repo root: `images/`
- Naming convention: `tXX.jpg` matching trailer ID (e.g. `t01.jpg`, `t20.jpg`)
- No other naming required — the `image` field in data.js is the source of truth

---

## Section 2: editor.html

A standalone file at repo root. Opens directly in any modern browser (`file://` or local server). No build step — uses CDN React 18 + Babel (same pattern as main app) + JSZip for ZIP export.

### On load

`editor.html` includes `<script src="data.js">` to pre-populate all fields from `window.WEDFLIX_DATA`. All three sections (Trailers, Categories, Profiles) are populated immediately.

### Trailers section

Grid of cards, one per trailer. Each card contains:

| Field | Control |
|---|---|
| Thumbnail | Drop zone (drag & drop JPG/PNG, or click to browse). Shows preview. |
| Title | Text input |
| Year | Number input |
| Duration (mins) | Number input |
| Rating | Select (TV-PG, TV-14, TV-MA, etc.) |
| Description | Textarea with character count |
| Cast | Text input (comma-separated) |
| Tags | Text input (comma-separated) |
| Genres | Text input (comma-separated) |
| Match % | Number input (0–100) |
| Award | Text input |
| Award subtitle | Text input |

- **Add trailer** button → appends a blank card with auto-assigned ID (`t21`, `t22`, ...).
- **Remove** button per card → confirmation prompt before deletion.
- Required fields (title, description) highlighted if empty on export attempt.

### Categories section

List of the 7 rows, each with:
- Editable row title (text input)
- Drag-to-reorder trailer list (shows trailer titles as chips; drag to reorder)
- "top10" checkbox (renders Top 10 badge style)
- Add/remove category buttons

### Profiles section

List of profiles, each with:
- Editable name
- Color picker
- "kid" checkbox
- Add/remove profile buttons

### Export flow

1. User clicks **"Export ZIP"**
2. Validation runs — any missing required fields show an error highlight; export is blocked.
3. `serializeData()` generates a new `data.js` string reconstructing `window.WEDFLIX_DATA` with all edits applied. Trailers with a dropped image get `image: 'images/tXX.jpg'`.
4. JSZip assembles: `data.js` + each dropped image as `images/tXX.jpg`.
5. Browser downloads `wedflix-content.zip`.
6. **Non-developer instructions** (shown in the UI):
   > Unzip the file. Copy `data.js` into the `Netflix_Wedding_WebApp` folder (replace existing). Copy the `images/` folder into the same location. Refresh the site.

---

## Section 3: Technical architecture

### Dependencies (CDN only)

- React 18 + ReactDOM (`unpkg.com`)
- Babel standalone (`unpkg.com`)
- JSZip 3.x (`cdnjs.cloudflare.com`)

### State shape

```js
{
  trailers: [...],   // mirrors WEDFLIX_DATA.trailers + imageFile per entry
  rows: [...],       // mirrors WEDFLIX_DATA.rows
  profiles: [...],   // mirrors WEDFLIX_DATA.profiles
  imageFiles: {      // parallel map: trailerId → File object
    't01': File,
    't03': File,
  }
}
```

`imageFiles` is kept separate from `trailers` to avoid serializing File objects.

### serializeData()

Reconstructs the `window.WEDFLIX_DATA = { ... }` JS string:
- Trailers: serialized as JS object literals. `image` field included only if an image was set (either pre-existing or newly dropped).
- `posterGradient()` function body is preserved verbatim (not editable — developer concern).
- Output is formatted with 2-space indentation for human readability.

### Image file naming

Auto-assigned: existing trailers keep their original ID-based filename (`t01.jpg`). New trailers get the next available ID (`t21.jpg`, etc.). If a user removes a trailer and adds a new one, IDs continue incrementing (no reuse) to avoid stale cache issues.

---

## Out of scope

- Adding/editing the `posterGradient()` function
- URL-based images (all images are local files)
- Multi-user editing or conflict resolution
- Deployment automation (user manually copies files)
