<script lang="ts">
  type Props = {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    label?: string;
    showValue?: boolean;
    oninput?: (e: Event) => void;
  };

  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    label = "",
    showValue = false,
    oninput,
  }: Props = $props();

  let pct = $derived(((value - min) / (max - min)) * 100);
</script>

{#if label}
  <div class="header">
    <span class="label">{label}</span>
    {#if showValue}
      <span class="val">{value}</span>
    {/if}
  </div>
{/if}
<div class="slider" class:disabled>
  <input
    type="range"
    {min}
    {max}
    {step}
    {disabled}
    bind:value
    class="range"
    style="--pct: {pct}%"
    {oninput}
  />
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--flew-spacing-1);
  }

  .label {
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-secondary);
  }

  .val {
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-secondary);
  }

  .slider {
    padding: 4px 0;
  }

  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, var(--flew-color-primary) var(--pct), var(--flew-color-border) var(--pct));
    border-radius: var(--flew-radius-full);
    outline: none;
    cursor: pointer;
  }

  .range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: var(--flew-radius-full);
    background: var(--flew-color-primary);
    border: 2px solid var(--flew-color-bg);
    cursor: pointer;
    transition: transform var(--flew-transition-fast);
  }

  .range::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .range::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: var(--flew-radius-full);
    background: var(--flew-color-primary);
    border: 2px solid var(--flew-color-bg);
    cursor: pointer;
  }

  .range:focus-visible::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px var(--flew-color-primary-bg);
  }

  .range:focus-visible::-moz-range-thumb {
    box-shadow: 0 0 0 3px var(--flew-color-primary-bg);
  }
</style>
