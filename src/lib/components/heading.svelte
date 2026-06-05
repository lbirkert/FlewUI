<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    depth?: 1 | 2 | 3 | 4;
    margin?: "default" | "none";
    class?: string;
    style?: string;
    children: Snippet;
  };

  let {
    depth = 1,
    margin = "default",
    class: className = "",
    style = "",
    children,
  }: Props = $props();

  let cls = $derived(`heading depth-${depth} margin-${margin}${className ? ' ' + className : ''}`);

  const tagMap = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4"
  } as const;
</script>

<svelte:element this={tagMap[depth]} class={cls} {style}>
  {@render children()}
</svelte:element>

<style>
  .heading {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  .depth-1 { font-size: 22px; }
  .depth-2 { font-size: 18px; }
  .depth-3 { font-size: 15px; }
  .depth-4 { font-size: 13px; }

  .margin-default { display: block; }
  .margin-default.depth-1 { margin: 0 0 12px 0; }
  .margin-default.depth-2 { margin: 0 0 10px 0; }
  .margin-default.depth-3 { margin: 0 0 8px 0; }
  .margin-default.depth-4 { margin: 0 0 6px 0; }

  .margin-none { margin: 0; }
</style>