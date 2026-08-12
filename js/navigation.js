document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('navPrimary');
  const body = document.body;

  if (!toggle || !nav) return;

  function openMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    body.classList.toggle('nav-open', open);
  }

  toggle.addEventListener('click', function () {
    openMenu(!nav.classList.contains('open'));
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
      // Only close if it's a same-page anchor or an internal link
      const href = this.getAttribute('href');
      if (href && (href.startsWith('#') || href.startsWith('index.html#') || href === 'index.html')) {
        openMenu(false);
      } else {
        // For other links, we still close the menu after navigation
        openMenu(false);
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
      openMenu(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      openMenu(false);
    }
  });
});