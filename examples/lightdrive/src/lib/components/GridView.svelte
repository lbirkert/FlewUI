<script lang="ts">
  import { Button, Flex, Text } from "flewui";
  import { File, Folder, Share2, Trash2, MoveRight, Download } from "@lucide/svelte";
  import { formatSize, getPreviewUrl, isImageType } from "./helpers";

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
  <div class="grid-view">
    {#each folders as f}
      <div class="grid-item" onclick={() => onnavigate?.(f.id)} role="button" tabindex={0} onkeydown={(e) => { if (e.key === "Enter") onnavigate?.(f.id); }}>
        <div class="grid-preview grid-folder-preview">
          <Folder size={48} />
        </div>
        <div class="grid-info">
          <Text size="sm" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;">{f.name}</Text>
          <Text size="xs" color="tertiary">{formatSize(folderSizes[f.id] ?? 0)}</Text>
          <Flex gap="var(--flew-spacing-1)" style="flex-wrap: wrap;">
            {#if onshare}
              <Button variant="ghost" size="xs" icon onclick={(e: MouseEvent) => { e.stopPropagation(); onshare(f.id, f.name, "folder"); }} aria-label="Share">
                <Share2 size={12} />
              </Button>
            {/if}
            {#if ondeletefolder}
              <Button variant="ghost" size="xs" icon onclick={(e: MouseEvent) => { e.stopPropagation(); ondeletefolder(f.id); }} aria-label="Delete">
                <Trash2 size={12} />
              </Button>
            {/if}
          </Flex>
        </div>
      </div>
    {/each}
    {#each files as f}
      <div class="grid-item" onclick={() => onopenfilepreview?.(f.id)} role="button" tabindex={0} onkeydown={(e) => { if (e.key === "Enter") onopenfilepreview?.(f.id); }}>
        <div class="grid-preview">
          {#if f.hasPreview}
            <img src={getPreviewUrl(f.id, driveId)} alt={f.originalName} class="grid-thumb" loading="lazy" />
          {:else if isImageType(f.type)}
            <img src="/api/drive/{driveId}/files/{f.id}/download" alt={f.originalName} class="grid-thumb" loading="lazy" />
          {:else}
            <File size={48} />
          {/if}
        </div>
        <div class="grid-info">
          <Text size="sm" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;">{f.originalName}</Text>
          <Text size="xs" color="tertiary">{formatSize(f.size)}</Text>
          <Flex gap="var(--flew-spacing-1)" style="flex-wrap: wrap;" onclick={(e: MouseEvent) => e.stopPropagation()}>
            {#if onshare}
              <Button variant="ghost" size="xs" icon onclick={() => onshare(f.id, f.originalName, "file")} aria-label="Share">
                <Share2 size={12} />
              </Button>
            {/if}
            {#if onmovestart}
              <Button variant="ghost" size="xs" icon onclick={() => onmovestart(f.id, f.originalName)} aria-label="Move">
                <MoveRight size={12} />
              </Button>
            {/if}
            <a href={downloadUrl(f)} download={f.originalName}>
              <Button variant="ghost" size="xs" icon aria-label="Download">
                <Download size={12} />
              </Button>
            </a>
            {#if ondelete}
              <Button variant="ghost" size="xs" icon onclick={() => ondelete(f.id)} aria-label="Delete">
                <Trash2 size={12} />
              </Button>
            {/if}
          </Flex>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <Flex align="center" justify="center" style="height: 100%;">
    <Text color="tertiary">{emptyMessage}</Text>
  </Flex>
{/if}

<style>
  .grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--flew-spacing-3);
    padding: 16px;
  }

  .grid-item {
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-md);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--flew-transition-fast);
    background: var(--flew-color-bg);
  }

  .grid-item:hover {
    border-color: var(--flew-color-text-tertiary);
    box-shadow: var(--flew-shadow-sm);
  }

  .grid-preview {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--flew-color-bg-hover);
    overflow: hidden;
  }

  .grid-folder-preview {
    background: var(--flew-color-bg-active);
    color: var(--flew-color-text-secondary);
  }

  .grid-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .grid-info {
    padding: 8px 10px;
  }
</style>
