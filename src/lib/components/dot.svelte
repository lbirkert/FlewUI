<script lang="ts">
  type Color = "primary" | "success" | "error" | "warning" | "info" | "secondary" | "tertiary";
  type Size = "sm" | "md";

  type Props = {
    color?: Color;
    size?: Size;
    style?: string;
  };

  let {
    color = "primary",
    size = "md",
    style = "",
  }: Props = $props();

  let dims = $derived(size === "sm" ? "6px" : "8px");

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
  class="dot"
  style="
    width: {dims};
    height: {dims};
    background: {colorMap[color]};
    {style}
  "
></div>

<style>
  .dot {
    border-radius: 50%;
    flex-shrink: 0;
    display: inline-block;
  }
</style>
