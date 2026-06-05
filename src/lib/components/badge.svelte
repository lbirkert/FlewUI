<script lang="ts">
  import type { Snippet } from "svelte";

  type Variant = "primary" | "success" | "warning" | "error" | "info" | "neutral";
  type Size = "sm" | "md";

  type Props = {
    variant?: Variant;
    size?: Size;
    children: Snippet;
  };

  let {
    variant = "primary",
    size = "sm",
    children,
  }: Props = $props();

  let cls = $derived(`badge variant-${variant} size-${size}`);
</script>

<span class={cls}>
  {@render children()}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    font-family: var(--flew-font-sans);
    font-weight: 500;
    border-radius: var(--flew-radius-full);
    white-space: nowrap;
    line-height: 1;
  }

  .size-sm {
    padding: 2px 8px;
    font-size: var(--flew-font-size-xs);
    height: 18px;
  }

  .size-md {
    padding: 3px 10px;
    font-size: var(--flew-font-size-sm);
    height: 22px;
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
</style>
