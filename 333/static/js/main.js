/* ═══════════════════════════════════════════════════
   main.js  –  Global JS: cursor, navbar, theme,
               reveal, counters, particles, parallax
   د. وسام ميسر – عيادة الأسنان
═══════════════════════════════════════════════════ */
'use strict';

/* ── 1. CUSTOM CURSOR (desktop only) ──────────── */
(function initCursor() {
  if (window.matchMedia('(hover:none)').matches) return;
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  (function loop(){ rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(loop); })();
  document.querySelectorAll('a,button,.srv-card,.test-card,.feat-card,.g-item,.soc').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ ring.style.width='56px'; ring.style.height='56px'; ring.style.opacity='1'; });
    el.addEventListener('mouseleave',()=>{ ring.style.width='36px'; ring.style.height='36px'; ring.style.opacity='.6'; });
  });
})();

/* ── 2. PROGRESS BAR ──────────────────────────── */
(function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  const update = () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
})();

/* ── 3. NAVBAR ────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    const y = window.scrollY + 130;
    sections.forEach(sec => {
      const link = document.querySelector(`.nav-link-item[href="#${sec.id}"]`);
      if (link) link.classList.toggle('active', y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
    });
  }, { passive: true });
})();

/* ── 4. MOBILE DRAWER ─────────────────────────── */
(function initMobileDrawer() {
  const toggle  = document.getElementById('mobToggle');
  const drawer  = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobOverlay');
  if (!toggle || !drawer || !overlay) return;
  const open  = () => { drawer.classList.add('open');   overlay.classList.add('show');   toggle.classList.add('open');  };
  const close = () => { drawer.classList.remove('open'); overlay.classList.remove('show'); toggle.classList.remove('open'); };
  toggle.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

/* ── 5. THEME TOGGLE (Light default) ─────────── */
(function initTheme() {
  const btn  = document.getElementById('themeBtn');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;
  if (!btn) return;

  // Light is default; read saved preference
  const saved = localStorage.getItem('wissam_theme');
  let isDark  = saved === 'dark'; // only dark if explicitly saved

  function apply() {
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
  }
  apply();

  btn.addEventListener('click', () => {
    isDark = !isDark;
    localStorage.setItem('wissam_theme', isDark ? 'dark' : 'light');
    apply();
    btn.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => btn.style.transform = '', 450);
  });
})();

/* ── 6. PARTICLES ─────────────────────────────── */
(function initParticles() {
  const field = document.getElementById('particleField');
  if (!field) return;
  // fewer particles on mobile to save performance
  const count = window.innerWidth < 768 ? 12 : 28;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.style.cssText = `left:${Math.random()*100}%;animation-duration:${Math.random()*18+10}s;animation-delay:${Math.random()*12}s;width:${Math.random()*3+1}px;height:${Math.random()*3+1}px;`;
    field.appendChild(s);
  }
})();

/* ── 7. SCROLL REVEAL ─────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── 8. ANIMATED COUNTERS ─────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target._done) return;
      e.target._done = true;
      const el = e.target, target = +el.dataset.target;
      const prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = target / (2200 / 16);
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = prefix + Math.floor(cur) + suffix;
      }, 16);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ── 9. PARALLAX (desktop only) ──────────────── */
(function initParallax() {
  if (window.innerWidth < 992) return;
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs.forEach((o, i) => o.style.transform = `translateY(${y * (i%2===0?.08:.05)}px)`);
  }, { passive: true });
})();

/* ── 10. SMOOTH SCROLL ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── 11. WHATSAPP HOVER LABEL ─────────────────── */
(function initWaHover() {
  const waBtn   = document.querySelector('.wa-btn');
  const waLabel = document.querySelector('.wa-label');
  if (!waBtn || !waLabel) return;
  waBtn.addEventListener('mouseenter', () => { waLabel.style.opacity='1'; waLabel.style.transform='translateX(0) scale(1)'; });
  waBtn.addEventListener('mouseleave', () => { waLabel.style.opacity='0'; waLabel.style.transform='translateX(-10px) scale(.9)'; });
})();


