<script lang="ts">
  type Props = {
    value?: string;
    name?: string;
    disabled?: boolean;
    label?: string;
    group?: string;
    onchange?: (e: Event) => void;
  };

  let {
    value = $bindable(""),
    name = "",
    disabled = false,
    label = "",
    group = $bindable(""),
    onchange,
  }: Props = $props();
</script>

<label class="radio" class:checked={group === value} class:disabled>
  <input
    type="radio"
    {name}
    {disabled}
    bind:group
    bind:value
    {onchange}
  />
  <span class="dot"></span>
  {#if label}
    <span class="label-text">{label}</span>
  {/if}
</label>

<style>
  .radio {
    display: inline-flex;
    align-items: center;
    gap: var(--flew-spacing-2);
    cursor: pointer;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    color: var(--flew-color-text);
  }

  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 1px solid var(--flew-color-border-active);
    border-radius: var(--flew-radius-full);
    background: var(--flew-color-bg-elevated);
    transition: all var(--flew-transition-fast);
    flex-shrink: 0;
  }

  .checked .dot {
    border-color: var(--flew-color-primary);
  }

  .dot::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: var(--flew-radius-full);
    background: var(--flew-color-primary);
    opacity: 0;
    transition: opacity var(--flew-transition-fast);
  }

  .checked .dot::after {
    opacity: 1;
  }

  input:focus-visible + .dot {
    outline: 2px solid var(--flew-color-primary);
    outline-offset: 2px;
  }

  .label-text {
    user-select: none;
  }
</style>
