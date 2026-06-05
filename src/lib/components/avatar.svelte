<script lang="ts">
  type Size = "xs" | "sm" | "md" | "lg" | "xl";
  type Variant = "circle" | "square";

  type Props = {
    src?: string;
    alt?: string;
    initials?: string;
    size?: Size;
    variant?: Variant;
  };

  let {
    src = "",
    alt = "",
    initials = "",
    size = "md",
    variant = "circle",
  }: Props = $props();

  let hasError = $state(false);
  let cls = $derived(`avatar variant-${variant} size-${size}`);
</script>

{#if src && !hasError}
  <span class={cls}>
    <img {src} {alt} onerror={() => hasError = true} />
  </span>
{:else}
  <span class={cls}>
    <span class="initials">{initials}</span>
  </span>
{/if}

<style>
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--flew-color-primary-bg);
    color: var(--flew-color-primary);
    font-family: var(--flew-font-sans);
    font-weight: 600;
  }

  .variant-circle {
    border-radius: var(--flew-radius-full);
  }

  .variant-square {
    border-radius: var(--flew-radius-md);
  }

  .size-xs { width: 20px; height: 20px; font-size: var(--flew-font-size-2xs); }
  .size-sm { width: 24px; height: 24px; font-size: var(--flew-font-size-xs); }
  .size-md { width: 32px; height: 32px; font-size: var(--flew-font-size-sm); }
  .size-lg { width: 40px; height: 40px; font-size: var(--flew-font-size-base); }
  .size-xl { width: 56px; height: 56px; font-size: var(--flew-font-size-lg); }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .initials {
    line-height: 1;
  }
</style>
