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
  let sizeMap = $state(new Map<symbol, string>());
  let elMap = $state(new Map<symbol, HTMLElement>());

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
    elMap.set(id, el);
  }

  function getPaneFlex(id: symbol): string {
    return sizeMap.get(id) ?? "1";
  }

  let activeHandleId: symbol | null = $state(null);
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

  function setCursor(value: string) {
    document.body.style.cursor = value;
    document.body.style.userSelect = value === "auto" ? "" : "none";
    document.body.style.webkitUserSelect = value === "auto" ? "" : "none";
  }

  function handleDragStart(handleId: symbol, e: MouseEvent) {
    const handleIndex = handleOrder.indexOf(handleId);
    if (handleIndex === -1) return;

    const prevId = paneOrder[handleIndex];
    const nextId = paneOrder[handleIndex + 1];
    if (!prevId || !nextId) return;

    const prevEl = elMap.get(prevId);
    const nextEl = elMap.get(nextId);
    if (!prevEl || !nextEl) return;

    const isHorizontal = dir === "horizontal";

    activeHandleId = handleId;
    setCursor(isHorizontal ? "col-resize" : "row-resize");

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

      sizeMap.set(ds.prevId, prevFlex);
      sizeMap.set(ds.nextId, nextFlex);
    }

    function onUp() {
      activeHandleId = null;
      setCursor("auto");
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
    get activeHandleId() { return activeHandleId; },
    registerPane,
    unregisterPane,
    registerHandle,
    unregisterHandle,
    setPaneElement,
    setPaneFlex: (id: symbol, flex: string) => sizeMap.set(id, flex),
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
