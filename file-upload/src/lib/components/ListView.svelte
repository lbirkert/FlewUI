<script lang="ts">
  import { Button, Flex, Text } from "flewui";
  import { File, Folder, Share2, Trash2, MoveRight, Download } from "@lucide/svelte";
  import { formatSize, formatFullDate, getPreviewUrl } from "./helpers";

  type Item = Record<string, any>;

  type Props = {
    driveId?: string;
    folders: Item[];
    files: Item[];
    folderSizes?: Record<string, number>;
    onnavigate?: (id: string | null) => void;
    onopenfilepreview?: (id: string) => void;
    onshare?: (id: string, name: string, type: "file" | "folder") => void;
    ondeletefolder?: (id: string) => void;
    ondelete?: (id: string) => void;
    onmovestart?: (id: string, name: string) => void;
    onfiledownload?: (file: Item) => string;
    emptyMessage?: string;
  };

  let {
    driveId, folders, files, folderSizes = {},
    onnavigate, onopenfilepreview, onshare, ondeletefolder, ondelete, onmovestart,
    onfiledownload, emptyMessage = "No files yet.",
  }: Props = $props();

  function downloadUrl(f: Item) {
    if (onfiledownload) return onfiledownload(f);
    if (driveId) return `/api/drive/${driveId}/files/${f.id}/download`;
    return `/api/files/${f.id}/download`;
  }
</script>

{#if folders.length > 0 || files.length > 0}
  <div class="list-table">
    <div class="list-header">
      <span class="col-name">Name</span>
      <span class="col-size">Size</span>
      <span class="col-date">Created</span>
      <span class="col-owner">Owner</span>
      <span class="col-actions">Actions</span>
    </div>
    {#each folders as f}
      <div class="list-row" onclick={() => onnavigate?.(f.id)} role="button" tabindex={0} onkeydown={(e) => { if (e.key === "Enter") onnavigate?.(f.id); }}>
        <span class="col-name">
          <Folder size={16} />
          <Text size="sm">{f.name}</Text>
        </span>
        <span class="col-size"><Text size="xs" color="tertiary">{formatSize(folderSizes[f.id] ?? 0)}</Text></span>
        <span class="col-date"><Text size="xs" color="tertiary">{formatFullDate(f.createdAt)}</Text></span>
        <span class="col-owner"><Text size="xs" color="tertiary">You</Text></span>
        <span class="col-actions" onclick={(e: MouseEvent) => e.stopPropagation()}>
          {#if onshare}
            <Button variant="ghost" size="xs" icon onclick={() => onshare(f.id, f.name, "folder")} aria-label="Share">
              <Share2 size={14} />
            </Button>
          {/if}
          {#if ondeletefolder}
            <Button variant="ghost" size="xs" icon onclick={() => ondeletefolder(f.id)} aria-label="Delete">
              <Trash2 size={14} />
            </Button>
          {/if}
        </span>
      </div>
    {/each}
    {#each files as f}
      <div class="list-row" onclick={() => onopenfilepreview?.(f.id)} role="button" tabindex={0} onkeydown={(e) => { if (e.key === "Enter") onopenfilepreview?.(f.id); }}>
        <span class="col-name">
          {#if f.hasPreview}
            <img src={getPreviewUrl(f.id, driveId)} alt="" class="list-thumb" />
          {:else}
            <File size={16} />
          {/if}
          <Flex direction="column" gap="0" style="min-width: 0;">
            <Text size="sm" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{f.originalName}</Text>
          </Flex>
        </span>
        <span class="col-size"><Text size="xs" color="tertiary">{formatSize(f.size)}</Text></span>
        <span class="col-date"><Text size="xs" color="tertiary">{formatFullDate(f.uploadedAt)}</Text></span>
        <span class="col-owner"><Text size="xs" color="tertiary">You</Text></span>
        <span class="col-actions" onclick={(e: MouseEvent) => e.stopPropagation()}>
          {#if onshare}
            <Button variant="ghost" size="xs" icon onclick={() => onshare(f.id, f.originalName, "file")} aria-label="Share">
              <Share2 size={14} />
            </Button>
          {/if}
          {#if onmovestart}
            <Button variant="ghost" size="xs" icon onclick={() => onmovestart(f.id, f.originalName)} aria-label="Move">
              <MoveRight size={14} />
            </Button>
          {/if}
          <a href={downloadUrl(f)} download={f.originalName}>
            <Button variant="ghost" size="xs" icon aria-label="Download">
              <Download size={14} />
            </Button>
          </a>
          {#if ondelete}
            <Button variant="ghost" size="xs" icon onclick={() => ondelete(f.id)} aria-label="Delete">
              <Trash2 size={14} />
            </Button>
          {/if}
        </span>
      </div>
    {/each}
  </div>
{:else}
  <Flex align="center" justify="center" style="height: 100%;">
    <Text color="tertiary">{emptyMessage}</Text>
  </Flex>
{/if}

<style>
  .list-table {
    width: 100%;
    border-collapse: collapse;
  }

  .list-header {
    display: grid;
    grid-template-columns: 1fr 80px 120px 80px 140px;
    gap: var(--flew-spacing-2);
    padding: 8px 12px;
    border-bottom: 1px solid var(--flew-color-border);
    font-size: var(--flew-font-size-xs);
    color: var(--flew-color-text-tertiary);
    font-weight: 600;
  }

  .list-row {
    display: grid;
    grid-template-columns: 1fr 80px 120px 80px 140px;
    gap: var(--flew-spacing-2);
    padding: 8px 12px;
    align-items: center;
    border-bottom: 1px solid var(--flew-color-border);
    cursor: default;
    transition: background var(--flew-transition-fast);
  }

  .list-row:hover {
    background: var(--flew-color-bg-hover);
  }

  .list-row[role="button"] {
    cursor: pointer;
  }

  .col-name {
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-2);
    min-width: 0;
    overflow: hidden;
  }

  .col-actions {
    display: flex;
    gap: 2px;
  }

  .list-thumb {
    width: 24px;
    height: 24px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .list-header,
    .list-row {
      grid-template-columns: 1fr !important;
    }
    .col-size,
    .col-date,
    .col-owner,
    .col-actions {
      display: none;
    }
  }
</style>
