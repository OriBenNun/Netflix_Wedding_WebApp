// Wedflix — shared UI components: Header, Row, Tile, HoverCard, Icons

const { useState, useEffect, useRef, useMemo } = React;

// ---------- ICONS ----------
const Icon = {
  play: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M8 5v14l11-7z"/></svg>
  ),
  pause: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
  ),
  plus: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...props}><path d="M12 5v14M5 12h14"/></svg>
  ),
  check: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="4 12 10 18 20 6"/></svg>
  ),
  thumb: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h13.4a2 2 0 0 0 2-1.7l1.3-8a2 2 0 0 0-2-2.3H14V4a3 3 0 0 0-3-3l-4 9z"/></svg>
  ),
  chevDown: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9"/></svg>
  ),
  chevLeft: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6"/></svg>
  ),
  chevRight: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"/></svg>
  ),
  info: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  ),
  search: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
  ),
  bell: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/></svg>
  ),
  volume: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>
  ),
  volumeMute: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
  ),
  fullscreen: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4"/></svg>
  ),
  skipBack: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="11 19 2 12 11 5"/><polyline points="22 19 13 12 22 5"/></svg>
  ),
  skipFwd: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="13 19 22 12 13 5"/><polyline points="2 19 11 12 2 5"/></svg>
  ),
  subtitles: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="7" y1="14" x2="13" y2="14"/><line x1="15" y1="14" x2="17" y2="14"/><line x1="7" y1="10" x2="9" y2="10"/><line x1="11" y1="10" x2="17" y2="10"/></svg>
  ),
  episodes: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
};

// ---------- HEADER ----------
function Header({ screen, navTo, profile, brand, onSearch }) {
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
          <input placeholder="Titles, people, vibes…" autoFocus={searchOpen}/>
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

// ---------- TILE ART (procedural poster — varied compositions) ----------
// Three composition templates assigned deterministically by trailer id, so each
// trailer has its own visual identity even with placeholder art.
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
  const template = h % 3;
  // Pattern type also varies
  const patternType = (h >> 3) % 3; // 0 stripes, 1 dots, 2 diagonal
  const patternBg = patternType === 0
    ? 'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 14px)'
    : patternType === 1
      ? 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 2px) 0 0 / 12px 12px'
      : 'repeating-linear-gradient(45deg, rgba(0,0,0,0.12) 0 4px, transparent 4px 18px)';

  const baseStyle = {
    background: data.posterGradient(trailer.id),
    width: '100%', height: '100%',
    position: 'relative',
    display: 'flex',
    overflow: 'hidden',
  };
  const titleFs = large ? 'clamp(28px, 4vw, 56px)' : '28px';
  const titleFsSmall = large ? '34px' : '22px';

  // Common decorations
  const Pattern = () => (
    <div style={{ position: 'absolute', inset: 0, background: patternBg, pointerEvents: 'none' }} />
  );
  const Vignette = () => (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />
  );
  const Watermark = () => (
    <div style={{ position: 'absolute', top: 10, left: 12, fontFamily: 'var(--font-display)', color: brand, fontSize: large ? 22 : 14, fontWeight: 900, letterSpacing: 0, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>W</div>
  );
  const YearBadge = ({ pos = 'br' }) => (
    <div style={{ position: 'absolute', [pos[0] === 't' ? 'top' : 'bottom']: 10, [pos[1] === 'l' ? 'left' : 'right']: 12, fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.7)', fontSize: large ? 12 : 10, letterSpacing: '0.2em', fontWeight: 600 }}>{trailer.year}</div>
  );

  // Template A: Bold Center
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

  // Template B: Lower-third (poster style)
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

  // Template C: Stamped
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

// ---------- TILE ----------
function Tile({ trailer, onClick, onHover, onLeave, progress, brand }) {
  const tileRef = useRef(null);
  return (
    <div
      ref={tileRef}
      className="tile"
      onClick={onClick}
      onMouseEnter={(e) => onHover && onHover(trailer, tileRef.current)}
      onMouseLeave={onLeave}
    >
      <TileArt trailer={trailer} brand={brand} />
      {progress && <div className="tile-progress"><div className="tile-progress-fill" style={{ width: `${progress}%`, background: brand }}/></div>}
    </div>
  );
}

// ---------- TOP 10 TILE ----------
function Top10Tile({ trailer, rank, onClick, onHover, onLeave, brand }) {
  const tileRef = useRef(null);
  return (
    <div className="tile-top10">
      <div className="rank-num">{rank}</div>
      <div ref={tileRef} className="tile" onClick={onClick}
           onMouseEnter={() => onHover && onHover(trailer, tileRef.current)}
           onMouseLeave={onLeave}>
        <TileArt trailer={trailer} brand={brand} />
      </div>
    </div>
  );
}

// ---------- ROW ----------
function Row({ row, onTileClick, onTileHover, onTileLeave, brand }) {
  const scrollerRef = useRef(null);
  const data = window.WEDFLIX_DATA;
  const trailers = row.ids.map(id => data.trailers.find(t => t.id === id)).filter(Boolean);
  const isContinue = row.id === 'r1';

  const scroll = (dir) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: dir * 720, behavior: 'smooth' });
  };

  return (
    <section className="row">
      <h2 className="row-title">{row.title}</h2>
      <button className="row-arrow left" onClick={() => scroll(-1)} aria-label="scroll left"><Icon.chevLeft /></button>
      <div className="row-scroller" ref={scrollerRef}>
        {trailers.map((t, i) => {
          if (row.top10) {
            return <Top10Tile key={t.id} trailer={t} rank={i + 1}
                              onClick={() => onTileClick(t)}
                              onHover={onTileHover}
                              onLeave={onTileLeave}
                              brand={brand} />;
          }
          const progress = isContinue ? 20 + (i * 11) % 80 : null;
          return <Tile key={t.id} trailer={t}
                       onClick={() => onTileClick(t)}
                       onHover={onTileHover}
                       onLeave={onTileLeave}
                       progress={progress}
                       brand={brand} />;
        })}
      </div>
      <button className="row-arrow right" onClick={() => scroll(1)} aria-label="scroll right"><Icon.chevRight /></button>
    </section>
  );
}

// ---------- HOVER CARD ----------
function HoverCard({ trailer, rect, onClose, onPlay, onMore, brand, inMyList, toggleMyList, onMouseEnter }) {
  // Position near the source tile.
  const cardRef = useRef(null);
  const [pos, setPos] = useState(null);
  useEffect(() => {
    if (!rect) return;
    const cardW = 360;
    const tileCx = rect.left + rect.width / 2;
    let left = tileCx - cardW / 2;
    left = Math.max(20, Math.min(window.innerWidth - cardW - 20, left));
    const top = Math.max(80, rect.top - 30);
    setPos({ left, top });
  }, [rect]);

  if (!rect || !pos) return null;
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

Object.assign(window, {
  Icon, Header, Tile, Top10Tile, Row, HoverCard, TileArt,
});
