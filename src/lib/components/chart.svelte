<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type {
    ChartConfiguration,
    ChartType,
    DefaultDataPoint,
  } from "chart.js";

  type Props = {
    type: ChartType;
    data: ChartConfiguration["data"];
    options?: ChartConfiguration["options"];
    height?: string;
    style?: string;
  };

  let {
    type,
    data,
    options = {},
    height = "250px",
    style = "",
  }: Props = $props();

  let canvas: HTMLCanvasElement;
  let chart: import("chart.js").Chart | null = $state(null);

  onMount(() => {
    async function init() {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      if (!canvas) return;

      chart = new Chart(canvas, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          ...options,
        },
      });
    }

    init();

    return () => {
      chart?.destroy();
      chart = null;
    };
  });

  $effect(() => {
    if (!chart) return;
    chart.data = data;
    chart.update("none");
  });

  $effect(() => {
    if (!chart) return;
    (chart.options as Record<string, unknown>) = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      ...options,
    };
    chart.update("none");
  });
</script>

<div class="chart-wrapper" class:has-chart={!!chart} style="height: {height}; {style}">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart-wrapper {
    position: relative;
    width: 100%;
  }

  .chart-wrapper canvas {
    width: 100% !important;
    height: 100% !important;
  }
</style>
