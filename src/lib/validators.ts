import { get, type Readable } from "svelte/store";
import type { FormCtx } from "./components/form-context.js";

// --- Types ---

export type Rule = (value: string, ctx: FormCtx) => string | undefined;

export type CrossField = {
  rule: Rule;
  deps: (ctx: FormCtx) => Readable<unknown>[];
};

export type Chainable = Rule | CrossField;

// --- Pure rules ---

export function required(msg?: string): Rule {
  return (v, _ctx) => !v || v.trim() === "" ? (msg ?? "This field is required") : undefined;
}

export function email(msg?: string): Rule {
  return (v, _ctx) => {
    if (!v) return undefined;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : (msg ?? "Invalid email address");
  };
}

export function minLength(n: number, msg?: string): Rule {
  return (v, _ctx) => {
    if (!v) return undefined;
    return v.length < n ? (msg ?? `Must be at least ${n} characters`) : undefined;
  };
}

export function maxLength(n: number, msg?: string): Rule {
  return (v, _ctx) => {
    if (!v) return undefined;
    return v.length > n ? (msg ?? `Must be at most ${n} characters`) : undefined;
  };
}

export function pattern(regex: RegExp, msg?: string): Rule {
  return (v, _ctx) => {
    if (!v) return undefined;
    return regex.test(v) ? undefined : (msg ?? "Invalid format");
  };
}

// --- Type guard ---

function isRule(item: Chainable): item is Rule {
  return typeof item === 'function';
}

// --- Composers ---

export function pipe(...items: Chainable[]): CrossField {
  return {
    deps: (ctx) => items.flatMap(item => isRule(item) ? [] : item.deps(ctx)),
    rule: (v, ctx) => {
      for (const item of items) {
        const r = isRule(item) ? item : item.rule;
        const err = r(v, ctx);
        if (err !== undefined) return err;
      }
      return undefined;
    },
  };
}

export function all(...items: Chainable[]): CrossField {
  return pipe(...items);
}

// --- Cross-field ---

export function matchesField(sourceId: string, msg?: string): CrossField {
  return {
    deps: (ctx) => ctx.values[sourceId] ? [ctx.values[sourceId] as Readable<unknown>] : [],
    rule: (v, ctx) => {
      const source = ctx.values[sourceId] as Readable<string> | undefined;
      if (!source) return;
      return get(source) !== v ? (msg ?? "Values do not match") : undefined;
    },
  };
}

// --- Convenience wrappers ---

export function checked(msg?: string): Rule {
  return (v, _ctx) => v !== "true" ? (msg ?? "This field must be checked") : undefined;
}

export function emailValidator(opts?: { msg?: string }): Rule {
  return email(opts?.msg);
}

export function passwordValidator(opts?: { minLength?: number; msg?: string }): Rule {
  return minLength(opts?.minLength ?? 8, opts?.msg ?? `Must be at least ${opts?.minLength ?? 8} characters`);
}

/** @deprecated Use `matchesField` instead. */
export function repeatValidator(opts: { source: string; msg?: string }): CrossField {
  return matchesField(opts.source, opts.msg);
}
