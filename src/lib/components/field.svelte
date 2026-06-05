<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    name: string;
    label?: string;
    required?: boolean;
    children: Snippet;
  };

  let {
    name,
    label = "",
    required = false,
    children,
  }: Props = $props();
</script>

<div class="field">
  {#if label}
    <label class="field-label" for={name}>
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}
  {@render children()}
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--flew-spacing-1);
  }

  .field-label {
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-secondary);
    cursor: pointer;
  }

  .required {
    color: var(--flew-color-error);
    margin-left: 2px;
  }
</style>
