<script lang="ts">
  import type { Snippet } from "svelte";

  type Color = "primary" | "success" | "error" | "warning" | "info" | "secondary" | "tertiary";
  type Size = "sm" | "md";

  type Props = {
    color?: Color;
    size?: Size;
    style?: string;
    children: Snippet;
  };

  let {
    color = "primary",
    size = "md",
    style = "",
    children,
  }: Props = $props();

  let dims = $derived(size === "sm" ? "28px" : "32px");

  const bgMap: Record<Color, string> = {
    primary: "var(--flew-color-primary-bg)",
    success: "var(--flew-color-success-bg)",
    error: "var(--flew-color-error-bg)",
    warning: "var(--flew-color-warning-bg)",
    info: "var(--flew-color-info-bg)",
    secondary: "var(--flew-color-bg-surface)",
    tertiary: "var(--flew-color-bg)",
  };

  const colorMap: Record<Color, string> = {
    primary: "var(--flew-color-primary)",
    success: "var(--flew-color-success)",
    error: "var(--flew-color-error)",
    warning: "var(--flew-color-warning)",
    info: "var(--flew-color-info)",
    secondary: "var(--flew-color-text-secondary)",
    tertiary: "var(--flew-color-text-tertiary)",
  };
</script>

<div
  class="icon-box"
  style="
    width: {dims};
    height: {dims};
    background: {bgMap[color]};
    color: {colorMap[color]};
    {style}
  "
>
  {@render children()}
</div>

<style>
  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: var(--flew-radius-md);
  }
</style>
