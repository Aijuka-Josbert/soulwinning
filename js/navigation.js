/* ==========================================================
   NAVIGATION.JS
   Mobile menu toggle, header scroll state, and scroll
   progress bar. Shared by every page.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('navToggle');
  const navPrimary = document.getElementById('navPrimary');

  // ---- MOBILE MENU TOGGLE ----
  if (navToggle && navPrimary) {
    const openMenu = () => {
      navPrimary.classList.add('open');
      navToggle.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
    };
    const closeMenu = () => {
      navPrimary.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };
    const toggleMenu = () => {
      if (navPrimary.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when a nav link is clicked (mobile)
    navPrimary.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        navPrimary.classList.contains('open') &&
        !navPrimary.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navPrimary.classList.contains('open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    // If the viewport is resized back to desktop, reset state
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && navPrimary.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // ---- HEADER SCROLL STATE ----
  if (header) {
    const updateHeaderState = () => {
      if (window.scrollY > 12) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  // ---- SCROLL PROGRESS BAR ----
  const progressWrap = document.createElement('div');
  progressWrap.className = 'scroll-progress';
  progressWrap.setAttribute('aria-hidden', 'true');
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  progressWrap.appendChild(progressBar);
  document.body.prepend(progressWrap);

  const updateProgressBar = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + '%';
  };
  updateProgressBar();
  window.addEventListener('scroll', updateProgressBar, { passive: true });
  window.addEventListener('resize', updateProgressBar);
});
