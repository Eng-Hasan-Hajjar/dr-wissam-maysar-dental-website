// EnamoraAnimation.jsx — Enamora Dental Center Logo Animation Reel
// Self-contained: Stage, timing primitives, all scene components.
// Exports: window.EnamoraAnimation

// ── Math utils ───────────────────────────────────────────────────────────────
const _cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const _outCubic = t => 1 - Math.pow(1 - t, 3);
const _outBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const _inOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;
const _tw = (from, to, start, end, ease) => t => {
  if (t <= start) return from;
  if (t >= end) return to;
  return from + (to - from) * (ease || _outCubic)((t - start) / (end - start));
};

// ── Brand tokens ─────────────────────────────────────────────────────────────
const TEAL    = '#3E9B9B';
const PURPLE  = '#8B6BE0';
const BG      = '#F5F1EC';
const DUR     = 10;

// ── Timeline context ──────────────────────────────────────────────────────────
const TCtx = React.createContext(0);
const useT = () => React.useContext(TCtx);

// ── 4-pointed sparkle ✦ ──────────────────────────────────────────────────────
function Spark({ r = 10, color = PURPLE, opacity = 1, rotate = 0 }) {
  const c = r * 0.13;
  const d = `M0,${-r} C${c},${-c} ${c},${-c} ${r},0 C${c},${c} ${c},${c} 0,${r} C${-c},${c} ${-c},${c} ${-r},0 C${-c},${-c} ${-c},${-c} 0,${-r}Z`;
  return (
    <svg width={r * 2} height={r * 2} viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`}
      style={{ display: 'block', transform: `rotate(${rotate}deg)`, overflow: 'visible', flexShrink: 0 }}>
      <path d={d} fill={color} opacity={opacity} />
    </svg>
  );
}

// ── Glass crystal star (hero mark) ───────────────────────────────────────────
function GlassStar() {
  const t = useT();
  const R = 122;
  const c = R * 0.13;
  const Ri = Math.round(R * 0.29);
  const ci = Math.round(Ri * 0.13);

  const sp = (r, k) => {
    const cp = r * k;
    return `M0,${-r} C${cp},${-cp} ${cp},${-cp} ${r},0 C${cp},${cp} ${cp},${cp} 0,${r} C${-cp},${cp} ${-cp},${cp} ${-r},0 C${-cp},${-cp} ${-cp},${-cp} 0,${-r}Z`;
  };

  const baseScale = _tw(0, 1, 0.4, 2.6, _outBack)(t);
  const holdPulse = t > 5.5 ? 1 + 0.028 * Math.sin((t - 5.5) * 2.1) : 1;
  const scale     = baseScale * holdPulse;
  const rot       = _tw(18, 0, 0.4, 2.6)(t) + (t > 5.5 ? 1.5 * Math.sin((t - 5.5) * 0.9) : 0);
  const op        = _cl(t > 0.4 ? (t - 0.4) * 3.5 : 0, 0, 1);
  const S         = R + 38;

  return (
    <div style={{ opacity: op, transform: `scale(${scale}) rotate(${rot}deg)`, transformOrigin: 'center', willChange: 'transform,opacity' }}>
      <svg width={S * 2} height={S * 2} viewBox={`${-S} ${-S} ${S * 2} ${S * 2}`} style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <radialGradient id="gG" cx="33%" cy="27%" r="72%">
            <stop offset="0%"   stopColor="#fff"    stopOpacity="0.97" />
            <stop offset="22%"  stopColor="#def4f4" stopOpacity="0.82" />
            <stop offset="55%"  stopColor="#9dcccc" stopOpacity="0.46" />
            <stop offset="100%" stopColor="#5ab8b8" stopOpacity="0.13" />
          </radialGradient>
          <filter id="gGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="gBloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="26" />
          </filter>
          <filter id="gInner" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ambient bloom */}
        <path d={sp(R, 0.13)} fill={TEAL} opacity="0.09" filter="url(#gBloom)" />

        {/* Main glass body */}
        <path d={sp(R, 0.13)} fill="url(#gG)" />

        {/* Inner depth layer */}
        <path d={sp(R * 0.82, 0.13)} fill="white" opacity="0.16" transform="translate(2,2)" />

        {/* Edge highlight */}
        <path d={sp(R, 0.13)} fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="1.5" />

        {/* Inner purple star */}
        <path d={sp(Ri, 0.13)} fill={PURPLE} filter="url(#gInner)" />

        {/* Primary highlight (upper-left) */}
        <ellipse cx={-R * 0.30} cy={-R * 0.57} rx={R * 0.135} ry={R * 0.052}
          fill="white" opacity="0.78"
          transform={`rotate(-38,${-R * 0.30},${-R * 0.57})`} />

        {/* Secondary highlight */}
        <circle cx={-R * 0.14} cy={-R * 0.74} r={R * 0.033} fill="white" opacity="0.55" />

        {/* Right-edge sheen */}
        <path d={`M0,${-R * 0.55} C${R * 0.07},${-R * 0.07} ${R * 0.07},${-R * 0.07} ${R * 0.55},0`}
          fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
      </svg>
    </div>
  );
}

// ── Background particles ──────────────────────────────────────────────────────
const PTCLS = [
  { x: 142, y:  92, r: 6, ph: 0.0, sp: 0.42, p: true  },
  { x: 338, y: 275, r: 5, ph: 1.2, sp: 0.58, p: false },
  { x: 518, y:  74, r: 7, ph: 2.1, sp: 0.38, p: true  },
  { x: 724, y: 188, r: 5, ph: 0.8, sp: 0.51, p: true  },
  { x:1028, y: 318, r: 6, ph: 3.0, sp: 0.44, p: false },
  { x:1248, y:  92, r: 5, ph: 1.7, sp: 0.60, p: true  },
  { x:1452, y: 238, r: 7, ph: 2.5, sp: 0.37, p: false },
  { x:1682, y: 116, r: 6, ph: 0.3, sp: 0.53, p: true  },
  { x:1838, y: 303, r: 5, ph: 4.1, sp: 0.47, p: true  },
  { x:1762, y: 618, r: 7, ph: 1.4, sp: 0.40, p: false },
  { x: 212, y: 477, r: 5, ph: 2.8, sp: 0.55, p: true  },
  { x: 448, y: 698, r: 6, ph: 0.6, sp: 0.36, p: true  },
  { x: 682, y: 578, r: 5, ph: 3.5, sp: 0.62, p: false },
  { x: 918, y: 818, r: 7, ph: 1.9, sp: 0.43, p: true  },
  { x:1152, y: 678, r: 5, ph: 0.4, sp: 0.57, p: false },
  { x:1378, y: 758, r: 6, ph: 2.3, sp: 0.39, p: true  },
  { x:1598, y: 498, r: 5, ph: 4.7, sp: 0.49, p: true  },
  { x:1898, y: 797, r: 7, ph: 1.1, sp: 0.54, p: false },
];

function Particles() {
  const t = useT();
  const entry = _cl(t / 2.0, 0, 1);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {PTCLS.map((p, i) => {
        const drift   = Math.sin(t * p.sp + p.ph) * 13;
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * p.sp * 2.7 + p.ph * 1.5));
        const op      = (p.p ? 0.26 : 0.20) * twinkle * entry;
        const rot     = t * 17 * (i % 2 ? 1 : -1) + p.ph * 22;
        return (
          <div key={i} style={{
            position: 'absolute', left: p.x - p.r, top: p.y + drift - p.r,
            opacity: op,
            transform: `rotate(${rot}deg)`,
            willChange: 'transform,opacity',
          }}>
            <Spark r={p.r} color={p.p ? PURPLE : TEAL} />
          </div>
        );
      })}
    </div>
  );
}

// ── Enamora wordmark ──────────────────────────────────────────────────────────
function EnamoraWord() {
  const t   = useT();
  const LTS = ['E', 'n', 'a', 'm', 'o', 'r', 'a'];
  const T0  = 2.0, DL = 0.13, FD = 0.58;

  // Shimmer light sweep at ~4.5s and ~7.5s
  const sh1 = _tw(0, 1, 4.4, 5.3)(t);
  const sh2 = _tw(0, 1, 7.4, 8.3)(t);
  const shX = (sh1 + sh2) * 900;

  // 'o' star opacity follows the 'o' letter (index 4)
  const oOp = _outCubic(_cl((t - (T0 + 4 * DL)) / FD, 0, 1));

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline', letterSpacing: '-0.01em' }}>
      {/* Shimmer sweep */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(90deg,transparent ${shX - 80}px,rgba(255,255,255,0.38) ${shX}px,transparent ${shX + 80}px)`,
        pointerEvents: 'none', zIndex: 3, borderRadius: 4,
      }} />

      {LTS.map((ltr, i) => {
        const prog = _outCubic(_cl((t - (T0 + i * DL)) / FD, 0, 1));
        return (
          <span key={i} style={{
            position: 'relative', display: 'inline-block',
            opacity: prog,
            transform: `translateY(${(1 - prog) * 22}px)`,
            color: TEAL, zIndex: 1,
            willChange: 'transform,opacity',
          }}>
            {ltr}
            {/* Star inside the 'o' */}
            {i === 4 && (
              <span style={{
                position: 'absolute', left: '50%', top: '57%',
                transform: 'translate(-50%,-50%)',
                zIndex: 4, opacity: oOp, pointerEvents: 'none',
              }}>
                <Spark r={16} color={PURPLE} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  const t = useT();

  const fadeIn  = _cl(t / 0.8, 0, 1);
  const fadeOut = t > 9.0 ? _cl((10 - t), 0, 1) : 1;
  const go      = fadeIn * fadeOut;

  const subOp  = _outCubic(_cl((t - 3.3) / 0.9, 0, 1));
  const accOp  = _outBack(_cl((t - 3.9) / 0.45, 0, 1));
  const tagOp  = _outCubic(_cl((t - 4.6) / 1.0, 0, 1));

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: go }}>
      <div style={{ position: 'absolute', inset: 0, background: BG }} />
      <Particles />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 10,
      }}>
        {/* Glass star */}
        <div style={{ marginBottom: 20 }}>
          <GlassStar />
        </div>

        {/* Enamora wordmark */}
        <div style={{
          fontFamily: "'Cormorant Garamond','Cormorant',Georgia,serif",
          fontSize: 188, fontWeight: 400, lineHeight: 1,
        }}>
          <EnamoraWord />
        </div>

        {/* DENTAL CENTER */}
        <div style={{
          fontFamily: "'Montserrat','Helvetica Neue',Arial,sans-serif",
          fontSize: 22, fontWeight: 500,
          letterSpacing: '0.38em', paddingLeft: '0.38em',
          color: TEAL,
          opacity: subOp,
          transform: `translateY(${(1 - subOp) * 14}px)`,
          marginTop: 10, textTransform: 'uppercase',
          willChange: 'transform,opacity',
        }}>
          DENTAL CENTER
        </div>

        {/* Accent sparkle */}
        <div style={{
          marginTop: 16,
          opacity: _cl(accOp, 0, 1),
          transform: `scale(${_cl(accOp, 0, 1.35)})`,
          transformOrigin: 'center',
          willChange: 'transform,opacity',
        }}>
          <Spark r={11} color={PURPLE} />
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: "'Montserrat','Helvetica Neue',Arial,sans-serif",
          fontSize: 14, fontWeight: 400,
          letterSpacing: '0.3em', paddingLeft: '0.3em',
          color: 'rgba(62,155,155,0.62)',
          opacity: tagOp, marginTop: 16,
          textTransform: 'uppercase',
          willChange: 'opacity',
        }}>
          {'SCIENCE. ARTISTRY. '}
          <span style={{ color: TEAL, fontWeight: 600 }}>YOU.</span>
        </div>
      </div>
    </div>
  );
}

