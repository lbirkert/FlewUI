<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    position?: "left" | "right";
    width?: string;
    children: Snippet;
  };

  let {
    position = "left",
    width = "260px",
    children
  }: Props = $props();
</script>

<div
  class="sidebar"
  style="
    width: {width};
    grid-column: {position === 'left' ? '1' : '-1'};
  "
>
  {@render children()}
</div>

<style>
  .sidebar {
    height: 100%;
    overflow: hidden;
    border-right: 1px solid rgba(255,255,255,0.08);
  }
</style>