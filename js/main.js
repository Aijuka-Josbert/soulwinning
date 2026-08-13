
document.addEventListener("DOMContentLoaded", function () {
  // ---- SCROLL SPY (Active Nav) — only relevant on pages using in-page hash sections ----
  const hashNavLinks = document.querySelectorAll('.nav-list a[href^="#"]');
  if (hashNavLinks.length) {
    const sections = document.querySelectorAll("section[id]");

    function updateActiveNav() {
      let currentSectionId = "";
      const scrollY = window.scrollY + 120; // offset for header

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute("id");
        }
      });

      hashNavLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active");
        }
      });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    window.addEventListener("load", updateActiveNav);
  }

  // ---- SCROLL ANIMATIONS (Intersection Observer) ----
  const animateElements = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    },
  );
  animateElements.forEach((el) => observer.observe(el));

  // ---- BACK TO TOP ----
  const backBtn = document.getElementById("backToTop");
  if (backBtn) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 400) {
          backBtn.classList.add("visible");
        } else {
          backBtn.classList.remove("visible");
        }
      },
      { passive: true },
    );
    backBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- SMOOTH SCROLL FOR IN-PAGE ANCHORS ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
