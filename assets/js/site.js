(function () {
  function initMenu() {
    const menu = document.getElementById("mobileMenu");
    const toggle = document.getElementById("menuToggle");

    if (!menu || !toggle) {
      return;
    }

    function setOpen(isOpen) {
      menu.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    }

    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("open"));
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });
  }

  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lb-img");
    const closeButton = document.getElementById("lb-close");
    const prevButton = document.getElementById("lb-prev");
    const nextButton = document.getElementById("lb-next");
    const galleryImages = Array.from(document.querySelectorAll("[data-gallery-image]"));
    const singleImage = document.querySelector("[data-lightbox-single]");

    if (!lightbox || !lightboxImage || !closeButton || !prevButton || !nextButton) {
      return;
    }

    const state = {
      images: [],
      index: 0,
    };

    function showCurrentImage() {
      const currentImage = state.images[state.index];
      if (!currentImage) {
        return;
      }

      lightboxImage.src = currentImage.dataset.fullSrc || currentImage.src;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function open(images, index) {
      state.images = images;
      state.index = index;
      showCurrentImage();
    }

    function close() {
      lightbox.classList.remove("open");
      lightboxImage.src = "";
      document.body.style.overflow = "";
    }

    function step(direction) {
      if (state.images.length <= 1) {
        return;
      }

      state.index = (state.index + direction + state.images.length) % state.images.length;
      showCurrentImage();
    }

    galleryImages.forEach(function (image, index) {
      image.addEventListener("click", function () {
        open(galleryImages, index);
      });
    });

    if (singleImage) {
      singleImage.addEventListener("click", function () {
        open([singleImage], 0);
      });
    }

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        close();
      }
    });

    closeButton.addEventListener("click", close);

    prevButton.addEventListener("click", function (event) {
      event.stopPropagation();
      step(-1);
    });

    nextButton.addEventListener("click", function (event) {
      event.stopPropagation();
      step(1);
    });

    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("open")) {
        return;
      }

      if (event.key === "Escape") {
        close();
      }
      if (event.key === "ArrowRight") {
        step(1);
      }
      if (event.key === "ArrowLeft") {
        step(-1);
      }
    });
  }

  function preloadFullImages() {
    const fullImageUrls = Array.from(document.querySelectorAll("[data-full-src]"))
      .map(function (image) {
        return image.dataset.fullSrc;
      })
      .filter(Boolean);

    fullImageUrls.forEach(function (url) {
      const image = new Image();
      image.decoding = "async";
      image.src = url;
    });
  }

  function scheduleFullImagePreload() {
    window.addEventListener("load", function () {
      const run = preloadFullImages;

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(run, { timeout: 2500 });
        return;
      }

      window.setTimeout(run, 1200);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initLightbox();
    scheduleFullImagePreload();
  });
})();
