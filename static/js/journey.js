/* Enamora's hero timeline and scroll entrance effects. No client libraries. */
(() => {
  'use strict';
  const hero = document.querySelector('[data-journey]');
  if (!hero) return;
  const stage = hero.querySelector('[data-journey-stage]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const controls = hero.querySelector('.journey-controls');
  const play = hero.querySelector('[data-journey-play]');
  const skip = hero.querySelector('[data-journey-skip]');
  const status = play.querySelector('span');
  const times = {
    cairo: [860, 2160], erbil: [1180, 2330],
    dubai: [1475, 3100], istanbul: [1930, 3360],
    reveal: [4140, 5390], title: [4640, 5400], duration: 6800
  };
  const routes = [...stage.querySelectorAll('[data-route]')].map((group) => {
    const trace = group.querySelector('.route-trace');
    const glow = group.querySelector('.route-glow');
    return {
      trace, glow,
      head: group.querySelector('.route-head'),
      length: trace.getTotalLength(),
      points: times[group.dataset.route]
    };
  });
  const wave1 = stage.querySelector('.wave-1');
  const wave2 = stage.querySelector('.wave-2');
  const clamp = (p) => Math.min(1, Math.max(0, p));
  const range = (t, start, end) => clamp((t - start) / (end - start));
  const ease = (p) => p * p * (3 - 2 * p);
  const mix = (a, b, p) => a + (b - a) * p;

  function draw(time) {
    const switchFrame = ease(range(time, ...times.reveal));
    const typeFrame = ease(range(time, ...times.title));
    const zoomFrame = ease(range(time, 3330, 5350));
    const film = time / times.duration;
    stage.style.setProperty('--film-progress', film.toFixed(3));
    stage.style.setProperty('--map-opacity', (1 - switchFrame).toFixed(3));
    stage.style.setProperty('--land-scale', mix(1, 1.24, zoomFrame).toFixed(3));
    stage.style.setProperty('--scene-opacity', switchFrame.toFixed(3));
    stage.style.setProperty('--scene-text', typeFrame.toFixed(3));
    stage.style.setProperty('--legend-opacity', (1 - ease(range(time, 3840, 4620))).toFixed(3));
    stage.style.setProperty('--citadel-scale', mix(1.11, 1.025, ease(range(time, 4100, 6800))).toFixed(3));
    const pulse = range(time, 3230, 4560);
    wave1.setAttribute('r', mix(13, 51, pulse));
    wave1.style.opacity = (Math.sin(Math.PI * pulse) * .76).toFixed(3);
    const second = range(time, 3390, 4680);
    wave2.setAttribute('r', mix(16, 73, second));
    wave2.style.opacity = (Math.sin(Math.PI * second) * .43).toFixed(3);
    routes.forEach(({ trace, glow, head, length, points }) => {
      const raw = range(time, ...points);
      const progress = ease(raw);
      const offset = 1 - progress;
      trace.style.strokeDasharray = '1 1';
      glow.style.strokeDasharray = '1 1';
      trace.style.strokeDashoffset = offset;
      glow.style.strokeDashoffset = offset;
      head.style.opacity = raw > 0 && raw < 1 ? Math.min(raw * 13, (1 - raw) * 14, 1) : 0;
      if (raw > 0 && raw < 1) {
        const next = trace.getPointAtLength(length * progress);
        head.setAttribute('cx', next.x);
        head.setAttribute('cy', next.y);
      }
    });
  }

  let mode = 'ready';
  let elapsed = 0;
  let saved = 0;
  let frame = 0;
  let started = null;
  let autoQueued = false;

  function updateMode(next) {
    mode = next;
    play.dataset.mode = next;
    const labels = { ready: 'تشغيل المشهد', playing: 'إيقاف مؤقت', paused: 'متابعة المشهد', ended: 'إعادة المشهد' };
    status.textContent = labels[next];
    play.setAttribute('aria-label', labels[next]);
    skip.hidden = next === 'ended';
  }
  function stop() {
    cancelAnimationFrame(frame);
    if (mode !== 'playing') return;
    saved = elapsed;
    updateMode('paused');
  }
  function tick(timestamp) {
    if (mode !== 'playing') return;
    if (started === null) started = timestamp;
    elapsed = Math.min(times.duration, saved + timestamp - started);
    draw(elapsed);
    if (elapsed === times.duration) {
      saved = 0;
      updateMode('ended');
    } else {
      frame = requestAnimationFrame(tick);
    }
  }
  function start() {
    if (mode === 'playing') return;
    if (mode === 'ended' || mode === 'ready') saved = 0;
    elapsed = saved;
    started = null;
    draw(elapsed);
    updateMode('playing');
    frame = requestAnimationFrame(tick);
  }
  function showEnd() {
    cancelAnimationFrame(frame);
    elapsed = times.duration;
    saved = 0;
    draw(elapsed);
    if (document.activeElement === skip) play.focus({ preventScroll: true });
    updateMode('ended');
  }
  function showMap() {
    cancelAnimationFrame(frame);
    updateMode('ready');
    saved = 0;
    elapsed = 0;
    draw(0);
    for (const { trace, glow } of routes) {
      trace.style.strokeDashoffset = '0';
      glow.style.strokeDashoffset = '0';
    }
  }

  controls.hidden = false;
  stage.setAttribute('data-player', '');
  showMap();
  play.addEventListener('click', () => {
    if (reduce.matches) {
      if (mode === 'ended') showMap();
      else showEnd();
    } else if (mode === 'playing') stop();
    else start();
  });
  skip.addEventListener('click', showEnd);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  reduce.addEventListener('change', () => { if (reduce.matches && mode === 'playing') showMap(); });

  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !autoQueued && !reduce.matches) {
        autoQueued = true;
        if (mode === 'ready') start();
      } else if (!entry.isIntersecting && mode === 'playing') stop();
    }, { threshold: .34 });
    visibility.observe(stage);
  } else if (!reduce.matches) {
    start();
  }

  if ('IntersectionObserver' in window && Element.prototype.animate) {
    const animatedItems = document.querySelectorAll('.services .section-head, .service-card, .about-copy, .about-art, .team .section-head, .founder, .member, .gallery-heading, .case-card:not([data-more]), .visit-grid > div, .booking-copy, .booking-card, .location-copy, .map-card');
    const reveal = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        reveal.unobserve(target);
        if (reduce.matches || target.matches(':focus-within')) continue;
        const speed = target.matches('.member,.service-card,.case-card') ? 535 : 660;
        const animation = target.animate([
          { opacity: .66, transform: 'translateY(13px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: speed, easing: 'cubic-bezier(.21,.69,.28,1)', fill: 'none' });
        const cancelForFocus = () => animation.cancel();
        target.addEventListener('focusin', cancelForFocus, { once: true });
        animation.addEventListener('finish', () => target.removeEventListener('focusin', cancelForFocus), { once: true });
      }
    }, { threshold: .12 });
    animatedItems.forEach((item) => {
      if (item.getBoundingClientRect().top > innerHeight) reveal.observe(item);
    });
  }
})();
