<script lang="ts">
  import { setContext } from "svelte";
  import type { Snippet } from "svelte";
  import { GRID_CTX } from "./constants.ts";

  type Props = {
    columns?: string;
    rows?: string;
    gap?: number;
    children: Snippet;
  };

  let {
    columns = "1fr 1fr",
    rows = "1fr",
    gap = 0,
    children
  }: Props = $props();

  // internal state (parsed)
  let colTracks: string[] = $derived(columns.split(" "));
  let rowTracks: string[] = $derived(rows.split(" "));

  function setColumn(index: number, value: string) {
    colTracks[index] = value;
    colTracks = [...colTracks];
  }

  function setRow(index: number, value: string) {
    rowTracks[index] = value;
    rowTracks = [...rowTracks];
  }

  function getCSS(tracks: string[]) {
    // TODO: do more work here maybe?
    return tracks.join(" ");
  }

  const api = {
    setColumn,
    setRow,
  };

  setContext(GRID_CTX, api);
</script>

<div
  class="grid"
  style="
    grid-template-columns: {getCSS(colTracks)};
    grid-template-rows: {getCSS(rowTracks)};
    gap: {gap}px;
  "
>
  {@render children()}
</div>

<style>
  .grid {
    width: 100%;
    height: 100%;
    display: grid;
    overflow: hidden;
  }
</style>