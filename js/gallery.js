
/* ==========================================================
   GALLERY.JS
   Renders the Gallery page's photos and videos from
   content/gallery.json instead of hardcoded HTML — that JSON
   file is what Decap CMS (/admin) edits, so adding or removing
   a photo/video there is all it takes for it to show up here,
   no HTML editing required.
   ========================================================== */
(function () {
  const imageGrid = document.getElementById("imageGrid");
  const videoGrid = document.getElementById("videoGrid");
  if (!imageGrid && !videoGrid) return; // not the gallery page

  const CATEGORY_LABELS = {
    worship: "Worship",
    evangelism: "Evangelism",
    prayer: "Prayer",
    community: "Community",
    youth: "Youth",
    events: "Events",
  };

  function photoTileHTML(item) {
    const label = CATEGORY_LABELS[item.category] || item.alt || "Photo";
    const captionHTML = item.caption
      ? `<span class="photo-caption">${escapeHTML(item.caption)}</span>`
      : "";
    return `
      <div class="gallery-item" data-category="${escapeHTML(item.category || "")}">
        <div class="media-frame">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.alt || label)}" loading="lazy" />
          <div class="media-placeholder-state">
            <i class="fas fa-image"></i>
            <span>${escapeHTML(label)}</span>
            <small>Photo to be provided</small>
          </div>
        </div>
        ${captionHTML}
      </div>`;
  }

  function videoTileHTML(item) {
    return `
      <div class="gallery-item">
        <div class="media-frame media-frame--video">
          <video controls preload="none" poster="${escapeHTML(item.poster || "")}">
            <source src="${escapeHTML(item.video)}" type="video/mp4" />
          </video>
          <div class="media-placeholder-state">
            <i class="fas fa-play-circle"></i>
            <span>${escapeHTML(item.title || "Video")}</span>
            <small>Video coming soon</small>
          </div>
        </div>
      </div>`;
  }

  function escapeHTML(str) {
    if (typeof str !== "string") return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  fetch("content/gallery.json")
    .then((res) => {
      if (!res.ok) throw new Error("gallery.json not found");
      return res.json();
    })
    .then((data) => {
      const photos = Array.isArray(data.photos) ? data.photos : [];
      const videos = Array.isArray(data.videos) ? data.videos : [];

      if (imageGrid) {
        imageGrid.innerHTML = photos.length
          ? photos.map(photoTileHTML).join("")
          : '<p class="gallery-empty">Photos coming soon.</p>';
      }
      if (videoGrid) {
        videoGrid.innerHTML = videos.length
          ? videos.map(videoTileHTML).join("")
          : '<p class="gallery-empty">Videos coming soon.</p>';
      }

      // Re-run the missing-media fallback detection (media.js) on the
      // tiles we just injected — it only auto-runs on page load otherwise.
      if (window.initMediaFrames) {
        if (imageGrid) window.initMediaFrames(imageGrid);
        if (videoGrid) window.initMediaFrames(videoGrid);
      }

      initTabsAndFilters();
    })
    .catch(() => {
      if (imageGrid) {
        imageGrid.innerHTML =
          '<p class="gallery-empty">Photos are being updated — please check back soon.</p>';
      }
      if (videoGrid) {
        videoGrid.innerHTML =
          '<p class="gallery-empty">Videos are being updated — please check back soon.</p>';
      }
    });

  function initTabsAndFilters() {
    // ---- Tab switching ----
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = {
      images: document.getElementById("tab-images"),
      videos: document.getElementById("tab-videos"),
    };

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        tabBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const tab = this.dataset.tab;
        Object.keys(tabContents).forEach((key) => {
          if (tabContents[key]) {
            tabContents[key].classList.toggle("active", key === tab);
          }
        });
      });
    });

    // ---- Image filter ----
    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll("#imageGrid .gallery-item");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        filterButtons.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const filter = this.dataset.filter;
        galleryItems.forEach((item) => {
          item.style.display =
            filter === "all" || item.dataset.category === filter
              ? "block"
              : "none";
        });
      });
    });
  }
})();
