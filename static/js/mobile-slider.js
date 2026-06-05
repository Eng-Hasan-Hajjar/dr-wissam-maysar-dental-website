/* ═══════════════════════════════════════════════════════════
   mobile-slider.js  –  سلايدر آراء المرضى (موبايل)
   يعمل فقط على شاشات ≤ 768px
   • رأي واحد في كل لحظة
   • تقليب تلقائي كل 3 ثوانٍ
   • سحب باللمس (swipe)
   • أزرار التنقل + النقاط
   • متوافق مع RTL
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function isMobile() { return window.innerWidth <= 768; }
  if (!isMobile()) return;

  var stage = document.getElementById('tsStage');
  var track = document.getElementById('tsTrack');
  if (!track || !stage) return;

  var slides = track.querySelectorAll('.ts-slide');
  var total  = slides.length;
  if (total === 0) return;

  var current   = 0;
  var autoTimer = null;

  /* ── إزالة مستمعات main.js القديمة عبر استنساخ الأزرار ── */
  function cleanBtn(id) {
    var btn = document.getElementById(id);
    if (!btn) return null;
    var clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
    return clone;
  }
  var prevBtn = cleanBtn('tsPrev');
  var nextBtn = cleanBtn('tsNext');

  /* ── إعادة بناء النقاط ── */
  var dotsWrap = document.getElementById('tsDots');
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'ts-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-i', i);
      dot.addEventListener('click', function () {
        goTo(parseInt(this.getAttribute('data-i'), 10));
        resetAuto();
      });
      dotsWrap.appendChild(dot);
    }
  }

  /* ── الانتقال إلى شريحة ── */
  function goTo(index) {
    current = ((index % total) + total) % total;

    // عرض الشريحة = عرض المسرح (كل شريحة 100%)
    var w = stage.offsetWidth;

    // RTL: translateX موجب = التقدم للشريحة التالية
    track.style.transition = 'transform 0.5s cubic-bezier(.25,.46,.45,.94)';
    track.style.transform  = 'translateX(' + (current * w) + 'px)';

    // تحديث النقاط
    if (dotsWrap) {
      var dots = dotsWrap.querySelectorAll('.ts-dot');
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle('active', j === current);
      }
    }

    // تحديث شريط التقدم
    var prog = document.getElementById('tsProgress');
    if (prog) prog.style.width = ((current + 1) / total * 100) + '%';

    // تحديث classes الشريحة
    for (var k = 0; k < slides.length; k++) {
      slides[k].classList.remove('active', 'adjacent');
      if (k === current) slides[k].classList.add('active');
    }
  }

  /* ── تقليب تلقائي كل 3 ثوانٍ ── */
  function resetAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(function () { goTo(current + 1); }, 3000);
  }

  /* ── أزرار التنقل ── */
  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

  /* ── سحب باللمس (swipe) ── */
  var startX = 0, startY = 0;

  track.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    track.style.transition = 'none'; // إيقاف الأنيميشن أثناء السحب
    if (autoTimer) clearInterval(autoTimer);
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    // فقط إذا الحركة الأفقية > العمودية وأكبر من 40px
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      // RTL: سحب لليمين = التالي ، لليسار = السابق
      if (dx > 0) goTo(current + 1);
      else goTo(current - 1);
    } else {
      goTo(current); // ارجع للمكان الحالي
    }
    resetAuto();
  }, { passive: true });

  /* ── تهيئة ── */
  goTo(0);
  resetAuto();

  /* ── إعادة حساب عند تغيير حجم الشاشة ── */
  window.addEventListener('resize', function () {
    if (isMobile()) goTo(current);
  });

})();