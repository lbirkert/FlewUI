<script lang="ts">
  import type { Snippet } from "svelte";

  type Size = "sm" | "md" | "lg" | "xl" | "full";

  type Props = {
    size?: Size;
    children: Snippet;
  };

  let { size = "lg", children }: Props = $props();

  const maxWidth: Record<Size, string> = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    full: "100%",
  };
</script>

<div class="container" style="max-width: {maxWidth[size]}">
  {@render children()}
</div>

<style>
  .container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--flew-spacing-4);
    padding-right: var(--flew-spacing-4);
  }
</style>
