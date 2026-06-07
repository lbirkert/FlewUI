<script lang="ts">
  import { Flex, Text } from "flewui";
  import { File, Folder } from "@lucide/svelte";
  import { formatSize, formatFullDate, getPreviewUrl, isVideoType } from "./helpers";

  let failedImages = $state<Set<string>>(new Set());
  function imgError(fileId: string) {
    failedImages.add(fileId);
    failedImages = new Set(failedImages);
  }

  type Item = Record<string, any>;

  type Props = {
    driveId?: string;
    folders: Item[];
    files: Item[];
    folderSizes?: Record<string, number>;
    selectedIds: Set<string>;
    onnavigate?: (id: string | null) => void;
    onopenfilepreview?: (id: string) => void;
    ontoggleselection?: (id: string) => void;
    emptyMessage?: string;
  };

  let {
    driveId, folders, files, folderSizes = {},
    selectedIds,
    onnavigate, onopenfilepreview, ontoggleselection,
    emptyMessage = "No files yet.",
  }: Props = $props();

  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let longPressFired = false;

  function touchStart(id: string) {
    longPressFired = false;
    longPressTimer = setTimeout(() => {
      ontoggleselection?.(id);
      longPressTimer = null;
      longPressFired = true;
    }, 500);
  }

  function touchEnd() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function touchMove() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handleClick(e: MouseEvent, id: string, isFolder: boolean) {
    if (longPressFired) {
      longPressFired = false;
      return;
    }
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    if (e.ctrlKey || e.metaKey) {
      ontoggleselection?.(id);
    } else if (selectedIds.size > 0) {
      ontoggleselection?.(id);
    } else {
      if (isFolder) onnavigate?.(id);
      else onopenfilepreview?.(id);
    }
  }
</script>

{#if folders.length > 0 || files.length > 0}
  <div class="list-table">
    <div class="list-header">
      <span class="col-name">Name</span>
      <span class="col-size">Size</span>
      <span class="col-date">Created</span>
      <span class="col-owner">Owner</span>
    </div>
    {#each folders as f}
      <div
        class="list-row"
        class:selected={selectedIds.has(f.id)}
        onclick={(e) => handleClick(e, f.id, true)}
        oncontextmenu={(e) => e.preventDefault()}
        ontouchstart={() => touchStart(f.id)}
        ontouchend={touchEnd}
        ontouchmove={touchMove}
        role="button"
        tabindex={0}
        onkeydown={(e) => { if (e.key === "Enter") handleClick(e, f.id, true); }}
      >
        <span class="col-name">
          <Folder size={16} />
          <Text size="sm">{f.name}</Text>
        </span>
        <span class="col-size"><Text size="xs" color="tertiary">{formatSize(folderSizes[f.id] ?? 0)}</Text></span>
        <span class="col-date"><Text size="xs" color="tertiary">{formatFullDate(f.createdAt)}</Text></span>
        <span class="col-owner"><Text size="xs" color="tertiary">You</Text></span>
      </div>
    {/each}
    {#each files as f}
      <div
        class="list-row"
        class:selected={selectedIds.has(f.id)}
        onclick={(e) => handleClick(e, f.id, false)}
        oncontextmenu={(e) => e.preventDefault()}
        ontouchstart={() => touchStart(f.id)}
        ontouchend={touchEnd}
        ontouchmove={touchMove}
        role="button"
        tabindex={0}
        onkeydown={(e) => { if (e.key === "Enter") handleClick(e, f.id, false); }}
      >
        <span class="col-name">
          {#if f.hasPreview || (isVideoType(f.type, f.originalName) && !failedImages.has(f.id))}
            <img src={getPreviewUrl(f.id, driveId)} alt="" class="list-thumb" onerror={() => imgError(f.id)} />
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
    grid-template-columns: 1fr 80px 120px 80px;
    gap: var(--flew-spacing-2);
    padding: 8px 12px;
    border-bottom: 1px solid var(--flew-color-border);
    font-size: var(--flew-font-size-xs);
    color: var(--flew-color-text-tertiary);
    font-weight: 600;
  }

  .list-row {
    display: grid;
    grid-template-columns: 1fr 80px 120px 80px;
    gap: var(--flew-spacing-2);
    padding: 8px 12px;
    align-items: center;
    border-bottom: 1px solid var(--flew-color-border);
    cursor: pointer;
    transition: background var(--flew-transition-fast);
  }

  .list-row:hover {
    background: var(--flew-color-bg-hover);
  }

  .list-row.selected {
    background: var(--flew-color-primary-bg);
  }

  .list-row.selected:hover {
    background: var(--flew-color-primary-hover);
  }

  .col-name {
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-2);
    min-width: 0;
    overflow: hidden;
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
    .col-owner {
      display: none;
    }

    .list-row {
      padding: 12px 16px;
    }

    .col-name :global(.flew-text--sm) {
      font-size: 16px !important;
    }

    .list-thumb {
      width: 32px;
      height: 32px;
    }

    .col-name :global(svg) {
      width: 20px;
      height: 20px;
    }
  }
</style>
