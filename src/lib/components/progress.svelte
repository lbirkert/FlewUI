<script lang="ts">
  type Variant = "primary" | "success" | "warning" | "error" | "info";
  type Size = "sm" | "md" | "lg";

  type Props = {
    value?: number;
    max?: number;
    variant?: Variant;
    size?: Size;
    label?: string;
    showValue?: boolean;
    indeterminate?: boolean;
    style?: string;
  };

  let {
    value = $bindable(0),
    max = 100,
    variant = "primary",
    size = "md",
    label = "",
    showValue = false,
    indeterminate = false,
    style = "",
  }: Props = $props();

  let pct = $derived(Math.min(Math.max((value / max) * 100, 0), 100));
  let cls = $derived(`track variant-${variant} size-${size}${indeterminate ? " indeterminate" : ""}`);
</script>

{#if label || showValue}
  <div class="header">
    {#if label}
      <span class="label">{label}</span>
    {/if}
    {#if showValue}
      <span class="val">{Math.round(pct)}%</span>
    {/if}
  </div>
{/if}
<div class={cls} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} {style}>
  <div class="fill" class:indeterminate style="width: {indeterminate ? '40%' : pct + '%'}"></div>
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

  .track {
    width: 100%;
    background: var(--flew-color-bg-hover);
    border-radius: var(--flew-radius-full);
    overflow: hidden;
  }

  .size-sm { height: 4px; }
  .size-md { height: 6px; }
  .size-lg { height: 10px; }

  .indeterminate.track {
    overflow: hidden;
  }

  .fill {
    height: 100%;
    border-radius: var(--flew-radius-full);
    transition: width 300ms ease;
  }

  .fill.indeterminate {
    animation: indeterminate 1.5s ease infinite;
    width: 40%;
  }

  .variant-primary .fill { background: var(--flew-color-primary); }
  .variant-success .fill { background: var(--flew-color-success); }
  .variant-warning .fill { background: var(--flew-color-warning); }
  .variant-error .fill { background: var(--flew-color-error); }
  .variant-info .fill { background: var(--flew-color-info); }

  @keyframes indeterminate {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(350%); }
  }
</style>
