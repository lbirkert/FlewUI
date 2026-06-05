<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    columns?: number | string;
    gap?: string;
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "stretch";
    style?: string;
    children: Snippet;
  };

  let {
    columns = 2,
    gap = "var(--flew-spacing-4)",
    align = "stretch",
    justify = "stretch",
    style = "",
    children,
  }: Props = $props();

  let cols = $derived(typeof columns === "number" ? `repeat(${columns}, 1fr)` : columns);
</script>

<div
  class="grid"
  style="
    grid-template-columns: {cols};
    gap: {gap};
    align-items: {align};
    justify-items: {justify};
    {style}
  "
>
  {@render children()}
</div>

<style>
  .grid {
    display: grid;
  }
</style>
