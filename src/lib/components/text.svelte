<script lang="ts">
  import type { Snippet } from "svelte";

  type Size = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  type Weight = "normal" | "medium" | "semibold" | "bold";
  type Color = "default" | "secondary" | "tertiary" | "primary" | "error" | "success" | "warning";
  type Align = "left" | "center" | "right";

  type Props = {
    size?: Size;
    weight?: Weight;
    color?: Color;
    margin?: "default" | "none";
    align?: Align;
    as?: "span" | "p" | "div" | "label";
    style?: string;
    children: Snippet;
  };

  let {
    size = "base",
    weight = "normal",
    color = "default",
    align = "left",
    margin = "none",
    as = "p",
    style = "",
    children,
  }: Props = $props();

  const sizeMap: Record<Size, string> = {
    xs: "var(--flew-font-size-xs)",
    sm: "var(--flew-font-size-sm)",
    base: "var(--flew-font-size-base)",
    lg: "var(--flew-font-size-lg)",
    xl: "var(--flew-font-size-xl)",
    "2xl": "var(--flew-font-size-2xl)",
    "3xl": "var(--flew-font-size-3xl)",
  };

  const colorMap: Record<Color, string> = {
    default: "var(--flew-color-text)",
    secondary: "var(--flew-color-text-secondary)",
    tertiary: "var(--flew-color-text-tertiary)",
    primary: "var(--flew-color-primary)",
    error: "var(--flew-color-error)",
    success: "var(--flew-color-success)",
    warning: "var(--flew-color-warning)",
  };

  const weightMap: Record<Weight, string> = {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  };
</script>

<svelte:element
  this={as}
  class={`text margin-${margin}`}
  style="
    font-size: {sizeMap[size]};
    font-weight: {weightMap[weight]};
    color: {colorMap[color]};
    text-align: {align};
    {style}
  "
>
  {@render children()}
</svelte:element>

<style>
  .text {
    font-family: var(--flew-font-sans);
    line-height: 1.5;
    margin: 0;
  }

  .text.margin-default {
    margin-bottom: var(--flew-spacing-2);
  }
</style>
