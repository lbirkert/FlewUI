<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type { Snippet } from "svelte";
  import { PANE_GROUP_CTX } from "./constants.ts";

  type Props = {
    initialFlex?: string;
    initialSize?: number;
    pad?: boolean;
    children: Snippet;
  };

  let { initialFlex, initialSize, pad = false, children }: Props = $props();

  let flexValue = $derived(initialSize ? `0 0 ${initialSize}px` : initialFlex);

  const ctx = getContext<{
    registerPane: (id: symbol) => void;
    unregisterPane: (id: symbol) => void;
    setPaneElement: (id: symbol, el: HTMLElement) => void;
    setPaneFlex: (id: symbol, flex: string) => void;
    getPaneFlex: (id: symbol) => string;
  }>(PANE_GROUP_CTX);

  const id = Symbol("pane");
  let el: HTMLElement;

  onMount(() => {
    ctx.registerPane(id);
    ctx.setPaneElement(id, el);
    if (flexValue) ctx.setPaneFlex(id, flexValue);
    return () => ctx.unregisterPane(id);
  });

  let flex = $derived(ctx.getPaneFlex(id));
</script>

<div
  bind:this={el}
  class="pane"
  class:pad
  style="flex: {flex}; min-width: 0; min-height: 0;"
>
  {@render children()}
</div>

<style>
  .pane {
    overflow: auto;
  }

  .pane.pad {
    padding: 20px;
  }
</style>
