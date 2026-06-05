<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<p>{@render children()}</p>

<style>
  p {
    font-size: 13px;
    line-height: 1.5;
    margin: 0 0 8px 0;
    opacity: 0.9;
  }
</style>