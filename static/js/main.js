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