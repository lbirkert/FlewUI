<script lang="ts">
  import type { Snippet } from "svelte";

  type Variant = "default" | "subtle" | "muted";
  type Size = "sm" | "md" | "lg";

  type Props = {
    href: string;
    variant?: Variant;
    size?: Size;
    external?: boolean;
    children: Snippet;
  };

  let {
    href,
    variant = "default",
    size = "md",
    external = false,
    children,
  }: Props = $props();

  let cls = $derived(`link variant-${variant} size-${size}`);
</script>

<a
  {href}
  class={cls}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
>
  {@render children()}
</a>

<style>
  .link {
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    text-decoration: none;
    cursor: pointer;
    transition: color var(--flew-transition-fast);
  }

  .link:hover {
    text-decoration: underline;
  }

  .variant-default {
    color: var(--flew-color-primary);
  }

  .variant-default:hover {
    color: var(--flew-color-primary-hover);
  }

  .variant-subtle {
    color: var(--flew-color-text);
  }

  .variant-subtle:hover {
    color: var(--flew-color-primary);
  }

  .variant-muted {
    color: var(--flew-color-text-tertiary);
  }

  .variant-muted:hover {
    color: var(--flew-color-text);
  }

  .size-sm { font-size: var(--flew-font-size-sm); }
  .size-md { font-size: var(--flew-font-size-base); }
  .size-lg { font-size: var(--flew-font-size-lg); }
</style>
