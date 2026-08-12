/* ==========================================================
   MEDIA.JS
   Watches every real <img>/<video> tag inside a .media-frame.
   If the file at its src doesn't load (because the church
   hasn't supplied it yet), the wrapper gets `.is-missing` and
   CSS shows a clearly-labelled placeholder instead of a
   broken-image icon. As soon as a real file is placed at that
   same path, this does nothing and the real photo/video just
   shows.
   ========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  // ---- HERO PHOTO FALLBACK ----
  const heroImage = document.getElementById("heroImage");
  if (heroImage) {
    const heroBg = heroImage.querySelector(".hero-bg");
    if (heroBg) {
      if (heroBg.complete && heroBg.naturalWidth === 0) {
        heroImage.classList.add("hero-missing");
      }
      heroBg.addEventListener("error", () =>
        heroImage.classList.add("hero-missing"),
      );
      heroBg.addEventListener("load", () =>
        heroImage.classList.remove("hero-missing"),
      );
    }
  }

  // ---- ALL OTHER MEDIA FRAMES ----
  document.querySelectorAll(".media-frame").forEach((frame) => {
    const img = frame.querySelector("img");
    const video = frame.querySelector("video");

    if (img) {
      if (img.complete && img.naturalWidth === 0) {
        frame.classList.add("is-missing");
      }
      img.addEventListener("error", () => frame.classList.add("is-missing"));
      img.addEventListener("load", () => frame.classList.remove("is-missing"));
    }

    if (video) {
      video.addEventListener(
        "error",
        () => frame.classList.add("is-missing"),
        true,
      );
      video.addEventListener("loadeddata", () =>
        frame.classList.remove("is-missing"),
      );
      const source = video.querySelector("source");
      if (source) {
        source.addEventListener("error", () =>
          frame.classList.add("is-missing"),
        );
      }
    }
  });
});
