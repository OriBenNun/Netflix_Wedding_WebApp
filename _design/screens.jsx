// Wedflix — screen components: Profile, Home, Detail, Playback

const { useState: useStateS, useEffect: useEffectS, useRef: useRefS, useMemo: useMemoS } = React;

// ---------- PROFILE PICKER ----------
function ProfileScreen({ onPick, brand, brandText }) {
  const data = window.WEDFLIX_DATA;
  return (
    <div className="profile-screen fade-in">
      <div className="wedflix-logo" style={{ color: brand }}>{brandText}</div>
      <h1>Who's watching?</h1>
      <div className="profile-grid">
        {data.profiles.map((p) =>
        <button key={p.id} className="profile-card" onClick={() => !p.add && onPick(p)}>
            <div className={`profile-tile ${p.add ? 'add' : ''}`} style={!p.add ? { background: window.WEDFLIX_DATA.posterGradient(p.id) } : {}}>
              {p.add ? '+' : p.name[0]}
            </div>
            <div className="profile-name">{p.name.replace('+ Add Profile', 'Add Profile')}</div>
            {p.kid && <div className="profile-kid-tag">Kids</div>}
          </button>
        )}
      </div>
      <button className="manage-btn">Manage Profiles</button>
    </div>);

}

// ---------- HOME ----------
function HomeScreen({ profile, navTo, brand, brandText, heroId, myList, toggleMyList }) {
  const data = window.WEDFLIX_DATA;
  const hero = data.trailers.find((t) => t.id === heroId) || data.trailers[1];
  const [hover, setHover] = useStateS(null); // { trailer, rect }
  const hoverTimerRef = useRefS(null);
  const leaveTimerRef = useRefS(null);

  const showHover = (trailer, el) => {
    clearTimeout(leaveTimerRef.current);
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      setHover({ trailer, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } });
    }, 280);
  };
  const hideHover = () => {
    clearTimeout(hoverTimerRef.current);
    leaveTimerRef.current = setTimeout(() => setHover(null), 220);
  };
  const cancelHide = () => clearTimeout(leaveTimerRef.current);

  return (
    <div className="home-screen fade-in">
      <Header screen="home" navTo={navTo} profile={profile} brand={brandText} />

      <section className="hero">
        <div className="hero-bg">
          <TileArt trailer={hero} brand={brand} large noTitle />
        </div>
        <div className="hero-content">
          <div className="hero-badge"><span className="w-mark" style={{ color: brand }}>W</span> WEDFLIX ORIGINAL TRAILER</div>
          <h1 className="hero-title" style={{ letterSpacing: "1.1px", lineHeight: "1.1" }}>{hero.title}</h1>
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
        {data.rows.map((row) =>
        <Row key={row.id} row={row}
        onTileClick={(t) => navTo('detail', t.id)}
        onTileHover={showHover}
        onTileLeave={hideHover}
        brand={brand} />
        )}
      </div>

      {hover &&
      <HoverCard
        trailer={hover.trailer}
        rect={hover.rect}
        onClose={hideHover}
        onMouseEnter={cancelHide}
        onPlay={() => navTo('playback', hover.trailer.id)}
        onMore={() => navTo('detail', hover.trailer.id)}
        brand={brand}
        inMyList={myList.includes(hover.trailer.id)}
        toggleMyList={() => toggleMyList(hover.trailer.id)} />

      }
    </div>);

}

// ---------- DETAIL ----------
function DetailScreen({ trailerId, profile, navTo, brand, brandText, myList, toggleMyList }) {
  const data = window.WEDFLIX_DATA;
  const t = data.trailers.find((x) => x.id === trailerId);
  if (!t) return null;
  const moreLike = data.trailers.filter((x) => x.id !== t.id && x.genres.some((g) => t.genres.includes(g))).slice(0, 6);
  const inList = myList.includes(t.id);

  useEffectS(() => {window.scrollTo(0, 0);}, [trailerId]);

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
          <div className="hero-badge"><span className="w-mark" style={{ color: brand }}>W</span> WEDFLIX ORIGINAL</div>
          <h1 style={{ letterSpacing: "0px", lineHeight: "1.1" }}>{t.title}</h1>
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
          {moreLike.map((mt) =>
          <div key={mt.id} className="tile" style={{ width: '100%', cursor: 'pointer' }} onClick={() => navTo('detail', mt.id)}>
              <TileArt trailer={mt} brand={brand} />
            </div>
          )}
        </div>
      </div>
    </div>);

}