// ════════════════════════════
// 12. TESTIMONIALS SLIDER
// ════════════════════════════
(function initTestimonialSlider() {
  const track    = document.getElementById('tsTrack');
  const stage    = document.getElementById('tsStage');
  const dotsWrap = document.getElementById('tsDots');
  const prevBtn  = document.getElementById('tsPrev');
  const nextBtn  = document.getElementById('tsNext');
  const progBar  = document.getElementById('tsProgress');
  if (!track) return;

  const slides     = Array.from(track.querySelectorAll('.ts-slide'));
  const TOTAL      = slides.length;
  const AUTO_MS    = 5000;   // autoplay interval
  let current      = 0;
  let autoTimer    = null;
  let progTimer    = null;
  let progStart    = null;
  let isDragging   = false;
  let dragStartX   = 0;
  let dragDelta    = 0;

  // ── Per-view count ───────────────────────
  function getPerView() {
    const w = window.innerWidth;
    if (w < 769)  return 1;
    if (w < 1025) return 2;
    return 3;
  }

  // ── Build dots ───────────────────────────
  function buildDots() {
    dotsWrap.innerHTML = '';
    const pv = getPerView();
    const pages = Math.ceil(TOTAL / pv);
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'ts-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'الصفحة ' + (i + 1));
      d.addEventListener('click', () => goTo(i * pv));
      dotsWrap.appendChild(d);
    }
  }

  // ── Update dot active ─────────────────────
  function updateDots() {
    const pv   = getPerView();
    const page = Math.floor(current / pv);
    dotsWrap.querySelectorAll('.ts-dot').forEach((d, i) => d.classList.toggle('active', i === page));
  }

  // ── Apply slide states ───────────────────
  function updateSlides() {
    const pv = getPerView();
    slides.forEach((s, i) => {
      s.classList.remove('active', 'adjacent');
      if (i >= current && i < current + pv) {
        s.classList.add('active');
      } else if (i === current - 1 || i === current + pv) {
        s.classList.add('adjacent');
      }
    });
  }

  // ── Move track ───────────────────────────
  function moveTrack(extra) {
    const pv       = getPerView();
    const slideW   = slides[0].offsetWidth + 24; // gap=24
    const offset   = -(current * slideW) + (extra || 0);
    // RTL: positive offset moves right
    track.style.transform = `translateX(${offset}px)`;
  }

  // ── Go to index ──────────────────────────
  function goTo(idx) {
    const pv = getPerView();
    const maxIdx = Math.max(0, TOTAL - pv);
    current = Math.min(Math.max(idx, 0), maxIdx);
    track.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
    moveTrack();
    updateSlides();
    updateDots();
  }

  // ── Navigate ─────────────────────────────
  function prev() { goTo(current - getPerView()); resetAutoPlay(); }
  function next() {
    const pv = getPerView();
    if (current + pv >= TOTAL) goTo(0);
    else goTo(current + pv);
    resetAutoPlay();
  }

  // ── Progress bar animation ───────────────
  function startProgress() {
    clearInterval(progTimer);
    progStart = Date.now();
    progBar.style.transition = 'none';
    progBar.style.width = '0%';
    requestAnimationFrame(() => {
      progTimer = setInterval(() => {
        const elapsed = Date.now() - progStart;
        const pct = Math.min((elapsed / AUTO_MS) * 100, 100);
        progBar.style.width = pct + '%';
        if (pct >= 100) clearInterval(progTimer);
      }, 30);
    });
  }

  // ── AutoPlay ─────────────────────────────
  function startAutoPlay() {
    clearInterval(autoTimer);
    startProgress();
    autoTimer = setInterval(() => {
      const pv = getPerView();
      if (current + pv >= TOTAL) goTo(0);
      else goTo(current + pv);
      startProgress();
    }, AUTO_MS);
  }
  function resetAutoPlay() { startAutoPlay(); }

  // ── Touch / Mouse drag ───────────────────
  function onDragStart(x) {
    isDragging = true;
    dragStartX = x;
    dragDelta  = 0;
    track.style.transition = 'none';
  }
  function onDragMove(x) {
    if (!isDragging) return;
    dragDelta = x - dragStartX;
    moveTrack(dragDelta);
  }
  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    const threshold = 60;
    if (dragDelta < -threshold) next();
    else if (dragDelta > threshold) prev();
    else goTo(current);
  }

  // Touch events
  stage.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
  stage.addEventListener('touchmove',  e => onDragMove(e.touches[0].clientX),  { passive: true });
  stage.addEventListener('touchend',   onDragEnd);

  // Mouse drag
  stage.addEventListener('mousedown',  e => onDragStart(e.clientX));
  window.addEventListener('mousemove', e => isDragging && onDragMove(e.clientX));
  window.addEventListener('mouseup',   onDragEnd);

  // Buttons
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  next();
    if (e.key === 'ArrowRight') prev();
  });

  // Pause on hover
  stage.addEventListener('mouseenter', () => clearInterval(autoTimer));
  stage.addEventListener('mouseleave', resetAutoPlay);

  // Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots(); goTo(0); startAutoPlay();
    }, 200);
  });

  // ── Init ─────────────────────────────────
  buildDots();
  goTo(0);
  startAutoPlay();
})();