<script lang="ts">
  import type { Snippet } from "svelte";
  import Spinner from "./spinner.svelte";
  import Kbd from "./kbd.svelte";

  type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
  type Size = "xs" | "sm" | "md" | "lg";

  type Props = {
    variant?: Variant;
    size?: Size;
    icon?: boolean;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    stretch?: boolean;
    type?: "button" | "submit" | "reset";
    href?: string;
    shortcut?: string;
    showShortcutHint?: boolean;
    children: Snippet;
    onclick?: (e: MouseEvent) => void;
    [key: string]: unknown;
  };

  let {
    variant = "primary",
    size = "md",
    icon = false,
    disabled = false,
    loading = false,
    fullWidth = false,
    stretch = false,
    type = "button",
    href,
    shortcut = "",
    showShortcutHint = false,
    children,
    onclick,
    ...restProps
  }: Props = $props();

  let cls = $derived(
    `btn variant-${variant} size-${size}${icon ? " icon" : ""}${loading ? " loading" : ""}${fullWidth ? " full-width" : ""}${stretch ? " stretch" : ""}${disabled ? " disabled" : ""}`
  );

  let btnEl = $state<HTMLButtonElement | HTMLAnchorElement | null>(null);

  let isMac = $state(typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac"));

  function parseShortcut(s: string): { key: string; ctrl: boolean; meta: boolean; shift: boolean; alt: boolean } {
    const parts = s.split("+");
    const result = { key: "", ctrl: false, meta: false, shift: false, alt: false };
    for (const part of parts) {
      const p = part.toLowerCase();
      if (p === "ctrl" || p === "control") result.ctrl = true;
      else if (p === "cmd" || p === "meta" || p === "command") result.meta = true;
      else if (p === "shift") result.shift = true;
      else if (p === "alt" || p === "option") result.alt = true;
      else if (p === "mod") { if (isMac) result.meta = true; else result.ctrl = true; }
      else result.key = p;
    }
    return result;
  }

  function formatShortcut(s: string): string {
    const parts = s.split("+");
    return parts.map(p => {
      const l = p.toLowerCase();
      if (l === "mod") return isMac ? "⌘" : "Ctrl";
      if (l === "ctrl" || l === "control") return isMac ? "⌃" : "Ctrl";
      if (l === "cmd" || l === "meta" || l === "command") return "⌘";
      if (l === "shift") return "⇧";
      if (l === "alt" || l === "option") return isMac ? "⌥" : "Alt";
      if (l === "enter") return "↵";
      if (l === "escape" || l === "esc") return "Esc";
      if (l === "delete" || l === "del") return "Del";
      if (l === "backspace") return "⌫";
      if (l === "tab") return "⇥";
      if (l === "space" || l === " ") return "␣";
      if (l === "arrowup") return "↑";
      if (l === "arrowdown") return "↓";
      if (l === "arrowleft") return "←";
      if (l === "arrowright") return "→";
      return p.length === 1 ? p.toUpperCase() : p.charAt(0).toUpperCase() + p.slice(1);
    }).join(isMac ? "" : "+");
  }

  let parsed = $derived(shortcut ? parseShortcut(shortcut) : null);
  let displayShortcut = $derived(shortcut ? formatShortcut(shortcut) : "");

  function handleKeydown(e: KeyboardEvent) {
    if (!parsed) return;
    if (disabled || loading) return;
    if (e.key.toLowerCase() !== parsed.key) return;
    if (e.ctrlKey !== parsed.ctrl) return;
    if (e.metaKey !== parsed.meta) return;
    if (e.shiftKey !== parsed.shift) return;
    if (e.altKey !== parsed.alt) return;
    e.preventDefault();
    btnEl?.click();
  }

  $effect(() => {
    if (!shortcut || href) return;
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  });

  function handleClick(e: MouseEvent) {
    if (disabled || loading) return;
    onclick?.(e);
  }
</script>

{#if href}
  <a bind:this={btnEl} {href} class={cls} onclick={handleClick} {...restProps}>
    {#if loading}
      <Spinner size="sm" />
    {/if}
    {@render children()}
    {#if showShortcutHint && shortcut && !icon}
      <Kbd>{displayShortcut}</Kbd>
    {/if}
  </a>
{:else}
  <button bind:this={btnEl} {type} class={cls} {disabled} onclick={handleClick} {...restProps}>
    {#if loading}
      <Spinner size="sm" />
    {/if}
    {@render children()}
    {#if showShortcutHint && shortcut && !icon}
      <Kbd>{displayShortcut}</Kbd>
    {/if}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--flew-spacing-2);
    font-family: var(--flew-font-sans);
    font-weight: 500;
    border: 1px solid transparent;
    border-radius: var(--flew-radius-md);
    cursor: pointer;
    text-decoration: none;
    line-height: 1;
    white-space: nowrap;
    transition: all var(--flew-transition-fast);
    outline: none;
  }

  .btn:focus-visible {
    box-shadow: 0 0 0 2px var(--flew-color-primary-bg), 0 0 0 1px var(--flew-color-primary);
  }

  .disabled, .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .size-xs { padding: 2px 8px; font-size: var(--flew-font-size-xs); height: 24px; }
  .size-sm { padding: 4px 12px; font-size: var(--flew-font-size-sm); height: 28px; }
  .size-md { padding: 6px 16px; font-size: var(--flew-font-size-base); height: 32px; }
  .size-lg { padding: 8px 20px; font-size: var(--flew-font-size-lg); height: 40px; }

  .icon { padding: 0; aspect-ratio: 1; width: unset; }

  .full-width {
    width: 100%;
  }

  .stretch {
    height: auto;
    align-self: stretch;
  }

  .variant-primary {
    background: var(--flew-color-primary);
    color: white;
    border-color: var(--flew-color-primary);
  }
  .variant-primary:hover:not(.disabled) {
    background: var(--flew-color-primary-hover);
    border-color: var(--flew-color-primary-hover);
  }
  .variant-primary:active:not(.disabled) {
    background: var(--flew-color-primary-active);
    border-color: var(--flew-color-primary-active);
  }

  .variant-secondary {
    background: var(--flew-color-bg-elevated);
    color: var(--flew-color-text);
    border-color: var(--flew-color-border);
  }
  .variant-secondary:hover:not(.disabled) {
    background: var(--flew-color-bg-hover);
    border-color: var(--flew-color-border-hover);
  }
  .variant-secondary:active:not(.disabled) {
    background: var(--flew-color-bg-active);
    border-color: var(--flew-color-border-active);
  }

  .variant-ghost {
    background: transparent;
    color: var(--flew-color-text-secondary);
    border-color: transparent;
  }
  .variant-ghost:hover:not(.disabled) {
    background: var(--flew-color-bg-hover);
    color: var(--flew-color-text);
  }
  .variant-ghost:active:not(.disabled) {
    background: var(--flew-color-bg-active);
  }

  .variant-danger {
    background: var(--flew-color-error);
    color: white;
    border-color: var(--flew-color-error);
  }
  .variant-danger:hover:not(.disabled) {
    background: var(--flew-color-error-hover);
    border-color: var(--flew-color-error-hover);
  }

  .variant-outline {
    background: transparent;
    color: var(--flew-color-text);
    border-color: var(--flew-color-border-active);
  }
  .variant-outline:hover:not(.disabled) {
    border-color: var(--flew-color-text-secondary);
  }
  .variant-outline:active:not(.disabled) {
    background: var(--flew-color-bg-hover);
  }

  .loading {
    position: relative;
    pointer-events: none;
  }

</style>
