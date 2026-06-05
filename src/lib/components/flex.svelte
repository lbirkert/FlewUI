<script lang="ts">
  import type { Snippet } from "svelte";

  type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
  type Align = "start" | "center" | "end" | "stretch" | "baseline";
  type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";

  type Props = {
    direction?: FlexDirection | "vertical" | "horizontal";
    gap?: string;
    align?: Align;
    justify?: Justify;
    wrap?: boolean;
    inline?: boolean;
    style?: string;
    children: Snippet;
  };

  let {
    direction = "row",
    gap = "var(--flew-spacing-3)",
    align = "stretch",
    justify = "start",
    wrap = false,
    inline = false,
    style = "",
    children,
  }: Props = $props();

  const directionMap: Record<string, string> = {
    vertical: "column",
    horizontal: "row",
  };

  const alignMap: Record<Align, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
    baseline: "baseline",
  };

  const justifyMap: Record<Justify, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  };
</script>

<div
  class="flex"
  class:inline
  style="
    flex-direction: {directionMap[direction] ?? direction};
    gap: {gap};
    align-items: {alignMap[align]};
    justify-content: {justifyMap[justify]};
    flex-wrap: {wrap ? 'wrap' : 'nowrap'};
    {style}
  "
>
  {@render children()}
</div>

<style>
  .flex {
    display: flex;
  }

  .inline {
    display: inline-flex;
  }
</style>
