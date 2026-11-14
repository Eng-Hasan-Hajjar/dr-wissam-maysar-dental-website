// EnamoraAnimation v2 — Enamora Dental Center Logo Reel
// Redesigned for website hero section
// window.EnamoraAnimation → <AnimStage />

// ─── Easing utils ────────────────────────────────────────────────────────────
const _clamp      = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const _outCubic   = t => 1 - Math.pow(1 - t, 3);
const _outBack    = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const _outExpo    = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const _outElastic = t => {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
};
const _tw = (from, to, start, end, ease) => t => {
  if (t <= start) return from;
  if (t >= end)   return to;
  return from + (to - from) * (ease || _outCubic)((t - start) / (end - start));
};

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const TEAL   = '#3E9B9B';
const TEAL_L = '#5fc4c4';
const PURPLE = '#8B6BE0';
const BG     = '#F5F1EC';
const DUR    = 12;

// ─── Timeline context ─────────────────────────────────────────────────────────
const TCtx = React.createContext(0);
const useT = () => React.useContext(TCtx);

// ─── 4-pointed sparkle ✦ ──────────────────────────────────────────────────────
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

// ─── Glass Crystal Star (hero mark) ───────────────────────────────────────────
function GlassStar() {
  const t = useT();
  const R  = 158;
  const Ri = Math.round(R * 0.26);

  const sp = (r, k) => {
    k = k || 0.13;
    const c = r * k;
    return `M0,${-r} C${c},${-c} ${c},${-c} ${r},0 C${c},${c} ${c},${c} 0,${r} C${-c},${c} ${-c},${c} ${-r},0 C${-c},${-c} ${-c},${-c} 0,${-r}Z`;
  };

  // Entry
  const baseScale  = _tw(0, 1, 0.55, 2.35, _outElastic)(t);
  const breathe    = t > 5.0 ? 1 + 0.018 * Math.sin((t - 5) * 1.65) : 1;
  const scale      = baseScale * breathe;
  const rot        = _tw(24, 0, 0.55, 2.35)(t) + (t > 5 ? 1.2 * Math.sin((t - 5) * 0.72) : 0);
  const op         = _clamp(t > 0.55 ? (t - 0.55) * 5 : 0, 0, 1);

  // Orb
  const orbProg    = _tw(0, 1, 0.35, 1.9, _outCubic)(t);
  const orbBreathe = t > 5 ? 0.82 + 0.18 * Math.sin((t - 5) * 1.1) : 1;
  const orbOp      = orbProg * orbBreathe;
  const orbR       = Math.round(R * 1.40);

  // Ambient pulse ring
  const glowR      = orbR * (1 + (t > 5 ? 0.08 * Math.sin((t - 5) * 2.0) : 0));

  const S = R + 55;

  return (
    <div style={{ position: 'relative', width: S * 2, height: S * 2 }}>

      {/* Soft ambient radial glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: glowR * 2.6, height: glowR * 2.6,
        transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(95,196,196,0.13) 0%, rgba(95,196,196,0) 62%)`,
        opacity: orbProg,
        pointerEvents: 'none',
      }}></div>

      {/* Translucent glass orb (circle) */}
      <svg
        width={orbR * 2} height={orbR * 2}
        viewBox={`${-orbR} ${-orbR} ${orbR * 2} ${orbR * 2}`}
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: `translate(-50%,-50%) scale(${orbProg})`,
          opacity: orbOp * 0.55,
          pointerEvents: 'none', overflow: 'visible',
        }}>
        <defs>
          <radialGradient id="orbGrad" cx="34%" cy="27%" r="70%">
            <stop offset="0%"   stopColor="#ffffff"  stopOpacity="0.22" />
            <stop offset="35%"  stopColor="#d8f0f0"  stopOpacity="0.09" />
            <stop offset="100%" stopColor={TEAL}     stopOpacity="0.02" />
          </radialGradient>
        </defs>
        <circle r={orbR} fill="url(#orbGrad)" />
        <circle r={orbR} fill="none" stroke="rgba(90,184,184,0.18)" strokeWidth="1.3" />
        {/* Orb highlight */}
        <ellipse
          cx={-orbR * 0.28} cy={-orbR * 0.30}
          rx={orbR * 0.10} ry={orbR * 0.038}
          fill="white" opacity="0.22"
          transform={`rotate(-40,${-orbR * 0.28},${-orbR * 0.30})`}
        />
        <circle cx={-orbR * 0.38} cy={-orbR * 0.48} r={orbR * 0.020} fill="white" opacity="0.28" />
      </svg>

      {/* Glass star */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: `translate(-50%,-50%) scale(${scale}) rotate(${rot}deg)`,
        opacity: op,
        willChange: 'transform,opacity',
      }}>
        <svg width={S * 2} height={S * 2}
          viewBox={`${-S} ${-S} ${S * 2} ${S * 2}`}
          style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <radialGradient id="glassGrad" cx="27%" cy="20%" r="80%">
              <stop offset="0%"    stopColor="#ffffff"  stopOpacity="0.98" />
              <stop offset="14%"   stopColor="#eafafb"  stopOpacity="0.90" />
              <stop offset="35%"   stopColor="#aadcdc"  stopOpacity="0.55" />
              <stop offset="66%"   stopColor="#6abcbc"  stopOpacity="0.26" />
              <stop offset="100%"  stopColor="#3E9B9B"  stopOpacity="0.05" />
            </radialGradient>
            <radialGradient id="purpleGrad" cx="48%" cy="38%" r="60%">
              <stop offset="0%"   stopColor="#b490f0"  stopOpacity="1.00" />
              <stop offset="55%"  stopColor={PURPLE}   stopOpacity="0.90" />
              <stop offset="100%" stopColor="#5e36c4"  stopOpacity="0.55" />
            </radialGradient>
            <filter id="fxBloom" x="-130%" y="-130%" width="360%" height="360%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
            </filter>
            <filter id="fxGlow" x="-90%" y="-90%" width="280%" height="280%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="fxInner" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="fxPurpleHalo" x="-130%" y="-130%" width="360%" height="360%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
            </filter>
          </defs>

          {/* Outer teal bloom */}
          <path d={sp(R)} fill={TEAL} opacity="0.10" filter="url(#fxBloom)" />

          {/* Main glass body */}
          <path d={sp(R)} fill="url(#glassGrad)" />

          {/* Depth inner layer */}
          <path d={sp(R * 0.78)} fill="white" opacity="0.12" transform="translate(4,4)" />

          {/* Outer edge highlight */}
          <path d={sp(R)} fill="none" stroke="rgba(255,255,255,0.58)" strokeWidth="1.8" />

          {/* Inner edge subtle */}
          <path d={sp(R * 0.86)} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.0" />

          {/* Purple halo */}
          <path d={sp(Ri * 1.6)} fill={PURPLE} opacity="0.18" filter="url(#fxPurpleHalo)" />

          {/* Purple inner star */}
          <path d={sp(Ri)} fill="url(#purpleGrad)" filter="url(#fxInner)" />

          {/* Primary highlight (upper-left) */}
          <ellipse
            cx={-R * 0.28} cy={-R * 0.54}
            rx={R * 0.145} ry={R * 0.056}
            fill="white" opacity="0.86"
            transform={`rotate(-38,${-R * 0.28},${-R * 0.54})`}
          />

          {/* Secondary dot highlight */}
          <circle cx={-R * 0.13} cy={-R * 0.72} r={R * 0.030} fill="white" opacity="0.62" />

          {/* Tertiary micro highlight */}
          <circle cx={R * 0.41} cy={R * 0.14} r={R * 0.018} fill="white" opacity="0.32" />

          {/* Right-edge sheen arc */}
          <path
            d={`M0,${-R * 0.50} C${R * 0.07},${-R * 0.07} ${R * 0.07},${-R * 0.07} ${R * 0.50},0`}
            fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.2"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Burst ring + sparkles when star lands ─────────────────────────────────────
