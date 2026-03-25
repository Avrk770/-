(function () {
  const config = window.APP_CONFIG || {};
  const bucketName = config.SUPABASE_GALLERY_BUCKET || "gallery";

  const setupState = document.getElementById("setup-state");
  const authState = document.getElementById("auth-state");
  const dashboardState = document.getElementById("dashboard-state");

  const loginForm = document.getElementById("login-form");
  const uploadForm = document.getElementById("upload-form");
  const fileInput = document.getElementById("image_file");
  const selectedFileName = document.getElementById("selected-file-name");
  const signOutBtn = document.getElementById("sign-out");
  const refreshBtn = document.getElementById("refresh-items");
  const feedbackEl = document.getElementById("feedback");
  const itemsGrid = document.getElementById("items-grid");

  let supabaseClient = null;
  let galleryItems = [];
  let dragSourceId = null;
  let isSavingOrder = false;

  function setFeedback(type, message) {
    if (!feedbackEl) {
      return;
    }

    feedbackEl.className = "rounded-xl px-4 py-3 text-sm";

    if (type === "error") {
      feedbackEl.classList.add("bg-red-50", "text-red-700", "border", "border-red-100");
    } else {
      feedbackEl.classList.add("bg-emerald-50", "text-emerald-700", "border", "border-emerald-100");
    }

    feedbackEl.textContent = message;
    feedbackEl.classList.remove("hidden");
  }

  function clearFeedback() {
    feedbackEl.textContent = "";
    feedbackEl.classList.add("hidden");
  }

  function safeFileName(fileName) {
    const ext = fileName.includes(".") ? fileName.split(".").pop() : "jpg";
    const base = fileName
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);

    return (base || "gallery") + "." + ext.toLowerCase();
  }

  function inferStoragePathFromPublicUrl(imageUrl) {
    const marker = "/object/public/" + bucketName + "/";
    const markerIndex = imageUrl.indexOf(marker);
    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(imageUrl.slice(markerIndex + marker.length));
  }

  function deriveAltTextFromFileName(fileName) {
    return fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "Gallery image";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function renderItems(items) {
    if (!items.length) {
      itemsGrid.innerHTML =
        '<div class="col-span-full rounded-xl border border-outline-variant bg-surface-container-low p-8 text-center text-on-surface-variant">אין עדיין תמונות בגלריה.</div>';
      return;
    }

    itemsGrid.innerHTML = items
      .map(function (item, index) {
        const imageUrl = escapeHtml(item.image_url || "");
        const storagePath = escapeHtml(item.storage_path || "");
        const isPublished = item.is_published;

        return (
          '<article class="gallery-card rounded-xl border border-outline-variant bg-white overflow-hidden" draggable="true" data-id="' +
          item.id +
          '" data-storage-path="' +
          storagePath +
          '" data-image-url="' +
          imageUrl +
          '">' +
          '<div class="aspect-square bg-surface-container-low relative">' +
          '<img src="' +
          imageUrl +
          '" alt="" class="h-full w-full object-cover" draggable="false">' +
          '<span class="absolute top-2 right-2 rounded-full px-2.5 py-1 text-xs ' +
          (isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700") +
          '">' +
          (isPublished ? "באתר" : "מוסתר") +
          "</span>" +
          "</div>" +
          '<div class="p-3 space-y-2">' +
          '<p class="text-xs text-on-surface-variant">סדר תצוגה: ' +
          (index + 1) +
          "</p>" +
          '<div class="grid grid-cols-2 gap-2">' +
          '<button type="button" class="toggle-publish rounded-lg border border-outline-variant px-3 py-2 text-xs hover:bg-surface-container-low">' +
          (isPublished ? "הסתר מהאתר" : "פרסם באתר") +
          "</button>" +
          '<button type="button" class="delete-item rounded-lg border border-red-300 text-red-700 px-3 py-2 text-xs hover:bg-red-50">מחק</button>' +
          "</div>" +
          '<p class="text-[11px] text-on-surface-variant">גרור לשינוי סדר</p>' +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  async function loadItems() {
    const { data, error } = await supabaseClient
      .from("gallery_items")
      .select("id, is_published, image_url, storage_path, sort_order, created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setFeedback("error", "נכשלה טעינת פריטי הגלריה: " + error.message);
      return;
    }

    galleryItems = data || [];
    renderItems(galleryItems);
  }

  function setAuthView(isLoggedIn) {
    if (isLoggedIn) {
      authState.classList.add("hidden");
      dashboardState.classList.remove("hidden");
      return;
    }

    authState.classList.remove("hidden");
    dashboardState.classList.add("hidden");
  }

  async function initSession() {
    const {
      data: { session },
      error
    } = await supabaseClient.auth.getSession();

    if (error) {
      setFeedback("error", "שגיאת אימות: " + error.message);
      setAuthView(false);
      return;
    }

    if (session) {
      setAuthView(true);
      await loadItems();
    } else {
      setAuthView(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    clearFeedback();

    const formData = new FormData(loginForm);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const { error } = await supabaseClient.auth.signInWithPassword({ email: email, password: password });

    if (error) {
      setFeedback("error", "התחברות נכשלה: " + error.message);
      return;
    }

    setFeedback("success", "התחברת בהצלחה.");
    await initSession();
  }

  async function handleSignOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      setFeedback("error", "התנתקות נכשלה: " + error.message);
      return;
    }

    setAuthView(false);
    setFeedback("success", "התנתקת.");
  }

  function updateSelectedFileName() {
    if (!fileInput || !selectedFileName) {
      return;
    }

    if (!fileInput.files || !fileInput.files.length) {
      selectedFileName.textContent = "לא נבחר קובץ";
      return;
    }

    selectedFileName.textContent = fileInput.files[0].name;
  }

  async function handleUpload(event) {
    event.preventDefault();
    clearFeedback();

    const formData = new FormData(uploadForm);
    const imageFile = formData.get("image_file");

    if (!(imageFile instanceof File) || !imageFile.size) {
      setFeedback("error", "בחר קובץ תמונה לפני העלאה.");
      return;
    }

    const uploadPath = Date.now() + "-" + safeFileName(imageFile.name);

    const { error: storageError } = await supabaseClient.storage
      .from(bucketName)
      .upload(uploadPath, imageFile, {
        cacheControl: "3600",
        upsert: false
      });

    if (storageError) {
      setFeedback("error", "העלאה ל-Storage נכשלה: " + storageError.message);
      return;
    }

    const {
      data: { publicUrl }
    } = supabaseClient.storage.from(bucketName).getPublicUrl(uploadPath);

    const maxOrder = galleryItems.reduce(function (max, item) {
      return Math.max(max, Number(item.sort_order || 0));
    }, 0);

    const payload = {
      title: null,
      alt_text: deriveAltTextFromFileName(imageFile.name),
      category: null,
      sort_order: maxOrder + 10,
      is_published: formData.get("is_published") === "on",
      image_url: publicUrl,
      storage_path: uploadPath
    };

    const { error: insertError } = await supabaseClient.from("gallery_items").insert(payload);

    if (insertError) {
      await supabaseClient.storage.from(bucketName).remove([uploadPath]);
      setFeedback("error", "שמירה למסד הנתונים נכשלה: " + insertError.message);
      return;
    }

    uploadForm.reset();
    updateSelectedFileName();
    setFeedback("success", "התמונה הועלתה בהצלחה.");
    await loadItems();
  }

  async function togglePublish(itemId) {
    const item = galleryItems.find(function (entry) {
      return entry.id === itemId;
    });

    if (!item) {
      return;
    }

    const { error } = await supabaseClient
      .from("gallery_items")
      .update({ is_published: !item.is_published })
      .eq("id", itemId);

    if (error) {
      setFeedback("error", "נכשל עדכון סטטוס הפרסום: " + error.message);
      return;
    }

    setFeedback("success", item.is_published ? "התמונה הוסתרה מהאתר." : "התמונה פורסמה באתר.");
    await loadItems();
  }

  async function deleteItem(card, itemId) {
    const confirmed = window.confirm("למחוק את התמונה מהגלריה?");
    if (!confirmed) {
      return;
    }

    const storagePath = card.dataset.storagePath || inferStoragePathFromPublicUrl(card.dataset.imageUrl || "");

    if (storagePath) {
      const { error: storageDeleteError } = await supabaseClient.storage.from(bucketName).remove([storagePath]);
      if (storageDeleteError) {
        setFeedback("error", "נכשלה מחיקת הקובץ מה-Storage: " + storageDeleteError.message);
        return;
      }
    }

    const { error: deleteError } = await supabaseClient.from("gallery_items").delete().eq("id", itemId);

    if (deleteError) {
      setFeedback("error", "נכשלה מחיקת הפריט: " + deleteError.message);
      return;
    }

    setFeedback("success", "התמונה נמחקה.");
    await loadItems();
  }

  async function handleGridClick(event) {
    const card = event.target.closest(".gallery-card");
    if (!card) {
      return;
    }

    const itemId = card.dataset.id;

    if (event.target.classList.contains("toggle-publish")) {
      await togglePublish(itemId);
      return;
    }

    if (event.target.classList.contains("delete-item")) {
      await deleteItem(card, itemId);
    }
  }

  function clearDragStates() {
    itemsGrid.querySelectorAll(".gallery-card").forEach(function (card) {
      card.classList.remove("drag-over");
      card.classList.remove("dragging");
    });
  }

  function handleDragStart(event) {
    const card = event.target.closest(".gallery-card");
    if (!card) {
      return;
    }

    dragSourceId = card.dataset.id;
    card.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", dragSourceId);
  }

  function handleDragOver(event) {
    const draggingCard = itemsGrid.querySelector(".gallery-card.dragging");
    if (!draggingCard) {
      return;
    }

    event.preventDefault();

    const targetCard = event.target.closest(".gallery-card");
    if (!targetCard || targetCard === draggingCard) {
      return;
    }

    clearDragStates();
    draggingCard.classList.add("dragging");
    targetCard.classList.add("drag-over");

    const rect = targetCard.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;

    if (before) {
      itemsGrid.insertBefore(draggingCard, targetCard);
    } else {
      itemsGrid.insertBefore(draggingCard, targetCard.nextSibling);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
  }

  async function persistOrderFromDom() {
    const orderedIds = Array.from(itemsGrid.querySelectorAll(".gallery-card")).map(function (card) {
      return card.dataset.id;
    });

    if (!orderedIds.length) {
      return;
    }

    const hasChanged = orderedIds.some(function (id, index) {
      return !galleryItems[index] || galleryItems[index].id !== id;
    });

    if (!hasChanged || isSavingOrder) {
      return;
    }

    isSavingOrder = true;

    const updates = orderedIds.map(function (id, index) {
      return supabaseClient
        .from("gallery_items")
        .update({ sort_order: (index + 1) * 10 })
        .eq("id", id);
    });

    const results = await Promise.all(updates);
    const failedResult = results.find(function (result) {
      return result.error;
    });

    isSavingOrder = false;

    if (failedResult) {
      setFeedback("error", "שמירת הסדר נכשלה: " + failedResult.error.message);
      await loadItems();
      return;
    }

    setFeedback("success", "סדר התמונות נשמר.");
    await loadItems();
  }

  async function handleDragEnd() {
    clearDragStates();
    await persistOrderFromDom();
    dragSourceId = null;
  }

  function validateSetup() {
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      setupState.classList.remove("hidden");
      setupState.textContent = "ספריית Supabase לא נטענה. בדוק חיבור אינטרנט.";
      return false;
    }

    if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
      setupState.classList.remove("hidden");
      setupState.textContent = "יש לעדכן SUPABASE_URL ו-SUPABASE_ANON_KEY בקובץ app-config.js.";
      return false;
    }

    return true;
  }

  async function init() {
    if (!validateSetup()) {
      authState.classList.add("hidden");
      dashboardState.classList.add("hidden");
      return;
    }

    supabaseClient = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

    loginForm.addEventListener("submit", handleLogin);
    uploadForm.addEventListener("submit", handleUpload);
    fileInput.addEventListener("change", updateSelectedFileName);
    signOutBtn.addEventListener("click", handleSignOut);
    refreshBtn.addEventListener("click", loadItems);

    itemsGrid.addEventListener("click", handleGridClick);
    itemsGrid.addEventListener("dragstart", handleDragStart);
    itemsGrid.addEventListener("dragover", handleDragOver);
    itemsGrid.addEventListener("drop", handleDrop);
    itemsGrid.addEventListener("dragend", handleDragEnd);

    supabaseClient.auth.onAuthStateChange(function (_event, session) {
      if (session) {
        setAuthView(true);
        loadItems();
      } else {
        setAuthView(false);
      }
    });

    updateSelectedFileName();
    await initSession();
  }

  init();
})();
