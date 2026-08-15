/* ==========================================================
   LIVE-TOGGLE.JS
   Reads SITE_CONFIG.liveStreamEnabled (js/site-config.js) and
   turns the "Watch Us Live" button on or off accordingly.
   Every page has the exact same button markup — this script is
   what makes it live or disabled, driven from one flag.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('[data-live-toggle]');
  if (!btn || typeof SITE_CONFIG === 'undefined') return;

  if (SITE_CONFIG.liveStreamEnabled) {
    btn.classList.add('is-live');
    btn.removeAttribute('aria-disabled');
    btn.removeAttribute('title');
  } else {
    btn.classList.remove('is-live');
    btn.setAttribute('aria-disabled', 'true');
    btn.setAttribute('title', 'Live stream not available yet — coming soon');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
    });
  }
});
