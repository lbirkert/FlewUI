<script lang="ts">
  import { onMount } from "svelte";
  import { getFormCtx } from "./form-context.js";
  import { get, writable } from "svelte/store";
  import { type Chainable } from "$lib/validators.js";

  type Size = "sm" | "md" | "lg";

  type Props = {
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    id?: string;
    size?: Size;
    validate?: Chainable;
    onchange?: (e: Event) => void;
  };

  let {
    checked = $bindable(false),
    disabled = false,
    label = "",
    id = "",
    size = "md",
    validate: validateProp,
    onchange,
  }: Props = $props();

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

  let cls = $derived(`toggle size-${size}${disabled ? " disabled" : ""}${checked ? " checked" : ""}${displayError ? " has-error" : ""}`);

  function handleChange(e: Event) {
    touched = true;
    onchange?.(e);
  }
</script>

<label class={cls}>
  <input
    type="checkbox"
    role="switch"
    name={id}
    id={id}
    {disabled}
    bind:checked
    onchange={handleChange}
  />
  <span class="track">
    <span class="thumb"></span>
  </span>
  {#if label}
    <span class="label-text">{label}</span>
  {/if}
</label>
{#if displayError}
  <span class="error-msg">{displayError}</span>
{/if}

<style>
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--flew-spacing-2);
    cursor: pointer;
    font-family: var(--flew-font-sans);
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

  .track {
    position: relative;
    border-radius: var(--flew-radius-full);
    background: var(--flew-color-bg-active);
    transition: background var(--flew-transition-fast);
    flex-shrink: 0;
  }

  .has-error .track {
    outline: 2px solid var(--flew-color-error);
    outline-offset: 1px;
  }

  .size-sm .track { width: 28px; height: 16px; }
  .size-md .track { width: 36px; height: 20px; }
  .size-lg .track { width: 44px; height: 24px; }

  .checked .track {
    background: var(--flew-color-primary);
  }

  .checked.has-error .track {
    background: var(--flew-color-error);
  }

  .thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    border-radius: var(--flew-radius-full);
    background: var(--flew-color-text);
    transition: all var(--flew-transition-fast);
  }

  .size-sm .thumb { width: 12px; height: 12px; }
  .size-md .thumb { width: 16px; height: 16px; }
  .size-lg .thumb { width: 20px; height: 20px; }

  .checked .thumb {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }

  input:focus-visible ~ .track {
    outline: 2px solid var(--flew-color-primary);
    outline-offset: 2px;
  }

  .size-sm .label-text,
  .size-md .label-text {
    font-size: var(--flew-font-size-base);
  }

  .size-lg .label-text {
    font-size: var(--flew-font-size-lg);
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
