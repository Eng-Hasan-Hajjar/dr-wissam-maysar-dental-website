/* ═══════════════════════════════════════════════════
   booking.js  –  Booking Form Logic
   Validates inputs → builds WhatsApp message → opens wa.me
   د. وسام ميسر – عيادة الأسنان
═══════════════════════════════════════════════════ */

'use strict';

// ── CONFIGURATION ────────────────────────────────
const WHATSAPP_NUMBER = '963999020549'; // Syria country code + number

// ── SHAKE ANIMATION KEYFRAME (injected once) ─────
(function injectShake() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%,60%  { transform: translateX(-6px); }
      40%,80%  { transform: translateX(6px); }
    }
    .input-error {
      border-color: #ff4d6d !important;
      animation: shake 0.4s ease;
    }
  `;
  document.head.appendChild(style);
})();

// ── HELPERS ──────────────────────────────────────
function shakeField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('input-error');
  el.addEventListener('animationend', () => el.classList.remove('input-error'), { once: true });
  setTimeout(() => el.classList.remove('input-error'), 500);
}

function formatDateArabic(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SY', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric',
    });
  } catch {
    return dateStr;
  }
}

function buildWhatsAppMessage(data) {
  const lines = [
    '🦷 *طلب حجز موعد جديد*',
    '━━━━━━━━━━━━━━━━━━',
    `👤 *الاسم:* ${data.name}`,
    `📞 *الهاتف:* ${data.phone}`,
    `🔧 *الخدمة المطلوبة:* ${data.service}`,
    `📅 *التاريخ المطلوب:* ${formatDateArabic(data.date)}`,
  ];

  if (data.note) {
    lines.push(`📝 *ملاحظات:* ${data.note}`);
  }

  lines.push('━━━━━━━━━━━━━━━━━━');
  lines.push('✅ أرجو تأكيد الموعد، شكراً!');

  return lines.join('\n');
}

// ── MAIN SUBMIT FUNCTION ─────────────────────────
function submitBooking() {
  const nameEl    = document.getElementById('bName');
  const phoneEl   = document.getElementById('bPhone');
  const serviceEl = document.getElementById('bService');
  const dateEl    = document.getElementById('bDate');
  const noteEl    = document.getElementById('bNote');

  const name    = nameEl?.value.trim()    || '';
  const phone   = phoneEl?.value.trim()   || '';
  const service = serviceEl?.value        || '';
  const date    = dateEl?.value           || '';
  const note    = noteEl?.value.trim()    || '';

  // ── VALIDATION ──────────────────────────────────
  let valid = true;

  if (!name)    { shakeField('bName');    valid = false; }
  if (!phone)   { shakeField('bPhone');   valid = false; }
  if (!service) { shakeField('bService'); valid = false; }
  if (!date)    { shakeField('bDate');    valid = false; }

  if (!valid) return;

  // ── BUILD MESSAGE & OPEN WHATSAPP ────────────────
  const msg = buildWhatsAppMessage({ name, phone, service, date, note });
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  // show success modal, then open WhatsApp after short delay
  const modal = document.getElementById('successModal');
  if (modal) modal.classList.add('show');

  setTimeout(() => {
    window.open(url, '_blank');
  }, 900);
}

// ── MODAL CLOSE ──────────────────────────────────
function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) modal.classList.remove('show');
}

// close on overlay click
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('successModal');
  if (!modal) return;
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
});