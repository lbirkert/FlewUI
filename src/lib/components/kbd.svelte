<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<kbd class="kbd">{@render children()}</kbd>

<style>
  .kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1px 5px;
    font-family: var(--flew-font-mono);
    font-size: var(--flew-font-size-xs);
    color: var(--flew-color-text-secondary);
    background: var(--flew-color-bg-hover);
    border: 1px solid var(--flew-color-border);
    border-bottom-width: 2px;
    border-radius: var(--flew-radius-sm);
    line-height: 1.4;
    white-space: nowrap;
  }
</style>
