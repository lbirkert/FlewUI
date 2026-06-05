<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    depth?: 1 | 2 | 3 | 4;
    children: Snippet;
  };

  let { depth = 1, children }: Props = $props();

  const tagMap = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4"
  } as const;
</script>

<svelte:element this={tagMap[depth]}>
  {@render children()}
</svelte:element>

<style>
  h1 {
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 12px 0;
  }

  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 10px 0;
  }

  h3 {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  h4 {
    font-size: 13px;
    font-weight: 600;
    margin: 0 0 6px 0;
  }
</style>