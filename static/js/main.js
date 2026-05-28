/* ═══════════════════════════════════════════════════
   main.js  –  Global interactions: cursor, navbar,
               scroll progress, theme, reveal, counters
   د. وسام ميسر – عيادة الأسنان
═══════════════════════════════════════════════════ */

'use strict';

// ════════════════════════════
// 1. CUSTOM CURSOR
// ════════════════════════════
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // smooth ring follow
  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // ring expand on interactive elements
  const interactives = 'a, button, .srv-card, .test-card, .feat-card, .g-item, .soc, .nav-link-item';
  document.querySelectorAll(interactives).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '56px';
      ring.style.height = '56px';
      ring.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.opacity = '0.6';
    });
  });
})();


// ════════════════════════════
// 2. SCROLL PROGRESS BAR
// ════════════════════════════
(function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();


// ════════════════════════════
// 3. NAVBAR – scroll class + active link
// ════════════════════════════
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link-item');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    // scrolled class
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // active link
    const y = window.scrollY + 130;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const bot = top + sec.offsetHeight;
      const link = document.querySelector(`.nav-link-item[href="#${sec.id}"]`);
      if (link) link.classList.toggle('active', y >= top && y < bot);
    });
  }, { passive: true });
})();


// ════════════════════════════
// 4. MOBILE DRAWER
// ════════════════════════════
(function initMobileDrawer() {
  const toggle  = document.getElementById('mobToggle');
  const drawer  = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobOverlay');
  if (!toggle || !drawer || !overlay) return;

  const open  = () => { drawer.classList.add('open');  overlay.classList.add('show');  toggle.classList.add('open');  };
  const close = () => { drawer.classList.remove('open'); overlay.classList.remove('show'); toggle.classList.remove('open'); };

  toggle.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
})();


// ════════════════════════════
// 5. THEME TOGGLE – Dark / Light
// ════════════════════════════
(function initTheme() {
  const btn  = document.getElementById('themeBtn');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;
  if (!btn) return;

  let isDark = localStorage.getItem('theme') !== 'light';

  function applyTheme() {
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  applyTheme(); // restore on load

  btn.addEventListener('click', () => {
    isDark = !isDark;
    applyTheme();
    btn.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => (btn.style.transform = ''), 400);
  });
})();


// ════════════════════════════
// 6. HERO PARTICLE FIELD
// ════════════════════════════
(function initParticles() {
  const field = document.getElementById('particleField');
  if (!field) return;

  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.style.cssText = `
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 18 + 10}s;
      animation-delay:${Math.random() * 12}s;
      width:${Math.random() * 3 + 1}px;
      height:${Math.random() * 3 + 1}px;
    `;
    field.appendChild(s);
  }
})();


// ════════════════════════════
// 7. SCROLL REVEAL
// ════════════════════════════
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach((el) => obs.observe(el));
})();


// ════════════════════════════
// 8. ANIMATED COUNTERS
// ════════════════════════════
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !e.target._animated) {
        e.target._animated = true;
        const el     = e.target;
        const target = +el.dataset.target;
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const dur    = 2200;
        const step   = target / (dur / 16);
        let cur = 0;

        const timer = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(timer); }
          el.textContent = prefix + Math.floor(cur) + suffix;
        }, 16);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => obs.observe(c));
})();


// ════════════════════════════
// 9. PARALLAX – hero orbs
// ════════════════════════════
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      orb.style.transform = `translateY(${y * (i % 2 === 0 ? 0.08 : 0.05)}px)`;
    });
  }, { passive: true });
})();


// ════════════════════════════
// 10. SMOOTH SCROLL ANCHORS
// ════════════════════════════
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


// ════════════════════════════
// 11. WHATSAPP FLOAT HOVER
// ════════════════════════════
(function initWaHover() {
  const waBtn   = document.querySelector('.wa-btn');
  const waLabel = document.querySelector('.wa-label');
  if (!waBtn || !waLabel) return;

  waBtn.addEventListener('mouseenter', () => {
    waLabel.style.opacity   = '1';
    waLabel.style.transform = 'translateX(0) scale(1)';
  });
  waBtn.addEventListener('mouseleave', () => {
    waLabel.style.opacity   = '0';
    waLabel.style.transform = 'translateX(-10px) scale(0.9)';
  });
})();