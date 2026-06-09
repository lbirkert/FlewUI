<script lang="ts">
  import { page } from "$app/stores";
  import { goto, invalidate, replaceState, beforeNavigate, afterNavigate } from "$app/navigation";
  import { formatSize, formatDate, formatFullDate, getPreviewUrl, getFileIconClass } from "$lib/rewrite/helpers";
  import Toolbar from "$lib/rewrite/Toolbar.svelte";
  import FilePreview from "$lib/rewrite/FilePreview.svelte";
  import ListView from "$lib/rewrite/ListView.svelte";
  import GridView from "$lib/rewrite/GridView.svelte";

  let { data } = $props();

  let driveId = $derived(data.driveId);
  let isShared = $derived(data.isShared);

  type ViewMode = "list" | "grid";
  let viewMode = $state<ViewMode>($page.url.hash === "#grid" ? "grid" : "list");

  $effect(() => {
    const hash = viewMode === "grid" ? "#grid" : "";
    const url = $page.url.pathname + $page.url.search + hash;
    if ($page.url.hash !== hash) replaceState(url, {});
  });

  let savedScroll = $state(0);

  beforeNavigate(({ to }) => {
    if (to?.url.pathname === $page.url.pathname) {
      savedScroll = document.querySelector<HTMLElement>(".content-area")?.scrollTop ?? 0;
    }
  });

  afterNavigate(() => {
    if (savedScroll > 0) {
      const el = document.querySelector<HTMLElement>(".content-area");
      if (el) el.scrollTop = savedScroll;
      savedScroll = 0;
    }
  });

  let dragOver = $state(false);

  let showNewItem = $state(false);
  let newItemType = $state<"folder" | "txt" | "md" | "csv">("folder");
  let newItemName = $state("");
  let creatingItem = $state(false);

  const CHUNK_SIZE = 1024 * 1024;

  type UploadFileState = {
    name: string;
    totalBytes: number;
    uploadedBytes: number;
    speed: number;
    eta: number;
    done: boolean;
  };

  let uploadFiles = $state<UploadFileState[]>([]);
  let uploading = $derived(uploadFiles.length > 0 && uploadFiles.some(f => !f.done));
  let uploadProgress = $derived(uploadFiles.filter(f => f.done).length);
  let uploadTotal = $derived(uploadFiles.length);
  let overallBytes = $derived(uploadFiles.reduce((a, f) => a + f.totalBytes, 0));
  let totalUploadedBytes = $derived(uploadFiles.reduce((a, f) => a + f.uploadedBytes, 0));
  let uploadStartTime = $state(0);

  let now = $state(Date.now());
  $effect(() => {
    if (uploading) {
      const id = setInterval(() => now = Date.now(), 250);
      return () => clearInterval(id);
    }
  });

  let isOnline = $state(true);
  let currentXhr: XMLHttpRequest | null = null;
  let onlineResolve: (() => void) | null = null;

  $effect(() => {
    function onOnline() { isOnline = true; onlineResolve?.(); onlineResolve = null; }
    function onOffline() { isOnline = false; currentXhr?.abort(); }
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  });

  function waitForOnline(): Promise<void> {
    if (isOnline) return Promise.resolve();
    return new Promise((resolve) => { onlineResolve = resolve; });
  }

  let totalSpeed = $derived(
    totalUploadedBytes > 0 && uploadStartTime > 0 ? totalUploadedBytes / ((now - uploadStartTime) / 1000) : 0
  );
  let totalEta = $derived(totalSpeed > 0 ? (overallBytes - totalUploadedBytes) / totalSpeed : 0);

  function formatSpeed(bytesPerSec: number): string {
    if (bytesPerSec > 1024 * 1024) return `${(bytesPerSec / 1024 / 1024).toFixed(1)} MB/s`;
    if (bytesPerSec > 1024) return `${(bytesPerSec / 1024).toFixed(0)} KB/s`;
    return `${bytesPerSec.toFixed(0)} B/s`;
  }

  function formatEta(sec: number): string {
    if (!sec || !isFinite(sec)) return "\u2014";
    if (sec > 60) return `${Math.ceil(sec / 60)}m ${Math.ceil(sec % 60)}s`;
    return `${Math.ceil(sec)}s`;
  }

  let confirmOpen = $state(false);
  let confirmTitle = $state("");
  let confirmMessage = $state("");
  let confirmAction = $state<() => void>(() => {});

  function showConfirm(title: string, message: string, action: () => void) {
    confirmTitle = title;
    confirmMessage = message;
    confirmAction = () => { confirmOpen = false; action(); };
    confirmOpen = true;
  }

  let showShareDialog = $state<{ id: string; name: string; type: "file" | "folder" } | null>(null);
  let shareDialogOpen = $state(false);
  let sharePermissions = $state("read");
  let shareExpiry = $state("");
  let shareUrlValue = $state("");
  let creatingShare = $state(false);
  let createShareError = $state("");

  let existingShares = $state<any[]>([]);
  let loadingShares = $state(false);

  let permissionOptions = [
    { value: "view", label: "View" },
    { value: "view,edit", label: "Edit" },
  ];

  async function loadShares() {
    if (!showShareDialog) return;
    loadingShares = true;
    const param = showShareDialog.type === "file" ? "fileId" : "folderId";
    const res = await fetch(`/api/shares?${param}=${showShareDialog.id}`);
    if (res.ok) { const r = await res.json(); existingShares = r.shares; }
    loadingShares = false;
  }

  async function createShareLink() {
    if (!showShareDialog) return;
    creatingShare = true;
    createShareError = "";
    const hours = shareExpiry ? Math.round((new Date(shareExpiry).getTime() - Date.now()) / (1000 * 60 * 60)) : null;
    const body: Record<string, any> = {
      permissions: sharePermissions,
      expiresInHours: hours && hours > 0 ? hours : null,
    };
    if (showShareDialog.type === "file") body.fileId = showShareDialog.id;
    else body.folderId = showShareDialog.id;

    const res = await fetch("/api/shares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const r = await res.json();
      shareUrlValue = `${location.origin}/ui-rewrite/drive/${r.share.token}`;
      await loadShares();
    } else {
      const r = await res.json();
      createShareError = r.error || "Failed to create share link";
    }
    creatingShare = false;
  }

  async function revokeShare(id: string) {
    const res = await fetch("/api/shares", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) existingShares = existingShares.filter(s => s.id !== id);
  }

  let copiedToken = $state<string | null>(null);

  async function copyShareUrl(token: string) {
    const url = `${location.origin}/ui-rewrite/drive/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      copiedToken = token;
      setTimeout(() => copiedToken = null, 2000);
    } catch { shareUrlValue = url; }
  }

  function openShareDialog(id: string, name: string, type: "file" | "folder") {
    showShareDialog = { id, name, type };
    shareDialogOpen = true;
    sharePermissions = "view";
    shareExpiry = "";
    shareUrlValue = "";
    createShareError = "";
    existingShares = [];
    loadShares();
  }

  function closeShareDialog() { shareDialogOpen = false; showShareDialog = null; }

  function currentFolderId(): string | null {
    return $page.url.searchParams.get("folder") || null;
  }

  function navigateTo(folderId: string | null) {
    clearSelection();
    const base = `/ui-rewrite/drive/${driveId}`;
    goto(folderId ? `${base}?folder=${folderId}` : base);
  }

  function xhrPost(url: string, formData: FormData, onProgress: (pct: number) => void): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      currentXhr = xhr;
      xhr.open("POST", url);
      xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(e.loaded / e.total); };
      xhr.onload = () => {
        currentXhr = null;
        try { const d = JSON.parse(xhr.responseText); if (xhr.status >= 200 && xhr.status < 300) resolve(d); else reject({ error: d.error || "Upload failed", status: xhr.status }); }
        catch { reject({ error: "Invalid response", status: xhr.status }); }
      };
      xhr.onerror = () => { currentXhr = null; reject({ error: "Network error" }); };
      xhr.onabort = () => { currentXhr = null; reject({ error: "Aborted" }); };
      xhr.send(formData);
    });
  }

  async function uploadFileChunked(file: File, folderId: string | null): Promise<boolean> {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let storedName = "";
    let startTime = Date.now();
    const maxRetries = 3;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      let lastError: any = null;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        await waitForOnline();
        try {
          const fd = new FormData();
          fd.set("files", chunk);
          fd.set("chunkIndex", String(i));
          fd.set("totalChunks", String(totalChunks));
          fd.set("originalName", file.name);
          fd.set("fileType", file.type);
          if (storedName) fd.set("storedName", storedName);
          if (folderId) fd.set("folderId", folderId);
          const data = await xhrPost(`/api/drive/${driveId}/files`, fd, (pct) => {
            const loaded = start + chunkSize * pct;
            const fi = uploadFiles.find(f => f.name === file.name);
            if (fi) {
              fi.uploadedBytes = loaded;
              const elapsed = (Date.now() - startTime) / 1000 || 1;
              fi.speed = fi.uploadedBytes / elapsed;
              fi.eta = (fi.totalBytes - fi.uploadedBytes) / fi.speed;
            }
          });
          if (i === 0 && data.storedName) storedName = data.storedName;
          lastError = null;
          break;
        } catch (err) {
          lastError = err;
          if (attempt < maxRetries) {
            if (!isOnline) await waitForOnline();
            else await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
          }
        }
      }
      if (lastError) return false;
    }
    const fi = uploadFiles.find(f => f.name === file.name);
    if (fi) fi.done = true;
    return true;
  }

  async function handleUpload(e: SubmitEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const input = form.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input?.files?.length) return;
    const folderId = currentFolderId();
    const files_list = Array.from(input.files);

    uploadFiles = files_list.map(f => ({ name: f.name, totalBytes: f.size, uploadedBytes: 0, speed: 0, eta: 0, done: false }));
    uploadStartTime = Date.now();
    for (let i = 0; i < files_list.length; i++) {
      const ok = await uploadFileChunked(files_list[i], folderId);
      if (!ok) break;
    }
    form.reset();
    if (uploadFiles.every(f => f.done)) invalidate("app:drive");
  }

  async function doDeleteFile(fileId: string) {
    const res = await fetch(`/api/drive/${driveId}/files/${fileId}`, { method: "DELETE" });
    if (res.ok) { if (filePreviewId === fileId) closeFilePreview(); invalidate("app:drive"); }
  }

  async function handleDelete(fileId: string) {
    showConfirm("Delete File", "Are you sure you want to delete this file?", () => doDeleteFile(fileId));
  }

  async function handleDeleteFolder(folderId: string) {
    showConfirm("Delete Folder", "Delete this folder and all its contents?", async () => {
      const res = await fetch(`/api/drive/${driveId}/folders/${folderId}`, { method: "DELETE" });
      if (res.ok) invalidate("app:drive");
    });
  }

  async function handleCreateItem() {
    if (!newItemName.trim()) return;
    creatingItem = true;
    if (newItemType === "folder") {
      const res = await fetch(`/api/drive/${driveId}/folders`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItemName.trim(), parentId: currentFolderId() }),
      });
      creatingItem = false;
      if (res.ok) { showNewItem = false; newItemName = ""; invalidate("app:drive"); }
      else { const r = await res.json(); showConfirm("Error", r.error || "Failed to create folder", () => {}); }
    } else {
      const res = await fetch(`/api/drive/${driveId}/files/document`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItemName.trim(), type: newItemType, folderId: currentFolderId() }),
      });
      creatingItem = false;
      if (res.ok) { showNewItem = false; newItemName = ""; invalidate("app:drive"); }
      else { const r = await res.json(); showConfirm("Error", r.error || "Failed to create document", () => {}); }
    }
  }

  let renameDialogOpen = $state(false);
  let renameTargetId = $state("");
  let renameTargetName = $state("");
  let renameTargetType = $state<"file" | "folder">("file");
  let renameValue = $state("");
  let renaming = $state(false);
  let renameError = $state("");

  function openRenameDialog(id: string, name: string, type: "file" | "folder") {
    renameTargetId = id; renameTargetName = name; renameTargetType = type;
    renameValue = name; renameError = ""; renaming = false; renameDialogOpen = true;
  }

  async function doRename() {
    if (!renameValue.trim()) return;
    renaming = true; renameError = "";
    const endpoint = renameTargetType === "folder"
      ? `/api/drive/${driveId}/folders/${renameTargetId}`
      : `/api/drive/${driveId}/files/${renameTargetId}`;
    const res = await fetch(endpoint, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: renameValue.trim() }),
    });
    if (res.ok) { renameDialogOpen = false; invalidate("app:drive"); }
    else { const r = await res.json(); renameError = r.error || "Rename failed"; }
    renaming = false;
  }

  let moveDialogOpen = $state(false);
  let moveTargets = $state<{ id: string; isFolder: boolean }[]>([]);
  let moveTargetNames = $state<string>("");
  let moveDir = $state<string | null>(null);
  let allFolders = $state<{ id: string; name: string; parentId: string | null }[]>([]);
  let moveRunning = $state(false);

  async function openMoveDialog() {
    moveTargets = selectedItems.map((i: any) => ({ id: i.id, isFolder: i.originalName === undefined }));
    moveTargetNames = selectedItems.map((i: any) => i.name || i.originalName).join(", ");
    moveDir = currentFolderId();
    moveRunning = false;
    const res = await fetch(`/api/drive/${driveId}/folders?all=true`);
    if (res.ok) { const r = await res.json(); allFolders = r.folders; }
    else allFolders = [];
    moveDialogOpen = true;
  }

  async function doMove(folderId: string | null) {
    moveRunning = true;
    for (const { id, isFolder } of moveTargets) {
      await fetch(`/api/drive/${driveId}/${isFolder ? "folders" : "files"}/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId }),
      });
    }
    moveRunning = false; moveDialogOpen = false; clearSelection(); invalidate("app:drive");
  }

  let shareInfo = $derived(isShared ? data.shareInfo : null);
  let sharedFolders = $derived(isShared ? data.sharedFolders ?? [] : []);
  let sharedFiles = $derived(isShared ? data.sharedFiles ?? [] : []);
  let shareBreadcrumbs = $derived(isShared ? data.shareBreadcrumbs ?? [] : []);
  let showDeleteConfirm = $state(false);
  let deleteTargetId = $state("");

  function hasPermission(perm: string) {
    if (!data.shareInfo?.permissions) return false;
    return data.shareInfo.permissions.split(",").map((p: string) => p.trim()).includes(perm);
  }

  let sharePreviewFile = $derived(shareInfo?.type === "file" ? {
    id: shareInfo.file.id, originalName: shareInfo.file.name,
    type: shareInfo.file.type, size: shareInfo.file.size,
    uploadedAt: shareInfo.createdAt || new Date().toISOString(), hasPreview: false,
  } : null);

  let filePreviewId = $derived(
    isShared && shareInfo?.type === "file" ? shareInfo.file.id : $page.url.searchParams.get("file")
  );
  let previewFiles = $derived(
    isShared && shareInfo?.type === "file" ? (sharePreviewFile ? [sharePreviewFile] : [])
      : (isShared ? sharedFiles : data.files ?? [])
  );
  let previewFileIndex = $derived(filePreviewId ? previewFiles.findIndex(f => f.id === filePreviewId) : -1);
  let previewFile = $derived(filePreviewId ? previewFiles[previewFileIndex] ?? null : null);
  let previewContent = $state<any>(null);
  let previewLoading = $state(false);
  let previewError = $state("");

  function openFilePreview(fileId: string) {
    clearSelection();
    const params = new URLSearchParams();
    const folder = currentFolderId();
    if (folder) params.set("folder", folder);
    params.set("file", fileId);
    goto(`/ui-rewrite/drive/${driveId}?${params}`);
  }

  function closeFilePreview() {
    const folder = currentFolderId();
    if (isShared && shareInfo?.type === "file") return;
    goto(folder ? `/ui-rewrite/drive/${driveId}?folder=${folder}` : `/ui-rewrite/drive/${driveId}`);
  }

  function goToPrevFile() { if (previewFileIndex > 0) openFilePreview(previewFiles[previewFileIndex - 1].id); }
  function goToNextFile() { if (previewFileIndex < previewFiles.length - 1) openFilePreview(previewFiles[previewFileIndex + 1].id); }

  async function loadPreviewContent() {
    if (!filePreviewId || !previewFile) return;
    previewLoading = true; previewError = ""; previewContent = null;
    const res = await fetch(`/api/drive/${driveId}/files/${filePreviewId}/content`);
    if (res.ok) { const d = await res.json(); previewContent = d; }
    else previewError = "Failed to load preview";
    previewLoading = false;
  }

  $effect(() => {
    if (filePreviewId && previewFile && !previewFile.type.startsWith("image/") && !previewFile.type.startsWith("audio/")) loadPreviewContent();
  });

  let previewCategory = $derived(filePreviewId && previewFile ? getFileIconClass(previewFile.type, previewFile.originalName) : null);

  let editMode = $state(false);
  let editText = $state("");

  function enableEdit() { if (previewContent?.content != null) { editText = previewContent.content; editMode = true; } }

  async function saveEdit() {
    if (!filePreviewId) return;
    const res = await fetch(`/api/drive/${driveId}/files/${filePreviewId}/content`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editText }),
    });
    if (res.ok) { editMode = false; loadPreviewContent(); invalidate("app:drive"); }
  }

  function cancelEdit() { editMode = false; editText = ""; }
  function handleDeletePreview(id: string) { if (isShared && hasPermission("structure")) { deleteTargetId = id; showDeleteConfirm = true; } else if (!isShared) handleDelete(id); }

  let selectedIds = $state(new Set<string>());
  let selectedCount = $derived(selectedIds.size);
  let hasSelection = $derived(selectedCount > 0);

  function toggleSelection(id: string) { const next = new Set(selectedIds); if (next.has(id)) next.delete(id); else next.add(id); selectedIds = next; }
  function clearSelection() { selectedIds = new Set(); }

  let selectedItems = $derived.by(() => {
    const ids = selectedIds;
    return [...filteredFolders.filter((f: any) => ids.has(f.id)), ...filteredFiles.filter((f: any) => ids.has(f.id))];
  });

  let rawFolders = $derived(isShared ? sharedFolders : data.folders ?? []);
  let rawFiles = $derived(isShared ? sharedFiles : data.files ?? []);
  let displayBreadcrumbs = $derived(isShared ? shareBreadcrumbs : data.breadcrumbs ?? []);
  let displayFolderSizes = $derived(!isShared ? data.folderSizes : undefined);

  let searchOpen = $state(false);
  let searchQuery = $state("");
  type SortMode = "name-asc" | "name-desc" | "date-desc" | "date-asc" | "size-desc" | "size-asc";
  let sortMode = $state<SortMode>("date-desc");
  let filterType = $state("all");

  function updateSort(col: "name" | "date" | "size") {
    const map: Record<string, [SortMode, SortMode]> = {
      name: ["name-asc", "name-desc"], date: ["date-asc", "date-desc"], size: ["size-asc", "size-desc"],
    };
    const [asc, desc] = map[col];
    sortMode = sortMode === desc ? asc : desc;
  }

  function sortIndicator(col: "name" | "date" | "size"): "asc" | "desc" | null {
    if (sortMode === `${col}-asc`) return "asc";
    if (sortMode === `${col}-desc`) return "desc";
    return null;
  }

  function getFileCategory(f: any): string {
    const t = f.type || "";
    const n = f.originalName || "";
    const ext = n.split(".").pop()?.toLowerCase() || "";
    if (["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/svg+xml", "image/avif"].includes(t)) return "images";
    if (["mp4", "webm", "mkv", "avi", "mov", "wmv", "flv", "m4v", "mpg", "mpeg", "3gp"].includes(ext) || ["video/mp4", "video/webm", "video/x-matroska", "video/avi", "video/x-msvideo", "video/quicktime", "video/x-ms-wmv", "video/x-flv", "video/mpeg"].includes(t)) return "videos";
    if (["mp3", "wav", "flac", "ogg", "aac", "m4a", "wma", "opus", "webm"].includes(ext) || t.startsWith("audio/")) return "audio";
    if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "md"].includes(ext)) return "documents";
    if (["zip", "tar", "gz", "rar", "7z"].includes(ext)) return "archives";
    return "other";
  }

  let filteredFolders = $derived.by(() => {
    let items = rawFolders;
    if (searchQuery) { const q = searchQuery.toLowerCase(); items = items.filter((f: any) => f.name.toLowerCase().includes(q)); }
    const sortFn = sortMode === "name-asc" ? (a: any, b: any) => a.name.localeCompare(b.name)
      : sortMode === "name-desc" ? (a: any, b: any) => b.name.localeCompare(a.name)
      : sortMode === "date-asc" ? (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : sortMode === "date-desc" ? (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : () => 0;
    return [...items].sort(sortFn);
  });

  let filteredFiles = $derived.by(() => {
    let items = rawFiles;
    if (searchQuery) { const q = searchQuery.toLowerCase(); items = items.filter((f: any) => f.originalName.toLowerCase().includes(q)); }
    if (filterType !== "all") items = items.filter((f: any) => getFileCategory(f) === filterType);
    const sortFn = sortMode === "name-asc" ? (a: any, b: any) => a.originalName.localeCompare(b.originalName)
      : sortMode === "name-desc" ? (a: any, b: any) => b.originalName.localeCompare(a.originalName)
      : sortMode === "date-asc" ? (a: any, b: any) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      : sortMode === "date-desc" ? (a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      : sortMode === "size-asc" ? (a: any, b: any) => a.size - b.size
      : sortMode === "size-desc" ? (a: any, b: any) => b.size - a.size
      : () => 0;
    return [...items].sort(sortFn);
  });

  let displayFolders = $derived(filteredFolders);
  let displayFiles = $derived(filteredFiles);
  let canUpload = $derived(!isShared || hasPermission("insert"));
  let canDelete = $derived(!isShared || hasPermission("structure"));
  let canEdit = $derived(!isShared || (isShared && shareInfo?.type === "file" && hasPermission("edit")));

  let singleSelected = $derived(selectedCount === 1 ? selectedItems[0] : null);
  let canRenameSelection = $derived((!isShared || hasPermission("structure")) && !!singleSelected);
  let canShareSelection = $derived(!isShared && !!singleSelected && singleSelected.originalName !== undefined);
  let canMoveSelection = $derived(!isShared && selectedCount > 0);
  let canDeleteSelection = $derived(canDelete && selectedCount > 0);

  async function handleBulkDelete() {
    if (!canDeleteSelection) return;
    showConfirm("Delete", `Delete ${selectedCount} item${selectedCount > 1 ? "s" : ""}?`, async () => {
      for (const item of selectedItems) {
        if (item.originalName === undefined) await fetch(`/api/drive/${driveId}/folders/${item.id}`, { method: "DELETE" });
        else await fetch(`/api/drive/${driveId}/files/${item.id}`, { method: "DELETE" });
      }
      clearSelection();
      invalidate("app:drive");
    });
  }

  function handleSelectionRename() {
    if (!singleSelected) return;
    openRenameDialog(singleSelected.id, singleSelected.name || singleSelected.originalName, singleSelected.originalName === undefined ? "folder" : "file");
    clearSelection();
  }

  function handleSelectionShare() {
    if (!singleSelected || singleSelected.originalName === undefined) return;
    openShareDialog(singleSelected.id, singleSelected.name || singleSelected.originalName, "file");
    clearSelection();
  }

  function handleSelectionMove() { openMoveDialog(); clearSelection(); }
</script>

<div class="drive-container">
  {#if isShared && shareInfo?.type === "file"}
    <div class="content-area">
      <FilePreview {driveId} {filePreviewId} previewFile={sharePreviewFile} {previewCategory} {previewContent} {previewLoading} {previewError} {previewFiles} previewFileIndex={0} bind:editMode bind:editText ongotoprev={() => {}} ongotonext={() => {}} onenableedit={canEdit ? enableEdit : undefined} onsaveedit={canEdit ? saveEdit : undefined} oncanceledit={canEdit ? cancelEdit : undefined} ondelete={canDelete ? () => handleDelete(shareInfo.file.id) : undefined} />
    </div>
  {:else if !isShared && !data.user}
    <div class="unauthorized">
      <p>Sign in to access your drive.</p>
      <a href="/ui-rewrite/auth" class="btn-primary">Sign In</a>
    </div>
  {:else}
    <Toolbar
      breadcrumbs={displayBreadcrumbs}
      {viewMode}
      onnavigate={navigateTo}
      onviewmodechange={(m) => viewMode = m}
      showNewButton={canUpload}
      onnewclick={() => { showNewItem = true; newItemType = "folder"; newItemName = ""; }}
      showUploadButton={canUpload}
      onuploadclick={() => document.querySelector<HTMLInputElement>("#drive-file-input")?.click()}
      {hasSelection}
      selectedCount={selectedCount}
      canRenameSelection={canRenameSelection}
      canShareSelection={canShareSelection}
      canMoveSelection={canMoveSelection}
      canDeleteSelection={canDeleteSelection}
      onRename={handleSelectionRename}
      onShare={handleSelectionShare}
      onMove={handleSelectionMove}
      onDelete={handleBulkDelete}
      onClearSelection={clearSelection}
      bind:searchOpen
      bind:searchQuery
      bind:filterType
      bind:sortMode
      onsearchclear={() => searchQuery = ""}
      onfilterchange={(v) => filterType = v}
      onsortchange={(v) => sortMode = v as any}
    />

    <form method="POST" enctype="multipart/form-data" style="display:none" onsubmit={handleUpload}>
      <input id="drive-file-input" type="file" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.md,.mp3,.wav,.flac,.ogg,.aac,.m4a,.wma,.opus,.webm" onchange={(e) => { (e.currentTarget as HTMLInputElement).form?.requestSubmit(); }} />
    </form>

    <div class="content-area" class:drag-over={dragOver} role="application"
      ondragover={(e: DragEvent) => { e.preventDefault(); dragOver = true; }}
      ondragleave={() => dragOver = false}
      ondrop={(e: DragEvent) => {
        e.preventDefault(); dragOver = false;
        if (!canUpload) return;
        const dt = e.dataTransfer;
        if (dt?.files.length) {
          const input = document.querySelector<HTMLInputElement>("#drive-file-input");
          if (input) { const dT = new DataTransfer(); for (const f of dt.files) dT.items.add(f); input.files = dT.files; input.form?.requestSubmit(); }
        }
      }}
    >
      {#if !isOnline}
        <div class="offline-banner">{uploading ? "Connection lost &mdash; upload paused, resumes automatically" : "No internet connection"}</div>
      {/if}
      {#if uploading}
        <div class="upload-banner">
          <div class="upload-summary">
            <span>Uploading {uploadProgress}/{uploadTotal}</span>
            <span>{totalEta > 0 ? `${formatEta(totalEta)} left` : ""}</span>
            <span>{totalSpeed > 0 ? formatSpeed(totalSpeed) : ""}</span>
            <div class="progress-bar"><div class="progress-fill" style="width:{overallBytes ? (totalUploadedBytes / overallBytes * 100) : 0}%"></div></div>
          </div>
          {#each uploadFiles as f}
            {#if !f.done}
              <div class="upload-item">
                <span class="upload-name">{f.name}</span>
                <span>{f.eta > 0 ? `${formatEta(f.eta)} left` : ""}</span>
                <span>{f.speed > 0 ? formatSpeed(f.speed) : ""}</span>
                <div class="progress-bar"><div class="progress-fill" style="width:{f.totalBytes ? (f.uploadedBytes / f.totalBytes * 100) : 0}%"></div></div>
              </div>
            {/if}
          {/each}
        </div>
      {/if}

      <FilePreview {driveId} {filePreviewId} {previewFile} {previewCategory} {previewContent} {previewLoading} {previewError} {previewFiles} {previewFileIndex} bind:editMode bind:editText onclose={closeFilePreview} ongotoprev={goToPrevFile} ongotonext={goToNextFile} onenableedit={!isShared ? enableEdit : undefined} onsaveedit={!isShared ? saveEdit : undefined} oncanceledit={!isShared ? cancelEdit : undefined} onshare={!isShared ? openShareDialog : undefined} ondelete={canDelete ? handleDeletePreview : undefined} />

      {#if !filePreviewId}
        {#if viewMode === "grid"}
          <GridView {driveId} folders={displayFolders} files={displayFiles} folderSizes={displayFolderSizes} {selectedIds} onnavigate={navigateTo} onopenfilepreview={openFilePreview} ontoggleselection={toggleSelection} />
        {:else}
          <ListView {driveId} folders={displayFolders} files={displayFiles} folderSizes={displayFolderSizes} {selectedIds} {sortMode} {updateSort} {sortIndicator} onnavigate={navigateTo} onopenfilepreview={openFilePreview} ontoggleselection={toggleSelection} />
        {/if}
      {/if}
    </div>
  {/if}
</div>

<!-- Share Dialog -->
{#if !isShared && shareDialogOpen && showShareDialog}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="modal-overlay" role="button" tabindex="0" onclick={closeShareDialog}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
      <h2>{showShareDialog.name}</h2>
      <form onsubmit={(e) => { e.preventDefault(); createShareLink(); }}>
        <div class="field">
          <label for="share-permissions">Permissions</label>
          <select id="share-permissions" bind:value={sharePermissions}>
            {#each permissionOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
        <div class="field">
          <label for="share-expiry">Expires at (optional)</label>
          <input id="share-expiry" type="datetime-local" bind:value={shareExpiry} />
        </div>
        {#if shareUrlValue}
          <div class="field">
            <label for="share-url">Share URL</label>
            <input id="share-url" value={shareUrlValue} readonly />
          </div>
          <button type="button" class="btn-primary" onclick={() => copyShareUrl(existingShares[0]?.token || "")}>{copiedToken ? "Copied!" : "Copy Link"}</button>
        {:else}
          <button type="submit" class="btn-primary" disabled={creatingShare}>{creatingShare ? "Creating..." : "Create Share Link"}</button>
        {/if}
        {#if createShareError}
          <p class="error">{createShareError}</p>
        {/if}
      </form>
      {#if existingShares.length > 0}
        <hr />
        <h3>Existing Share Links</h3>
        <ul class="share-list">
          {#each existingShares as share}
            <li>
              <span>{share.file?.originalName || share.folder?.name || "Unknown"}</span>
              <span>{share.permissions}</span>
              {#if share.expiresAt}<span>Expires {formatDate(share.expiresAt)}</span>{/if}
              <button class="btn-sm" onclick={() => copyShareUrl(share.token)}>{copiedToken === share.token ? "Copied!" : "Copy"}</button>
              <button class="btn-sm" onclick={() => revokeShare(share.id)}>Revoke</button>
            </li>
          {/each}
        </ul>
      {/if}
      <button class="btn-ghost" onclick={closeShareDialog}>Close</button>
    </div>
  </div>
{/if}

<!-- Confirm Dialog -->
{#if confirmOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="modal-overlay" role="button" tabindex="0" onclick={() => confirmOpen = false}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
      <h2>{confirmTitle}</h2>
      <p>{confirmMessage}</p>
      <div class="modal-actions">
        <button class="btn-ghost" onclick={() => confirmOpen = false}>Cancel</button>
        <button class="btn-primary" onclick={confirmAction}>{confirmTitle}</button>
      </div>
    </div>
  </div>
{/if}

<!-- New Item Dialog -->
{#if showNewItem}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="modal-overlay" role="button" tabindex="0" onclick={() => { showNewItem = false; newItemName = ""; }}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
      <h2>New</h2>
      <form onsubmit={(e) => { e.preventDefault(); handleCreateItem(); }}>
        <div class="field">
          <label for="new-item-type">Type</label>
          <select id="new-item-type" bind:value={newItemType}>
            <option value="folder">Folder</option>
            <option value="txt">Text (.txt)</option>
            <option value="md">Markdown (.md)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
        </div>
        <div class="field">
          <label for="new-item-name">Name</label>
          <input id="new-item-name" bind:value={newItemName} placeholder={newItemType === "folder" ? "New Folder" : newItemType === "txt" ? "notes.txt" : newItemType === "md" ? "readme.md" : "data.csv"} required />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-ghost" onclick={() => { showNewItem = false; newItemName = ""; }}>Cancel</button>
          <button type="submit" class="btn-primary" disabled={!newItemName.trim() || creatingItem}>{creatingItem ? "Creating..." : "Create"}</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Move Dialog -->
{#if !isShared && moveDialogOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="modal-overlay" role="button" tabindex="0" onclick={() => moveDialogOpen = false}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
      <h2>Move {selectedCount > 1 ? `${selectedCount} items` : moveTargetNames}</h2>
      <p>Choose destination:</p>
      <ul class="move-list">
        <li><button class="btn-ghost" onclick={() => doMove(null)} disabled={moveRunning}>My Drive (root)</button></li>
        {#each allFolders.filter(f => f.id !== moveDir) as folder}
          <li><button class="btn-ghost" onclick={() => doMove(folder.id)} disabled={moveRunning}>{folder.name}</button></li>
        {/each}
      </ul>
      <button class="btn-ghost" onclick={() => moveDialogOpen = false} disabled={moveRunning}>Cancel</button>
    </div>
  </div>
{/if}

<!-- Rename Dialog -->
{#if renameDialogOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="modal-overlay" role="button" tabindex="0" onclick={() => renameDialogOpen = false}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
      <h2>Rename &quot;{renameTargetName}&quot;</h2>
      <form onsubmit={(e) => { e.preventDefault(); doRename(); }}>
        <div class="field">
          <label for="rename-value">Name</label>
          <input id="rename-value" bind:value={renameValue} required />
        </div>
        {#if renameError}
          <p class="error">{renameError}</p>
        {/if}
        <div class="modal-actions">
          <button type="button" class="btn-ghost" onclick={() => renameDialogOpen = false}>Cancel</button>
          <button type="submit" class="btn-primary" disabled={renaming || !renameValue.trim()}>{renaming ? "Renaming..." : "Rename"}</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Delete Confirm (shared drive) -->
{#if isShared && showDeleteConfirm}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="modal-overlay" role="button" tabindex="0" onclick={() => showDeleteConfirm = false}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
      <h2>Delete File</h2>
      <p>Are you sure you want to delete this file?</p>
      <div class="modal-actions">
        <button class="btn-ghost" onclick={() => showDeleteConfirm = false}>Cancel</button>
        <button class="btn-primary" onclick={() => { showDeleteConfirm = false; doDeleteFile(deleteTargetId); }}>Delete</button>
      </div>
    </div>
  </div>
{/if}
