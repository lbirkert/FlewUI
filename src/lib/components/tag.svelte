<script lang="ts">
  import type { Snippet } from "svelte";
  import { X } from "@lucide/svelte";

  type Variant = "primary" | "success" | "warning" | "error" | "info" | "neutral";
  type Size = "sm" | "md";

  type Props = {
    variant?: Variant;
    size?: Size;
    closable?: boolean;
    children: Snippet;
    onclose?: () => void;
  };

  let {
    variant = "neutral",
    size = "sm",
    closable = false,
    children,
    onclose,
  }: Props = $props();

  let hidden = $state(false);
  let cls = $derived(`tag variant-${variant} size-${size}`);

  function handleClose() {
    hidden = true;
    onclose?.();
  }
</script>

{#if !hidden}
  <span class={cls}>
    {@render children()}
    {#if closable}
      <button class="close" onclick={handleClose} aria-label="remove">
        <X size={14} />
      </button>
    {/if}
  </span>
{/if}

<style>
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: var(--flew-font-sans);
    font-weight: 500;
    border-radius: var(--flew-radius-sm);
    white-space: nowrap;
    line-height: 1;
  }

  .size-sm {
    padding: 2px 6px;
    font-size: var(--flew-font-size-xs);
    height: 20px;
  }

  .size-md {
    padding: 3px 8px;
    font-size: var(--flew-font-size-sm);
    height: 24px;
  }

  .variant-primary {
    background: var(--flew-color-primary-bg);
    color: var(--flew-color-primary);
    border: 1px solid var(--flew-color-primary-border);
  }

  .variant-success {
    background: var(--flew-color-success-bg);
    color: var(--flew-color-success);
    border: 1px solid var(--flew-color-success-border);
  }

  .variant-warning {
    background: var(--flew-color-warning-bg);
    color: var(--flew-color-warning);
    border: 1px solid var(--flew-color-warning-border);
  }

  .variant-error {
    background: var(--flew-color-error-bg);
    color: var(--flew-color-error);
    border: 1px solid var(--flew-color-error-border);
  }

  .variant-info {
    background: var(--flew-color-info-bg);
    color: var(--flew-color-info);
    border: 1px solid var(--flew-color-info-border);
  }

  .variant-neutral {
    background: var(--flew-color-bg-hover);
    color: var(--flew-color-text-secondary);
    border: 1px solid var(--flew-color-border);
  }

  .close {
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    transition: opacity var(--flew-transition-fast);
    width: 14px;
    height: 14px;
  }

  .close:hover {
    opacity: 1;
  }

  .close :global(.lucide) {
    width: 12px;
    height: 12px;
  }
</style>
