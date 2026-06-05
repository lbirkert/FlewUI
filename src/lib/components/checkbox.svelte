<script lang="ts">
  import { onMount } from "svelte";
  import { Check } from "@lucide/svelte";
  import { getFormCtx } from "./form-context.js";
  import { get, writable } from "svelte/store";
  import { type Chainable } from "$lib/validators.js";

  type Props = {
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    id?: string;
    indeterminate?: boolean;
    validate?: Chainable;
    onchange?: (e: Event) => void;
  };

  let {
    checked = $bindable(false),
    disabled = false,
    label = "",
    id = "",
    indeterminate = false,
    validate: validateProp,
    onchange,
  }: Props = $props();

  let inputEl: HTMLInputElement;

  $effect(() => {
    if (inputEl) {
      inputEl.indeterminate = indeterminate;
    }
  });

  let formCtx = $derived(getFormCtx());
  let localError = $state("");
  let touched = $state(false);

  let valStore = writable<string>(checked ? "true" : "false");

  $effect(() => {
    valStore.set(checked ? "true" : "false");
  });

  function setError(err: string | undefined) {
    localError = err ?? "";
    formCtx?.setError(id, err);
  }

  onMount(() => {
    if (!formCtx || !id) return;
    formCtx.register({ id, value: valStore });
    return () => formCtx.unregister(id);
  });

  onMount(() => {
    if (!validateProp || !id || !formCtx) return;

    const ctx = formCtx;
    const chainable = validateProp;
    const rule = typeof chainable === 'function' ? chainable : chainable.rule;
    const deps = typeof chainable === 'function' ? [] : chainable.deps(ctx);

    function evaluate() {
      const err = rule(get(valStore), ctx);
      setError(err);
    }

    const unsubs = [valStore, ...deps].map(s => s.subscribe(evaluate));
    return () => unsubs.forEach(u => u());
  });

  let displayError = $derived(
    (touched || formCtx?.submitted ? localError : "") || "",
  );

  function handleChange(e: Event) {
    touched = true;
    onchange?.(e);
  }
</script>

<label class="checkbox" class:checked class:disabled class:has-error={!!displayError}>
  <input
    bind:this={inputEl}
    type="checkbox"
    name={id}
    id={id}
    {disabled}
    bind:checked
    onchange={handleChange}
  />
  <span class="check">
    <Check size={12} />
  </span>
  {#if label}
    <span class="label-text">{label}</span>
  {/if}
</label>
{#if displayError}
  <span class="error-msg">{displayError}</span>
{/if}

<style>
  .checkbox {
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

  .check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 1px solid var(--flew-color-border-active);
    border-radius: var(--flew-radius-sm);
    background: var(--flew-color-bg-elevated);
    transition: all var(--flew-transition-fast);
    flex-shrink: 0;
  }

  .has-error .check {
    border-color: var(--flew-color-error);
  }

  .checked .check {
    background: var(--flew-color-primary);
    border-color: var(--flew-color-primary);
  }

  .checked.has-error .check {
    background: var(--flew-color-error);
    border-color: var(--flew-color-error);
  }

  .check :global(.lucide) {
    width: 10px;
    height: 10px;
    color: white;
    opacity: 0;
    transition: opacity var(--flew-transition-fast);
  }

  .checked .check :global(.lucide) {
    opacity: 1;
  }

  input:focus-visible + .check {
    outline: 2px solid var(--flew-color-primary);
    outline-offset: 2px;
  }

  .label-text {
    user-select: none;
  }

  .error-msg {
    display: block;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-xs);
    color: var(--flew-color-error);
    margin-top: var(--flew-spacing-1);
  }
</style>
