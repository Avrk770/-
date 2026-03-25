(function () {
  const config = window.APP_CONFIG || {};
  const bucketName = config.SUPABASE_GALLERY_BUCKET || "gallery";

  const setupState = document.getElementById("setup-state");
  const authState = document.getElementById("auth-state");
  const dashboardState = document.getElementById("dashboard-state");

  const loginForm = document.getElementById("login-form");
  const uploadForm = document.getElementById("upload-form");
  const signOutBtn = document.getElementById("sign-out");
  const refreshBtn = document.getElementById("refresh-items");
  const feedbackEl = document.getElementById("feedback");
  const itemsTableBody = document.getElementById("items-table-body");

  let supabaseClient = null;

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

  function renderItems(items) {
    if (!items.length) {
      itemsTableBody.innerHTML =
        '<tr><td colspan="8" class="px-4 py-8 text-center text-on-surface-variant">אין פריטים בגלריה. העלה את הפריט הראשון.</td></tr>';
      return;
    }

    itemsTableBody.innerHTML = items
      .map(function (item) {
        const publishedChecked = item.is_published ? "checked" : "";
        const safeTitle = escapeHtml(item.title || "");
        const safeAlt = escapeHtml(item.alt_text || "");
        const safeCategory = escapeHtml(item.category || "");

        return (
          '<tr data-id="' +
          item.id +
          '" data-storage-path="' +
          escapeHtml(item.storage_path || "") +
          '" data-image-url="' +
          escapeHtml(item.image_url || "") +
          '">' +
          '<td class="px-4 py-3"><img src="' +
          escapeHtml(item.image_url) +
          '" alt="' +
          safeAlt +
          '" class="h-16 w-16 rounded-lg object-cover"></td>' +
          '<td class="px-4 py-3"><input class="title-input w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm" value="' +
          safeTitle +
          '"></td>' +
          '<td class="px-4 py-3"><input class="alt-input w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm" value="' +
          safeAlt +
          '"></td>' +
          '<td class="px-4 py-3"><input class="category-input w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm" value="' +
          safeCategory +
          '"></td>' +
          '<td class="px-4 py-3"><input type="number" class="order-input w-24 rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm" value="' +
          Number(item.sort_order || 1000) +
          '"></td>' +
          '<td class="px-4 py-3 text-center"><input type="checkbox" class="published-input h-4 w-4" ' +
          publishedChecked +
          '></td>' +
          '<td class="px-4 py-3"><button type="button" class="save-item rounded-lg bg-primary text-white px-4 py-2 text-sm">שמור</button></td>' +
          '<td class="px-4 py-3"><button type="button" class="delete-item rounded-lg border border-red-300 text-red-700 px-4 py-2 text-sm">מחק</button></td>' +
          "</tr>"
        );
      })
      .join("");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  async function loadItems() {
    const { data, error } = await supabaseClient
      .from("gallery_items")
      .select("id, title, alt_text, category, sort_order, is_published, image_url, storage_path, created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setFeedback("error", "נכשלה טעינת פריטי הגלריה: " + error.message);
      return;
    }

    renderItems(data || []);
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

    const payload = {
      title: String(formData.get("title") || "").trim() || null,
      alt_text: String(formData.get("alt_text") || "").trim() || "Gallery image",
      category: String(formData.get("category") || "").trim() || null,
      sort_order: Number(formData.get("sort_order") || 1000),
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
    setFeedback("success", "המדיה הועלתה ונשמרה בגלריה.");
    await loadItems();
  }

  async function handleTableClick(event) {
    const row = event.target.closest("tr[data-id]");
    if (!row) {
      return;
    }

    const itemId = row.dataset.id;

    if (event.target.classList.contains("save-item")) {
      await saveItem(row, itemId);
      return;
    }

    if (event.target.classList.contains("delete-item")) {
      await deleteItem(row, itemId);
    }
  }

  async function saveItem(row, itemId) {
    const payload = {
      title: row.querySelector(".title-input").value.trim() || null,
      alt_text: row.querySelector(".alt-input").value.trim() || "Gallery image",
      category: row.querySelector(".category-input").value.trim() || null,
      sort_order: Number(row.querySelector(".order-input").value || 1000),
      is_published: row.querySelector(".published-input").checked
    };

    const { error } = await supabaseClient.from("gallery_items").update(payload).eq("id", itemId);

    if (error) {
      setFeedback("error", "שמירת הפריט נכשלה: " + error.message);
      return;
    }

    setFeedback("success", "הפריט נשמר.");
  }

  async function deleteItem(row, itemId) {
    const confirmed = window.confirm("למחוק את הפריט הזה מהגלריה?");
    if (!confirmed) {
      return;
    }

    const storagePath = row.dataset.storagePath || inferStoragePathFromPublicUrl(row.dataset.imageUrl || "");

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

    setFeedback("success", "הפריט נמחק.");
    await loadItems();
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
    signOutBtn.addEventListener("click", handleSignOut);
    refreshBtn.addEventListener("click", loadItems);
    itemsTableBody.addEventListener("click", handleTableClick);

    supabaseClient.auth.onAuthStateChange(function (_event, session) {
      if (session) {
        setAuthView(true);
        loadItems();
      } else {
        setAuthView(false);
      }
    });

    await initSession();
  }

  init();
})();
