<script lang="ts">
  import type { Snippet } from "svelte";
  import { X } from "@lucide/svelte";

  type Tab = {
    label: string;
    active?: boolean;
  };

  type Props = {
    tabs: Tab[];
    onClose?: (tab: Tab) => void;
    onSelect?: (tab: Tab) => void;
    leading?: Snippet;
  };

  let { tabs, onClose, onSelect, leading }: Props = $props();
</script>

<div class="tab-bar">
  {#if leading}
    <div class="tab-leading">
      {@render leading()}
    </div>
  {/if}
  {#each tabs as tab}
    <div
      class="tab"
      class:active={tab.active}
      role="tab"
      tabindex="0"
      onclick={() => onSelect?.(tab)}
      onkeydown={(e) => e.key === "Enter" && onSelect?.(tab)}
    >
      <span class="tab-label">{tab.label}</span>
      {#if onClose}
        <button
          class="tab-close"
          aria-label="close {tab.label}"
          onclick={(e) => { e.stopPropagation(); onClose(tab); }}
        >
          <X size={16} />
        </button>
      {/if}
    </div>
  {/each}
</div>

<style>
  .tab-bar {
    display: flex;
    background: var(--flew-color-bg-surface);
    border-bottom: 1px solid var(--flew-color-border);
    height: 36px;
    align-items: stretch;
  }

  .tab-leading {
    display: flex;
    align-items: center;
  }

  .tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 14px;
    background: var(--flew-color-bg-elevated);
    border-right: 1px solid var(--flew-color-border);
    cursor: pointer;
    position: relative;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-secondary);
  }

  .tab.active {
    background: var(--flew-color-bg);
    border-bottom: 1px solid var(--flew-color-bg);
    margin-bottom: -1px;
    color: var(--flew-color-text);
  }

  .tab.active::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 4px;
    right: 4px;
    height: 2px;
    border-radius: var(--flew-radius-sm);
    background: var(--flew-color-primary);
  }

  .tab-close {
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: var(--flew-radius-sm);
    color: var(--flew-color-text-tertiary);
    opacity: 0;
    transition: all var(--flew-transition-fast);
  }

  .tab:hover .tab-close {
    opacity: 1;
  }

  .tab-close:hover {
    background: var(--flew-color-bg-hover);
    color: var(--flew-color-text);
  }

  .tab-close :global(.lucide) {
    width: 12px;
    height: 12px;
  }
</style>
