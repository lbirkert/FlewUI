<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { basicSetup, EditorView } from "codemirror";
  import { Compartment } from "@codemirror/state";
  import { placeholder as cmPlaceholder } from "@codemirror/view";
  import { javascript } from "@codemirror/lang-javascript";
  import { css } from "@codemirror/lang-css";
  import { html } from "@codemirror/lang-html";
  import { json } from "@codemirror/lang-json";
  import { markdown } from "@codemirror/lang-markdown";
  import { oneDark } from "@codemirror/theme-one-dark";

  type Lang = "javascript" | "typescript" | "jsx" | "tsx" | "css" | "html" | "json" | "markdown";

  function getLangExt(lang: Lang) {
    switch (lang) {
      case "javascript": return javascript();
      case "typescript": return javascript({ typescript: true });
      case "jsx": return javascript({ jsx: true });
      case "tsx": return javascript({ typescript: true, jsx: true });
      case "css": return css();
      case "html": return html();
      case "json": return json();
      case "markdown": return markdown();
    }
  }

  type Props = {
    value?: string;
    lang?: Lang;
    theme?: "dark" | "light";
    placeholder?: string;
    readonly?: boolean;
    style?: string;
  };

  let {
    value = $bindable(""),
    lang = "typescript",
    theme = "dark",
    placeholder = "",
    readonly = false,
    style = "",
  }: Props = $props();

  let container: HTMLElement;
  let view: EditorView;
  const langComp = new Compartment();
  const themeComp = new Compartment();
  let syncing = false;
  let mounted = false;

  onMount(() => {
    view = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        langComp.of(getLangExt(lang)),
        themeComp.of(theme === "dark" ? oneDark : []),
        placeholder ? cmPlaceholder(placeholder) : [],
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !syncing) {
            value = update.state.doc.toString();
          }
        }),
        ...(readonly ? [EditorView.editable.of(false)] : []),
      ],
      parent: container,
    });
    mounted = true;
  });

  onDestroy(() => {
    view?.destroy();
  });

  $effect(() => {
    if (!mounted) return;
    view.dispatch({ effects: langComp.reconfigure(getLangExt(lang)) });
  });

  $effect(() => {
    if (!mounted) return;
    view.dispatch({ effects: themeComp.reconfigure(theme === "dark" ? oneDark : []) });
  });

  $effect(() => {
    if (!mounted) return;
    const current = view.state.doc.toString();
    if (value !== current) {
      syncing = true;
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
      syncing = false;
    }
  });
</script>

<div bind:this={container} class="cm-container" class:readonly {style}></div>

<style>
  .cm-container {
    height: 100%;
    min-height: 100px;
    font-size: var(--flew-font-size-sm);
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-md);
    overflow: hidden;
  }

  .cm-container :global(.cm-editor) {
    height: 100%;
  }

  .cm-container :global(.cm-editor .cm-scroller) {
    font-family: var(--flew-font-mono);
  }

  .cm-container :global(.cm-editor.cm-focused) {
    outline: none;
  }

  .cm-container.readonly :global(.cm-editor) {
    opacity: 0.7;
  }
</style>