// ── Stage: auto-scaling 1920×1080 canvas + playback bar ──────────────────────
function AnimStage() {
  const [t, setT] = React.useState(() => {
    try { const v = parseFloat(localStorage.getItem('enaReel:t') || '0'); return isFinite(v) ? _cl(v, 0, DUR) : 0; } catch { return 0; }
  });
  const [playing, setPlaying] = React.useState(true);
  const [scale, setScale]     = React.useState(1);
  const [dragging, setDrag]   = React.useState(false);

  const wrapRef  = React.useRef(null);
  const canvRef  = React.useRef(null);
  const trackRef = React.useRef(null);
  const lastTs   = React.useRef(null);

  // Persist
  React.useEffect(() => { try { localStorage.setItem('enaReel:t', String(t)); } catch {} }, [t]);

  // Scale to viewport
  React.useEffect(() => {
    const measure = () => {
      const el = wrapRef.current; if (!el) return;
      setScale(Math.max(0.05, Math.min(el.clientWidth / 1920, (el.clientHeight - 52) / 1080)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // Label for comments (updated each second)
  React.useEffect(() => {
    if (canvRef.current) canvRef.current.setAttribute('data-screen-label', `${String(Math.floor(t)).padStart(2, '0')}s`);
  }, [Math.floor(t)]);

  // RAF loop
  React.useEffect(() => {
    if (!playing) { lastTs.current = null; return; }
    let raf;
    const step = ts => {
      if (!lastTs.current) lastTs.current = ts;
      const dt = (ts - lastTs.current) / 1000; lastTs.current = ts;
      setT(prev => { const n = prev + dt; return n >= DUR ? n % DUR : n; });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); lastTs.current = null; };
  }, [playing]);

  // Keyboard
  React.useEffect(() => {
    const h = e => {
      if (e.code === 'Space') { e.preventDefault(); setPlaying(p => !p); }
      else if (e.code === 'ArrowLeft')  setT(v => Math.max(0, v - (e.shiftKey ? 1 : 0.1)));
      else if (e.code === 'ArrowRight') setT(v => Math.min(DUR, v + (e.shiftKey ? 1 : 0.1)));
      else if (e.key === '0') setT(0);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Scrub
  const tmFromEvt = e => {
    if (!trackRef.current) return 0;
    const r = trackRef.current.getBoundingClientRect();
    return _cl((e.clientX - r.left) / r.width, 0, 1) * DUR;
  };
  React.useEffect(() => {
    if (!dragging) return;
    const up = () => setDrag(false);
    const mv = e => setT(tmFromEvt(e));
    window.addEventListener('mouseup', up); window.addEventListener('mousemove', mv);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('mousemove', mv); };
  }, [dragging]);

  const pct  = (t / DUR) * 100;
  const fmt  = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}.${String(Math.floor((s * 100) % 100)).padStart(2, '0')}`;
  const mono = 'JetBrains Mono,ui-monospace,monospace';
  const btn  = { width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 6, color: '#f6f4ef', cursor: 'pointer', padding: 0, flexShrink: 0 };

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#080808', fontFamily: 'Inter,system-ui,sans-serif' }}>

      {/* Canvas */}
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', minHeight: 0 }}>
        <div ref={canvRef} data-screen-label="00s" style={{
          width: 1920, height: 1080, position: 'relative',
          transform: `scale(${scale})`, transformOrigin: 'center',
          flexShrink: 0, overflow: 'hidden',
          background: '#000',
          boxShadow: '0 24px 72px rgba(0,0,0,0.55)',
        }}>
          <TCtx.Provider value={t}>
            <Scene />
          </TCtx.Provider>
        </div>
      </div>

      {/* Playback bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'rgba(14,14,14,0.96)', borderTop: '1px solid rgba(255,255,255,0.07)', width: '100%', maxWidth: 680, alignSelf: 'center', borderRadius: '0 0 8px 8px', color: '#f6f4ef', userSelect: 'none', flexShrink: 0 }}>

        <button onClick={() => setT(0)} style={btn} title="Reset (0)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" /></svg>
        </button>

        <button onClick={() => setPlaying(p => !p)} style={btn} title="Play/Pause (Space)">
          {playing
            ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3" y="2" width="3" height="10" fill="currentColor" /><rect x="8" y="2" width="3" height="10" fill="currentColor" /></svg>
            : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2l9 5-9 5V2z" fill="currentColor" /></svg>
          }
        </button>

        <div style={{ fontFamily: mono, fontSize: 12, width: 64, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(t)}</div>

        <div ref={trackRef} onMouseDown={e => { setDrag(true); setT(tmFromEvt(e)); }}
          style={{ flex: 1, height: 22, position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 4, background: 'oklch(68% 0.10 185)', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: `${pct}%`, top: '50%', width: 12, height: 12, marginLeft: -6, marginTop: -6, background: '#fff', borderRadius: 6, boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }} />
        </div>

        <div style={{ fontFamily: mono, fontSize: 12, width: 64, fontVariantNumeric: 'tabular-nums', color: 'rgba(246,244,239,0.45)' }}>{fmt(DUR)}</div>
      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
function EnamoraAnimation() { return <AnimStage />; }
window.EnamoraAnimation = EnamoraAnimation;
