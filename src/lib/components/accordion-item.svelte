<script lang="ts">
  import { getContext } from "svelte";
  import type { Snippet } from "svelte";
  import { ChevronRight } from "@lucide/svelte";
  import { ACCORDION_CTX } from "./constants.ts";

  type Props = {
    id: string;
    title: string;
    children: Snippet;
  };

  let { id, title, children }: Props = $props();

  const ctx = getContext<{
    isOpen: (id: string) => boolean;
    toggle: (id: string) => void;
  }>(ACCORDION_CTX);

  let open = $derived(ctx.isOpen(id));
</script>

<div class="item">
  <button class="trigger" class:open onclick={() => ctx.toggle(id)} aria-expanded={open}>
    <span>{title}</span>
    <span class="arrow"><ChevronRight size={16} /></span>
  </button>
  {#if open}
    <div class="content">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .item {
    border-bottom: 1px solid var(--flew-color-border);
  }

  .item:first-child {
    border-radius: calc(var(--flew-radius-md) - 1px) calc(var(--flew-radius-md) - 1px) 0 0;
  }

  .item:last-child {
    border-bottom: none;
    border-radius: 0 0 calc(var(--flew-radius-md) - 1px) calc(var(--flew-radius-md) - 1px);
  }

  .trigger {
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 14px;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    color: var(--flew-color-text);
    cursor: pointer;
    transition: background var(--flew-transition-fast);
  }

  .trigger:hover {
    background: var(--flew-color-bg-hover);
  }

  .arrow {
    width: 14px;
    height: 14px;
    color: var(--flew-color-text-tertiary);
    transition: transform var(--flew-transition-fast);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .open .arrow {
    transform: rotate(90deg);
  }

  .content {
    padding: 0 14px 10px;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    color: var(--flew-color-text-secondary);
  }
</style>
