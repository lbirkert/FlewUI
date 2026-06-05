<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    variant?: "inline" | "block";
    lang?: string;
    code?: string;
    children?: Snippet;
  };

  let { variant = "inline", lang = "", code = "", children }: Props = $props();

  let highlighted = $state("");

  function escapeHtml(text: string) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  async function highlight(source: string, language: string): Promise<string> {
    try {
      const hljs = (await import("highlight.js")).default;
      if (hljs.getLanguage(language)) {
        return hljs.highlight(source, { language }).value;
      }
    } catch {}
    return escapeHtml(source);
  }

  let content = $derived(code || "");

  $effect(() => {
    if (variant !== "block" || !lang || !content) {
      highlighted = "";
      return;
    }
    highlight(content, lang).then((html) => {
      highlighted = html;
    });
  });
</script>

{#if variant === "inline"}
  <code class="code-inline">
    {#if children}
      {@render children()}
    {:else}
      {code}
    {/if}
  </code>
{:else}
  <pre class="code-block"><code>{#if highlighted}{@html highlighted}{:else}{code}{/if}</code></pre>
{/if}

<style>
  .code-inline {
    font-family: var(--flew-font-mono);
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text);
    background: var(--flew-color-bg-hover);
    padding: 1px 5px;
    border-radius: var(--flew-radius-sm);
    border: 1px solid var(--flew-color-border);
  }

  .code-block {
    font-family: var(--flew-font-mono);
    font-size: var(--flew-font-size-sm);
    background: var(--flew-color-bg-elevated);
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-md);
    padding: var(--flew-spacing-4);
    overflow-x: auto;
    line-height: 1.6;
    margin: 0;
  }

  .code-block code {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background: none;
    padding: 0;
    border: none;
  }

  .code-block :global(.hljs-keyword),
  .code-block :global(.hljs-built_in),
  .code-block :global(.hljs-type) {
    color: #c792ea;
  }

  .code-block :global(.hljs-string),
  .code-block :global(.hljs-addition) {
    color: #c3e88d;
  }

  .code-block :global(.hljs-number),
  .code-block :global(.hljs-literal) {
    color: #f78c6c;
  }

  .code-block :global(.hljs-comment),
  .code-block :global(.hljs-deletion) {
    color: var(--flew-color-text-tertiary);
    font-style: italic;
  }

  .code-block :global(.hljs-function),
  .code-block :global(.hljs-title.function_) {
    color: #82aaff;
  }

  .code-block :global(.hljs-params) {
    color: var(--flew-color-text-secondary);
  }

  .code-block :global(.hljs-property),
  .code-block :global(.hljs-variable) {
    color: var(--flew-color-text);
  }

  .code-block :global(.hljs-attr),
  .code-block :global(.hljs-attribute) {
    color: #ffcb6b;
  }

  .code-block :global(.hljs-tag),
  .code-block :global(.hljs-name) {
    color: #f07178;
  }

  .code-block :global(.hljs-selector-class),
  .code-block :global(.hljs-selector-id) {
    color: #ffcb6b;
  }

  .code-block :global(.hljs-punctuation),
  .code-block :global(.hljs-operator) {
    color: #89ddff;
  }

  .code-block :global(.hljs-regexp) {
    color: #c3e88d;
  }

  .code-block :global(.hljs-meta) {
    color: #ffcb6b;
  }
</style>
