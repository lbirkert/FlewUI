<script lang="ts">
  import { Button, Flex } from "flewui";
  import { ChevronRight, Plus, Upload, Grid3X3, List } from "@lucide/svelte";

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
  };

  let {
    breadcrumbs, viewMode = "list", showViewToggle = true, showNewButton = true, showUploadButton = true,
    onnavigate, onviewmodechange, onnewclick, onuploadclick,
  }: Props = $props();
</script>

<Flex
  align="center"
  gap="var(--flew-spacing-2)"
  style="padding: 8px 16px; border-bottom: 1px solid var(--flew-color-border); flex-shrink: 0; flex-wrap: wrap;"
>
  {#each breadcrumbs as crumb, i}
    {#if i > 0}<ChevronRight size={14} />{/if}
    <button class="breadcrumb" onclick={() => onnavigate?.(crumb.id)}>{crumb.name}</button>
  {/each}
  <div style="flex: 1;"></div>
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
    <Flex gap="var(--flew-spacing-1)" style="border: 1px solid var(--flew-color-border); border-radius: var(--flew-radius-sm); padding: 2px;">
      <button class="view-btn" class:active={viewMode === "list"} onclick={() => onviewmodechange?.("list")} aria-label="List view">
        <List size={16} />
      </button>
      <button class="view-btn" class:active={viewMode === "grid"} onclick={() => onviewmodechange?.("grid")} aria-label="Grid view">
        <Grid3X3 size={16} />
      </button>
    </Flex>
  {/if}
</Flex>

<style>
  .breadcrumb {
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-secondary);
    padding: 2px 6px;
    border-radius: var(--flew-radius-sm);
  }
  .breadcrumb:hover {
    color: var(--flew-color-text);
    background: var(--flew-color-bg-hover);
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
</style>
