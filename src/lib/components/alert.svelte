<script lang="ts">
  import type { Snippet } from "svelte";
  import { X } from "@lucide/svelte";

  type Variant = "info" | "success" | "warning" | "error";

  type Props = {
    variant?: Variant;
    title?: string;
    closable?: boolean;
    children: Snippet;
    onclose?: () => void;
  };

  let {
    variant = "info",
    title = "",
    closable = false,
    children,
    onclose,
  }: Props = $props();

  let hidden = $state(false);
  let cls = $derived(`alert variant-${variant}`);
</script>

{#if !hidden}
  <div class={cls} role="alert">
    <div class="content">
      {#if title}
        <strong class="title">{title}</strong>
      {/if}
      <div class="msg">{@render children()}</div>
    </div>
    {#if closable}
      <button class="close" onclick={() => { hidden = true; onclose?.(); }} aria-label="close">
        <X size={16} />
      </button>
    {/if}
  </div>
{/if}

<style>
  .alert {
    display: flex;
    align-items: flex-start;
    gap: var(--flew-spacing-2);
    padding: 10px 14px;
    border-radius: var(--flew-radius-md);
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    border: 1px solid;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .title {
    display: block;
    font-weight: 600;
    margin-bottom: 2px;
  }

  .msg {
    color: inherit;
    opacity: 0.9;
    line-height: 1.5;
  }

  .close {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    outline: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: var(--flew-radius-sm);
    opacity: 0.6;
    transition: all var(--flew-transition-fast);
    margin-top: 1px;
  }

  .close:hover {
    opacity: 1;
  }

  .close :global(.lucide) {
    width: 14px;
    height: 14px;
  }

  .variant-info {
    background: var(--flew-color-info-bg);
    color: var(--flew-color-info);
    border-color: var(--flew-color-info-border);
  }

  .variant-success {
    background: var(--flew-color-success-bg);
    color: var(--flew-color-success);
    border-color: var(--flew-color-success-border);
  }

  .variant-warning {
    background: var(--flew-color-warning-bg);
    color: var(--flew-color-warning);
    border-color: var(--flew-color-warning-border);
  }

  .variant-error {
    background: var(--flew-color-error-bg);
    color: var(--flew-color-error);
    border-color: var(--flew-color-error-border);
  }
</style>
