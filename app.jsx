// Wedflix — main app: screen routing, profile state, tweaks integration

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

const WEDFLIX_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brand": "#C8102E",
  "brandText": "WEDFLIX",
  "green": "#00B140",
  "hudVariant": "standard",
  "heroId": "t02",
  "showHudTags": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(WEDFLIX_DEFAULTS)
    : [WEDFLIX_DEFAULTS, () => {}];

  // Navigation: screen is 'profile' | 'home' | 'detail' | 'playback'
  const [screen, setScreen] = useStateA('profile');
  const [profile, setProfile] = useStateA(null);
  const [currentTrailerId, setCurrentTrailerId] = useStateA(null);
  const [myList, setMyList] = useStateA(['t02', 't09', 't20']);

  const navTo = (s, trailerId) => {
    if (trailerId) setCurrentTrailerId(trailerId);
    setScreen(s);
    window.scrollTo(0, 0);
  };

  const toggleMyList = (id) => {
    setMyList(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };

  // Esc to back out of playback
  useEffectA(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && screen === 'playback') navTo('home');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen]);

  // Apply brand var live
  useEffectA(() => {
    document.documentElement.style.setProperty('--brand', tweaks.brand);
    document.documentElement.style.setProperty('--green-screen', tweaks.green);
  }, [tweaks.brand, tweaks.green]);

  const renderScreen = () => {
    if (screen === 'profile' || !profile) {
      return <ProfileScreen brand={tweaks.brand} brandText={tweaks.brandText} onPick={(p) => { setProfile(p); setScreen('home'); }} />;
    }
    if (screen === 'home') {
      return <HomeScreen profile={profile} navTo={navTo} brand={tweaks.brand} brandText={tweaks.brandText} heroId={tweaks.heroId} myList={myList} toggleMyList={toggleMyList} />;
    }
    if (screen === 'detail') {
      return <DetailScreen trailerId={currentTrailerId} profile={profile} navTo={navTo} brand={tweaks.brand} brandText={tweaks.brandText} myList={myList} toggleMyList={toggleMyList} />;
    }
    if (screen === 'playback') {
      return <PlaybackScreen
        trailerId={currentTrailerId}
        navTo={navTo}
        brand={tweaks.brand}
        hudVariant={tweaks.hudVariant}
        greenColor={tweaks.green}
        hudOptions={{ tags: tweaks.showHudTags }}
      />;
    }
    return null;
  };

  return (
    <React.Fragment>
      {renderScreen()}

      {/* Tweaks panel */}
      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Brand">
            <window.TweakText label="Wordmark" value={tweaks.brandText} onChange={(v) => setTweak('brandText', v)} />
            <window.TweakColor label="Accent" value={tweaks.brand}
              onChange={(v) => setTweak('brand', v)}
              options={['#C8102E', '#8B0028', '#D4A574', '#1F8A5B', '#1E3A8A', '#000000']} />
          </window.TweakSection>

          <window.TweakSection label="Playback HUD">
            <window.TweakRadio label="HUD density"
              value={tweaks.hudVariant}
              onChange={(v) => setTweak('hudVariant', v)}
              options={[
                { value: 'minimal', label: 'Minimal' },
                { value: 'standard', label: 'Standard' },
                { value: 'loaded', label: 'Loaded' },
              ]} />
            <window.TweakToggle label="Show tag pills + award"
              value={tweaks.showHudTags}
              onChange={(v) => setTweak('showHudTags', v)} />
            <window.TweakColor label="Green screen"
              value={tweaks.green}
              onChange={(v) => setTweak('green', v)}
              options={['#00B140', '#00FF00', '#0047BB', '#FF00FF']} />
          </window.TweakSection>

          <window.TweakSection label="Hero">
            <window.TweakSelect label="Featured trailer"
              value={tweaks.heroId}
              onChange={(v) => setTweak('heroId', v)}
              options={window.WEDFLIX_DATA.trailers.map(tr => ({ value: tr.id, label: tr.title }))} />
          </window.TweakSection>

          <window.TweakSection label="Quick nav">
            <window.TweakButton label="Profile picker" onClick={() => setScreen('profile')} />
            <window.TweakButton label="Home" onClick={() => { if (!profile) setProfile(window.WEDFLIX_DATA.profiles[0]); setScreen('home'); }} />
            <window.TweakButton label="Detail (featured)" onClick={() => { if (!profile) setProfile(window.WEDFLIX_DATA.profiles[0]); navTo('detail', tweaks.heroId); }} />
            <window.TweakButton label="Playback (featured)" onClick={() => { if (!profile) setProfile(window.WEDFLIX_DATA.profiles[0]); navTo('playback', tweaks.heroId); }} />
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
