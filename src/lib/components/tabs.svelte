<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    value: string;
    onChange?: (value: string) => void;
    tabs: { value: string; label: string; disabled?: boolean }[];
    children: Snippet;
  };

  let {
    value = $bindable(""),
    onChange,
    tabs,
    children,
  }: Props = $props();

  function select(v: string) {
    if (v !== value) {
      value = v;
      onChange?.(v);
    }
  }
</script>

<div class="tabs">
  <div class="tab-list" role="tablist">
    {#each tabs as tab}
      <button
        class="tab"
        class:active={tab.value === value}
        class:disabled={tab.disabled}
        role="tab"
        aria-selected={tab.value === value}
        disabled={tab.disabled}
        onclick={() => select(tab.value)}
      >
        {tab.label}
      </button>
    {/each}
    <span class="indicator" style="--tab: {tabs.findIndex(t => t.value === value)}; --count: {tabs.length}"></span>
  </div>
  <div class="tab-panel" role="tabpanel">
    {@render children()}
  </div>
</div>

<style>
  .tabs {
    display: flex;
    flex-direction: column;
  }

  .tab-list {
    display: flex;
    border-bottom: 1px solid var(--flew-color-border);
    position: relative;
    gap: 0;
  }

  .tab {
    background: none;
    border: none;
    padding: 8px 16px;
    margin: 0;
    outline: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    color: var(--flew-color-text-tertiary);
    cursor: pointer;
    transition: color var(--flew-transition-fast);
    white-space: nowrap;
    position: relative;
  }

  .tab:hover:not(.disabled) {
    color: var(--flew-color-text-secondary);
  }

  .tab.active {
    color: var(--flew-color-text);
  }

  .tab.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .tab-panel {
    padding: var(--flew-spacing-4);
  }
</style>
