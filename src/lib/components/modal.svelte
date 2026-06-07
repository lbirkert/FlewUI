<script lang="ts">
  import type { Snippet } from "svelte";
  import { X } from "@lucide/svelte";

  type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: Snippet;
    footer?: Snippet;
    closeOnOverlay?: boolean;
    width?: string;
  };

  let {
    open = $bindable(false),
    onClose,
    title = "",
    children,
    footer,
    closeOnOverlay = true,
    width = "480px",
  }: Props = $props();

  function handleOverlayClick(e: MouseEvent) {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    }
  }
</script>

{#if open}
  <div class="overlay" onclick={handleOverlayClick} onkeydown={handleKeydown} role="dialog" aria-modal="true" tabindex="-1">
    <div class="modal" style="max-width: {width}">
      {#if title}
        <div class="header">
          <h2 class="title">{title}</h2>
          <button class="close-btn" onclick={onClose} aria-label="close">
            <X size={16} />
          </button>
        </div>
      {/if}
      <div class="body">
        {@render children()}
      </div>
      {#if footer}
        <div class="footer">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    animation: fadeIn 150ms ease;
  }

  .modal {
    width: 90%;
    background: var(--flew-color-bg-overlay);
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-xl);
    box-shadow: var(--flew-shadow-xl);
    animation: slideUp 200ms ease;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: var(--flew-spacing-4) var(--flew-spacing-4) 0;
    gap: var(--flew-spacing-2);
    min-width: 0;
  }

  .title {
    font-size: var(--flew-font-size-lg);
    font-weight: 600;
    color: var(--flew-color-text);
    margin: 0;
    word-break: break-word;
    overflow-wrap: break-word;
    flex: 1;
    min-width: 0;
  }

  .close-btn {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    outline: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--flew-radius-md);
    cursor: pointer;
    color: var(--flew-color-text-tertiary);
    transition: all var(--flew-transition-fast);
  }

  .close-btn:hover {
    background: var(--flew-color-bg-hover);
    color: var(--flew-color-text);
  }

  .close-btn :global(.lucide) {
    width: 16px;
    height: 16px;
  }

  .body {
    padding: var(--flew-spacing-4);
    overflow-y: auto;
    flex: 1;
  }

  .footer {
    padding: 0 var(--flew-spacing-4) var(--flew-spacing-4);
    display: flex;
    justify-content: flex-end;
    gap: var(--flew-spacing-2);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
