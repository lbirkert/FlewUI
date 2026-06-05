<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { getFormCtx } from "./form-context.js";
  import { get, writable } from "svelte/store";
  import { type Chainable } from "$lib/validators.js";

  type Variant = "filled" | "outlined";
  type Size = "sm" | "md" | "lg";
  type InputType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "url"
    | "search"
    | "tel"
    | "date";

  type Props = {
    value?: string;
    variant?: Variant;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    size?: Size;
    type?: InputType;
    label?: string;
    id?: string;
    readonly?: boolean;
    required?: boolean;
    leading?: Snippet;
    trailing?: Snippet;
    validate?: Chainable;
    style?: string;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
    onblur?: (e: Event) => void;
    onkeydown?: (e: KeyboardEvent) => void;
  };

  let {
    value = $bindable(""),
    variant = "filled",
    placeholder = "",
    disabled = false,
    error = "",
    size = "md",
    type = "text",
    label = "",
    id = "",
    readonly = false,
    required = false,
    leading,
    trailing,
    validate: validateProp,
    style = "",
    oninput,
    onchange,
    onblur,
    onkeydown,
  }: Props = $props();

  const formCtx = getFormCtx();
  let localError = $state("");
  let touched = $state(false);

  let valueStore = writable(value);

  $effect(() => {
    value = $valueStore;
  });

  $effect(() => {
    valueStore.set(value);
  });

  function setError(err: string | undefined) {
    localError = err ?? "";
    formCtx?.setError(id, err);
  }

  onMount(() => {
    if (!formCtx || !id) return;
    formCtx.register({
      id,
      value: valueStore,
    });

    return () => formCtx.unregister(id);
  });

  onMount(() => {
    if (!validateProp || !id || !formCtx) return;

    const ctx = formCtx;
    const chainable = validateProp;
    const rule = typeof chainable === 'function' ? chainable : chainable.rule;
    const deps = typeof chainable === 'function' ? [] : chainable.deps(ctx);

    function evaluate() {
      const err = rule(get(valueStore), ctx);
      setError(err);
    }


    const unsubs = [valueStore, ...deps].map(s => s.subscribe(evaluate));
    return () => unsubs.forEach(u => u());
  });

  let displayError = $derived(
    error || (touched || formCtx?.submitted ? localError : "") || "",
  );
  let cls = $derived(`input size-${size}${displayError ? " has-error" : ""}`);

  function handleBlur(e: Event) {
    onblur?.(e);
  }

  function handleInput(e: Event) {
    if (!touched) touched = true;
    oninput?.(e);
  }
</script>

<div class="input-root" {style}>
  {#if label}
    <label class="label" for={id}>
      {label}
      {#if required}<span class="required">*</span>{/if}
    </label>
  {/if}
  <div class="input-wrapper variant-{variant}" class:has-error={!!displayError}>
    {#if leading}
      <span class="leading">
        {@render leading()}
      </span>
    {/if}
    <input
      {type}
      name={id}
      {id}
      {placeholder}
      {disabled}
      {readonly}
      {required}
      bind:value={() => $valueStore, (val) => ($valueStore = val)}
      class={cls}
      onblur={handleBlur}
      oninput={handleInput}
      {onchange}
      {onkeydown}
    />
    {#if trailing}
      <span class="trailing">
        {@render trailing()}
      </span>
    {/if}
  </div>
  {#if displayError}
    <span class="error-msg">{displayError}</span>
  {/if}
</div>

<style>
  .input-root {
    display: flex;
    flex-direction: column;
    gap: var(--flew-spacing-1);
  }

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

  .input-wrapper {
    display: flex;
    align-items: center;
    background: var(--flew-color-bg-elevated);
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-md);
    transition: all var(--flew-transition-fast);
  }

  .input-wrapper:focus-within {
    border-color: var(--flew-color-primary);
    box-shadow: 0 0 0 1px var(--flew-color-primary);
  }

  .variant-outlined {
    background: transparent;
  }

  .variant-outlined:focus-within {
    border-color: var(--flew-color-primary);
    box-shadow: 0 0 0 1px var(--flew-color-primary);
  }

  .variant-outlined.has-error {
    border-color: var(--flew-color-error);
  }

  .variant-outlined.has-error:focus-within {
    border-color: var(--flew-color-error);
    box-shadow: 0 0 0 1px var(--flew-color-error);
  }

  .input-wrapper.has-error {
    border-color: var(--flew-color-error);
  }

  .input-wrapper.has-error:focus-within {
    border-color: var(--flew-color-error);
    box-shadow: 0 0 0 1px var(--flew-color-error);
  }

  .leading,
  .trailing {
    display: flex;
    align-items: center;
    color: var(--flew-color-text-tertiary);
    flex-shrink: 0;
  }

  .leading {
    padding-left: 8px;
  }

  .trailing {
    padding-right: 8px;
  }

  .input {
    width: 100%;
    font-family: var(--flew-font-sans);
    background: transparent;
    color: var(--flew-color-text);
    border: none;
    border-radius: 0;
    outline: none;
    line-height: 1.5;
  }

  .input:focus {
    box-shadow: none;
  }

  .input::placeholder {
    color: var(--flew-color-text-tertiary);
  }

  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .size-sm {
    padding: 6px 12px;
    font-size: var(--flew-font-size-sm);
    height: 28px;
  }
  .size-md {
    padding: 8px 12px;
    font-size: var(--flew-font-size-base);
    height: 32px;
  }
  .size-lg {
    padding: 10px 14px;
    font-size: var(--flew-font-size-lg);
    height: 40px;
  }

  .error-msg {
    display: block;
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-xs);
    color: var(--flew-color-error);
    margin-top: var(--flew-spacing-1);
  }
</style>
