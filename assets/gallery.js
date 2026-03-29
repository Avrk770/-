(function () {
  const fallbackItems = [
    {
      id: "fallback-1",
      title: "Editorial Design",
      alt_text: "Editorial Design",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBzhr8C-1kwzoO1fvNz0XT80NbBm6_b5c2QSE6uf3MZpYz0gjyv_cXjuFH6mW6J8jgU9wnGhcjiP1ZKYgBfYmTYoCkxCjW62DVQ9746Oi0Pb4rNzIfy3Xd4XPH7nI16ujxDW7MhpPbuoTGAw_h6apqkxWgkhtyyEvd2oGJtQs1ZdYPhGSUnw8Ak9f7lKpiADH3j1m2BKWCOf7OzA8GhtVf6XAahdH6gjXPAVFtP1ZsfyxH3c0gHKpbvQURCCPC-TFnRXXo_3djuAdk"
    },
    {
      id: "fallback-2",
      title: "Identity Design",
      alt_text: "Identity Design",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBevWIoxydqL4R8qtvLrd3vqT5_AeOquaq7qa9OleMVTKFQKx6C9UXN8UD84fSDU1vYnnnMxGUjB9r3nIkpitigfGcqZ-K_9FIzbMwUh2q4XnfignGgu06pvTS6Afrg2W_Ul1qtPj9nAeQUvCFEL0aAlZFaKcwJvTtHXXXKsZyK4FynUv6twRwZOGoVyZ0zT7v3jCLIr4I4nrG8ikrItNEVVI4i08iozCPTKEGLStpliEfxoxZtNO57awwybKHF94UbAKNqY_1dzEg"
    },
    {
      id: "fallback-3",
      title: "Advertisement",
      alt_text: "Advertisement",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA7IIZE4s-eTM8MxOz1fVGzxt2sOwV7eNL0AOW5RCfpOZD85WCrh_SfxlO08WkjcZ2zu3VrozOxNoVadGvr9e8Sisu5CTss_Q7C36QX9KRUgs8JptenNaVF39DF5Dy4H_VPiHs96Eg9JtOsQYs6mRDuBrEM02-W5ZjnzdhfFtVBqb963QPmnsD__9WlC4BRUF39aXyD8eCeS7_ICUtWRYBu7KAnMli784AyxalJGyHFPYdHJCwx-CGJwHeyDoECapcgFP2RxlHEAm0"
    },
    {
      id: "fallback-4",
      title: "Stationery Design",
      alt_text: "Stationery Design",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCz1uaetV_ujy2wM2lGtnL3fysXJ77HEJk8xCMg0wBybf9v44LUgQCN93vg16gnmg792vLY5iIXBrrpawbWdlD8QmaaSW5T2Uays4Vssm4DfG-bviGRdkXaOcX3Uk7LcLZog_oQ2Khm6sNbNjFS67zdRpUHHWHu3cD_2cs9EFgcTh9VGbQVELI053QjtxQeHNGZR_0LuLIQe48tY5_5Z0_R2DQQ3VZy8iXpH18Er_kPPsnc7maGTLvjRCleFj5sRAUx-P_e9jdwWcs"
    },
    {
      id: "fallback-5",
      title: "Packaging",
      alt_text: "Packaging",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBbzEr1sStiFu6YOWp0Ag42VMGPY7gsDjyrVIo_ZFh44N8YkJtRO9aZ6ROs-eciWps94AE1ltuOgIr11NaEhM8QFcWS7mRqk6BmgMMDBukwG7iul4RnWiCl58Ru0qSCxROygS7o-lQCsASV7FFVoBq91BRuIrY4nxa1IPCvm7MhyhcYos3aXRk2iJBmvA7kdr5BMEonUrO7Pv9pJmY6fUKCchBXxXplQFC28P5dWdZrRyi-BlcE7wSFO5X1zS2Kq3stS3no6-iu0Qg"
    },
    {
      id: "fallback-6",
      title: "Typography Art",
      alt_text: "Typography Art",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC4LbaCHymOYOtKqBTaJE3k9hBBGPwUkBWBk8ibBaQgbH6s9Y8Tgtp7QG4ZzSho_w8G9wGnv7hXfsRJv-dS28j6ynB4RF6dYQJ1_OjLUd0zEoyQuZZ7BfiRJhiZe4VRrTBU0UOXkMJuqrfI5J57RPru-zhn_RQHXCEWMa4kfmbNe8GzN2Go93-bb7cQd4Px3mSKwUJl0JYbwSRD6lg7K-_wYCsLlIedOvVs9k2EP0BDH4otBIYhlP2kumKled9sTcKwyCLzvVNF8GY"
    },
    {
      id: "fallback-7",
      title: "Brand Manual",
      alt_text: "Brand Manual",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBy5Fq3eXDXHfXXlAt2gUhl4QWZ1MZ6_N98HI65xQRsrd7pyaXduU7QGT29onLBByuYr3JizyGk1_3T_b3N4v5fVCWcraqBWgAKiMYdleFIifZ90DzHpcadsJhTCXeeM7oqRjxrda77pa8mrEZEjPcH2UUh1QAm-24Kotw6cNcqkOI7FsR_BfGCdLuqPMCCQO11xSTerXCFyCJzC1dOZjXpBSihQB83N0f3MD5E9cc3dJlj5o_8h5r_iRI0aEtgh1pFlGDOROY8Abo"
    },
    {
      id: "fallback-8",
      title: "Signage",
      alt_text: "Signage",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAqqe4xQHiiokBxTTrC6-FCOL67AZHDLL6hTMTujxLBHrYL8UyMzSCdxrgUnirCtmvevPKdJfLWF4gHXpGdLEhRRLyLBj08wSXw_DuLmyLkYvYA9KgiOwtUyEp0rxL-YzaFocpdVLYawYlr6zhD3mBOr74qu2AgO5-3dhoRwwDYjngPSoq4vOnHfUY8U43OrQ92n43ICnLctOdFOLCdu6HxMDZCmB-wm84PfOtTxZkW2yxQ0LLa1FAxRCg1qdYEwhUadWEB7zZvST4"
    }
  ];

  let currentItems = [];
  let currentIndex = 0;

  const appConfig = window.APP_CONFIG || {};
  const modal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("close-lightbox");
  const prevBtn = document.getElementById("prev-lightbox");
  const nextBtn = document.getElementById("next-lightbox");
  const featuredSection = document.getElementById("featured-section");
  const featuredViewport = document.getElementById("featured-viewport");
  const featuredTrack = document.getElementById("featured-track");
  const masonryGrid = document.getElementById("masonry-grid");
  const galleryStatus = document.getElementById("gallery-status");

  let featuredAnimationFrame = null;
  let featuredCurrentX = 0;
  let featuredSetWidth = 0;
  let featuredCycleWidth = 0;
  let isFeaturedPaused = false;
  let featuredResizeTimer = null;

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function isMissingFeaturedColumnError(error) {
    const message = String((error && error.message) || "").toLowerCase();
    return message.includes("is_featured") && (message.includes("column") || message.includes("schema"));
  }

  function setStatus(message) {
    if (!galleryStatus) {
      return;
    }

    galleryStatus.textContent = message;
  }

  function createSupabaseClient() {
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      return null;
    }

    if (!appConfig.SUPABASE_URL || !appConfig.SUPABASE_ANON_KEY) {
      return null;
    }

    return window.supabase.createClient(appConfig.SUPABASE_URL, appConfig.SUPABASE_ANON_KEY);
  }

  async function fetchGalleryItems() {
    const supabaseClient = createSupabaseClient();
    if (!supabaseClient) {
      setStatus("האתר פועל במצב דמו. להגדרה מלאה, חבר Supabase בקובץ app-config.js.");
      return fallbackItems;
    }

    let { data, error } = await supabaseClient
      .from("gallery_items")
      .select("id, title, alt_text, image_url, sort_order, created_at, is_featured")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error && isMissingFeaturedColumnError(error)) {
      const fallbackResult = await supabaseClient
        .from("gallery_items")
        .select("id, title, alt_text, image_url, sort_order, created_at")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      data = (fallbackResult.data || []).map(function (item) {
        return Object.assign({}, item, { is_featured: false });
      });
      error = fallbackResult.error;
    }

    if (error) {
      console.error("Failed to fetch gallery items", error);
      setStatus("נכשל חיבור לגלריה החיה. מוצג תוכן דמו זמני.");
      return fallbackItems;
    }

    if (!data || data.length === 0) {
      setStatus("הגלריה עדיין ריקה.");
      return [];
    }

    setStatus("");
    return data;
  }

  function renderGallery(items) {
    currentItems = items.slice();
    const indexById = new Map(
      currentItems.map(function (item, index) {
        return [item.id, index];
      })
    );

    if (!items.length) {
      stopFeaturedMarquee();
      if (featuredSection) {
        featuredSection.classList.add("hidden");
      }
      if (featuredViewport) {
        featuredViewport.classList.add("hidden");
      }
      if (featuredTrack) {
        featuredTrack.innerHTML = "";
      }
      masonryGrid.innerHTML =
        '<div class="rounded-2xl bg-surface-container-low dark:bg-white/5 p-8 border border-black/[0.05] dark:border-white/10"><p class="text-lg">אין כרגע עבודות להצגה.</p></div>';
      return;
    }

    const featuredItems = items.filter(function (item) {
      return Boolean(item.is_featured);
    });
    const regularItems = items.slice();

    renderFeaturedSection(featuredItems, indexById);
    renderRegularGallery(regularItems, indexById);

    if (regularItems.length) {
      initRevealAnimation();
    }

    bindGalleryEvents();
  }

  function renderFeaturedSection(items, indexById) {
    if (!featuredViewport || !featuredTrack || !featuredSection) {
      return;
    }

    stopFeaturedMarquee();

    if (!items.length) {
      featuredSection.classList.add("hidden");
      featuredViewport.classList.add("hidden");
      featuredTrack.innerHTML = "";
      return;
    }

    featuredSection.classList.remove("hidden");

    const cardsHtml = items
      .map(function (item) {
        const title = escapeHtml(item.title || "");
        const altText = escapeHtml(item.alt_text || item.title || "Portfolio image");
        const imageUrl = escapeHtml(item.image_url);
        const globalIndex = Number(indexById.get(item.id) || 0);

        return (
          '<article class="featured-card group">' +
          '<img class="gallery-image featured-image cursor-zoom-in" src="' +
          imageUrl +
          '" alt="' +
          altText +
          '" draggable="false" data-index="' +
          globalIndex +
          '">' +
          (title ? '<div class="px-3 py-2 text-sm text-on-surface-variant dark:text-white/70">' + title + "</div>" : "") +
          "</article>"
        );
      })
      .join("");

    featuredTrack.innerHTML =
      '<div class="featured-set">' +
      cardsHtml +
      '</div><div class="featured-set" aria-hidden="true">' +
      cardsHtml +
      '</div><div class="featured-set" aria-hidden="true">' +
      cardsHtml +
      "</div>";
    featuredViewport.classList.remove("hidden");
    startFeaturedMarquee();
  }

  function renderRegularGallery(items, indexById) {
    if (!items.length) {
      masonryGrid.innerHTML =
        '<div class="rounded-2xl bg-surface-container-low dark:bg-white/5 p-8 border border-black/[0.05] dark:border-white/10"><p class="text-lg">אין כרגע עבודות נוספות להצגה.</p></div>';
      return;
    }

    masonryGrid.innerHTML = items
      .map(function (item, index) {
        const title = escapeHtml(item.title || "");
        const altText = escapeHtml(item.alt_text || item.title || "Portfolio image");
        const imageUrl = escapeHtml(item.image_url);
        const globalIndex = Number(indexById.get(item.id) || index);

        return (
          '<article class="masonry-item">' +
          '<div class="portfolio-card rounded-2xl overflow-hidden bg-surface-container-low dark:bg-white/5 group cursor-pointer border border-black/[0.03] dark:border-white/5">' +
          '<img class="gallery-image w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:brightness-90 cursor-zoom-in" src="' +
          imageUrl +
          '" alt="' +
          altText +
          '" draggable="false" data-index="' +
          globalIndex +
          '">' +
          (title
            ? '<div class="p-4 text-sm text-on-surface-variant dark:text-white/70 font-medium">' + title + "</div>"
            : "") +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function stopFeaturedMarquee() {
    if (featuredAnimationFrame) {
      cancelAnimationFrame(featuredAnimationFrame);
      featuredAnimationFrame = null;
    }

    if (featuredTrack) {
      featuredTrack.style.transform = "translate3d(0, 0, 0)";
    }

    featuredCurrentX = 0;
    featuredSetWidth = 0;
    featuredCycleWidth = 0;
  }

  function ensureFeaturedSetIsWideEnough() {
    if (!featuredTrack || !featuredViewport) {
      return;
    }

    const sets = featuredTrack.querySelectorAll(".featured-set");
    const firstSet = sets[0];
    if (!firstSet || sets.length < 2) {
      return;
    }

    const viewportWidth = featuredViewport.clientWidth || window.innerWidth || 1;
    const baseHtml = firstSet.innerHTML;
    let guard = 0;
    while (firstSet.scrollWidth < viewportWidth * 1.8 && guard < 12) {
      firstSet.innerHTML += baseHtml;
      guard += 1;
    }

    for (let i = 1; i < sets.length; i += 1) {
      sets[i].innerHTML = firstSet.innerHTML;
    }
  }

  function startFeaturedMarquee() {
    if (!featuredViewport || !featuredTrack || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    ensureFeaturedSetIsWideEnough();

    const sets = featuredTrack.querySelectorAll(".featured-set");
    const firstSet = sets[0];
    const secondSet = sets[1];
    if (!firstSet || !secondSet) {
      return;
    }

    featuredSetWidth = firstSet.getBoundingClientRect().width;
    if (!featuredSetWidth) {
      return;
    }

    featuredCycleWidth = secondSet.offsetLeft - firstSet.offsetLeft;
    if (!featuredCycleWidth) {
      return;
    }

    featuredCurrentX = 0;
    let previousTs = performance.now();
    const pixelsPerSecond = 42;

    function tick(ts) {
      const delta = ts - previousTs;
      previousTs = ts;

      if (!isFeaturedPaused) {
        featuredCurrentX = (featuredCurrentX + (pixelsPerSecond * delta) / 1000) % featuredCycleWidth;
        featuredTrack.style.transform = "translate3d(" + -featuredCurrentX + "px, 0, 0)";
      }

      featuredAnimationFrame = requestAnimationFrame(tick);
    }

    featuredAnimationFrame = requestAnimationFrame(tick);
  }

  function initRevealAnimation() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const gridTemplateColumns = window.getComputedStyle(masonryGrid).gridTemplateColumns || "";
    const gridColumns = gridTemplateColumns
      .split(" ")
      .map(function (token) {
        return token.trim();
      })
      .filter(function (token) {
        return token && token !== "/";
      }).length;
    const columns = gridColumns > 0 ? gridColumns : 2;

    document.querySelectorAll(".masonry-item").forEach(function (item, index) {
      const delay = (index % columns) * 150;
      item.style.transitionDelay = delay + "ms";
      observer.observe(item);
    });
  }

  function updateLightboxContent(isInitial) {
    if (!isInitial) {
      lightboxImg.style.opacity = "0";
      lightboxImg.style.transform = "scale(0.95)";
    }

    setTimeout(function () {
      lightboxImg.src = currentItems[currentIndex].image_url;
      lightboxImg.alt = currentItems[currentIndex].alt_text || currentItems[currentIndex].title || "Gallery image";
      lightboxImg.onload = function () {
        lightboxImg.style.opacity = "1";
        lightboxImg.style.transform = "scale(1)";
      };
    }, isInitial ? 50 : 200);
  }

  function openLightbox(index) {
    currentIndex = index;
    modal.classList.remove("hidden");

    setTimeout(function () {
      modal.classList.add("opacity-100");
      updateLightboxContent(true);
    }, 10);

    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    modal.classList.remove("opacity-100");
    lightboxImg.style.transform = "scale(0.9)";
    lightboxImg.style.opacity = "0";

    setTimeout(function () {
      modal.classList.add("hidden");
      lightboxImg.src = "";
    }, 400);

    document.body.style.overflow = "";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % currentItems.length;
    updateLightboxContent(false);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    updateLightboxContent(false);
  }

  function bindGalleryEvents() {
    const galleryImages = Array.from(document.querySelectorAll(".gallery-image"));
    galleryImages.forEach(function (img) {
      img.addEventListener("click", function () {
        openLightbox(Number(img.dataset.index));
      });
    });
  }

  function initFeaturedInteractions() {
    if (!featuredViewport) {
      return;
    }

    featuredViewport.addEventListener("mouseenter", function () {
      isFeaturedPaused = true;
    });

    featuredViewport.addEventListener("mouseleave", function () {
      isFeaturedPaused = false;
    });

    featuredViewport.addEventListener(
      "touchstart",
      function () {
        isFeaturedPaused = true;
      },
      { passive: true }
    );

    featuredViewport.addEventListener(
      "touchend",
      function () {
        isFeaturedPaused = false;
      },
      { passive: true }
    );

    window.addEventListener("resize", function () {
      if (featuredResizeTimer) {
        clearTimeout(featuredResizeTimer);
      }

      featuredResizeTimer = setTimeout(function () {
        if (!featuredViewport.classList.contains("hidden")) {
          stopFeaturedMarquee();
          startFeaturedMarquee();
        }
      }, 150);
    });
  }

  function initLightboxControls() {
    closeBtn.addEventListener("click", closeLightbox);

    nextBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      showNext();
    });

    prevBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      showPrev();
    });

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (modal.classList.contains("hidden")) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowRight") {
        showPrev();
      }

      if (event.key === "ArrowLeft") {
        showNext();
      }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener(
      "touchstart",
      function (event) {
        touchStartX = event.changedTouches[0].screenX;
      },
      { passive: true }
    );

    modal.addEventListener(
      "touchend",
      function (event) {
        touchEndX = event.changedTouches[0].screenX;
        const threshold = 50;

        if (touchEndX < touchStartX - threshold) {
          showNext();
        }

        if (touchEndX > touchStartX + threshold) {
          showPrev();
        }
      },
      { passive: true }
    );
  }

  function initThemeToggle() {
    const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
    const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
    const themeToggleBtn = document.getElementById("theme-toggle");

    function updateIcons() {
      if (document.documentElement.classList.contains("dark")) {
        themeToggleLightIcon.classList.remove("hidden");
        themeToggleDarkIcon.classList.add("hidden");
      } else {
        themeToggleLightIcon.classList.add("hidden");
        themeToggleDarkIcon.classList.remove("hidden");
      }
    }

    updateIcons();

    themeToggleBtn.addEventListener("click", function () {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      }

      updateIcons();
    });
  }

  function initWhatsappCta() {
    const whatsappLink = document.getElementById("whatsapp-link");
    if (!whatsappLink) {
      return;
    }

    if (appConfig.WHATSAPP_NUMBER) {
      whatsappLink.href = "https://wa.me/" + appConfig.WHATSAPP_NUMBER;
      return;
    }

    whatsappLink.href = "mailto:hello@example.com";
    whatsappLink.textContent = "Contact";
  }

  function initMediaProtection() {
    document.addEventListener("contextmenu", function (event) {
      if (event.target.closest("img")) {
        event.preventDefault();
      }
    });

    document.addEventListener("dragstart", function (event) {
      if (event.target.closest("img")) {
        event.preventDefault();
      }
    });

    document.addEventListener("keydown", function (event) {
      const key = event.key.toLowerCase();
      const blocked =
        (event.metaKey && key === "s") ||
        (event.ctrlKey && key === "s") ||
        (event.metaKey && event.altKey && key === "i") ||
        (event.ctrlKey && event.shiftKey && key === "i") ||
        key === "f12";

      if (blocked) {
        event.preventDefault();
      }
    });
  }

  async function init() {
    initThemeToggle();
    initLightboxControls();
    initFeaturedInteractions();
    initWhatsappCta();
    initMediaProtection();

    const items = await fetchGalleryItems();
    renderGallery(items);
  }

  init();
})();
