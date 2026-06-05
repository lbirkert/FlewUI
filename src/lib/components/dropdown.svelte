<script lang="ts">
  import type { Snippet } from "svelte";

  type Position = "bottom-left" | "bottom-right" | "top-left" | "top-right";

  type Props = {
    trigger: Snippet;
    items: { label: string; value: string; disabled?: boolean; divider?: boolean }[];
    position?: Position;
    onSelect: (value: string) => void;
    open?: boolean;
  };

  let {
    trigger,
    items,
    position = "bottom-left",
    onSelect,
    open = $bindable(false),
  }: Props = $props();

  let menuEl: HTMLDivElement = $state(null!);
  let triggerEl: HTMLDivElement = $state(null!);

  function handleSelect(value: string) {
    onSelect(value);
    open = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      open = false;
    }
  }

  function toggleOpen(e: MouseEvent) {
    e.stopPropagation();
    open = !open;
  }

  $effect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuEl && !menuEl.contains(e.target as Node)) {
        open = false;
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  });
</script>

<div class="dropdown" class:open>
  <div bind:this={triggerEl} class="trigger-wrap" role="button" tabindex="0" onclick={toggleOpen} onkeydown={handleKeydown}>
    {@render trigger()}
  </div>
  {#if open}
    <div bind:this={menuEl} class="menu position-{position}" role="menu">
      {#each items as item}
        {#if item.divider}
          <div class="divider" role="separator"></div>
        {:else}
          <button
            class="item"
            class:disabled={item.disabled}
            role="menuitem"
            disabled={item.disabled}
            onclick={() => handleSelect(item.value)}
          >
            {item.label}
          </button>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .trigger-wrap {
    cursor: pointer;
  }

  .menu {
    position: absolute;
    z-index: 800;
    min-width: 160px;
    background: var(--flew-color-bg-overlay);
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-md);
    box-shadow: var(--flew-shadow-lg);
    padding: 4px;
    animation: fadeIn 100ms ease;
  }

  .position-bottom-left {
    top: calc(100% + 4px);
    left: 0;
  }

  .position-bottom-right {
    top: calc(100% + 4px);
    right: 0;
  }

  .position-top-left {
    bottom: calc(100% + 4px);
    left: 0;
  }

  .position-top-right {
    bottom: calc(100% + 4px);
    right: 0;
  }

  .item {
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
    width: 100%;
    padding: 6px 10px;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    color: var(--flew-color-text);
    border-radius: var(--flew-radius-sm);
    cursor: pointer;
    transition: background var(--flew-transition-fast);
    box-sizing: border-box;
  }

  .item:hover:not(.disabled) {
    background: var(--flew-color-bg-hover);
  }

  .item.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .divider {
    height: 1px;
    background: var(--flew-color-border);
    margin: 4px 8px;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-2px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
