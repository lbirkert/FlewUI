<script lang="ts">
  import type { Snippet } from "svelte";

  type Variant = "surface" | "elevated";

  type Props = {
    position?: "left" | "right";
    width?: string;
    variant?: Variant;
    title?: string;
    children: Snippet;
  };

  let {
    position = "left",
    width = "260px",
    variant = "surface",
    title = "",
    children
  }: Props = $props();

  let cls = $derived(`sidebar variant-${variant}`);
</script>

<div
  class={cls}
  style="
    width: {width};
    grid-column: {position === 'left' ? '1' : '-1'};
  "
>
  {#if title}
    <div class="sidebar-title">{title}</div>
  {/if}
  <div class="sidebar-content">
    {@render children()}
  </div>
</div>

<style>
  .sidebar {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .sidebar.variant-surface {
    background: var(--flew-color-bg-surface);
    border-right: 1px solid var(--flew-color-border);
  }

  .sidebar.variant-elevated {
    background: var(--flew-color-bg-elevated);
    border-right: 1px solid var(--flew-color-border);
  }

  .sidebar-title {
    padding: 12px 12px 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-sm);
    font-weight: 600;
    color: var(--flew-color-text-secondary);
    flex-shrink: 0;
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }
</style>
