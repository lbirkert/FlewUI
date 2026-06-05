<script lang="ts">
  import { setContext } from "svelte";
  import type { Snippet } from "svelte";
  import { PANE_GROUP_CTX } from "./constants.ts";

  type Dir = "horizontal" | "vertical";

  type Props = {
    dir?: Dir;
    children: Snippet;
  };

  let { dir = "horizontal", children }: Props = $props();

  let paneOrder: symbol[] = $state([]);
  let handleOrder: symbol[] = $state([]);
  let sizeMap: Record<string, string> = $state({});
  let elMap: Record<string, HTMLElement> = $state({});

  function registerPane(id: symbol) {
    paneOrder = [...paneOrder, id];
  }

  function unregisterPane(id: symbol) {
    paneOrder = paneOrder.filter(p => p !== id);
  }

  function registerHandle(id: symbol) {
    handleOrder = [...handleOrder, id];
  }

  function unregisterHandle(id: symbol) {
    handleOrder = handleOrder.filter(h => h !== id);
  }

  function setPaneElement(id: symbol, el: HTMLElement) {
    elMap = { ...elMap, [id.description!]: el };
  }

  function getPaneFlex(id: symbol): string {
    return sizeMap[id.description!] ?? "1";
  }

  let dragState: {
    prevId: symbol;
    nextId: symbol;
    prevEl: HTMLElement;
    nextEl: HTMLElement;
    isHorizontal: boolean;
    startPos: number;
    prevStartSize: number;
    nextStartSize: number;
  } | null = $state(null);

  function handleDragStart(handleId: symbol, e: MouseEvent) {
    const handleIndex = handleOrder.indexOf(handleId);
    if (handleIndex === -1) return;

    const prevId = paneOrder[handleIndex];
    const nextId = paneOrder[handleIndex + 1];
    if (!prevId || !nextId) return;

    const prevEl = elMap[prevId.description!];
    const nextEl = elMap[nextId.description!];
    if (!prevEl || !nextEl) return;

    const isHorizontal = dir === "horizontal";

    dragState = {
      prevId,
      nextId,
      prevEl,
      nextEl,
      isHorizontal,
      startPos: isHorizontal ? e.clientX : e.clientY,
      prevStartSize: isHorizontal ? prevEl.offsetWidth : prevEl.offsetHeight,
      nextStartSize: isHorizontal ? nextEl.offsetWidth : nextEl.offsetHeight,
    };
  }

  $effect(() => {
    if (!dragState) return;

    const ds = dragState;

    function onMove(ev: MouseEvent) {
      ev.preventDefault();
      const currentPos = ds.isHorizontal ? ev.clientX : ev.clientY;
      const delta = currentPos - ds.startPos;

      const newPrev = Math.max(50, ds.prevStartSize + delta);
      const newNext = Math.max(50, ds.nextStartSize - delta);

      const prevFlex = `0 0 ${newPrev}px`;
      const nextFlex = `0 0 ${newNext}px`;

      ds.prevEl.style.flex = prevFlex;
      ds.nextEl.style.flex = nextFlex;

      sizeMap = {
        ...sizeMap,
        [ds.prevId.description!]: prevFlex,
        [ds.nextId.description!]: nextFlex,
      };
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  });

  setContext(PANE_GROUP_CTX, {
    get dir() { return dir; },
    registerPane,
    unregisterPane,
    registerHandle,
    unregisterHandle,
    setPaneElement,
    getPaneFlex,
    handleDragStart,
  });
</script>

<div
  class="pane-group"
  style="flex-direction: {dir === 'horizontal' ? 'row' : 'column'}"
>
  {@render children()}
</div>

<style>
  .pane-group {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
