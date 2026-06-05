<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type { Snippet } from "svelte";
  import { PANE_GROUP_CTX } from "./constants.ts";

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();

  const ctx = getContext<{
    registerPane: (id: symbol) => void;
    unregisterPane: (id: symbol) => void;
    setPaneElement: (id: symbol, el: HTMLElement) => void;
    getPaneFlex: (id: symbol) => string;
  }>(PANE_GROUP_CTX);

  const id = Symbol("pane");
  let el: HTMLElement;

  onMount(() => {
    ctx.registerPane(id);
    ctx.setPaneElement(id, el);
    return () => ctx.unregisterPane(id);
  });

  let flex = $derived(ctx.getPaneFlex(id));
</script>

<div bind:this={el} class="pane" style="flex: {flex}; min-width: 0; min-height: 0;">
  {@render children()}
</div>

<style>
  .pane {
    overflow: auto;
  }
</style>
