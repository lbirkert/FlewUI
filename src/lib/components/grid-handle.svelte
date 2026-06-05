<script lang="ts">
  import { getContext } from "svelte";
  import { GRID_CTX } from "./constants.ts";

  type Props = {
    axis: "col" | "row";
    index: number;
  };

  let { axis, index }: Props = $props();

  const grid = getContext<{
    setColumn: (i: number, v: string) => void;
    setRow: (i: number, v: string) => void;
  }>(GRID_CTX);

  let dragging = false;
  let startPos = 0;

  function onDown(e: MouseEvent) {
    dragging = true;
    startPos = axis === "col" ? e.clientX : e.clientY;

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function onMove(e: MouseEvent) {
    if (!dragging) return;

    const current = axis === "col" ? e.clientX : e.clientY;
    const delta = current - startPos;

    // current track value (simple px-based baseline for now)
    const currentValue = 200;

    const next = Math.max(80, currentValue + delta);

    if (axis === "col") {
      grid?.setColumn(index, `${next}px`);
    } else {
      grid?.setRow(index, `${next}px`);
    }

    startPos = current;
  }

  function onUp() {
    dragging = false;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  }
</script>

<button
  aria-label="resize handle"
  class:col={axis === "col"}
  class:row={axis === "row"}
  onmousedown={onDown}
></button>

<style>
  button {
    all: unset;
    position: relative;
    display: block;
    z-index: 10;
    background-color: black;
  }

  .col {
    width: 2px;
    height: 100%;
    cursor: col-resize;
  }

  .row {
    width: 100%;
    height: 2px;
    cursor: row-resize;
  }

  .col::before,
  .row::before {
    content: "";
    position: absolute;
    background: rgba(255, 255, 255, 0.12);
    transition: all 120ms ease;
    pointer-events: none;
  }

  .col::before {
    width: 2px;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .row::before {
    height: 2px;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .col:hover::before {
    width: 6px;
    background: rgba(255, 255, 255, 0.25);
  }

  .row:hover::before {
    height: 6px;
    background: rgba(255, 255, 255, 0.25);
  }
</style>