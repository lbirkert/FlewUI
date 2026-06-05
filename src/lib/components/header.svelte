<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    title?: string;
    children?: Snippet;
    actions?: Snippet;
    compact?: boolean;
  };

  let { title = "", children, actions, compact = false }: Props = $props();
</script>

<header class="header" class:compact>
  <div class="inner">
    {#if title}
      <span class="title">{title}</span>
    {/if}
    {#if children}
      <div class="nav">
        {@render children()}
      </div>
    {/if}
    {#if actions}
      <div class="actions">
        {@render actions()}
      </div>
    {/if}
  </div>
</header>

<style>
  .header {
    background: var(--flew-color-bg-surface);
    border-bottom: 1px solid var(--flew-color-border);
    padding: 0 var(--flew-spacing-4);
    height: 48px;
    display: flex;
    align-items: center;
  }

  .header.compact {
    height: 38px;
    padding: 0 var(--flew-spacing-3);
  }

  .inner {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-4);
  }

  .compact .inner {
    gap: var(--flew-spacing-3);
  }

  .title {
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    font-weight: 600;
    color: var(--flew-color-text);
    white-space: nowrap;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-1);
    flex: 1;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-2);
    margin-left: auto;
  }
</style>
