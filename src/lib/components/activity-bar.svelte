<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    bottom?: Snippet;
  };

  let { children, bottom }: Props = $props();
</script>

<div class="activity-bar">
  <div class="activity-top">
    {@render children()}
  </div>
  {#if bottom}
    <div class="activity-bottom">
      {@render bottom()}
    </div>
  {/if}
</div>

<style>
  .activity-bar {
    width: 44px;
    height: 100%;
    background: var(--flew-color-bg-surface);
    border-right: 1px solid var(--flew-color-border);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    flex-shrink: 0;
  }

  .activity-top,
  .activity-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .activity-top :global(button),
  .activity-bottom :global(button) {
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
    justify-content: center;
    width: 36px;
    height: 36px;
    color: var(--flew-color-text-tertiary);
    border-radius: var(--flew-radius-md);
    transition: all var(--flew-transition-fast);
  }

  .activity-top :global(button:hover),
  .activity-bottom :global(button:hover) {
    background: var(--flew-color-bg-hover);
    color: var(--flew-color-text);
  }

  .activity-top :global(button.active),
  .activity-bottom :global(button.active) {
    color: var(--flew-color-text);
    background: var(--flew-color-bg-active);
  }

  .activity-top :global(button svg),
  .activity-bottom :global(button svg) {
    width: 20px;
    height: 20px;
  }
</style>
