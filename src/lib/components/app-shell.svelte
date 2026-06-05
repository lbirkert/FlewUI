<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    header?: Snippet;
    sidebar?: Snippet;
    children: Snippet;
    footer?: Snippet;
  };

  let { header, sidebar, children, footer }: Props = $props();
</script>

<div class="shell">
  {#if header}
    <div class="shell-header">
      {@render header()}
    </div>
  {/if}
  <div class="shell-body">
    {#if sidebar}
      <div class="shell-sidebar">
        {@render sidebar()}
      </div>
    {/if}
    <div class="shell-content">
      {@render children()}
    </div>
  </div>
  {#if footer}
    <div class="shell-footer">
      {@render footer()}
    </div>
  {/if}
</div>

<style>
  .shell {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .shell-header {
    flex-shrink: 0;
  }

  .shell-body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: row;
  }

  .shell-sidebar {
    flex-shrink: 0;
  }

  .shell-content {
    flex: 1;
    min-width: 0;
    display: flex;
  }
</style>
