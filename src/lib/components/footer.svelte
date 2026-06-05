<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<footer class="footer">
  {@render children()}
</footer>

<style>
  .footer {
    background: var(--flew-color-bg-surface);
    border-top: 1px solid var(--flew-color-border);
    padding: var(--flew-spacing-4);
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-tertiary);
    text-align: center;
  }
</style>
