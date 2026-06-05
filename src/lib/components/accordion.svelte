<script lang="ts">
  import { setContext } from "svelte";
  import type { Snippet } from "svelte";
  import { ACCORDION_CTX } from "./constants.ts";

  type Props = {
    multiple?: boolean;
    children: Snippet;
  };

  let { multiple = false, children }: Props = $props();

  let openItems: Record<string, boolean> = $state({});

  function isOpen(id: string): boolean {
    return !!openItems[id];
  }

  function toggle(id: string) {
    if (multiple) {
      openItems = { ...openItems, [id]: !openItems[id] };
    } else {
      openItems = isOpen(id) ? {} : { [id]: true };
    }
  }

  setContext(ACCORDION_CTX, { isOpen, toggle });
</script>

<div class="accordion">
  {@render children()}
</div>

<style>
  .accordion {
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-md);
  }
</style>