function BurstRing() {
  const t = useT();

  const prog  = _outExpo(_clamp((t - 1.95) / 0.80, 0, 1));
  const fadeT = _clamp((t - 2.15) / 1.05, 0, 1);
  const op    = (1 - fadeT) * (prog > 0 ? 1 : 0);

  if (prog <= 0) return null;

  const ringR  = 140 + 320 * prog;
  const ring2R = ringR * 0.74;

  const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315, 22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
  const dist   = 120 + 240 * prog;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 5,
    }}>
      {/* Expanding rings */}
      <svg style={{ position: 'absolute' }} width={960} height={960}
        viewBox="-480 -480 960 960" overflow="visible">
        <circle r={ringR}  fill="none" stroke={TEAL}   strokeWidth="1.6" opacity={op * 0.42} />
        <circle r={ring2R} fill="none" stroke={TEAL_L} strokeWidth="0.8" opacity={op * 0.25} />
      </svg>

      {/* Sparkle burst */}
      {ANGLES.map((angle, i) => {
        const isLg  = i % 4 === 0;
        const rad   = angle * Math.PI / 180;
        const x     = Math.cos(rad) * dist;
        const y     = Math.sin(rad) * dist;
        return (
          <div key={i} style={{
            position: 'absolute',
            transform: `translate(${x}px, ${y}px)`,
            opacity: op * (isLg ? 0.70 : 0.42),
            willChange: 'transform,opacity',
          }}>
            <Spark r={isLg ? 9 : 5} color={i % 3 === 0 ? PURPLE : TEAL} rotate={angle + 45} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Background particles ──────────────────────────────────────────────────────
const PTCLS = [
  { x:  142, y:  82, r: 5, ph: 0.0, sp: 0.42, p: true  },
  { x:  338, y: 265, r: 4, ph: 1.2, sp: 0.58, p: false },
  { x:  518, y:  68, r: 6, ph: 2.1, sp: 0.38, p: true  },
  { x:  724, y: 178, r: 4, ph: 0.8, sp: 0.51, p: true  },
  { x: 1028, y: 308, r: 5, ph: 3.0, sp: 0.44, p: false },
  { x: 1248, y:  82, r: 4, ph: 1.7, sp: 0.60, p: true  },
  { x: 1452, y: 228, r: 6, ph: 2.5, sp: 0.37, p: false },
  { x: 1682, y: 106, r: 5, ph: 0.3, sp: 0.53, p: true  },
  { x: 1838, y: 293, r: 4, ph: 4.1, sp: 0.47, p: true  },
  { x: 1762, y: 608, r: 6, ph: 1.4, sp: 0.40, p: false },
  { x:  212, y: 467, r: 4, ph: 2.8, sp: 0.55, p: true  },
  { x:  448, y: 688, r: 5, ph: 0.6, sp: 0.36, p: true  },
  { x:  682, y: 568, r: 4, ph: 3.5, sp: 0.62, p: false },
  { x:  918, y: 808, r: 6, ph: 1.9, sp: 0.43, p: true  },
  { x: 1152, y: 668, r: 4, ph: 0.4, sp: 0.57, p: false },
  { x: 1378, y: 748, r: 5, ph: 2.3, sp: 0.39, p: true  },
  { x: 1598, y: 488, r: 4, ph: 4.7, sp: 0.49, p: true  },
  { x: 1898, y: 787, r: 6, ph: 1.1, sp: 0.54, p: false },
  { x:   88, y: 530, r: 5, ph: 3.3, sp: 0.46, p: true  },
  { x: 1740, y: 410, r: 4, ph: 1.6, sp: 0.52, p: false },
  { x:  280, y: 155, r: 5, ph: 2.2, sp: 0.45, p: true  },
  { x: 1560, y: 875, r: 4, ph: 0.9, sp: 0.58, p: false },
];

function Particles() {
  const t = useT();
  const entry = _clamp(t / 2.5, 0, 1);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {PTCLS.map((p, i) => {
        const drift   = Math.sin(t * p.sp + p.ph) * 13;
        const twinkle = 0.28 + 0.72 * Math.abs(Math.sin(t * p.sp * 2.5 + p.ph * 1.4));
        const op      = (p.p ? 0.28 : 0.18) * twinkle * entry;
        const rot     = t * 17 * (i % 2 ? 1 : -1) + p.ph * 22;
        return (
          <div key={i} style={{
            position: 'absolute', left: p.x - p.r, top: p.y + drift - p.r,
            opacity: op, transform: `rotate(${rot}deg)`,
            willChange: 'transform,opacity',
          }}>
            <Spark r={p.r} color={p.p ? PURPLE : TEAL} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Animated draw-in line ────────────────────────────────────────────────────
function DrawLine({ delay, width }) {
  const t = useT();
  const prog = _outCubic(_clamp((t - delay) / 0.75, 0, 1));
  return (
    <div style={{
      width: (width || 56) * prog, height: 1,
      background: 'rgba(62,155,155,0.30)',
      flexShrink: 0,
    }}></div>
  );
}

// ─── Enamora wordmark ──────────────────────────────────────────────────────────
function EnamoraWord() {
  const t   = useT();
  const LTS = ['E', 'n', 'a', 'm', 'o', 'r', 'a'];
  const T0  = 2.45, DL = 0.11, FD = 0.52;

  // Two shimmer sweeps during hold phase
  const sh1 = _tw(0, 1, 6.2, 7.2)(t);
  const sh2 = _tw(0, 1, 9.8, 10.8)(t);
  const shX = (sh1 + sh2) * 1060;

  const oOp = _outCubic(_clamp((t - (T0 + 4 * DL)) / FD, 0, 1));

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline', letterSpacing: '-0.01em' }}>
      {/* Shimmer sweep overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(90deg, transparent ${shX - 110}px, rgba(255,255,255,0.44) ${shX}px, transparent ${shX + 110}px)`,
        pointerEvents: 'none', zIndex: 3, borderRadius: 4,
      }}></div>

      {LTS.map((ltr, i) => {
        const prog = _outCubic(_clamp((t - (T0 + i * DL)) / FD, 0, 1));
        return (
          <span key={i} style={{
            position: 'relative', display: 'inline-block',
            opacity: prog,
            transform: `translateY(${(1 - prog) * 26}px)`,
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
                <Spark r={19} color={PURPLE} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene() {
  const t = useT();

  // Global fade: in over first 0.7s, out over last 1s before loop
  const fadeIn  = _outCubic(_clamp(t / 0.7, 0, 1));
  const fadeOut = t > 10.8 ? _clamp((12.0 - t) / 1.0, 0, 1) : 1;
  const go      = fadeIn * fadeOut;

  const subOp  = _outCubic(_clamp((t - 3.55) / 0.85, 0, 1));
  const accOp  = _outBack(_clamp((t - 4.25) / 0.52, 0, 1));
  const tagOp  = _outCubic(_clamp((t - 5.1) / 1.0, 0, 1));

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: BG }}></div>

      {/* Soft center radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 58% 52% at 50% 44%, rgba(90,184,184,0.10) 0%, transparent 68%)',
        opacity: _clamp(t / 2.5, 0, 1),
        pointerEvents: 'none',
      }}></div>

      <Particles />

      {/* All animated content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 10, opacity: go,
      }}>

        {/* Glass star + burst ring */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BurstRing />
          <GlassStar />
        </div>

        {/* Wordmark */}
        <div style={{
          fontFamily: "'Cormorant Garamond','Cormorant',Georgia,serif",
          fontSize: 204, fontWeight: 400, lineHeight: 1,
          marginTop: -8,
        }}>
          <EnamoraWord />
        </div>

        {/* DENTAL CENTER with flanking draw lines */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginTop: 12,
          opacity: subOp,
          transform: `translateY(${(1 - subOp) * 14}px)`,
          willChange: 'transform,opacity',
        }}>
          <DrawLine delay={3.55} width={54} />
          <div style={{
            fontFamily: "'Montserrat','Helvetica Neue',Arial,sans-serif",
            fontSize: 21, fontWeight: 500,
            letterSpacing: '0.44em', paddingLeft: '0.44em',
            color: TEAL, textTransform: 'uppercase',
          }}>
            DENTAL CENTER
          </div>
          <DrawLine delay={3.55} width={54} />
        </div>

        {/* Accent sparkle */}
        <div style={{
          marginTop: 16,
          opacity: _clamp(accOp, 0, 1),
          transform: `scale(${_clamp(accOp, 0, 1.40)})`,
          transformOrigin: 'center',
          willChange: 'transform,opacity',
        }}>
          <Spark r={12} color={PURPLE} />
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: "'Montserrat','Helvetica Neue',Arial,sans-serif",
          fontSize: 13, fontWeight: 400,
          letterSpacing: '0.32em', paddingLeft: '0.32em',
          color: 'rgba(62,155,155,0.56)',
          opacity: tagOp, marginTop: 15,
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

// ─── Stage: auto-scaling 1920×1080 canvas + playback bar ──────────────────────
function AnimStage() {
  const [t, setT] = React.useState(() => {
    try { const v = parseFloat(localStorage.getItem('enaReel:t') || '0'); return isFinite(v) ? _clamp(v, 0, DUR) : 0; } catch { return 0; }
  });
  const [playing, setPlaying] = React.useState(true);
  const [scale, setScale]     = React.useState(1);
  const [dragging, setDrag]   = React.useState(false);

  const wrapRef  = React.useRef(null);
  const canvRef  = React.useRef(null);
  const trackRef = React.useRef(null);
  const lastTs   = React.useRef(null);

  React.useEffect(() => { try { localStorage.setItem('enaReel:t', String(t)); } catch {} }, [t]);

  React.useEffect(() => {
    const measure = () => {
      const el = wrapRef.current; if (!el) return;
      setScale(Math.max(0.05, Math.min(el.clientWidth / 1920, (el.clientHeight - 54) / 1080)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  React.useEffect(() => {
    if (canvRef.current) canvRef.current.setAttribute('data-screen-label', `${String(Math.floor(t)).padStart(2, '0')}s`);
  }, [Math.floor(t)]);

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

  const tmFromEvt = e => {
    if (!trackRef.current) return 0;
    const r = trackRef.current.getBoundingClientRect();
    return _clamp((e.clientX - r.left) / r.width, 0, 1) * DUR;
  };
  React.useEffect(() => {
    if (!dragging) return;
    const up = () => setDrag(false);
    const mv = e => setT(tmFromEvt(e));
    window.addEventListener('mouseup', up); window.addEventListener('mousemove', mv);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('mousemove', mv); };
  }, [dragging]);

  const pct = (t / DUR) * 100;
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}.${String(Math.floor((s * 100) % 100)).padStart(2, '0')}`;
  const mono = 'JetBrains Mono,ui-monospace,monospace';
  const btn  = { width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#f6f4ef', cursor: 'pointer', padding: 0, flexShrink: 0 };

  // Phase labels for scrubber
  const PHASES = [
    { at: 0/12,    label: 'Open'  },
    { at: 0.55/12, label: 'Star'  },
    { at: 2.45/12, label: 'Text'  },
    { at: 3.55/12, label: 'Sub'   },
    { at: 5.1/12,  label: 'Tag'   },
    { at: 5.5/12,  label: 'Hold'  },
    { at: 10.8/12, label: 'Fade'  },
  ];

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#090909', fontFamily: 'Inter,system-ui,sans-serif' }}>

      {/* Canvas */}
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', minHeight: 0 }}>
        <div ref={canvRef} data-screen-label="00s" style={{
          width: 1920, height: 1080, position: 'relative',
          transform: `scale(${scale})`, transformOrigin: 'center',
          flexShrink: 0, overflow: 'hidden',
          background: '#000',
          boxShadow: '0 28px 80px rgba(0,0,0,0.65)',
        }}>
          <TCtx.Provider value={t}>
            <Scene />
          </TCtx.Provider>
        </div>
      </div>

      {/* Playback bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', background: 'rgba(12,12,12,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)', width: '100%', maxWidth: 760, alignSelf: 'center', color: '#f6f4ef', userSelect: 'none', flexShrink: 0 }}>

        <button onClick={() => setT(0)} style={btn} title="Restart (0)">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" /></svg>
        </button>

        <button onClick={() => setPlaying(p => !p)} style={btn} title="Play/Pause (Space)">
          {playing
            ? <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="3" y="2" width="3" height="10" fill="currentColor" /><rect x="8" y="2" width="3" height="10" fill="currentColor" /></svg>
            : <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 2l9 5-9 5V2z" fill="currentColor" /></svg>
          }
        </button>

        <div style={{ fontFamily: mono, fontSize: 11, width: 68, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'rgba(246,244,239,0.80)' }}>{fmt(t)}</div>

        {/* Track */}
        <div style={{ flex: 1, position: 'relative', height: 28, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          ref={trackRef}
          onMouseDown={e => { setDrag(true); setT(tmFromEvt(e)); }}>

          {/* Phase tick marks */}
          {PHASES.map((ph, i) => (
            <div key={i} style={{
              position: 'absolute', left: `${ph.at * 100}%`,
              height: 6, width: 1, background: 'rgba(255,255,255,0.22)',
              top: 'calc(50% - 3px)',
            }}></div>
          ))}

          <div style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.10)', borderRadius: 2 }}></div>
          <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 3, background: `linear-gradient(90deg, ${TEAL}, ${TEAL_L})`, borderRadius: 2 }}></div>
          <div style={{ position: 'absolute', left: `${pct}%`, top: '50%', width: 13, height: 13, marginLeft: -6.5, marginTop: -6.5, background: '#fff', borderRadius: '50%', boxShadow: `0 0 0 2px ${TEAL}, 0 2px 6px rgba(0,0,0,0.4)` }}></div>
        </div>

        <div style={{ fontFamily: mono, fontSize: 11, width: 52, fontVariantNumeric: 'tabular-nums', color: 'rgba(246,244,239,0.38)' }}>{fmt(DUR)}</div>

        {/* Duration badge */}
        <div style={{
          fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 600,
          letterSpacing: '0.08em', padding: '3px 8px',
          background: `rgba(62,155,155,0.18)`, border: `1px solid rgba(62,155,155,0.32)`,
          borderRadius: 4, color: TEAL_L, flexShrink: 0,
        }}>
          12s LOOP
        </div>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
function EnamoraAnimation() { return React.createElement(AnimStage, null); }
window.EnamoraAnimation = EnamoraAnimation;
