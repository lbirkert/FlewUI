<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto, invalidate } from "$app/navigation";
  import { Button, Card, Flex, Input, Text, Modal, Select, Tag, Divider, Spinner, Heading } from "flewui";
  import {
    Upload, File, Folder, Trash2, Lock,
    X, Share2, Clock, MoveRight, Save
  } from "@lucide/svelte";
  import { formatSize, formatDate, formatFullDate, getPreviewUrl, getFileIconClass } from "$lib/components/helpers";
  import Toolbar from "$lib/components/Toolbar.svelte";
  import FilePreview from "$lib/components/FilePreview.svelte";
  import ListView from "$lib/components/ListView.svelte";
  import GridView from "$lib/components/GridView.svelte";

  let { data } = $props();

  let driveId = $derived(data.driveId);
  let isShared = $derived(data.isShared);

  type ViewMode = "list" | "grid";
  let viewMode = $state<ViewMode>("list");

  let dragOver = $state(false);

  // Personal drive state
  let showNewItem = $state(false);
  let newItemType = $state<"folder" | "txt" | "md" | "csv">("folder");
  let newItemName = $state("");
  let creatingItem = $state(false);

  // Upload progress
  let uploading = $state(false);
  let uploadProgress = $state(0);
  let uploadTotal = $state(0);

  // Confirm dialog
  let confirmOpen = $state(false);
  let confirmTitle = $state("");
  let confirmMessage = $state("");
  let confirmAction = $state<() => void>(() => {});
  let confirmVariant = $state<"primary" | "danger">("primary");

  function showConfirm(title: string, message: string, action: () => void, variant: "primary" | "danger" = "danger") {
    confirmTitle = title;
    confirmMessage = message;
    confirmAction = () => { confirmOpen = false; action(); };
    confirmVariant = variant;
    confirmOpen = true;
  }

  // Share dialog (personal drive only)
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
    { value: "read", label: "View only" },
    { value: "read,upload", label: "View & Upload" },
    { value: "read,upload,delete", label: "View, Upload & Delete" },
    { value: "read,upload,delete,edit", label: "Full access" },
  ];

  async function loadShares() {
    if (!showShareDialog) return;
    loadingShares = true;
    const param = showShareDialog.type === "file" ? "fileId" : "folderId";
    const res = await fetch(`/api/shares?${param}=${showShareDialog.id}`);
    if (res.ok) {
      const r = await res.json();
      existingShares = r.shares;
    }
    loadingShares = false;
  }

  async function createShareLink() {
    if (!showShareDialog) return;
    creatingShare = true;
    createShareError = "";
    const hours = shareExpiry
      ? Math.round((new Date(shareExpiry).getTime() - Date.now()) / (1000 * 60 * 60))
      : null;
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
      shareUrlValue = `${location.origin}/app/drive/${r.share.token}`;
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
    if (res.ok) {
      existingShares = existingShares.filter(s => s.id !== id);
    }
  }

  let copiedToken = $state<string | null>(null);

  async function copyShareUrl(token: string) {
    const url = `${location.origin}/app/drive/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      copiedToken = token;
      setTimeout(() => copiedToken = null, 2000);
    } catch {
      shareUrlValue = url;
    }
  }

  function openShareDialog(id: string, name: string, type: "file" | "folder") {
    showShareDialog = { id, name, type };
    shareDialogOpen = true;
    sharePermissions = "read";
    shareExpiry = "";
    shareUrlValue = "";
    createShareError = "";
    existingShares = [];
    loadShares();
  }

  function closeShareDialog() {
    shareDialogOpen = false;
    showShareDialog = null;
  }

  function currentFolderId(): string | null {
    return $page.url.searchParams.get("folder") || null;
  }

  function navigateTo(folderId: string | null) {
    const base = `/app/drive/${driveId}`;
    if (isShared) {
      loadShareData(folderId);
    } else {
      const url = folderId ? `${base}?folder=${folderId}` : base;
      goto(url);
    }
  }

  // Personal drive handlers
  async function handleUpload(e: SubmitEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const input = form.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input?.files?.length) return;

    uploading = true;
    uploadProgress = 0;
    const files_list = Array.from(input.files);
    uploadTotal = files_list.length;

    const folderId = currentFolderId();
    let completed = 0;

    for (const file of files_list) {
      const fd = new FormData();
      fd.set("files", file);
      if (folderId) fd.set("folderId", folderId);
      const res = await fetch(`/api/drive/${driveId}/files`, { method: "POST", body: fd });
      if (!res.ok) {
        const r = await res.json();
        showConfirm("Upload Failed", r.error || "Upload failed", () => {}, "primary");
        break;
      }
      completed++;
      uploadProgress = completed;
    }

    form.reset();
    uploading = false;
    if (isShared) {
      await loadShareData(currentFolderId());
    } else {
      invalidate("app:drive");
    }
  }

  async function doDeleteFile(fileId: string) {
    const res = await fetch(`/api/drive/${driveId}/files/${fileId}`, { method: "DELETE" });
    if (res.ok) {
      if (filePreviewId === fileId) closeFilePreview();
      if (isShared) {
        await loadShareData(currentFolderId());
      } else {
        invalidate("app:drive");
      }
    }
  }

  async function handleDelete(fileId: string) {
    showConfirm(
      "Delete File",
      "Are you sure you want to delete this file?",
      () => doDeleteFile(fileId),
    );
  }

  async function handleDeleteFolder(folderId: string) {
    showConfirm(
      "Delete Folder",
      "Delete this folder and all its contents?",
      async () => {
        const res = await fetch(`/api/folders/${folderId}`, { method: "DELETE" });
        if (res.ok) invalidate("app:drive");
      }
    );
  }

  async function handleCreateItem() {
    if (!newItemName.trim()) return;
    creatingItem = true;
    if (newItemType === "folder") {
      const res = await fetch(`/api/drive/${driveId}/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItemName.trim(), parentId: currentFolderId() }),
      });
      creatingItem = false;
      if (res.ok) {
        showNewItem = false;
        newItemName = "";
        if (isShared) {
          await loadShareData(currentFolderId());
        } else {
          invalidate("app:drive");
        }
      } else {
        const r = await res.json();
        showConfirm("Error", r.error || "Failed to create folder", () => {}, "primary");
      }
    } else {
      const res = await fetch("/api/files/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItemName.trim(), type: newItemType, folderId: currentFolderId() }),
      });
      creatingItem = false;
      if (res.ok) {
        showNewItem = false;
        newItemName = "";
        if (isShared) {
          await loadShareData(currentFolderId());
        } else {
          invalidate("app:drive");
        }
      } else {
        const r = await res.json();
        showConfirm("Error", r.error || "Failed to create document", () => {}, "primary");
      }
    }
  }

  // Move dialog (personal drive only)
  let moveDialogOpen = $state(false);
  let moveFileId = $state("");
  let moveFileName = $state("");
  let allFolders = $state<{ id: string; name: string; parentId: string | null }[]>([]);

  async function openMoveDialog(fileId: string, fileName: string) {
    moveFileId = fileId;
    moveFileName = fileName;
    const res = await fetch(`/api/drive/${driveId}/folders?all=true`);
    if (res.ok) {
      const r = await res.json();
      allFolders = r.folders;
    } else {
      allFolders = [];
    }
    moveDialogOpen = true;
  }

  async function doMove(folderId: string | null) {
    const res = await fetch(`/api/drive/${driveId}/files/${moveFileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId }),
    });
    if (res.ok) {
      moveDialogOpen = false;
      invalidate("app:drive");
    }
  }

  // Shared drive state
  let shareInfo = $state<any>(null);
  let sharedFolders = $state<any[]>([]);
  let sharedFiles = $state<any[]>([]);
  let shareBreadcrumbs = $state<{ id: string | null; name: string }[]>([]);
  let shareError = $state("");
  let shareLoading = $state(true);
  let showDeleteConfirm = $state(false);
  let deleteTargetId = $state("");

  function hasPermission(perm: string) {
    if (!shareInfo?.permissions) return false;
    return shareInfo.permissions.split(",").map((p: string) => p.trim()).includes(perm);
  }

  async function loadShareData(subfolder?: string | null) {
    if (!isShared) return;
    shareLoading = true;
    shareError = "";
    try {
      const folderParam = subfolder !== undefined ? subfolder : ($page.url.searchParams.get("folder") || null);

      if (subfolder !== undefined) {
        const base = `/app/drive/${driveId}`;
        goto(subfolder ? `${base}?folder=${subfolder}` : base, { replaceState: true, noScroll: true });
      }

      const infoUrl = folderParam
        ? `/api/drive/${driveId}/info?folder=${folderParam}`
        : `/api/drive/${driveId}/info`;
      const infoRes = await fetch(infoUrl);
      if (!infoRes.ok) {
        if (infoRes.status === 410) shareError = "This share link has expired.";
        else if (infoRes.status === 404) shareError = "Share link not found.";
        else shareError = "Failed to load shared content.";
        return;
      }
      shareInfo = await infoRes.json();

      if (shareInfo.type === "folder") {
        shareBreadcrumbs = shareInfo.breadcrumbs || [{ id: null, name: shareInfo.name || "Shared Folder" }];

        const [filesRes, foldersRes] = await Promise.all([
          fetch(`/api/drive/${driveId}/files${folderParam ? `?folderId=${folderParam}` : ""}`),
          fetch(`/api/drive/${driveId}/folders${folderParam ? `?parentId=${folderParam}` : ""}`),
        ]);

        if (filesRes.ok) {
          const d = await filesRes.json();
          sharedFiles = d.files || [];
        }
        if (foldersRes.ok) {
          const d = await foldersRes.json();
          sharedFolders = d.folders || [];
        }
      }
    } catch {
      shareError = "Failed to load shared content.";
    } finally {
      shareLoading = false;
    }
  }

  // File share preview
  let sharePreviewFile = $derived(shareInfo?.type === "file" ? {
    id: shareInfo.file.id,
    originalName: shareInfo.file.name,
    type: shareInfo.file.type,
    size: shareInfo.file.size,
    uploadedAt: shareInfo.createdAt || new Date().toISOString(),
    hasPreview: false,
  } : null);

  // File preview overlay
  let filePreviewId = $derived(
    isShared && shareInfo?.type === "file"
      ? shareInfo.file.id
      : $page.url.searchParams.get("file")
  );
  let previewFiles = $derived(
    isShared && shareInfo?.type === "file"
      ? (sharePreviewFile ? [sharePreviewFile] : [])
      : (isShared ? sharedFiles : data.files ?? [])
  );
  let previewFileIndex = $derived(filePreviewId ? previewFiles.findIndex(f => f.id === filePreviewId) : -1);
  let previewFile = $derived(filePreviewId ? previewFiles[previewFileIndex] ?? null : null);
  let previewContent = $state<any>(null);
  let previewLoading = $state(false);
  let previewError = $state("");

  function openFilePreview(fileId: string) {
    const params = new URLSearchParams();
    const folder = currentFolderId();
    if (folder) params.set("folder", folder);
    params.set("file", fileId);
    goto(`/app/drive/${driveId}?${params}`);
  }

  function closeFilePreview() {
    const folder = currentFolderId();
    if (isShared && shareInfo?.type === "file") return;
    const params = folder ? `?folder=${folder}` : "";
    goto(`/app/drive/${driveId}${params}`);
  }

  function goToPrevFile() {
    if (previewFileIndex > 0) {
      openFilePreview(previewFiles[previewFileIndex - 1].id);
    }
  }

  function goToNextFile() {
    if (previewFileIndex < previewFiles.length - 1) {
      openFilePreview(previewFiles[previewFileIndex + 1].id);
    }
  }

  async function loadPreviewContent() {
    if (!filePreviewId || !previewFile) return;
    previewLoading = true;
    previewError = "";
    previewContent = null;
    const res = await fetch(`/api/drive/${driveId}/files/${filePreviewId}/content`);
    if (res.ok) {
      const d = await res.json();
      previewContent = d;
    } else {
      previewError = "Failed to load preview";
    }
    previewLoading = false;
  }

  $effect(() => {
    if (filePreviewId && previewFile && !previewFile.type.startsWith("image/") && !previewFile.type.startsWith("audio/")) {
      loadPreviewContent();
    }
  });

  let previewCategory = $derived(filePreviewId && previewFile ? getFileIconClass(previewFile.type, previewFile.originalName) : null);

  // Edit mode
  let editMode = $state(false);
  let editText = $state("");

  function enableEdit() {
    if (previewContent?.content != null) {
      editText = previewContent.content;
      editMode = true;
    }
  }

  async function saveEdit() {
    if (!filePreviewId) return;
    const res = await fetch(`/api/drive/${driveId}/files/${filePreviewId}/content`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editText }),
    });
    if (res.ok) {
      editMode = false;
      loadPreviewContent();
      if (isShared) {
        await loadShareData(currentFolderId());
      } else {
        invalidate("app:drive");
      }
    }
  }

  function cancelEdit() {
    editMode = false;
    editText = "";
  }

  function handleSharePreview() {
    // no-op: sharing from within share preview is not applicable
  }

  function handleDeletePreview(id: string) {
    if (isShared && hasPermission("delete")) {
      deleteTargetId = id;
      showDeleteConfirm = true;
    } else if (!isShared) {
      handleDelete(id);
    }
  }

  // Init share data
  onMount(async () => {
    if (isShared) {
      const folderParam = $page.url.searchParams.get("folder") || null;
      await loadShareData(folderParam);
    }
  });

  // Shared drive: listen for folder param changes
  $effect(() => {
    if (isShared) {
      const folderParam = $page.url.searchParams.get("folder") || null;
      if (folderParam !== currentFolderId()) {
        loadShareData(folderParam);
      }
    }
  });

  // Folders/files for the current mode
  let displayFolders = $derived(isShared ? sharedFolders : data.folders ?? []);
  let displayFiles = $derived(isShared ? sharedFiles : data.files ?? []);
  let displayBreadcrumbs = $derived(isShared ? shareBreadcrumbs : data.breadcrumbs ?? []);
  let displayFolderSizes = $derived(!isShared ? data.folderSizes : undefined);
  let canUpload = $derived(!isShared || hasPermission("upload"));
  let canDelete = $derived(!isShared || hasPermission("delete"));
  let canEdit = $derived(!isShared || (isShared && shareInfo?.type === "file" && hasPermission("edit")));
  let showUploadButton = $derived(canUpload);
</script>

<Flex direction="column" style="height: 100%;">
  {#if isShared && shareLoading}
    <Flex direction="column" align="center" justify="center" style="flex: 1;" gap="var(--flew-spacing-3)">
      <Spinner />
      <Text color="secondary">Loading shared content...</Text>
    </Flex>
  {:else if isShared && shareError}
    <Flex direction="column" align="center" justify="center" style="flex: 1; text-align: center;" gap="var(--flew-spacing-3)">
      <Lock size={48} />
      <Heading depth={2}>{shareError}</Heading>
      <Text color="secondary" size="sm">The link may be invalid or expired.</Text>
    </Flex>
  {:else if isShared && shareInfo?.type === "file"}
    <div class="content-area">
      <FilePreview
        {driveId}
        {filePreviewId}
        previewFile={sharePreviewFile}
        {previewCategory}
        {previewContent}
        {previewLoading}
        {previewError}
        {previewFiles}
        previewFileIndex={0}
        bind:editMode
        bind:editText
        onclose={() => {}}
        ongotoprev={() => {}}
        ongotonext={() => {}}
        onenableedit={canEdit ? enableEdit : undefined}
        onsaveedit={canEdit ? saveEdit : undefined}
        oncanceledit={canEdit ? cancelEdit : undefined}
        ondelete={canDelete ? () => handleDelete(shareInfo.file.id) : undefined}
      />
    </div>
  {:else if !isShared && !data.user}
    <Flex align="center" justify="center" style="flex: 1; padding: var(--flew-spacing-6);">
      <Card variant="outlined" paddingSize="lg" style="text-align: center;">
        <Text color="secondary">Sign in to access your drive.</Text>
        <a href="/app/auth"><Button variant="primary" style="margin-top: var(--flew-spacing-2);">Sign In</Button></a>
      </Card>
    </Flex>
  {:else}
    <Toolbar
      breadcrumbs={displayBreadcrumbs}
      {viewMode}
      onnavigate={navigateTo}
      onviewmodechange={(m) => viewMode = m}
      showNewButton={canUpload}
      onnewclick={() => { showNewItem = true; newItemType = "folder"; newItemName = ""; }}
      showUploadButton={showUploadButton}
      onuploadclick={() => document.querySelector<HTMLInputElement>("#drive-file-input")?.click()}
    />

    <form method="POST" enctype="multipart/form-data" style="display: none;" onsubmit={handleUpload}>
      <input
        id="drive-file-input"
        type="file"
        multiple
        accept="image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.md,.mp3,.wav,.flac,.ogg,.aac,.m4a,.wma,.opus,.webm"
        onchange={(e) => {
          (e.currentTarget as HTMLInputElement).form?.requestSubmit();
        }}
      />
    </form>

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="content-area"
      class:drag-over={dragOver}
      ondragover={(e: DragEvent) => { e.preventDefault(); dragOver = true; }}
      ondragleave={() => dragOver = false}
      ondrop={(e: DragEvent) => {
        e.preventDefault();
        dragOver = false;
        if (!canUpload) return;
        const dt = e.dataTransfer;
        if (dt?.files.length) {
          const input = document.querySelector<HTMLInputElement>("#drive-file-input");
          if (input) {
            const dT = new DataTransfer();
            for (const f of dt.files) dT.items.add(f);
            input.files = dT.files;
            input.form?.requestSubmit();
          }
        }
      }}
    >
      {#if uploading}
        <div class="upload-banner">
          <Flex align="center" gap="var(--flew-spacing-2)">
            <Upload size={16} />
            <Text size="sm">Uploading {uploadProgress}/{uploadTotal}...</Text>
            <div class="progress-bar" style="flex: 1; max-width: 200px;">
              <div class="progress-fill" style="width: {(uploadProgress / uploadTotal) * 100}%;"></div>
            </div>
          </Flex>
        </div>
      {/if}

      <FilePreview
        {driveId}
        {filePreviewId}
        {previewFile}
        {previewCategory}
        {previewContent}
        {previewLoading}
        {previewError}
        previewFiles={previewFiles}
        {previewFileIndex}
        bind:editMode
        bind:editText
        onclose={closeFilePreview}
        ongotoprev={goToPrevFile}
        ongotonext={goToNextFile}
        onenableedit={!isShared ? enableEdit : undefined}
        onsaveedit={!isShared ? saveEdit : undefined}
        oncanceledit={!isShared ? cancelEdit : undefined}
        onshare={!isShared ? openShareDialog : undefined}
        ondelete={canDelete ? handleDeletePreview : undefined}
      />

      {#if !filePreviewId}
        {#if viewMode === "grid"}
          <GridView
            {driveId}
            folders={displayFolders}
            files={displayFiles}
            folderSizes={displayFolderSizes}
            onnavigate={navigateTo}
            onopenfilepreview={openFilePreview}
            onshare={!isShared ? openShareDialog : undefined}
            ondeletefolder={!isShared ? handleDeleteFolder : undefined}
            ondelete={canDelete ? handleDeletePreview : undefined}
            onmovestart={!isShared ? openMoveDialog : undefined}
          />
        {:else}
          <ListView
            {driveId}
            folders={displayFolders}
            files={displayFiles}
            folderSizes={displayFolderSizes}
            onnavigate={navigateTo}
            onopenfilepreview={openFilePreview}
            onshare={!isShared ? openShareDialog : undefined}
            ondeletefolder={!isShared ? handleDeleteFolder : undefined}
            ondelete={canDelete ? handleDeletePreview : undefined}
            onmovestart={!isShared ? openMoveDialog : undefined}
          />
        {/if}
      {/if}
    </div>
  {/if}
</Flex>

<!-- Share Dialog (personal drive only) -->
{#if !isShared}
  <Modal bind:open={shareDialogOpen} title={showShareDialog?.name ?? ""} onClose={closeShareDialog} width="520px">
    {#if showShareDialog}
      <form id="share-form" onsubmit={(e) => { e.preventDefault(); createShareLink(); }}>
        <Flex direction="vertical" gap="var(--flew-spacing-4)">
          <Select label="Permissions" bind:value={sharePermissions} options={permissionOptions} />
          <Input type="datetime-local" label="Expires at (optional)" bind:value={shareExpiry} />

          {#if shareUrlValue}
            <Flex direction="vertical" gap="var(--flew-spacing-1)">
              <Text size="xs" color="secondary" weight="semibold">Share URL</Text>
              <Input value={shareUrlValue} readonly />
            </Flex>
          {:else}
            <Button type="submit" variant="primary" size="sm" disabled={creatingShare}>
              {creatingShare ? "Creating..." : "Create Share Link"}
            </Button>
          {/if}

          {#if shareUrlValue}
            <Button type="button" variant="primary" size="sm" onclick={() => copyShareUrl(existingShares[0]?.token || "")}>
              {copiedToken ? "Copied!" : "Copy Link"}
            </Button>
          {/if}

          {#if createShareError}
            <Text size="sm" color="error">{createShareError}</Text>
          {/if}
        </Flex>
      </form>

      {#if existingShares.length > 0}
        <Divider />
        <Flex direction="vertical" gap="var(--flew-spacing-2)">
          <Text size="xs" color="tertiary" weight="semibold">EXISTING SHARE LINKS</Text>
          {#each existingShares as share, i}
            {#if i > 0}<Divider />{/if}
            <Flex direction="vertical" gap="var(--flew-spacing-1)">
              <Flex align="center" gap="var(--flew-spacing-2)">
                {#if share.file}
                  <File size={12} />
                  <Text size="xs" style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {share.file.originalName}
                  </Text>
                {:else if share.folder}
                  <Folder size={12} />
                  <Text size="xs" style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {share.folder.name}
                  </Text>
                {/if}
              </Flex>
              <Flex align="center" gap="var(--flew-spacing-2)" style="flex-wrap: wrap;">
                {#each share.permissions.split(",") as perm}
                  <Tag size="sm" variant={perm === "read" ? "neutral" : "primary"}>{perm.trim()}</Tag>
                {/each}
                {#if share.expiresAt}
                  <Flex align="center" gap="2px">
                    <Clock size={10} />
                    <Text size="xs" color="tertiary">{formatDate(share.expiresAt)}</Text>
                  </Flex>
                {/if}
                <div style="flex: 1;"></div>
                <Button variant="ghost" size="xs" onclick={() => copyShareUrl(share.token)}>
                  {copiedToken === share.token ? "Copied!" : "Copy"}
                </Button>
                <Button variant="ghost" size="xs" icon onclick={() => revokeShare(share.id)} aria-label="Revoke">
                  <X size={12} />
                </Button>
              </Flex>
              <Text size="xs" color="secondary" style="word-break: break-all;">{location.origin}/app/drive/{share.token}</Text>
            </Flex>
          {/each}
        </Flex>
      {/if}
    {/if}
    {#snippet footer()}
      <Button variant="ghost" onclick={closeShareDialog}>Close</Button>
    {/snippet}
  </Modal>
{/if}

<!-- Confirm Dialog -->
<Modal bind:open={confirmOpen} title={confirmTitle} onClose={() => confirmOpen = false}>
  <Text>{confirmMessage}</Text>
  {#snippet footer()}
    <Flex gap="var(--flew-spacing-2)" justify="end">
      <Button variant="ghost" onclick={() => confirmOpen = false}>Cancel</Button>
      <Button variant={confirmVariant === "danger" ? "primary" : "primary"} onclick={confirmAction}>
        {confirmTitle}
      </Button>
    </Flex>
  {/snippet}
</Modal>

<!-- New Item Dialog -->
<Modal bind:open={showNewItem} title="New" onClose={() => { showNewItem = false; newItemName = ""; }} width="400px">
    <form id="new-item-form" onsubmit={(e) => { e.preventDefault(); handleCreateItem(); }}>
      <Flex direction="vertical" gap="var(--flew-spacing-4)">
        <Flex direction="vertical" gap="var(--flew-spacing-2)">
          <Text size="sm" weight="medium">Type</Text>
          <Select
            bind:value={newItemType}
            options={[
              { value: "folder", label: "Folder" },
              { value: "txt", label: "Text (.txt)" },
              { value: "md", label: "Markdown (.md)" },
              { value: "csv", label: "CSV (.csv)" },
            ]}
          />
        </Flex>
        <Flex direction="vertical" gap="var(--flew-spacing-2)">
          <Text size="sm" weight="medium">Name</Text>
          <Input bind:value={newItemName} placeholder={newItemType === "folder" ? "New Folder" : newItemType === "txt" ? "notes.txt" : newItemType === "md" ? "readme.md" : "data.csv"} required />
        </Flex>
      </Flex>
    </form>
    {#snippet footer()}
      <Flex gap="var(--flew-spacing-2)" justify="end">
        <Button variant="ghost" onclick={() => { showNewItem = false; newItemName = ""; }}>Cancel</Button>
        <Button type="submit" form="new-item-form" variant="primary" disabled={!newItemName.trim() || creatingItem}>
          {creatingItem ? "Creating..." : "Create"}
        </Button>
      </Flex>
    {/snippet}
  </Modal>

<!-- Move Dialog (personal drive only) -->
{#if !isShared}
  <Modal bind:open={moveDialogOpen} title="Move &quot;{moveFileName}&quot;" onClose={() => moveDialogOpen = false} width="480px">
    <form method="dialog">
      <Flex direction="vertical" gap="var(--flew-spacing-1)">
        <Text size="sm" weight="medium" style="margin-bottom: 4px;">Choose destination:</Text>
        <button type="button" class="move-option" onclick={() => doMove(null)}>
          <Folder size={16} />
          <Text size="sm">My Drive (root)</Text>
        </button>
        {#each allFolders.filter(f => f.id !== currentFolderId()) as folder}
          <button type="button" class="move-option" onclick={() => doMove(folder.id)}>
            <Folder size={16} />
            <Text size="sm">{folder.name}</Text>
          </button>
        {/each}
      </Flex>
    </form>
    {#snippet footer()}
      <Button variant="ghost" onclick={() => moveDialogOpen = false}>Cancel</Button>
    {/snippet}
  </Modal>
{/if}

<!-- Delete Confirm (shared drive only) -->
{#if isShared}
  <Modal bind:open={showDeleteConfirm} title="Delete File" onClose={() => showDeleteConfirm = false}>
    <Text>Are you sure you want to delete this file?</Text>
    {#snippet footer()}
      <Flex gap="var(--flew-spacing-2)" justify="end">
        <Button variant="ghost" onclick={() => showDeleteConfirm = false}>Cancel</Button>
        <Button variant="primary" onclick={() => { showDeleteConfirm = false; doDeleteFile(deleteTargetId); }}>Delete</Button>
      </Flex>
    {/snippet}
  </Modal>
{/if}

<svelte:window onkeydown={(e) => { if (e.key === "Escape" && filePreviewId) closeFilePreview(); }} />

<style>
  .content-area {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    position: relative;
  }

  .content-area.drag-over {
    background: var(--flew-color-bg-active);
  }

  .upload-banner {
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-2);
    padding: 8px 16px;
    background: var(--flew-color-bg-overlay);
    border-bottom: 1px solid var(--flew-color-border);
  }

  .progress-bar {
    height: 6px;
    background: var(--flew-color-bg-hover);
    border-radius: var(--flew-radius-full);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--flew-color-primary);
    border-radius: var(--flew-radius-full);
    transition: width 200ms ease;
  }

  .move-option {
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-2);
    width: 100%;
    text-align: left;
    padding: 8px 12px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: var(--flew-radius-sm);
    color: inherit;
    font-size: inherit;
    transition: background var(--flew-transition-fast);
  }

  .move-option:hover {
    background: var(--flew-color-bg-hover);
  }

  @media (max-width: 640px) {
    .btn-label {
      display: none;
    }
  }
</style>
