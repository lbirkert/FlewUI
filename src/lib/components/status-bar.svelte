<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    left?: Snippet;
    right?: Snippet;
  };

  let { left, right }: Props = $props();
</script>

<div class="status-bar">
  <div class="status-left">
    {#if left}
      {@render left()}
    {/if}
  </div>
  <div class="status-right">
    {#if right}
      {@render right()}
    {/if}
  </div>
</div>

<style>
  .status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 24px;
    padding: 0 12px;
    background: var(--flew-color-bg-surface);
    border-top: 1px solid var(--flew-color-border);
    color: var(--flew-color-text-secondary);
    font-size: var(--flew-font-size-xs);
    flex-shrink: 0;
  }

  .status-left,
  .status-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
</style>
