<script lang="ts">
  import { LoaderCircle } from "@lucide/svelte";

  type Size = "sm" | "md" | "lg";

  type Props = {
    size?: Size;
  };

  let { size = "md" }: Props = $props();
  let cls = $derived(`spinner size-${size}`);
</script>

<span class={cls} aria-label="loading" role="status">
  <LoaderCircle size={24} strokeWidth={3} />
</span>

<style>
  .spinner {
    display: inline-flex;
    color: currentColor;
    animation: spin 0.8s linear infinite;
  }

  .size-sm { width: 14px; height: 14px; }
  .size-md { width: 20px; height: 20px; }
  .size-lg { width: 28px; height: 28px; }

  .spinner :global(.lucide) {
    width: 100%;
    height: 100%;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
