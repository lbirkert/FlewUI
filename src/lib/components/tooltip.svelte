<script lang="ts">
  import type { Snippet } from "svelte";

  type Position = "top" | "bottom" | "left" | "right";

  type Props = {
    text: string;
    position?: Position;
    delay?: number;
    children: Snippet;
  };

  let {
    text,
    position = "top",
    delay = 200,
    children,
  }: Props = $props();

  let visible = $state(false);
  let timeout: ReturnType<typeof setTimeout>;
  let tooltipCls = $derived(`tooltip position-${position}`);

  function show() {
    timeout = setTimeout(() => visible = true, delay);
  }

  function hide() {
    clearTimeout(timeout);
    visible = false;
  }
</script>

<div class="tooltip-wrapper" role="button" tabindex="0" onmouseenter={show} onmouseleave={hide} onfocus={show} onblur={hide}>
  {@render children()}
  {#if visible && text}
    <span class={tooltipCls} role="tooltip">
      {text}
    </span>
  {/if}
</div>

<style>
  .tooltip-wrapper {
    position: relative;
    display: inline-flex;
  }

  .tooltip {
    position: absolute;
    z-index: 900;
    padding: 4px 8px;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-xs);
    color: var(--flew-color-text-inverse);
    background: var(--flew-color-text);
    border-radius: var(--flew-radius-sm);
    white-space: nowrap;
    pointer-events: none;
    animation: fadeIn 100ms ease;
    line-height: 1.4;
  }

  .position-top {
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
  }

  .position-bottom {
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
  }

  .position-left {
    right: calc(100% + 6px);
    top: 50%;
    transform: translateY(-50%);
  }

  .position-right {
    left: calc(100% + 6px);
    top: 50%;
    transform: translateY(-50%);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
