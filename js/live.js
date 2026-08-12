/* ==========================================================
   LIVE.JS
   Opens/closes the "Watch Us Live" modal and only loads the
   YouTube iframe while the modal is open (so the stream isn't
   pulled in on every page load for people who never click it).
   ========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.getElementById("watchLiveBtn");
  const modal = document.getElementById("liveModal");
  if (!openBtn || !modal) return;

  const iframe = modal.querySelector("iframe");
  const originalSrc = iframe.getAttribute("src");

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    iframe.setAttribute("src", originalSrc);
    document.body.classList.add("nav-open");
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    iframe.setAttribute("src", "");
    document.body.classList.remove("nav-open");
  }

  openBtn.addEventListener("click", openModal);
  modal
    .querySelectorAll("[data-close-live]")
    .forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
});
