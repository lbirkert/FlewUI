<script lang="ts">
  import type { Snippet } from "svelte";

  type PaddingSize = "xs" | "sm" | "md" | "lg";

  const paddingMap: Record<PaddingSize, string> = {
    xs: "var(--flew-spacing-2)",
    sm: "var(--flew-spacing-3)",
    md: "var(--flew-spacing-4)",
    lg: "var(--flew-spacing-5)",
  };

  type Props = {
    variant?: "filled" | "outlined" | "elevated";
    padding?: string;
    paddingSize?: PaddingSize;
    style?: string;
    class?: string;
    children: Snippet;
  };

  let {
    variant = "filled",
    padding = "",
    paddingSize = "md",
    style = "",
    class: className = "",
    children,
  }: Props = $props();

  let resolvedPadding = $derived(padding || paddingMap[paddingSize]);
  let cls = $derived(`card variant-${variant}${className ? ' ' + className : ''}`);
</script>

<div class={cls} style="padding: {resolvedPadding}; {style}">
  {@render children()}
</div>

<style>
  .card {
    border-radius: var(--flew-radius-lg);
    font-family: var(--flew-font-sans);
    color: var(--flew-color-text);
  }

  .variant-filled {
    background: var(--flew-color-bg-elevated);
    border: 1px solid var(--flew-color-border);
  }

  .variant-outlined {
    background: transparent;
    border: 1px solid var(--flew-color-border);
  }

  .variant-elevated {
    background: var(--flew-color-bg-overlay);
    border: 1px solid var(--flew-color-border);
    box-shadow: var(--flew-shadow-md);
  }
</style>
