<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { PANE_GROUP_CTX } from "./constants.ts";

  const ctx = getContext<{
    registerHandle: (id: symbol) => void;
    unregisterHandle: (id: symbol) => void;
    handleDragStart: (id: symbol, e: MouseEvent) => void;
    dir: string;
  }>(PANE_GROUP_CTX);

  const id = Symbol("handle");

  onMount(() => {
    ctx.registerHandle(id);
    return () => ctx.unregisterHandle(id);
  });

  function onMouseDown(e: MouseEvent) {
    ctx.handleDragStart(id, e);
  }
</script>

<button
  class="pane-handle"
  class:horizontal={ctx.dir === "horizontal"}
  class:vertical={ctx.dir === "vertical"}
  aria-label="resize handle"
  onmousedown={onMouseDown}
></button>

<style>
  .pane-handle {
    all: unset;
    position: relative;
    display: block;
    z-index: 10;
    background-color: black;
    flex-shrink: 0;
  }

  .horizontal {
    width: 2px;
    height: 100%;
    cursor: col-resize;
  }

  .vertical {
    width: 100%;
    height: 2px;
    cursor: row-resize;
  }

  .horizontal::before,
  .vertical::before {
    content: "";
    position: absolute;
    background: rgba(255, 255, 255, 0.12);
    transition: all 120ms ease;
    pointer-events: none;
  }

  .horizontal::before {
    width: 2px;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .vertical::before {
    height: 2px;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .horizontal:hover::before {
    width: 6px;
    background: rgba(255, 255, 255, 0.25);
  }

  .vertical:hover::before {
    height: 6px;
    background: rgba(255, 255, 255, 0.25);
  }
</style>
