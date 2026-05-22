# Image Thumbnails + Non-Developer Content Editor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real image thumbnails to every trailer tile and build a standalone `editor.html` that lets non-developers edit all Wedflix content and export a ZIP with updated `data.js` + images.

**Architecture:** `images/` folder holds JPGs named by trailer ID (`t01.jpg`–`t20.jpg`). `data.js` gains an optional `image` field per trailer; `TileArt` in `components.jsx` renders `<img>` when present and falls back to the existing procedural gradient otherwise. `editor.html` is a standalone React+Babel page (no build step) that loads `data.js`, lets non-developers edit trailers/categories/profiles, and exports a ZIP via JSZip.

**Tech Stack:** React 18 + Babel standalone (CDN), JSZip 3.x (CDN), HTML5 drag-and-drop API, PowerShell `Invoke-WebRequest` for image download.

---

## File map

| Action | File | Purpose |
|---|---|---|
| Create | `images/t01.jpg` … `images/t20.jpg` | Placeholder Netflix-style poster images |
| Modify | `data.js` | Add `image: 'images/tXX.jpg'` field to each trailer |
| Modify | `components.jsx` lines 102–194 | `TileArt` renders `<img>` when `trailer.image` is set |
| Create | `editor.html` | Standalone non-developer content editor |

---

## Task 1: Fetch 20 placeholder poster images

**Files:**
- Create: `images/` folder
- Create: `images/t01.jpg` through `images/t20.jpg`

- [ ] **Step 1: Create the images folder**

```powershell
New-Item -ItemType Directory -Path "images" -Force
```

- [ ] **Step 2: Use WebSearch to find TMDB poster image URLs**

Search for TMDB poster image CDN URLs for these 20 Netflix titles (one search per title or batch):
`Stranger Things TMDB poster_path`, `Squid Game TMDB poster_path`, etc.

TMDB image CDN base URL: `https://image.tmdb.org/t/p/w300/{poster_path}`

Target titles (map in order t01–t20):

| ID | Title to search |
|---|---|
| t01 | Stranger Things |
| t02 | Squid Game |
| t03 | The Crown |
| t04 | Wednesday Netflix |
| t05 | Bridgerton |
| t06 | Narcos |
| t07 | Ozark |
| t08 | Dark Netflix |
| t09 | Money Heist La Casa de Papel |
| t10 | The Witcher Netflix |
| t11 | Emily in Paris |
| t12 | Tiger King |
| t13 | The Queen's Gambit |
| t14 | Bird Box |
| t15 | Lupin Netflix |
| t16 | Shadow and Bone |
| t17 | Outer Banks Netflix |
| t18 | You Netflix |
| t19 | Cobra Kai |
| t20 | Mindhunter |

- [ ] **Step 3: Download all 20 images**

For each found URL, run (replace URL and filename):

```powershell
Invoke-WebRequest -Uri "https://image.tmdb.org/t/p/w300/POSTER_PATH.jpg" -OutFile "images/t01.jpg"
```

Run all 20 as a batch. Verify each file exists and is non-zero:

```powershell
Get-ChildItem images/ | Select-Object Name, Length
```

Expected: 20 files, each > 5000 bytes.

If any TMDB URL fails or is unavailable, use this fallback for that slot (replace `NN` with the ID number and `Title` with URL-encoded title):

```powershell
Invoke-WebRequest -Uri "https://placehold.co/300x450/141414/e50914?text=WEDFLIX" -OutFile "images/tNN.jpg"
```

- [ ] **Step 4: Commit**

```bash
git add images/
git commit -m "feat: add placeholder poster images (t01-t20)"
```

---

## Task 2: Add image fields to data.js

**Files:**
- Modify: `data.js`

- [ ] **Step 1: Add `image` field to every trailer**

In `data.js`, update each trailer object to include `image: 'images/tXX.jpg'` where `XX` matches the trailer's `id`. Example for first three:

```js
{ id: 't01', title: 'How They Met', image: 'images/t01.jpg', year: 2016, ... },
{ id: 't02', title: 'The Proposal: Directors Cut', image: 'images/t02.jpg', year: 2023, ... },
{ id: 't03', title: 'Bachelorette: Vegas Heist', image: 'images/t03.jpg', year: 2024, ... },
```

