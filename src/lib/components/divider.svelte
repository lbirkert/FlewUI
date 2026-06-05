<script lang="ts">
  type Props = {
    label?: string;
    orientation?: "horizontal" | "vertical";
  };

  let { label = "", orientation = "horizontal" }: Props = $props();
</script>

{#if orientation === "vertical"}
  <div class="divider-vertical" role="separator" aria-orientation="vertical"></div>
{:else if label}
  <div class="divider-label" role="separator" aria-orientation="horizontal">
    <span class="line"></span>
    <span class="label">{label}</span>
    <span class="line"></span>
  </div>
{:else}
  <div class="divider" role="separator" aria-orientation="horizontal"></div>
{/if}

<style>
  .divider {
    width: 100%;
    height: 1px;
    background: var(--flew-color-border);
    margin: var(--flew-spacing-4) 0;
  }

  .divider-vertical {
    width: 1px;
    height: 100%;
    background: var(--flew-color-border);
    margin: 0 var(--flew-spacing-4);
  }

  .divider-label {
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-3);
    margin: var(--flew-spacing-4) 0;
  }

  .line {
    flex: 1;
    height: 1px;
    background: var(--flew-color-border);
  }

  .label {
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-xs);
    color: var(--flew-color-text-tertiary);
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
</style>
