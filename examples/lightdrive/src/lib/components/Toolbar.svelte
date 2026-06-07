<script lang="ts">
  import { Button, Flex, Text } from "flewui";
  import { ChevronRight, Plus, Upload, Grid3X3, List, Pen, Share2, MoveRight, Trash2, X, ArrowLeft } from "@lucide/svelte";

  type Props = {
    breadcrumbs: { id: string | null; name: string }[];
    viewMode?: "list" | "grid";
    showViewToggle?: boolean;
    showNewButton?: boolean;
    showUploadButton?: boolean;
    onnavigate?: (id: string | null) => void;
    onviewmodechange?: (mode: "list" | "grid") => void;
    onnewclick?: () => void;
    onuploadclick?: () => void;
    hasSelection?: boolean;
    selectedCount?: number;
    canRenameSelection?: boolean;
    canShareSelection?: boolean;
    canMoveSelection?: boolean;
    canDeleteSelection?: boolean;
    onRename?: () => void;
    onShare?: () => void;
    onMove?: () => void;
    onDelete?: () => void;
    onClearSelection?: () => void;
  };

  let {
    breadcrumbs, viewMode = "list", showViewToggle = true, showNewButton = true, showUploadButton = true,
    onnavigate, onviewmodechange, onnewclick, onuploadclick,
    hasSelection = false, selectedCount = 0,
    canRenameSelection = false, canShareSelection = false, canMoveSelection = false, canDeleteSelection = false,
    onRename, onShare, onMove, onDelete, onClearSelection,
  }: Props = $props();
</script>

<Flex
  align="center"
  gap="var(--flew-spacing-2)"
  style="padding: 8px 16px; border-bottom: 1px solid var(--flew-color-border); flex-shrink: 0; height: 47px; overflow: hidden;"
>
  {#if hasSelection}
    <Text size="sm" weight="medium" style="white-space: nowrap;">{selectedCount} selected</Text>
    <div style="flex: 1;"></div>
    {#if canRenameSelection}
      <Button variant="ghost" size="sm" onclick={onRename}>
        <Pen size={14} /><span class="btn-label"> Rename</span>
      </Button>
    {/if}
    {#if canShareSelection}
      <Button variant="ghost" size="sm" onclick={onShare}>
        <Share2 size={14} /><span class="btn-label"> Share</span>
      </Button>
    {/if}
    {#if canMoveSelection}
      <Button variant="ghost" size="sm" onclick={onMove}>
        <MoveRight size={14} /><span class="btn-label"> Move</span>
      </Button>
    {/if}
    {#if canDeleteSelection}
      <Button variant="ghost" size="sm" onclick={onDelete}>
        <Trash2 size={14} /><span class="btn-label"> Delete</span>
      </Button>
    {/if}
    <Button variant="ghost" size="sm" onclick={onClearSelection}>
      <X size={14} /><span class="btn-label"> Cancel</span>
    </Button>
  {:else}
    <div class="breadcrumb-desktop">
      {#each breadcrumbs as crumb, i}
        {#if i > 0}<ChevronRight size={14} />{/if}
        <button class="breadcrumb" onclick={() => onnavigate?.(crumb.id)}>{crumb.name}</button>
      {/each}
    </div>
    <div class="breadcrumb-mobile">
      {#if breadcrumbs.length > 1}
        <button class="back-btn" onclick={() => onnavigate?.(breadcrumbs[breadcrumbs.length - 2].id)} aria-label="Back">
          <ArrowLeft size={16} />
        </button>
      {/if}
      <span class="current-folder">{breadcrumbs[breadcrumbs.length - 1]?.name ?? ""}</span>
    </div>
    {#if showNewButton}
      <Button variant="ghost" size="sm" onclick={onnewclick}>
        <Plus size={14} /><span class="btn-label"> New</span>
      </Button>
    {/if}
    {#if showUploadButton}
      <Button variant="ghost" size="sm" onclick={onuploadclick}>
        <Upload size={14} /><span class="btn-label"> Upload</span>
      </Button>
    {/if}
    {#if showViewToggle}
      <Flex gap="var(--flew-spacing-1)" style="border: 1px solid var(--flew-color-border); border-radius: var(--flew-radius-sm); padding: 2px; flex-shrink: 0;">
        <button class="view-btn" class:active={viewMode === "list"} onclick={() => onviewmodechange?.("list")} aria-label="List view">
          <List size={16} />
        </button>
        <button class="view-btn" class:active={viewMode === "grid"} onclick={() => onviewmodechange?.("grid")} aria-label="Grid view">
          <Grid3X3 size={16} />
        </button>
      </Flex>
    {/if}
  {/if}
</Flex>

<style>
  .breadcrumb-desktop {
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-1);
    min-width: 0;
    overflow: hidden;
    flex: 1;
  }

  .breadcrumb-desktop :global(svg) {
    flex-shrink: 0;
    color: var(--flew-color-text-tertiary);
  }

  .breadcrumb-mobile {
    display: none;
    align-items: center;
    gap: var(--flew-spacing-1);
    flex: 1;
    min-width: 0;
  }

  .breadcrumb {
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-secondary);
    padding: 2px 6px;
    border-radius: var(--flew-radius-sm);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .breadcrumb:hover {
    color: var(--flew-color-text);
    background: var(--flew-color-bg-hover);
  }

  .breadcrumb:last-child {
    color: var(--flew-color-text);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .back-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--flew-color-text-secondary);
    padding: 2px;
    border-radius: var(--flew-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .back-btn:hover {
    color: var(--flew-color-text);
    background: var(--flew-color-bg-hover);
  }

  .current-folder {
    font-size: var(--flew-font-size-sm);
    font-weight: 600;
    color: var(--flew-color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .view-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--flew-color-text-tertiary);
    padding: 4px;
    border-radius: var(--flew-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--flew-transition-fast);
  }

  .view-btn:hover {
    color: var(--flew-color-text);
    background: var(--flew-color-bg-hover);
  }

  .view-btn.active {
    color: var(--flew-color-text);
    background: var(--flew-color-bg-active);
  }

  @media (max-width: 640px) {
    .btn-label {
      display: none;
    }

    .breadcrumb-desktop {
      display: none;
    }

    .breadcrumb-mobile {
      display: flex;
    }
  }
</style>
