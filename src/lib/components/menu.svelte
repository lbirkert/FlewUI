<script lang="ts">
  type Variant = "vertical" | "horizontal";

  type Props = {
    items: { label: string; value: string; disabled?: boolean; divider?: boolean }[];
    onSelect: (value: string) => void;
    variant?: Variant;
  };

  let { items, onSelect, variant = "vertical" }: Props = $props();
  let cls = $derived(`menu variant-${variant}`);
</script>

<div class={cls} role="menu">
  {#each items as item}
    {#if item.divider}
      <div class="divider" role="separator"></div>
    {:else}
      <button
        class="item"
        class:disabled={item.disabled}
        role="menuitem"
        disabled={item.disabled}
        onclick={() => onSelect(item.value)}
      >
        {item.label}
      </button>
    {/if}
  {/each}
</div>

<style>
  .menu {
    display: flex;
  }

  .variant-vertical {
    flex-direction: column;
    background: var(--flew-color-bg-overlay);
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-md);
    padding: 4px;
    min-width: 180px;
  }

  .variant-horizontal {
    flex-direction: row;
    gap: 2px;
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
    padding: 7px 12px;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    color: var(--flew-color-text);
    border-radius: var(--flew-radius-sm);
    cursor: pointer;
    transition: background var(--flew-transition-fast);
    box-sizing: border-box;
    white-space: nowrap;
  }

  .variant-horizontal .item {
    width: auto;
    padding: 6px 12px;
    font-size: var(--flew-font-size-sm);
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
</style>
