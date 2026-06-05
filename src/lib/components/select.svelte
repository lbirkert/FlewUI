<script lang="ts">
  import { onMount } from "svelte";
  import { ChevronDown } from "@lucide/svelte";
  import { getFormCtx } from "./form-context.js";
  import { get, writable } from "svelte/store";
  import { type Chainable } from "$lib/validators.js";

  type Variant = "filled" | "outlined";
  type Option = { value: string; label: string; disabled?: boolean };

  type Props = {
    value?: string;
    variant?: Variant;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    label?: string;
    id?: string;
    required?: boolean;
    validate?: Chainable;
    onchange?: (e: Event) => void;
  };

  let {
    value = $bindable(""),
    variant = "filled",
    options,
    placeholder = "",
    disabled = false,
    error = "",
    label = "",
    id = "",
    required = false,
    validate: validateProp,
    onchange,
  }: Props = $props();

  let formCtx = $derived(getFormCtx());
  let localError = $state("");
  let touched = $state(false);

  let valStore = writable<string>(value);

  $effect(() => {
    value = $valStore;
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
    error || (touched || formCtx?.submitted ? localError : "") || "",
  );

  function handleChange(e: Event) {
    touched = true;
    onchange?.(e);
  }
</script>

{#if label}
  <label class="label" for={id}>
    {label}
    {#if required}<span class="required">*</span>{/if}
  </label>
{/if}
<div class="wrapper" class:has-error={!!displayError}>
  <select
    name={id}
    id={id}
    {disabled}
    {required}
    bind:value={$valStore}
    class="select variant-{variant}"
    onchange={handleChange}
  >
    {#if placeholder}
      <option value="" disabled>{placeholder}</option>
    {/if}
    {#each options as opt}
      <option value={opt.value} disabled={opt.disabled}>{opt.label}</option>
    {/each}
  </select>
  <span class="chevron"><ChevronDown size={16} /></span>
</div>
{#if displayError}
  <span class="error-msg">{displayError}</span>
{/if}

<style>
  .label {
    display: block;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-secondary);
    margin-bottom: var(--flew-spacing-1);
  }

  .required {
    color: var(--flew-color-error);
    margin-left: 2px;
  }

  .wrapper {
    position: relative;
  }

  .select {
    width: 100%;
    appearance: none;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    background: var(--flew-color-bg-elevated);
    color: var(--flew-color-text);
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-md);
    padding: 6px 32px 6px 12px;
    height: 32px;
    outline: none;
    cursor: pointer;
    transition: all var(--flew-transition-fast);
    line-height: 1.5;
  }

  .variant-outlined {
    background: transparent;
  }

  .select:hover:not(:disabled) {
    border-color: var(--flew-color-border-hover);
  }

  .select:focus {
    border-color: var(--flew-color-primary);
    box-shadow: 0 0 0 1px var(--flew-color-primary);
  }

  .select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .has-error .select {
    border-color: var(--flew-color-error);
  }

  .has-error .select:focus {
    border-color: var(--flew-color-error);
    box-shadow: 0 0 0 1px var(--flew-color-error);
  }

  .chevron {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: var(--flew-color-text-tertiary);
    pointer-events: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .error-msg {
    display: block;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-xs);
    color: var(--flew-color-error);
    margin-top: var(--flew-spacing-1);
  }
</style>
