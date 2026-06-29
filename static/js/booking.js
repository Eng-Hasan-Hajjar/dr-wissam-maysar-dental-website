/* ═══════════════════════════════════════════════════
   booking.js  –  نظام الحجز عبر واتساب
   المريض يملأ الفورم → يضغط إرسال → يُفتح واتساب
   مع الرسالة جاهزة → المريض يضغط إرسال داخل واتساب
   د. وسام ميسر – عيادة Enamora لطب وتجميل الأسنان
═══════════════════════════════════════════════════ */

'use strict';

/* ── رقم الواتساب (مع رمز الدولة بدون +) ─── */
var WHATSAPP_NUMBER = '963999020549';

/* ── حقن أنيميشن الاهتزاز مرة واحدة ──────── */
(function injectShake() {
  if (document.getElementById('shake-style')) return;
  var style = document.createElement('style');
  style.id = 'shake-style';
  style.textContent = [
    '@keyframes shake {',
    '  0%,100% { transform:translateX(0); }',
    '  20%,60%  { transform:translateX(-7px); }',
    '  40%,80%  { transform:translateX(7px); }',
    '}',
    '.input-error {',
    '  border-color: #ff4d6d !important;',
    '  box-shadow: 0 0 0 3px rgba(255,77,109,0.15) !important;',
    '  animation: shake 0.4s ease;',
    '}'
  ].join('\n');
  document.head.appendChild(style);
})();

/* ── مساعد: اهتزاز حقل خاطئ ───────────────── */
function shakeField(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('input-error');
  /* إعادة تشغيل الأنيميشن */
  void el.offsetWidth;
  el.classList.add('input-error');
  el.focus();
  setTimeout(function () { el.classList.remove('input-error'); }, 600);
}

/* ── تحويل التاريخ إلى نص عربي مقروء ──────── */
function formatDate(dateStr) {
  if (!dateStr) return 'غير محدد';
  try {
    var parts = dateStr.split('-'); // YYYY-MM-DD
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    var days   = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
    var months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو',
                  'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    return days[d.getDay()] + '، ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  } catch (e) {
    return dateStr;
  }
}

/* ── بناء نص رسالة الواتساب ────────────────── */
function buildMessage(data) {
  var lines = [
    '\uD83E\uDDB7 *طلب حجز موعد - عيادة Enamora*',
    '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501',
    '\uD83D\uDC64 *الاسم:* ' + data.name,
    '\uD83D\uDCDE *رقم الهاتف:* ' + data.phone,
    '\uD83D\uDD27 *الخدمة المطلوبة:* ' + data.service,
    '\uD83D\uDCC5 *التاريخ المطلوب:* ' + formatDate(data.date)
  ];

  if (data.note) {
    lines.push('\uD83D\uDCDD *ملاحظات:* ' + data.note);
  }

  lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
  lines.push('\u2705 أرجو تأكيد الموعد، شكراً جزيلاً!');

  return lines.join('\n');
}

/* ══════════════════════════════════════════════
   الدالة الرئيسية – تُستدعى عند الضغط على الزر
══════════════════════════════════════════════ */
function submitBooking() {
  /* 1. جمع القيم */
  var nameEl    = document.getElementById('bName');
  var phoneEl   = document.getElementById('bPhone');
  var serviceEl = document.getElementById('bService');
  var dateEl    = document.getElementById('bDate');
  var noteEl    = document.getElementById('bNote');

  var name    = nameEl    ? nameEl.value.trim()    : '';
  var phone   = phoneEl   ? phoneEl.value.trim()   : '';
  var service = serviceEl ? serviceEl.value.trim() : '';
  var date    = dateEl    ? dateEl.value           : '';
  var note    = noteEl    ? noteEl.value.trim()    : '';

  /* 2. التحقق من الحقول المطلوبة */
  var valid = true;

  if (!name)    { shakeField('bName');    valid = false; }
  if (!phone)   { shakeField('bPhone');   valid = false; }
  if (!service) { shakeField('bService'); valid = false; }
  if (!date)    { shakeField('bDate');    valid = false; }

  if (!valid) {
    /* تحريك الزر ليُظهر رفضه */
    var btn = document.querySelector('.btn-submit');
    if (btn) {
      btn.style.background = 'linear-gradient(135deg,#ff4d6d,#c9184a)';
      setTimeout(function () {
        btn.style.background = '';
      }, 800);
    }
    return;
  }

  /* 3. بناء الرسالة وفتح واتساب مباشرة */
  var msg = buildMessage({ name: name, phone: phone, service: service, date: date, note: note });

  /*
    wa.me/?text=... يفتح واتساب مع الرسالة جاهزة في صندوق الإدخال
    المريض يرى رسالته ثم يضغط "إرسال" بنفسه
  */
  var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);

  /*
    نفتح واتساب مباشرة (بدون setTimeout لأن popup blockers
    تمنع window.open داخل setTimeout)
  */
  var waWindow = window.open(waUrl, '_blank');

  /* إذا مُنع فتح النافذة (popup blocker) نفتح في نفس التبويب */
  if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
    window.location.href = waUrl;
    return;
  }

  /* 4. إظهار رسالة نجاح بعد فتح واتساب */
  var modal = document.getElementById('successModal');
  if (modal) modal.classList.add('show');

  /* 5. تفريغ الفورم */
  if (nameEl)    nameEl.value    = '';
  if (phoneEl)   phoneEl.value   = '';
  if (serviceEl) serviceEl.value = '';
  if (dateEl)    dateEl.value    = '';
  if (noteEl)    noteEl.value    = '';
}

/* ── إغلاق الـ Modal ──────────────────────── */
function closeModal() {
  var modal = document.getElementById('successModal');
  if (modal) modal.classList.remove('show');
}

/* ── إغلاق الـ Modal عند النقر على الخلفية ── */
document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('successModal');
  if (!modal) return;
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
});