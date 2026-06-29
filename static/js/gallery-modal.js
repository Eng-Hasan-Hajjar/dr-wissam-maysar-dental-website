/* ═══════════════════════════════════════════════════
   gallery-modal.js
   معرض الحالات – قبل وبعد
   Enamora Dental Center

   مسار الملف: static/js/gallery-modal.js
   يُضاف قبل </body>:
   <script src="static/js/gallery-modal.js"></script>
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ═══════════════════════════════════════
     تحميل HTML الـ partial من ملف خارجي
     ويُضاف داخل #gallery-modal-container
  ═══════════════════════════════════════ */
  function loadModalHTML() {
    var container = document.getElementById('gallery-modal-container');
    if (!container) return;

    fetch('static/partials/gallery-modal.html')
      .then(function (res) {
        if (!res.ok) throw new Error('لم يتم تحميل الـ partial');
        return res.text();
      })
      .then(function (html) {
        container.innerHTML = html;
        bindEvents();        // ربط أحداث الإغلاق بعد الحقن
        initFilters();       // تفعيل الفلاتر
      })
      .catch(function (err) {
        console.warn('[GalleryModal]', err.message);
      });
  }

  /* ═══════════════════════════════════════
     فتح المودال
  ═══════════════════════════════════════ */
  window.openGalleryModal = function () {
    var modal = document.getElementById('galleryModal');
    if (!modal) return;
    modal.classList.add('gm-open');
    document.body.style.overflow = 'hidden';
    initModalSliders();   // نُشغّل السلايدرات عند أول فتح
  };

  /* ═══════════════════════════════════════
     إغلاق المودال
  ═══════════════════════════════════════ */
  window.closeGalleryModal = function () {
    var modal = document.getElementById('galleryModal');
    if (!modal) return;
    modal.classList.remove('gm-open');
    document.body.style.overflow = '';
  };

  /* ═══════════════════════════════════════
     ربط أحداث Overlay + Escape
  ═══════════════════════════════════════ */
  function bindEvents() {
    // إغلاق بالضغط خارج الـ Box
    var overlay = document.getElementById('galleryModal');
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) window.closeGalleryModal();
      });
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeGalleryModal();
  });

  /* ═══════════════════════════════════════
     فلترة الحالات
  ═══════════════════════════════════════ */
  function initFilters() {
    // ربط الأزرار بعد تحميل الـ HTML
    document.querySelectorAll('.gm-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterGallery(btn, btn.dataset.filter);
      });
    });
  }

  window.filterGallery = function (btn, category) {
    // تحديث الـ active
    document.querySelectorAll('.gm-filter').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    // إظهار / إخفاء
    document.querySelectorAll('.gm-item').forEach(function (item) {
      var match = category === 'all' || item.dataset.category === category;
      item.classList.toggle('gm-hidden', !match);
    });
  };

  /* ═══════════════════════════════════════
     Before / After Sliders داخل المودال
     يُشغَّل مرة واحدة فقط عند أول فتح
  ═══════════════════════════════════════ */
  var modalSlidersReady = false;

  function initModalSliders() {
    if (modalSlidersReady) return;
    modalSlidersReady = true;

    document.querySelectorAll('.modal-slider').forEach(function (slider) {
      var afterEl = slider.querySelector('.ba-after');
      var handle  = slider.querySelector('.ba-handle');
      if (!afterEl || !handle) return;

      var dragging = false;

      function setPos(clientX) {
        var rect = slider.getBoundingClientRect();
        var pct  = Math.max(2, Math.min(98,
          ((clientX - rect.left) / rect.width) * 100
        ));
        afterEl.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
        handle.style.left = pct + '%';
      }

      /* Mouse */
      slider.addEventListener('mousedown', function (e) {
        dragging = true;
        slider.classList.add('dragging');
        setPos(e.clientX);
        e.preventDefault();
      });
      window.addEventListener('mousemove', function (e) {
        if (dragging) setPos(e.clientX);
      });
      window.addEventListener('mouseup', function () {
        dragging = false;
        slider.classList.remove('dragging');
      });

      /* Touch */
      slider.addEventListener('touchstart', function (e) {
        dragging = true;
        setPos(e.touches[0].clientX);
        e.preventDefault();
      }, { passive: false });
      window.addEventListener('touchmove', function (e) {
        if (dragging) setPos(e.touches[0].clientX);
      }, { passive: false });
      window.addEventListener('touchend', function () {
        dragging = false;
      });

      /* كشف الصور الفاشلة */
      var imgs = slider.querySelectorAll('img');
      var failCount = 0;
      imgs.forEach(function (img) {
        if (img.complete && !img.naturalWidth) {
          failCount++;
        } else {
          img.addEventListener('error', function () {
            if (++failCount >= 2) {
              slider.closest('.gm-item').classList.add('gm-no-img');
            }
          });
        }
      });
      if (failCount >= 2) {
        slider.closest('.gm-item').classList.add('gm-no-img');
      }
    });
  }

  /* ═══════════════════════════════════════
     التشغيل عند تحميل الصفحة
  ═══════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadModalHTML);
  } else {
    loadModalHTML();
  }

})();