Apply to all 20 trailers (`t01` through `t20`). The `image` field should come right after `id` and `title` for readability.

- [ ] **Step 2: Verify data.js still parses**

Open `index.html` in a browser (or run `npx serve .` and visit localhost). The site should still load on the Profile screen without errors. Images won't show yet — `TileArt` still renders gradients. Check browser console: zero errors.

No commit yet — commit together with Task 3.

---

## Task 3: Update TileArt to render images

**Files:**
- Modify: `components.jsx` lines 102–194

- [ ] **Step 1: Replace the TileArt function opening**

Current code at line 102:

```jsx
function TileArt({ trailer, brand, large, noTitle }) {
  const data = window.WEDFLIX_DATA;
  // Hash id → template (0–2) + secondary hue offset.
  let h = 0;
  for (let i = 0; i < trailer.id.length; i++) h = (h * 31 + trailer.id.charCodeAt(i)) % 360;
```

Replace with:

```jsx
function TileArt({ trailer, brand, large, noTitle }) {
  if (trailer.image) {
    return (
      <div className="tile-art" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        <img
          src={trailer.image}
          alt={trailer.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    );
  }

  const data = window.WEDFLIX_DATA;
  // Hash id → template (0–2) + secondary hue offset.
  let h = 0;
  for (let i = 0; i < trailer.id.length; i++) h = (h * 31 + trailer.id.charCodeAt(i)) % 360;
```

This early-return pattern leaves all gradient fallback code untouched.

- [ ] **Step 2: Verify images render**

Open `index.html` in browser (or reload local server). On the Home screen, all tile cards should now show the poster images instead of the gradient art. Check:
- Row tiles show images correctly (object-fit: cover, no distortion)
- Hero banner still shows correctly (it uses a different component — check `screens.jsx` for hero rendering; if it also uses `TileArt` with `large` prop, the image will show there too)
- Hover cards still work
- No console errors

- [ ] **Step 3: Commit tasks 2 and 3 together**

```bash
git add data.js components.jsx
git commit -m "feat: add image thumbnails to trailer tiles"
```

---

## Task 4: Build editor.html — shell, state, CDN setup

**Files:**
- Create: `editor.html`

