/* Native interactions. The main page remains usable without this script. */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const compactNav = window.matchMedia('(max-width: 879px)');
  document.documentElement.classList.add('js');

  // Mobile navigation and matching state for the main links.
  const toggle = $('.menu-toggle');
  const nav = $('#main-nav');
  const navLinks = $$('a', nav);
  let menuOpen = false;

  function setMenu(open, restoreFocus = false) {
    menuOpen = open;
    nav.toggleAttribute('data-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    $('.menu-open', toggle).hidden = open;
    $('.menu-close', toggle).hidden = !open;
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => setMenu(!menuOpen));
  nav.addEventListener('click', (event) => {
    if (!event.target.closest('a') || !menuOpen) return;
    const target = document.getElementById(event.target.closest('a').hash.slice(1));
    setMenu(false);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  document.addEventListener('keydown', (event) => {
    if (menuOpen && event.key === 'Escape') setMenu(false, true);
  });
  document.addEventListener('pointerdown', (event) => {
    if (menuOpen && !$('.site-header').contains(event.target)) setMenu(false);
  });
  compactNav.addEventListener('change', () => setMenu(false));

  const observed = navLinks.map((link) => document.getElementById(link.hash.slice(1)));
  if ('IntersectionObserver' in window) {
    const onScreen = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) onScreen.add(target);
        else onScreen.delete(target);
      });
      const active = [...onScreen].sort((a, b) =>
        Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top))[0];
      navLinks.forEach((link) => {
        if (active && link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -43% 0px' });
    observed.filter(Boolean).forEach((section) => observer.observe(section));
  }

  // Gallery filters and native keyboard-accessible comparison dialog.
  const filters = $$('.filter');
  const cases = $$('.case-card');
  const more = $('#gallery-more');
  const status = $('#gallery-status');
  const dialog = $('#case-dialog');
  const previous = $('#case-prev');
  const next = $('#case-next');
  let category = 'all';
  let showAll = false;
  let selection = null;
  let opener = null;

  const visibleCases = () => cases.filter((card) => !card.hidden);
  function updateGallery(announce = false) {
    filters.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    });
    cases.forEach((card) => {
      card.hidden = category === 'all'
        ? card.hasAttribute('data-more') && !showAll
        : card.dataset.category !== category;
    });
    more.closest('.gallery-footer').hidden = category !== 'all';
    more.setAttribute('aria-expanded', String(showAll));
    more.firstChild.nodeValue = showAll ? 'عرض حالات أقل ' : 'عرض كل الحالات ';
    status.textContent = announce ? 'عدد الحالات المعروضة: ' + visibleCases().length : '';
  }

  filters.forEach((button) => button.addEventListener('click', () => {
    category = button.dataset.filter;
    updateGallery(true);
  }));
  more.addEventListener('click', () => {
    showAll = !showAll;
    updateGallery(true);
    if (!showAll) $('#gallery-title').scrollIntoView({ block: 'start' });
  });
  updateGallery();

  if (typeof dialog.showModal === 'function') {
    function showCase(card, announce = false) {
      const list = visibleCases();
      const index = list.indexOf(card);
      if (index < 0) return;
      const pictures = $$('.case-thumbs img', card);
      const title = $('h3', card).textContent;
      $('#case-dialog-title').textContent = title;
      const counter = $('#dialog-index');
      counter.textContent = 'حالة ' + card.dataset.case + ' · ' + (index + 1) + ' من ' + list.length;
      [['#dialog-before', pictures[0]], ['#dialog-after', pictures[1]]].forEach(([selector, original]) => {
        const picture = $(selector);
        picture.alt = original.alt;
        picture.src = original.getAttribute('src');
      });
      previous.disabled = index === 0;
      next.disabled = index === list.length - 1;
      selection = card;
      if (announce && !counter.hasAttribute('aria-live')) counter.setAttribute('aria-live', 'polite');
    }

    function moveCase(offset) {
      const list = visibleCases();
      const candidate = list[list.indexOf(selection) + offset];
      if (candidate) showCase(candidate, true);
    }

    cases.forEach((card) => {
      const trigger = $('[data-compare]', card);
      trigger.addEventListener('click', () => {
        opener = trigger;
        showCase(card);
        dialog.showModal();
        $('#dialog-index').setAttribute('aria-live', 'polite');
      });
    });
    previous.addEventListener('click', () => moveCase(-1));
    next.addEventListener('click', () => moveCase(1));
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      moveCase(event.key === 'ArrowLeft' ? 1 : -1);
    });
    dialog.addEventListener('close', () => {
      $('#dialog-index').removeAttribute('aria-live');
      opener?.focus({ preventScroll: true });
      opener = null;
      selection = null;
    });
  } else {
    $$('[data-compare]').forEach((button) => { button.hidden = true; });
  }

  // Play the original brand clip on demand, without downloading it on the homepage.
  const clipLink = $('[data-clinic-video]');
  const clipDialog = $('#clinic-video-dialog');
  if (typeof clipDialog.showModal === 'function') {
    const clip = $('video', clipDialog);
    clipLink.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (!clip.hasAttribute('src')) clip.src = clipLink.getAttribute('href');
      clipDialog.showModal();
    });
    $('.dialog-close', clipDialog).addEventListener('click', () => clipDialog.close());
    clipDialog.addEventListener('close', () => {
      clip.pause();
      clipLink.focus({ preventScroll: true });
    });
  }

  // Create a request locally, then pass it to WhatsApp for the visitor to send.
  const form = $('#appointment-form');
  const service = $('#patient-service');
  const date = $('#patient-date');
  const name = $('#patient-name');
  const phone = $('#patient-phone');
  const ready = $('#booking-ready');
  const fallback = $('#booking-fallback');
  const baseWhatsApp = fallback.getAttribute('href');
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Damascus', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  function setMinDate() {
    const parts = Object.fromEntries(dateParts.formatToParts(new Date()).map((part) => [part.type, part.value]));
    date.min = [parts.year, parts.month, parts.day].join('-');
  }
  setMinDate();
  date.addEventListener('focus', setMinDate);
  form.hidden = false;

  $$('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      service.value = link.dataset.service;
      ready.hidden = true;
      fallback.href = baseWhatsApp;
    });
  });

  const toAsciiDigits = (value) => value.replace(/[٠-٩۰-۹]/g, (char) =>
    String(char.charCodeAt(0) - (char <= '٩' ? 0x660 : 0x6F0)));
  const formatDate = (value) => {
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('ar-SY-u-ca-gregory', {
      dateStyle: 'full', timeZone: 'UTC'
    }).format(new Date(Date.UTC(year, month - 1, day)));
  };

  form.addEventListener('input', () => {
    name.setCustomValidity('');
    phone.setCustomValidity('');
    ready.hidden = true;
    fallback.href = baseWhatsApp;
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    setMinDate();
    const cleanName = name.value.trim();
    const cleanPhone = toAsciiDigits(phone.value).trim().replace(/[\s().-]/g, '');
    name.setCustomValidity(cleanName.length >= 2 ? '' : 'اكتب اسمًا من حرفين على الأقل.');
    phone.setCustomValidity(/^\+?\d{7,15}$/.test(cleanPhone) ? '' : 'أدخل رقم هاتف صحيحًا.');
    if (!form.reportValidity()) return;
    const lines = [
      'مرحبًا، أرغب بطلب موعد في مركز Enamora.',
      'الاسم: ' + cleanName,
      'رقم الهاتف: ' + cleanPhone
    ];
    if (service.value) lines.push('الخدمة: ' + service.selectedOptions[0].textContent.trim());
    if (date.value) lines.push('التاريخ المفضّل: ' + formatDate(date.value));
    lines.push('يرجى إعلامي بالمواعيد المتاحة. شكرًا.');
    const url = new URL(baseWhatsApp);
    url.searchParams.set('text', lines.join('\n'));
    fallback.href = url.toString();
    ready.hidden = false;
    window.open(fallback.href, '_blank', 'noopener,noreferrer');
  });

  $('#footer-year').textContent = new Date().getFullYear().toString();
})();
