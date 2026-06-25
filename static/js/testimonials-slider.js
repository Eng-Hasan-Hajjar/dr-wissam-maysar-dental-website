/* ════════════════════════════════════════════════════
   testimonials-slider.js  –  سلايدر آراء المرضى
   يعمل على كل الشاشات (ديسكتوب + موبايل) مع RTL
   يستبدل منطق السلايدر الموجود في main.js
════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── انتظر تحميل الصفحة ── */
  function init() {
    var track    = document.getElementById('tsTrack');
    var stage    = document.getElementById('tsStage');
    var dotsWrap = document.getElementById('tsDots');
    var prevBtn  = document.getElementById('tsPrev');
    var nextBtn  = document.getElementById('tsNext');
    var progBar  = document.getElementById('tsProgress');

    if (!track || !stage) return;

    var slides  = Array.from(track.querySelectorAll('.ts-slide'));
    var TOTAL   = slides.length;
    if (TOTAL === 0) return;

    var current   = 0;
    var autoTimer = null;
    var AUTO_MS   = 5000;

    /* ── كم بطاقة تظهر في وقت واحد ── */
    function perView() {
      var w = window.innerWidth;
      if (w < 769)  return 1;
      if (w < 1025) return 2;
      return 3;
    }

    /* ── بناء النقاط ── */
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      var pv    = perView();
      var pages = Math.ceil(TOTAL / pv);
      for (var i = 0; i < pages; i++) {
        (function (idx) {
          var btn = document.createElement('button');
          btn.className = 'ts-dot';
          btn.setAttribute('aria-label', 'صفحة ' + (idx + 1));
          btn.addEventListener('click', function () { goTo(idx * pv); resetAuto(); });
          dotsWrap.appendChild(btn);
        })(i);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      var pv   = perView();
      var page = Math.floor(current / pv);
      var dots = dotsWrap.querySelectorAll('.ts-dot');
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === page);
      }
    }

    /* ── تحديث حالة الشرائح (active/adjacent) ── */
    function updateClasses() {
      var pv = perView();
      slides.forEach(function (s, i) {
        s.classList.remove('active', 'adjacent');
        if (i >= current && i < current + pv) {
          s.classList.add('active');
        } else if (i === current - 1 || i === current + pv) {
          s.classList.add('adjacent');
        }
      });
    }

    /* ── تحريك المسار ──
       المنطق: نحسب عرض شريحة واحدة (بما فيها الـ gap)
       ثم نضرب في الـ index الحالي.
       في RTL المسار يتحرك بـ translateX موجب للتقدم.
    ── */
    function moveTrack(extraPx) {
      if (!slides[0]) return;

      /* احسب عرض شريحة واحدة بما فيها نصف الـ gap من كل جانب */
      var slideRect = slides[0].getBoundingClientRect();
      var slideW    = slideRect.width;

      /* الـ gap المُعرَّف في CSS هو 24px */
      var GAP = 24;
      var step = slideW + GAP;

      /* RTL: translateX موجب يحرك لليسار (التالي) */
      var offset = current * step + (extraPx || 0);
      track.style.transform = 'translateX(' + offset + 'px)';
    }

    /* ── الانتقال إلى شريحة ── */
    function goTo(idx, animate) {
      var pv     = perView();
      var maxIdx = Math.max(0, TOTAL - pv);
      current    = Math.min(Math.max(idx, 0), maxIdx);

      track.style.transition = (animate === false)
        ? 'none'
        : 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';

      moveTrack();
      updateClasses();
      updateDots();

      /* شريط التقدم */
      if (progBar) {
        var pv2   = perView();
        var pages = Math.ceil(TOTAL / pv2);
        var page  = Math.floor(current / pv2);
        progBar.style.width = ((page + 1) / pages * 100) + '%';
      }
    }

    function prevSlide() { goTo(current - perView()); resetAuto(); }
    function nextSlide() {
      var pv = perView();
      if (current + pv >= TOTAL) goTo(0);
      else goTo(current + pv);
      resetAuto();
    }

    /* ── التشغيل التلقائي ── */
    function resetAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(nextSlide, AUTO_MS);
    }

    /* ── السحب باللمس والماوس ── */
    var dragStartX = 0;
    var isDragging = false;

    function onDragStart(x) {
      isDragging = true;
      dragStartX = x;
      track.style.transition = 'none';
      if (autoTimer) clearInterval(autoTimer);
    }
    function onDragMove(x) {
      if (!isDragging) return;
      var delta = x - dragStartX;
      /* عكس الإشارة لأن RTL */
      moveTrack(-delta);
    }
    function onDragEnd(x) {
      if (!isDragging) return;
      isDragging = false;
      var delta = x - dragStartX;
      if (Math.abs(delta) > 55) {
        /* RTL: سحب يسار = التالي (delta سالب) */
        if (delta < 0) nextSlide();
        else prevSlide();
      } else {
        goTo(current);
      }
      resetAuto();
    }

    /* لمس */
    stage.addEventListener('touchstart', function (e) {
      onDragStart(e.touches[0].clientX);
    }, { passive: true });
    stage.addEventListener('touchmove', function (e) {
      onDragMove(e.touches[0].clientX);
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      onDragEnd(e.changedTouches[0].clientX);
    });

    /* ماوس */
    stage.addEventListener('mousedown', function (e) { onDragStart(e.clientX); });
    window.addEventListener('mousemove', function (e) { if (isDragging) onDragMove(e.clientX); });
    window.addEventListener('mouseup',   function (e) { if (isDragging) onDragEnd(e.clientX); });

    /* إيقاف التلقائي عند hover */
    stage.addEventListener('mouseenter', function () { if (autoTimer) clearInterval(autoTimer); });
    stage.addEventListener('mouseleave', resetAuto);

    /* أزرار */
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    /* لوحة المفاتيح */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  nextSlide();
      if (e.key === 'ArrowRight') prevSlide();
    });

    /* إعادة حساب عند تغيير حجم الشاشة */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        buildDots();
        goTo(0, false);
        resetAuto();
      }, 200);
    });

    /* ── التهيئة الأولى ── */
    buildDots();
    /* انتظر إطار واحد حتى تُحسب الأبعاد الحقيقية */
    requestAnimationFrame(function () {
      goTo(0, false);
      resetAuto();
    });
  }

  /* تشغيل بعد اكتمال الصفحة */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();