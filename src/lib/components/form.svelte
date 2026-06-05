<script lang="ts">
  import type { Snippet } from "svelte";
  import { setFormCtx, type FormCtx, type FormErrors, type FormValues, type FieldRegistration } from "./form-context.js";
    import type { Readable } from "svelte/store";

  type Actions = {
    errors: FormErrors;
    hasErrors: boolean;
    values: FormValues;
  };

  type Props = {
    onSubmit: (data: FormValues, e: SubmitEvent) => void;
    novalidate?: boolean;
    resetOnSubmit?: boolean;
    actions?: Snippet<[Actions]>;
    children: Snippet;
    style?: string;
  };

  let {
    onSubmit,
    novalidate = false,
    resetOnSubmit = false,
    actions,
    children,
    style = "",
  }: Props = $props();

  let fields = $state<Map<string, FieldRegistration>>(new Map());
  let errors = $state<FormErrors>({});
  let submitted = $state(false);

  let errorValues = $derived(Object.values(errors));
  let hasErrors = $derived(errorValues.some(e => e !== undefined && e !== ""));

  function validateAll(): boolean {
    const allErrors: FormErrors = {};
    for (const [id] of fields) {
      const err = errors[id];
      if (err) allErrors[id] = err;
    }
    errors = allErrors;
    return Object.keys(allErrors).length === 0;
  }

  function setError(id: string, error: string | undefined) {
    errors = { ...errors, [id]: error };
  }

  let values: {[key: string]: Readable<any>} = {};

  const ctx: FormCtx = {
    register(field: FieldRegistration) {
      values[field.id] = field.value;
    },
    unregister(id: string) {
      delete values[id];
    },
    setError,
    get errors() { return errors; },
    get hasErrors() { return hasErrors; },
    get values() { return values; },
    get submitted() { return submitted; },
    validateAll,
  };

  setFormCtx(ctx);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    submitted = true;
    if (!novalidate && hasErrors) return;
    onSubmit(values, e);
    if (resetOnSubmit) {
      const form = e.currentTarget as HTMLFormElement;
      form.reset();
    }
  }
</script>

<form {novalidate} onsubmit={handleSubmit} {style}>
  {@render children()}
  {#if actions}
    {@render actions({ errors, hasErrors, values })}
  {/if}
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: var(--flew-spacing-4);
  }
</style>