- [ ] **Step 1: Create editor.html with CDN scripts and base layout**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Wedflix Editor</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <script src="data.js"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f0f0f; color: #e5e5e5; min-height: 100vh; }
    .editor-header { background: #141414; border-bottom: 1px solid #333; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
    .editor-header h1 { font-size: 20px; font-weight: 700; color: #e50914; letter-spacing: 0.05em; }
    .editor-header .instructions { font-size: 12px; color: #999; max-width: 500px; line-height: 1.5; }
    .tab-nav { display: flex; gap: 4px; background: #1a1a1a; border-bottom: 1px solid #333; padding: 0 24px; }
    .tab-nav button { padding: 12px 20px; background: none; border: none; color: #999; font-size: 14px; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s; }
    .tab-nav button.active { color: #fff; border-bottom-color: #e50914; }
    .tab-nav button:hover:not(.active) { color: #ccc; }
    .tab-content { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .export-btn { background: #e50914; color: white; border: none; padding: 10px 24px; font-size: 14px; font-weight: 700; border-radius: 4px; cursor: pointer; letter-spacing: 0.05em; }
    .export-btn:hover { background: #f40612; }
    .export-btn:disabled { background: #666; cursor: not-allowed; }
    input[type=text], input[type=number], select, textarea { background: #2a2a2a; border: 1px solid #444; color: #e5e5e5; border-radius: 4px; padding: 6px 10px; font-size: 13px; width: 100%; outline: none; }
    input[type=text]:focus, input[type=number]:focus, select:focus, textarea:focus { border-color: #e50914; }
    textarea { resize: vertical; min-height: 80px; font-family: inherit; }
    label { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px; }
    .field { margin-bottom: 12px; }
    .field.error input, .field.error textarea { border-color: #e50914; }
    .char-count { font-size: 10px; color: #666; text-align: right; margin-top: 2px; }
    .btn-secondary { background: #2a2a2a; color: #ccc; border: 1px solid #444; padding: 6px 14px; font-size: 12px; font-weight: 600; border-radius: 4px; cursor: pointer; }
    .btn-secondary:hover { background: #333; color: #fff; }
    .btn-danger { background: transparent; color: #e50914; border: 1px solid #e50914; padding: 5px 12px; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer; }
    .btn-danger:hover { background: #e50914; color: #fff; }
    .validation-error { background: #2a0a0a; border: 1px solid #e50914; color: #ff6b6b; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px; font-size: 13px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useRef, useCallback } = React;

    // ---- STATE INIT ----
    function initState() {
      const d = window.WEDFLIX_DATA;
      return {
        trailers: d.trailers.map(t => ({
          ...t,
          tags: Array.isArray(t.tags) ? t.tags.join(', ') : t.tags,
          cast: Array.isArray(t.cast) ? t.cast.join(', ') : t.cast,
          genres: Array.isArray(t.genres) ? t.genres.join(', ') : t.genres,
        })),
        rows: d.rows.map(r => ({ ...r, ids: [...r.ids] })),
        profiles: d.profiles.map(p => ({ ...p })),
        imageFiles: {},
      };
    }

    // ---- PLACEHOLDER — remaining components added in Tasks 5-8 ----
    function App() {
      const [state, setState] = useState(initState);
      const [tab, setTab] = useState('trailers');
      const [errors, setErrors] = useState([]);

      return (
        <div>
          <div className="editor-header">
            <div>
              <h1>WEDFLIX EDITOR</h1>
            </div>
            <div className="instructions">
              Edit content below, then click <strong>Export ZIP</strong>.
              Unzip and copy <code>data.js</code> + <code>images/</code> into the Netflix_Wedding_WebApp folder, replacing existing files.
            </div>
            <button className="export-btn" disabled>Export ZIP</button>
          </div>
          <div className="tab-nav">
            {['trailers','categories','profiles'].map(t => (
              <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="tab-content">
            <p style={{color:'#666'}}>Loading sections… (Tasks 5–8 will add content here)</p>
          </div>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify shell loads**

Open `editor.html` in browser. Should see:
- Black background with red "WEDFLIX EDITOR" header
- Three tab buttons (Trailers, Categories, Profiles)
- Disabled "Export ZIP" button
- No console errors

- [ ] **Step 3: Commit shell**

```bash
git add editor.html
git commit -m "feat: add editor.html shell with CDN setup"
```

---

## Task 5: Trailers section

**Files:**
- Modify: `editor.html` — replace the `<script type="text/babel">` block content

- [ ] **Step 1: Add ImageDropZone component** (inside the `<script type="text/babel">` block, before `App`)

```jsx
function ImageDropZone({ trailerId, existingImage, imagePreview, onImageDrop }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onImageDrop(trailerId, file, e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const previewSrc = imagePreview || existingImage;

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      style={{
        width: '100%', aspectRatio: '2/3', background: '#1a1a1a',
        border: `2px dashed ${dragging ? '#e50914' : '#444'}`,
        borderRadius: 4, cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative',
      }}
    >
      {previewSrc
        ? <img src={previewSrc} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
        : <span style={{ fontSize: 11, color: '#666', textAlign: 'center', padding: 8 }}>
            Drop image<br/>or click
          </span>
      }
      <input
        ref={inputRef} type="file" accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => processFile(e.target.files[0])}
      />
    </div>
  );
}
```

- [ ] **Step 2: Add TrailerCard component** (after ImageDropZone, before App)

```jsx
const RATINGS = ['TV-G','TV-PG','TV-14','TV-MA','G','PG','PG-13','R'];

function TrailerCard({ trailer, imagePreview, onUpdate, onImageDrop, onRemove, allIds }) {
  const update = (field, val) => onUpdate(trailer.id, field, val);
  const descLen = (trailer.desc || '').length;

  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #333', borderRadius: 8,
      padding: 16, display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16,
    }}>
      <div>
        <ImageDropZone
          trailerId={trailer.id}
          existingImage={trailer.image}
          imagePreview={imagePreview}
          onImageDrop={onImageDrop}
        />
        <div style={{ marginTop: 8, fontSize: 10, color: '#555', textAlign: 'center' }}>
          {trailer.id}
        </div>
      </div>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px', gap: 8, marginBottom: 8 }}>
          <div className="field">
            <label>Title *</label>
            <input type="text" value={trailer.title || ''} onChange={e => update('title', e.target.value)} />
          </div>
          <div className="field">
            <label>Year</label>
            <input type="number" value={trailer.year || ''} onChange={e => update('year', Number(e.target.value))} />
          </div>
          <div className="field">
            <label>Mins</label>
            <input type="number" value={trailer.mins || ''} onChange={e => update('mins', Number(e.target.value))} />
          </div>
          <div className="field">
            <label>Rating</label>
            <select value={trailer.rating || 'TV-PG'} onChange={e => update('rating', e.target.value)}>
              {RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Description * <span style={{color: descLen > 200 ? '#e50914' : '#555'}}>{descLen}/200</span></label>
          <textarea value={trailer.desc || ''} onChange={e => update('desc', e.target.value)} style={{ minHeight: 60 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div className="field">
            <label>Cast (comma-separated)</label>
            <input type="text" value={trailer.cast || ''} onChange={e => update('cast', e.target.value)} />
          </div>
          <div className="field">
            <label>Tags (comma-separated)</label>
            <input type="text" value={trailer.tags || ''} onChange={e => update('tags', e.target.value)} />
          </div>
          <div className="field">
            <label>Genres (comma-separated)</label>
            <input type="text" value={trailer.genres || ''} onChange={e => update('genres', e.target.value)} />
          </div>
          <div className="field">
            <label>Match %</label>
            <input type="number" min={0} max={100} value={trailer.match || ''} onChange={e => update('match', Number(e.target.value))} />
          </div>
          <div className="field">
            <label>Award</label>
            <input type="text" value={trailer.award || ''} onChange={e => update('award', e.target.value)} />
          </div>
          <div className="field">
            <label>Award Subtitle</label>
            <input type="text" value={trailer.awardSub || ''} onChange={e => update('awardSub', e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: 8, textAlign: 'right' }}>
          <button className="btn-danger" onClick={() => { if (confirm(`Remove "${trailer.title}"?`)) onRemove(trailer.id); }}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add TrailersSection component** (after TrailerCard, before App)

```jsx
function nextTrailerId(trailers) {
  const nums = trailers.map(t => parseInt(t.id.replace('t',''), 10)).filter(n => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 20;
  return `t${String(max + 1).padStart(2, '0')}`;
}

function TrailersSection({ trailers, imageFiles, onUpdateTrailer, onImageDrop, onAddTrailer, onRemoveTrailer }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Trailers ({trailers.length})</h2>
        <button className="btn-secondary" onClick={onAddTrailer}>+ Add Trailer</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(560px, 1fr))', gap: 16 }}>
        {trailers.map(t => (
          <TrailerCard
            key={t.id}
            trailer={t}
            imagePreview={imageFiles[t.id]?.dataUrl}
            onUpdate={onUpdateTrailer}
            onImageDrop={onImageDrop}
            onRemove={onRemoveTrailer}
            allIds={trailers.map(x => x.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire TrailersSection into App**

Replace the `App` function with:

```jsx
function App() {
  const [state, setState] = useState(initState);
  const [tab, setTab] = useState('trailers');

  const updateTrailer = (id, field, val) => {
    setState(s => ({ ...s, trailers: s.trailers.map(t => t.id === id ? { ...t, [field]: val } : t) }));
  };

  const handleImageDrop = (trailerId, file, dataUrl) => {
    setState(s => ({ ...s, imageFiles: { ...s.imageFiles, [trailerId]: { file, dataUrl } } }));
  };

  const addTrailer = () => {
    const id = nextTrailerId(state.trailers);
    setState(s => ({
      ...s,
      trailers: [...s.trailers, {
        id, title: 'New Trailer', year: new Date().getFullYear(),
        mins: 4, rating: 'TV-PG', tags: '', cast: '', genres: '',
        match: 90, award: '', awardSub: '', desc: '', image: '',
      }]
    }));
  };

  const removeTrailer = (id) => {
    setState(s => ({
      ...s,
      trailers: s.trailers.filter(t => t.id !== id),
      rows: s.rows.map(r => ({ ...r, ids: r.ids.filter(rid => rid !== id) })),
    }));
  };

  return (
    <div>
      <div className="editor-header">
        <div><h1>WEDFLIX EDITOR</h1></div>
        <div className="instructions">
          Edit content, then click <strong>Export ZIP</strong>. Unzip and copy <code>data.js</code> + <code>images/</code> into the Netflix_Wedding_WebApp folder.
        </div>
        <button className="export-btn" disabled>Export ZIP</button>
      </div>
      <div className="tab-nav">
        {['trailers','categories','profiles'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'trailers' && ` (${state.trailers.length})`}
            {t === 'categories' && ` (${state.rows.length})`}
            {t === 'profiles' && ` (${state.profiles.filter(p => !p.add).length})`}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tab === 'trailers' && (
          <TrailersSection
            trailers={state.trailers}
            imageFiles={state.imageFiles}
            onUpdateTrailer={updateTrailer}
            onImageDrop={handleImageDrop}
            onAddTrailer={addTrailer}
            onRemoveTrailer={removeTrailer}
          />
        )}
        {tab === 'categories' && <p style={{color:'#666'}}>Categories section — Task 6</p>}
        {tab === 'profiles' && <p style={{color:'#666'}}>Profiles section — Task 7</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify trailers section**

Open `editor.html`. Trailers tab should show:
- Grid of 20 trailer cards
- Each card: image drop zone (showing existing poster if `images/t01.jpg` etc. are present) + all text fields pre-populated
- "+ Add Trailer" button adds a new blank card
- "Remove" button with confirmation removes a card
- No console errors

- [ ] **Step 6: Commit**

```bash
git add editor.html
git commit -m "feat: editor trailers section with image drop zones"
```

---

## Task 6: Categories section

**Files:**
- Modify: `editor.html`

- [ ] **Step 1: Add CategoriesSection component** (after TrailersSection, before App)

```jsx
function CategoriesSection({ rows, trailers, onUpdateRows }) {
  const [dragIdx, setDragIdx] = useState(null);

  const updateRowTitle = (rowId, title) => {
    onUpdateRows(rows.map(r => r.id === rowId ? { ...r, title } : r));
  };

  const updateRowIds = (rowId, ids) => {
    onUpdateRows(rows.map(r => r.id === rowId ? { ...r, ids } : r));
  };

  const toggleTop10 = (rowId) => {
    onUpdateRows(rows.map(r => r.id === rowId ? { ...r, top10: !r.top10 } : r));
  };

  const addRow = () => {
    const nums = rows.map(r => parseInt(r.id.replace('r',''), 10)).filter(n => !isNaN(n));
    const nextNum = nums.length ? Math.max(...nums) + 1 : rows.length + 1;
    onUpdateRows([...rows, { id: `r${nextNum}`, title: 'New Category', ids: [] }]);
  };

  const removeRow = (rowId) => {
    if (confirm('Remove this category?')) onUpdateRows(rows.filter(r => r.id !== rowId));
  };

  const handleDragStart = (i) => setDragIdx(i);
  const handleDrop = (i) => {
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); return; }
    const next = [...rows];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    onUpdateRows(next);
    setDragIdx(null);
  };

  const trailerMap = Object.fromEntries(trailers.map(t => [t.id, t.title]));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Categories ({rows.length})</h2>
        <button className="btn-secondary" onClick={addRow}>+ Add Category</button>
      </div>
      <p style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>Drag rows to reorder. Click a trailer chip to remove it from the category. Use the dropdown to add trailers.</p>
      {rows.map((row, i) => (
        <div
          key={row.id}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(i)}
          style={{
            background: '#1a1a1a', border: '1px solid #333', borderRadius: 8,
            padding: 16, marginBottom: 12, cursor: 'grab',
            opacity: dragIdx === i ? 0.5 : 1,
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: '#555', fontSize: 18 }}>⠿</span>
            <input
              type="text"
              value={row.title}
              onChange={e => updateRowTitle(row.id, e.target.value)}
              style={{ flex: 1, fontWeight: 600 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', textTransform: 'none', letterSpacing: 0 }}>
              <input type="checkbox" checked={!!row.top10} onChange={() => toggleTop10(row.id)} />
              Top 10 style
            </label>
            <button className="btn-danger" onClick={() => removeRow(row.id)}>Remove</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {row.ids.map(tid => (
              <span
                key={tid}
                title="Click to remove"
                onClick={() => updateRowIds(row.id, row.ids.filter(id => id !== tid))}
                style={{
                  background: '#2a2a2a', border: '1px solid #444', borderRadius: 16,
                  padding: '3px 10px', fontSize: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                {trailerMap[tid] || tid} <span style={{ color: '#e50914' }}>×</span>
              </span>
            ))}
          </div>
          <select
            value=""
            onChange={e => {
              if (!e.target.value) return;
              if (!row.ids.includes(e.target.value))
                updateRowIds(row.id, [...row.ids, e.target.value]);
              e.target.value = '';
            }}
            style={{ width: 'auto', minWidth: 200 }}
          >
            <option value="">+ Add trailer to category…</option>
            {trailers.filter(t => !row.ids.includes(t.id)).map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Wire into App**

In the `App` function, add the `updateRows` handler and replace the categories placeholder:

Add handler (inside App, after `removeTrailer`):

```jsx
const updateRows = (rows) => setState(s => ({ ...s, rows }));
```

Replace `{tab === 'categories' && <p style={{color:'#666'}}>Categories section — Task 6</p>}` with:

```jsx
{tab === 'categories' && (
  <CategoriesSection
    rows={state.rows}
    trailers={state.trailers}
    onUpdateRows={updateRows}
  />
)}
```

- [ ] **Step 3: Verify categories section**

Open `editor.html`, click Categories tab:
- 7 rows listed, each showing title + trailer chips
- Drag a row — it reorders
- Click a chip — it removes the trailer from the row
- Add trailer dropdown works
- "+ Add Category" adds a new empty row
- "Remove" with confirm removes the row

- [ ] **Step 4: Commit**

```bash
git add editor.html
git commit -m "feat: editor categories section with drag-to-reorder"
```

---

## Task 7: Profiles section

**Files:**
- Modify: `editor.html`

- [ ] **Step 1: Add ProfilesSection component** (after CategoriesSection, before App)

```jsx
function ProfilesSection({ profiles, onUpdateProfiles }) {
  const updateProfile = (id, field, val) => {
    onUpdateProfiles(profiles.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  const addProfile = () => {
    const nums = profiles.map(p => parseInt(p.id.replace('p',''), 10)).filter(n => !isNaN(n));
    const nextNum = nums.length ? Math.max(...nums) + 1 : profiles.length + 1;
    onUpdateProfiles([...profiles.filter(p => !p.add), {
      id: `p${nextNum}`, name: 'New Profile', color: '#6b7280',
    }, profiles.find(p => p.add)].filter(Boolean));
  };

  const removeProfile = (id) => {
    if (confirm('Remove this profile?')) onUpdateProfiles(profiles.filter(p => p.id !== id));
  };

  const editableProfiles = profiles.filter(p => !p.add);
  const addEntry = profiles.find(p => p.add);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Profiles ({editableProfiles.length})</h2>
        <button className="btn-secondary" onClick={addProfile}>+ Add Profile</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {editableProfiles.map(p => (
          <div key={p.id} style={{
            background: '#1a1a1a', border: '1px solid #333', borderRadius: 8,
            padding: 16, display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 6, background: p.color,
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700, color: 'white',
            }}>
              {(p.name || '?')[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="field" style={{ marginBottom: 8 }}>
                <label>Name</label>
                <input type="text" value={p.name || ''} onChange={e => updateProfile(p.id, 'name', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div className="field" style={{ marginBottom: 0, flex: 1 }}>
                  <label>Color</label>
                  <input type="color" value={p.color || '#888888'} onChange={e => updateProfile(p.id, 'color', e.target.value)}
                    style={{ height: 32, padding: 2, cursor: 'pointer', width: '100%' }} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#888', textTransform: 'none', letterSpacing: 0, marginTop: 14 }}>
                  <input type="checkbox" checked={!!p.kid} onChange={e => updateProfile(p.id, 'kid', e.target.checked)} />
                  Kids
                </label>
              </div>
            </div>
            <button className="btn-danger" style={{ alignSelf: 'flex-start' }} onClick={() => removeProfile(p.id)}>×</button>
          </div>
        ))}
      </div>
      {addEntry && (
        <p style={{ marginTop: 16, fontSize: 12, color: '#555' }}>
          The "+ Add Profile" entry is always shown in the app; it is not editable here.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire into App**

Add handler inside App (after `updateRows`):

```jsx
const updateProfiles = (profiles) => setState(s => ({ ...s, profiles }));
```

Replace `{tab === 'profiles' && <p style={{color:'#666'}}>Profiles section — Task 7</p>}` with:

```jsx
{tab === 'profiles' && (
  <ProfilesSection
    profiles={state.profiles}
    onUpdateProfiles={updateProfiles}
  />
)}
```

- [ ] **Step 3: Verify profiles section**

Open `editor.html`, Profiles tab:
- 4 editable profile cards (The Bride, The Groom, Bridesmaids, Kids)
- Avatar shows first letter in the profile color
- Name editable, color picker works (avatar updates live)
- Kids checkbox visible
- "+ Add Profile" adds a new card
- "×" removes with confirm

- [ ] **Step 4: Commit**

```bash
git add editor.html
git commit -m "feat: editor profiles section"
```

---

## Task 8: serializeData() + ZIP export

**Files:**
- Modify: `editor.html`

- [ ] **Step 1: Add serializeData function** (at top of `<script type="text/babel">`, after `const { useState, useRef, useCallback } = React;`)

```jsx
function splitCsv(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

function serializeData(state) {
  const { trailers, rows, profiles, imageFiles } = state;

  const trailersJs = trailers.map(t => {
    const hasImage = imageFiles[t.id] || t.image;
    const imageField = hasImage ? `\n    image: 'images/${t.id}.jpg',` : '';
    const tags = JSON.stringify(splitCsv(t.tags));
    const cast = JSON.stringify(splitCsv(t.cast));
    const genres = JSON.stringify(splitCsv(t.genres));
    return (
      `    { id: '${t.id}', title: ${JSON.stringify(t.title)}, year: ${Number(t.year) || 2024}, mins: ${Number(t.mins) || 4}, rating: '${t.rating || 'TV-PG'}', tags: ${tags}, match: ${Number(t.match) || 90}, award: ${JSON.stringify(t.award || '')}, awardSub: ${JSON.stringify(t.awardSub || '')}, desc: ${JSON.stringify(t.desc || '')}, cast: ${cast}, genres: ${genres}${imageField} }`
    );
  }).join(',\n');

  const rowsJs = rows.map(r => {
    const top10Part = r.top10 ? `, top10: true` : '';
    return `    { id: '${r.id}', title: ${JSON.stringify(r.title)}, ids: ${JSON.stringify(r.ids)}${top10Part} }`;
  }).join(',\n');

  const profilesJs = profiles.map(p => {
    const extras = [
      p.kid ? `kid: true` : null,
      p.add ? `add: true` : null,
    ].filter(Boolean).map(e => `, ${e}`).join('');
    return `    { id: '${p.id}', name: ${JSON.stringify(p.name)}, color: '${p.color}'${extras} }`;
  }).join(',\n');

  const gradientFn = `  posterGradient(id) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
    const h2 = (h + 40) % 360;
    return \`linear-gradient(135deg, oklch(0.35 0.18 \${h}) 0%, oklch(0.18 0.12 \${h2}) 100%)\`;
  },`;

  return `// Wedflix trailer data — edit via editor.html, then export ZIP.\n// Edit titles/descriptions/tags to match the actual filmed trailers.\n\nwindow.WEDFLIX_DATA = {\n  profiles: [\n${profilesJs}\n  ],\n\n  trailers: [\n${trailersJs}\n  ],\n\n  rows: [\n${rowsJs}\n  ],\n\n  // Procedurally generated tile gradient — fallback when no image is set.\n${gradientFn}\n};\n`;
}
```

- [ ] **Step 2: Add validate function** (after serializeData)

```jsx
function validate(state) {
  const errors = [];
  state.trailers.forEach(t => {
    if (!t.title || !t.title.trim()) errors.push(`Trailer ${t.id}: title is required`);
    if (!t.desc || !t.desc.trim()) errors.push(`Trailer ${t.id} ("${t.title || 'untitled'}"): description is required`);
  });
  state.rows.forEach(r => {
    if (!r.title || !r.title.trim()) errors.push(`Category ${r.id}: title is required`);
  });
  return errors;
}
```

- [ ] **Step 3: Add exportZip function** (after validate)

```jsx
async function exportZip(state) {
  const zip = new JSZip();
  zip.file('data.js', serializeData(state));
  const imgFolder = zip.folder('images');
  for (const [trailerId, { file }] of Object.entries(state.imageFiles)) {
    const ext = file.name.split('.').pop() || 'jpg';
    imgFolder.file(`${trailerId}.${ext}`, file);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wedflix-content.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 4: Wire export into App**

In the App function, add state and handler:

```jsx
const [exportErrors, setExportErrors] = useState([]);

const handleExport = async () => {
  const errs = validate(state);
  if (errs.length) { setExportErrors(errs); return; }
  setExportErrors([]);
  await exportZip(state);
};
```

Replace the disabled Export ZIP button in the header with:

```jsx
<button className="export-btn" onClick={handleExport}>Export ZIP</button>
```

Add error display inside the tab content area, before the section components:

```jsx
{exportErrors.length > 0 && (
  <div className="validation-error">
    <strong>Please fix before exporting:</strong>
    <ul style={{ marginTop: 6, paddingLeft: 18 }}>
      {exportErrors.map((e, i) => <li key={i}>{e}</li>)}
    </ul>
  </div>
)}
```

- [ ] **Step 5: Verify export**

Open `editor.html`. Click "Export ZIP":
- If validation passes: `wedflix-content.zip` downloads
- Unzip it — verify it contains `data.js` + `images/` folder
- Open the unzipped `data.js` — it should be valid JS with all 20 trailers, rows, profiles
- Copy the unzipped files into the repo folder
- Open `index.html` — app loads with correct data, no errors

Test validation: clear a trailer title, click Export — error message appears listing the problem.

- [ ] **Step 6: Commit**

```bash
git add editor.html
git commit -m "feat: editor ZIP export with validation"
```

---

## Task 9: Final verification + polish

**Files:**
- Modify: `editor.html` (minor CSS tweaks only if needed)

- [ ] **Step 1: End-to-end test of full workflow**

1. Open `editor.html` in browser
2. On a trailer card, drag a new JPG onto the drop zone — confirm preview appears
3. Edit a trailer's title and description
4. In Categories, rename a row and reorder rows by drag
5. Add a new trailer via "+ Add Trailer", fill in title + description
6. In Profiles, change a profile name and color
7. Click "Export ZIP" — file downloads
8. Unzip → copy `data.js` + `images/` into repo root
9. Open `index.html` — confirm all edits are reflected, new trailer appears, images show

- [ ] **Step 2: Verify graceful fallback**

Remove the `image` field from one trailer in `data.js` temporarily. Reload `index.html` — that trailer should show the procedural gradient, others show images. Restore the field.

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete image thumbnails + non-developer content editor"
```

---

## Self-review notes

- All 9 spec requirements covered: image field in data.js ✓, TileArt fallback ✓, 20 placeholder images ✓, editor.html ✓, trailers CRUD ✓, categories CRUD + reorder ✓, profiles CRUD ✓, ZIP export ✓, validation ✓
- No TBDs or TODOs in plan
- `nextTrailerId` defined in Task 5, used in Task 5 only — no cross-task reference issues
- `splitCsv` used in `serializeData` — both defined in Task 8
- `validate` and `exportZip` both defined in Task 8 before being called
- Tags/cast/genres stored as comma strings in editor state, serialized back to arrays on export via `splitCsv` — consistent throughout
