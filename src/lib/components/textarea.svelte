<script lang="ts">
  import { onMount } from "svelte";
  import { getFormCtx } from "./form-context.js";
  import { get, writable } from "svelte/store";
  import { type Chainable } from "$lib/validators.js";

  type Variant = "filled" | "outlined";

  type Props = {
    value?: string;
    variant?: Variant;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    label?: string;
    id?: string;
    rows?: number;
    readonly?: boolean;
    required?: boolean;
    validate?: Chainable;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
  };

  let {
    value = $bindable(""),
    variant = "filled",
    placeholder = "",
    disabled = false,
    error = "",
    label = "",
    id = "",
    rows = 3,
    readonly = false,
    required = false,
    validate: validateProp,
    oninput,
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

  function handleInput(e: Event) {
    if (!touched) touched = true;
    oninput?.(e);
  }

  function handleChange(e: Event) {
    onchange?.(e);
  }
</script>

{#if label}
  <label class="label" for={id}>
    {label}
    {#if required}<span class="required">*</span>{/if}
  </label>
{/if}
<textarea
  name={id}
  id={id}
  {placeholder}
  {disabled}
  {readonly}
  {required}
  {rows}
  bind:value={() => $valStore, (val) => ($valStore = val)}
  class="textarea variant-{variant}"
  class:has-error={!!displayError}
  oninput={handleInput}
  onchange={handleChange}
></textarea>
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

  .textarea {
    width: 100%;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    background: var(--flew-color-bg-elevated);
    color: var(--flew-color-text);
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-md);
    padding: 8px 12px;
    outline: none;
    resize: vertical;
    line-height: 1.5;
    transition: all var(--flew-transition-fast);
  }

  .variant-outlined {
    background: transparent;
  }

  .textarea::placeholder {
    color: var(--flew-color-text-tertiary);
  }

  .textarea:hover:not(:disabled) {
    border-color: var(--flew-color-border-hover);
  }

  .textarea:focus {
    border-color: var(--flew-color-primary);
    box-shadow: 0 0 0 1px var(--flew-color-primary);
  }

  .textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .has-error {
    border-color: var(--flew-color-error);
  }

  .has-error:focus {
    border-color: var(--flew-color-error);
    box-shadow: 0 0 0 1px var(--flew-color-error);
  }

  .error-msg {
    display: block;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-xs);
    color: var(--flew-color-error);
    margin-top: var(--flew-spacing-1);
  }
</style>