// ---------- PLAYBACK (green screen + HUD) ----------
function PlaybackScreen({ trailerId, navTo, brand, hudVariant, greenColor, hudOptions }) {
  const data = window.WEDFLIX_DATA;
  const t = data.trailers.find((x) => x.id === trailerId);
  if (!t) return null;
  const next = data.trailers[(data.trailers.indexOf(t) + 1) % data.trailers.length];

  const [showHud, setShowHud] = useStateS(true);
  const [playing, setPlaying] = useStateS(true);
  const [muted, setMuted] = useStateS(false);
  const [progress, setProgress] = useStateS(8); // % through trailer
  const totalSec = t.mins * 60;
  const elapsedSec = Math.floor(totalSec * progress / 100);
  const remainingSec = totalSec - elapsedSec;

  const hideTimer = useRefS(null);
  const bumpHud = () => {
    setShowHud(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => playing && setShowHud(false), 3000);
  };
  useEffectS(() => {
    bumpHud();
    return () => clearTimeout(hideTimer.current);
  }, [trailerId, playing]);

  useEffectS(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const np = p + 100 / totalSec * 0.4; // slow demo progress
        return np >= 100 ? 100 : np;
      });
    }, 400);
    return () => clearInterval(id);
  }, [playing, totalSec]);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${r}`;
  };

  const showSkipIntro = progress < 25 && hudVariant !== 'minimal';
  const showUpNext = progress > 85 && hudVariant === 'loaded';

  // hudOptions controls individual element visibility
  const opt = hudOptions || {};
  const showTags = opt.tags !== false && hudVariant !== 'minimal';

  return (
    <div className={`playback ${showHud ? 'show-hud' : ''}`} onMouseMove={bumpHud} onClick={(e) => {if (e.target.classList.contains('playback') || e.target.classList.contains('playback-greenscreen')) setPlaying((p) => !p);}}>
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
          {showTags &&
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              {t.tags.slice(0, 3).map((tag) =>
            <span key={tag} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 10px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tag}</span>
            )}
              <span style={{ background: 'rgba(200,16,46,0.85)', padding: '4px 10px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>🏆 {t.award}</span>
            </div>
          }
        </div>

        {hudVariant !== 'minimal' &&
        <div style={{ position: 'absolute', top: 100, left: 40, display: 'flex', flexDirection: 'column', gap: 4, color: 'white' }}>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 12px', fontSize: 13, alignSelf: 'flex-start', fontVariantNumeric: 'tabular-nums' }}>
              <span className="match-pct">{t.match}% Match</span>
              <span style={{ marginLeft: 10, color: 'var(--fg-muted)' }}>{t.year} · {t.rating} · {t.mins}m</span>
            </div>
            {hudVariant === 'loaded' &&
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 12px', fontSize: 12, color: 'var(--fg-muted)', alignSelf: 'flex-start' }}>
                {t.awardSub}
              </div>
          }
          </div>
        }

        {showSkipIntro && <button className="hud-skipintro">Skip Intro</button>}

        {showUpNext &&
        <div className="hud-upnext">
            <div className="small-tile" style={{ background: window.WEDFLIX_DATA.posterGradient(next.id) }}>
              <div className="small-tile-art">{next.title.split(':')[0]}</div>
            </div>
            <div className="un-body">
              <small>Next Episode</small>
              <h4>{next.title}</h4>
              <p>{next.desc.slice(0, 90)}…</p>
            </div>
          </div>
        }

        <div className="hud-bottom">
          <div className="hud-scrubber">
            <span>{fmt(elapsedSec)}</span>
            <div className="bar" onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setProgress((e.clientX - r.left) / r.width * 100);
            }}>
              <div className="bar-fill" style={{ width: `${progress}%`, background: brand }} />
              <div className="bar-knob" style={{ left: `${progress}%`, background: brand }} />
            </div>
            <span>-{fmt(remainingSec)}</span>
          </div>
          <div className="hud-controls">
            <button className="play" onClick={() => setPlaying((p) => !p)}>
              {playing ? <Icon.pause /> : <Icon.play />}
            </button>
            <button onClick={() => setProgress((p) => Math.max(0, p - 5))}><Icon.skipBack /></button>
            <button onClick={() => setProgress((p) => Math.min(100, p + 5))}><Icon.skipFwd /></button>
            <button onClick={() => setMuted((m) => !m)}>{muted ? <Icon.volumeMute /> : <Icon.volume />}</button>
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
    </div>);

}

Object.assign(window, {
  ProfileScreen, HomeScreen, DetailScreen, PlaybackScreen
});