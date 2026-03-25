(function () {
  const config = window.APP_CONFIG || {};
  const bucketName = config.SUPABASE_GALLERY_BUCKET || "gallery";

  const setupState = document.getElementById("setup-state");
  const authState = document.getElementById("auth-state");
  const dashboardState = document.getElementById("dashboard-state");

  const loginForm = document.getElementById("login-form");
  const signOutBtn = document.getElementById("sign-out");
  const refreshBtn = document.getElementById("refresh-items");
  const feedbackEl = document.getElementById("feedback");

  const uploadOpenBtn = document.getElementById("upload-open");
  const uploadModal = document.getElementById("upload-modal");
  const uploadCloseBtn = document.getElementById("upload-close");
  const uploadForm = document.getElementById("upload-form");
  const fileInput = document.getElementById("image_file");
  const selectedFileName = document.getElementById("selected-file-name");
  const uploadSubmitBtn = document.getElementById("upload-submit");
  const uploadProgressWrap = document.getElementById("upload-progress-wrap");
  const uploadProgressBar = document.getElementById("upload-progress-bar");
  const uploadProgressText = document.getElementById("upload-progress-text");
  const uploadProgressDetail = document.getElementById("upload-progress-detail");

  const editToggleBtn = document.getElementById("edit-toggle");
  const selectionActions = document.getElementById("selection-actions");
  const selectedCountEl = document.getElementById("selected-count");
  const selectAllActiveBtn = document.getElementById("select-all-active");
  const selectAllHiddenBtn = document.getElementById("select-all-hidden");
  const clearSelectionBtn = document.getElementById("clear-selection");
  const deleteSelectedBtn = document.getElementById("delete-selected");

  const hiddenToggleBtn = document.getElementById("hidden-toggle");
  const hiddenToggleIcon = document.getElementById("hidden-toggle-icon");
  const hiddenSectionBody = document.getElementById("hidden-section-body");

  const itemsGridActive = document.getElementById("items-grid-active");
  const itemsGridHidden = document.getElementById("items-grid-hidden");
  const itemsCountActiveEl = document.getElementById("items-count-active");
  const itemsCountHiddenEl = document.getElementById("items-count-hidden");

  let supabaseClient = null;
  let galleryItems = [];
  let selectedIds = new Set();
  let isEditMode = false;
  let isHiddenOpen = false;
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

  function setCardSelectedClass(card, isSelected) {
    card.classList.toggle("ring-2", isSelected);
    card.classList.toggle("ring-primary", isSelected);
  }

  function updateSelectionUi() {
    if (selectedCountEl) {
      selectedCountEl.textContent = selectedIds.size + " נבחרו";
    }

    if (deleteSelectedBtn) {
      deleteSelectedBtn.disabled = selectedIds.size === 0;
    }

    if (selectionActions) {
      selectionActions.classList.toggle("hidden", !(isEditMode && selectedIds.size > 0));
    }
  }

  function applySelectionToDom() {
    document.querySelectorAll(".gallery-card").forEach(function (card) {
      const id = card.dataset.id;
      const isSelected = selectedIds.has(id);
      const checkbox = card.querySelector(".select-item");

      if (checkbox) {
        checkbox.checked = isSelected;
      }

      setCardSelectedClass(card, isSelected);
    });
  }

  function syncSelectionWithItems() {
    const idsInData = new Set(
      galleryItems.map(function (item) {
        return item.id;
      })
    );

    selectedIds.forEach(function (id) {
      if (!idsInData.has(id)) {
        selectedIds.delete(id);
      }
    });

    updateSelectionUi();
  }

  function updateEditUi() {
    if (editToggleBtn) {
      editToggleBtn.textContent = isEditMode ? "סגור עריכה" : "מצב עריכה";
      editToggleBtn.classList.toggle("bg-slate-900", isEditMode);
      editToggleBtn.classList.toggle("text-white", isEditMode);
    }

    if (!isEditMode) {
      selectedIds.clear();
    }

    updateSelectionUi();
    renderItems(galleryItems);
  }

  function updateHiddenSectionUi() {
    if (hiddenSectionBody) {
      hiddenSectionBody.classList.toggle("hidden", !isHiddenOpen);
    }

    if (hiddenToggleIcon) {
      hiddenToggleIcon.textContent = isHiddenOpen ? "-" : "+";
    }
  }

  function openUploadModal() {
    if (!uploadModal) {
      return;
    }

    resetUploadProgress();
    uploadModal.classList.remove("hidden");
  }

  function closeUploadModal() {
    if (!uploadModal) {
      return;
    }

    resetUploadProgress();
    uploadModal.classList.add("hidden");
  }

  function finishUploadProgress() {
    setTimeout(function () {
      resetUploadProgress();
    }, 900);
  }

  function renderSection(gridEl, items, isActiveSection) {
    if (!gridEl) {
      return;
    }

    if (!items.length) {
      gridEl.innerHTML =
        '<div class="col-span-full rounded-xl border border-outline-variant bg-surface-container-low p-5 text-center text-on-surface-variant text-sm">' +
        (isActiveSection ? "אין תמונות פעילות כרגע." : "אין תמונות מוסתרות כרגע.") +
        "</div>";
      return;
    }

    gridEl.innerHTML = items
      .map(function (item, index) {
        const imageUrl = escapeHtml(item.image_url || "");
        const storagePath = escapeHtml(item.storage_path || "");
        const isSelected = selectedIds.has(item.id);

        return (
          '<article class="gallery-card rounded-xl border border-outline-variant bg-white overflow-hidden shadow-sm ' +
          (isSelected ? "ring-2 ring-primary" : "") +
          '" ' +
          (isEditMode && isActiveSection ? 'draggable="true" ' : "") +
          'data-id="' +
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
          (item.is_published ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700") +
          '">' +
          (item.is_published ? "באתר" : "מוסתר") +
          "</span>" +
          (isEditMode
            ? '<label class="absolute top-2 left-2 inline-flex items-center justify-center rounded-md bg-black/70 p-1.5 cursor-pointer"><input type="checkbox" class="select-item h-3.5 w-3.5" data-id="' +
              item.id +
              '" ' +
              (isSelected ? "checked" : "") +
              "></label>"
            : "") +
          (isEditMode
            ? '<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2"><div class="grid grid-cols-2 gap-2"><button type="button" class="toggle-publish rounded-md bg-white/90 px-2 py-1.5 text-[11px] hover:bg-white">' +
              (item.is_published ? "הסתר" : "פרסם") +
              '</button><button type="button" class="delete-item rounded-md bg-red-500/90 text-white px-2 py-1.5 text-[11px] hover:bg-red-500">מחק</button></div></div>'
            : "") +
          (isEditMode && isActiveSection
            ? '<span class="absolute bottom-2 right-2 rounded bg-black/70 text-white px-1.5 py-0.5 text-[10px]">גרירה</span>'
            : "") +
          (isEditMode && isActiveSection
            ? '<span class="absolute top-2 left-11 rounded-md bg-black/70 text-white px-2 py-0.5 text-[11px]">#' +
              (index + 1) +
              "</span>"
            : "") +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderItems(items) {
    const activeItems = items.filter(function (item) {
      return item.is_published;
    });

    const hiddenItems = items.filter(function (item) {
      return !item.is_published;
    });

    if (itemsCountActiveEl) {
      itemsCountActiveEl.textContent = activeItems.length + " פעילות";
    }

    if (itemsCountHiddenEl) {
      itemsCountHiddenEl.textContent = hiddenItems.length + " מוסתרות";
    }

    renderSection(itemsGridActive, activeItems, true);
    renderSection(itemsGridHidden, hiddenItems, false);
    syncSelectionWithItems();
    applySelectionToDom();
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
      selectedFileName.textContent = "לא נבחרו קבצים עדיין";
      if (uploadSubmitBtn) {
        uploadSubmitBtn.disabled = true;
        uploadSubmitBtn.textContent = "התחל העלאה";
      }
      return;
    }

    if (fileInput.files.length === 1) {
      selectedFileName.textContent = fileInput.files[0].name;
      if (uploadSubmitBtn) {
        uploadSubmitBtn.disabled = false;
        uploadSubmitBtn.textContent = "התחל העלאה (1)";
      }
      return;
    }

    selectedFileName.textContent = "נבחרו " + fileInput.files.length + " קבצים";
    if (uploadSubmitBtn) {
      uploadSubmitBtn.disabled = false;
      uploadSubmitBtn.textContent = "התחל העלאה (" + fileInput.files.length + ")";
    }
  }

  function resetUploadProgress() {
    if (!uploadProgressWrap || !uploadProgressBar || !uploadProgressText || !uploadProgressDetail) {
      return;
    }

    uploadProgressWrap.classList.add("hidden");
    uploadProgressBar.style.width = "0%";
    uploadProgressText.textContent = "0%";
    uploadProgressDetail.textContent = "";
  }

  function startUploadProgress(totalFiles) {
    if (!uploadProgressWrap || !uploadProgressBar || !uploadProgressText || !uploadProgressDetail) {
      return;
    }

    uploadProgressWrap.classList.remove("hidden");
    uploadProgressBar.style.width = "0%";
    uploadProgressText.textContent = "0%";
    uploadProgressDetail.textContent = "0/" + totalFiles;
  }

  function setUploadProgress(doneFiles, totalFiles, currentFileName) {
    if (!uploadProgressBar || !uploadProgressText || !uploadProgressDetail) {
      return;
    }

    const percent = Math.min(100, Math.round((doneFiles / totalFiles) * 100));
    uploadProgressBar.style.width = percent + "%";
    uploadProgressText.textContent = percent + "%";
    uploadProgressDetail.textContent = doneFiles + "/" + totalFiles + (currentFileName ? " - " + currentFileName : "");
  }

  async function handleUpload(event) {
    event.preventDefault();
    clearFeedback();

    const formData = new FormData(uploadForm);
    const files = Array.from(fileInput.files || []);
    const publishNow = formData.get("is_published") === "on";

    if (!files.length) {
      setFeedback("error", "בחר קובץ תמונה לפני העלאה.");
      return;
    }

    if (uploadSubmitBtn) {
      uploadSubmitBtn.disabled = true;
      uploadSubmitBtn.classList.add("opacity-70", "cursor-not-allowed");
      uploadSubmitBtn.textContent = "מעלה...";
    }
    startUploadProgress(files.length);

    const maxOrder = galleryItems.reduce(function (max, item) {
      return Math.max(max, Number(item.sort_order || 0));
    }, 0);

    let successCount = 0;
    let failedCount = 0;
    let processedCount = 0;
    const failedNames = [];

    try {
      async function processSingleFile(imageFile, index) {
        const uploadPath = Date.now() + "-" + index + "-" + safeFileName(imageFile.name);

        const { error: storageError } = await supabaseClient.storage
          .from(bucketName)
          .upload(uploadPath, imageFile, {
            cacheControl: "3600",
            upsert: false
          });

        if (storageError) {
          failedCount += 1;
          failedNames.push(imageFile.name);
          processedCount += 1;
          setUploadProgress(processedCount, files.length, imageFile.name);
          return;
        }

        const {
          data: { publicUrl }
        } = supabaseClient.storage.from(bucketName).getPublicUrl(uploadPath);

        const payload = {
          title: null,
          alt_text: deriveAltTextFromFileName(imageFile.name),
          category: null,
          sort_order: maxOrder + (index + 1) * 10,
          is_published: publishNow,
          image_url: publicUrl,
          storage_path: uploadPath
        };

        const { error: insertError } = await supabaseClient.from("gallery_items").insert(payload);

        if (insertError) {
          await supabaseClient.storage.from(bucketName).remove([uploadPath]);
          failedCount += 1;
          failedNames.push(imageFile.name);
          processedCount += 1;
          setUploadProgress(processedCount, files.length, imageFile.name);
          return;
        }

        successCount += 1;
        processedCount += 1;
        setUploadProgress(processedCount, files.length, imageFile.name);
      }

      const workerCount = Math.min(4, files.length);
      let nextIndex = 0;

      async function worker() {
        while (nextIndex < files.length) {
          const currentIndex = nextIndex;
          nextIndex += 1;
          const file = files[currentIndex];
          await processSingleFile(file, currentIndex);
        }
      }

      await Promise.all(
        Array.from({ length: workerCount }, function () {
          return worker();
        })
      );
    } finally {
      if (uploadSubmitBtn) {
        uploadSubmitBtn.disabled = false;
        uploadSubmitBtn.classList.remove("opacity-70", "cursor-not-allowed");
        uploadSubmitBtn.textContent = "התחל העלאה";
      }
    }

    uploadForm.reset();
    updateSelectedFileName();

    if (successCount && !failedCount) {
      setFeedback("success", "הועלו בהצלחה " + successCount + " תמונות.");
      finishUploadProgress();
      closeUploadModal();
      await loadItems();
      return;
    }

    if (successCount && failedCount) {
      setFeedback(
        "error",
        "הועלו " +
          successCount +
          " תמונות, ונכשלו " +
          failedCount +
          " (" +
          failedNames.slice(0, 3).join(", ") +
          (failedNames.length > 3 ? "..." : "") +
          ")."
      );
      finishUploadProgress();
      await loadItems();
      return;
    }

    setFeedback("error", "ההעלאה נכשלה לכל הקבצים.");
    finishUploadProgress();
    await loadItems();
  }

  function getItemById(itemId) {
    return galleryItems.find(function (item) {
      return item.id === itemId;
    });
  }

  async function togglePublish(itemId) {
    if (!isEditMode) {
      return;
    }

    const item = getItemById(itemId);
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

  async function deleteItemById(itemId) {
    const item = getItemById(itemId);
    if (!item) {
      return { ok: false, error: "פריט לא נמצא" };
    }

    const storagePath = item.storage_path || inferStoragePathFromPublicUrl(item.image_url || "");

    if (storagePath) {
      const { error: storageDeleteError } = await supabaseClient.storage.from(bucketName).remove([storagePath]);
      if (storageDeleteError) {
        return { ok: false, error: "נכשלה מחיקת הקובץ מה-Storage: " + storageDeleteError.message };
      }
    }

    const { error: deleteError } = await supabaseClient.from("gallery_items").delete().eq("id", itemId);

    if (deleteError) {
      return { ok: false, error: "נכשלה מחיקת הפריט: " + deleteError.message };
    }

    return { ok: true };
  }

  async function handleSingleDelete(itemId) {
    if (!isEditMode) {
      return;
    }

    const confirmed = window.confirm("למחוק את התמונה מהגלריה?");
    if (!confirmed) {
      return;
    }

    const result = await deleteItemById(itemId);

    if (!result.ok) {
      setFeedback("error", result.error);
      return;
    }

    selectedIds.delete(itemId);
    setFeedback("success", "התמונה נמחקה.");
    await loadItems();
  }

  async function handleBulkDelete() {
    if (!isEditMode || !selectedIds.size) {
      return;
    }

    const confirmed = window.confirm("למחוק " + selectedIds.size + " תמונות נבחרות?");
    if (!confirmed) {
      return;
    }

    if (deleteSelectedBtn) {
      deleteSelectedBtn.disabled = true;
    }

    const ids = Array.from(selectedIds);
    let successCount = 0;
    let failedCount = 0;

    for (const id of ids) {
      const result = await deleteItemById(id);
      if (result.ok) {
        successCount += 1;
        selectedIds.delete(id);
      } else {
        failedCount += 1;
      }
    }

    if (deleteSelectedBtn) {
      deleteSelectedBtn.disabled = false;
    }

    if (successCount && !failedCount) {
      setFeedback("success", "נמחקו " + successCount + " תמונות.");
    } else if (successCount && failedCount) {
      setFeedback("error", "נמחקו " + successCount + " תמונות, " + failedCount + " נכשלו.");
    } else {
      setFeedback("error", "מחיקת התמונות הנבחרות נכשלה.");
    }

    await loadItems();
  }

  function handleGridChange(event) {
    if (!isEditMode || !event.target.classList.contains("select-item")) {
      return;
    }

    const itemId = event.target.dataset.id;
    if (!itemId) {
      return;
    }

    if (event.target.checked) {
      selectedIds.add(itemId);
    } else {
      selectedIds.delete(itemId);
    }

    const card = event.target.closest(".gallery-card");
    if (card) {
      setCardSelectedClass(card, event.target.checked);
    }

    updateSelectionUi();
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
      await handleSingleDelete(itemId);
    }
  }

  function clearDragStates() {
    if (!itemsGridActive) {
      return;
    }

    itemsGridActive.querySelectorAll(".gallery-card").forEach(function (card) {
      card.classList.remove("drag-over");
      card.classList.remove("dragging");
    });
  }

  function handleDragStart(event) {
    if (!isEditMode) {
      return;
    }

    const card = event.target.closest(".gallery-card");
    if (!card || !itemsGridActive || !itemsGridActive.contains(card)) {
      return;
    }

    card.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", card.dataset.id);
  }

  function handleDragOver(event) {
    if (!isEditMode || !itemsGridActive) {
      return;
    }

    const draggingCard = itemsGridActive.querySelector(".gallery-card.dragging");
    if (!draggingCard) {
      return;
    }

    event.preventDefault();

    const targetCard = event.target.closest(".gallery-card");
    if (!targetCard || targetCard === draggingCard || !itemsGridActive.contains(targetCard)) {
      return;
    }

    clearDragStates();
    draggingCard.classList.add("dragging");
    targetCard.classList.add("drag-over");

    const rect = targetCard.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;

    if (before) {
      itemsGridActive.insertBefore(draggingCard, targetCard);
    } else {
      itemsGridActive.insertBefore(draggingCard, targetCard.nextSibling);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
  }

  async function persistOrderFromDom() {
    if (!isEditMode || !itemsGridActive) {
      return;
    }

    const orderedIds = Array.from(itemsGridActive.querySelectorAll(".gallery-card")).map(function (card) {
      return card.dataset.id;
    });

    if (!orderedIds.length) {
      return;
    }

    const currentActiveIds = galleryItems
      .filter(function (item) {
        return item.is_published;
      })
      .map(function (item) {
        return item.id;
      });

    const hasChanged = orderedIds.some(function (id, index) {
      return currentActiveIds[index] !== id;
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

    setFeedback("success", "סדר התמונות הפעילות נשמר.");
    await loadItems();
  }

  async function handleDragEnd() {
    clearDragStates();
    await persistOrderFromDom();
  }

  function selectAllByState(isPublished) {
    if (!isEditMode) {
      return;
    }

    galleryItems.forEach(function (item) {
      if (item.is_published === isPublished) {
        selectedIds.add(item.id);
      }
    });

    applySelectionToDom();
    updateSelectionUi();
  }

  function clearSelection() {
    selectedIds.clear();
    applySelectionToDom();
    updateSelectionUi();
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
    signOutBtn.addEventListener("click", handleSignOut);
    refreshBtn.addEventListener("click", loadItems);

    uploadOpenBtn.addEventListener("click", openUploadModal);
    uploadCloseBtn.addEventListener("click", closeUploadModal);
    uploadModal.addEventListener("click", function (event) {
      if (event.target === uploadModal) {
        closeUploadModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeUploadModal();
      }
    });

    uploadForm.addEventListener("submit", handleUpload);
    fileInput.addEventListener("change", updateSelectedFileName);

    editToggleBtn.addEventListener("click", function () {
      isEditMode = !isEditMode;
      updateEditUi();
    });

    hiddenToggleBtn.addEventListener("click", function () {
      isHiddenOpen = !isHiddenOpen;
      updateHiddenSectionUi();
    });

    itemsGridActive.addEventListener("click", handleGridClick);
    itemsGridActive.addEventListener("change", handleGridChange);
    itemsGridActive.addEventListener("dragstart", handleDragStart);
    itemsGridActive.addEventListener("dragover", handleDragOver);
    itemsGridActive.addEventListener("drop", handleDrop);
    itemsGridActive.addEventListener("dragend", handleDragEnd);

    itemsGridHidden.addEventListener("click", handleGridClick);
    itemsGridHidden.addEventListener("change", handleGridChange);

    selectAllActiveBtn.addEventListener("click", function () {
      selectAllByState(true);
    });

    selectAllHiddenBtn.addEventListener("click", function () {
      selectAllByState(false);
    });

    clearSelectionBtn.addEventListener("click", clearSelection);
    deleteSelectedBtn.addEventListener("click", handleBulkDelete);

    supabaseClient.auth.onAuthStateChange(function (_event, session) {
      if (session) {
        setAuthView(true);
        loadItems();
      } else {
        setAuthView(false);
      }
    });

    updateSelectedFileName();
    resetUploadProgress();
    updateSelectionUi();
    updateEditUi();
    updateHiddenSectionUi();
    await initSession();
  }

  init();
})();
