<script lang="ts">
  import type { Snippet } from "svelte";
  import { ChevronRight, Folder, File } from "@lucide/svelte";

  type FileNode = {
    name: string;
    type: "file" | "folder";
    open?: boolean;
    children?: FileNode[];
  };

  type Props = {
    nodes: FileNode[];
    children?: Snippet<[FileNode, number]>;
  };

  let { nodes, children }: Props = $props();
</script>

{#snippet DefaultItem(node: FileNode, depth: number)}
  <div class="file-row" style="padding-left: {depth * 16 + 8}px">
    {#if node.type === "folder"}
      <button class="file-toggle" aria-label="toggle {node.name}">
        <span class="folder-arrow {node.open ?? false ? 'open' : ''}"><ChevronRight size={16} /></span>
        <span class="folder-icon"><Folder size={16} /></span>
        <span class="file-name">{node.name}</span>
      </button>
      {#if node.open && node.children}
        {#each node.children as child}
          {#if children}
            {@render children(child, depth + 1)}
          {:else}
            {@render DefaultItem(child, depth + 1)}
          {/if}
        {/each}
      {/if}
    {:else}
      <div class="file-leaf">
        <span class="file-icon"><File size={16} /></span>
        <span class="file-name">{node.name}</span>
      </div>
    {/if}
  </div>
{/snippet}

<div class="file-tree">
  {#each nodes as node}
    {#if children}
      {@render children(node, 0)}
    {:else}
      {@render DefaultItem(node, 0)}
    {/if}
  {/each}
</div>

<style>
  .file-tree {
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-secondary);
  }

  .file-row {
    padding-top: 2px;
    padding-bottom: 2px;
  }

  .file-toggle {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    outline: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    padding: 2px 0;
    color: var(--flew-color-text-secondary);
    font-size: var(--flew-font-size-sm);
  }

  .file-toggle:hover {
    color: var(--flew-color-text);
  }

  .file-leaf {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 0;
    color: var(--flew-color-text-secondary);
    font-size: var(--flew-font-size-sm);
    cursor: default;
  }

  .file-leaf:hover {
    color: var(--flew-color-text);
  }

  .file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .folder-arrow {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    transition: transform 100ms ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .folder-arrow.open {
    transform: rotate(90deg);
  }

  .folder-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: #d4a05a;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .file-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: var(--flew-color-text-tertiary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style>
