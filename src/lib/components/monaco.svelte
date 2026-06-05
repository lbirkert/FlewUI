<script lang="ts">
  import { onMount } from "svelte";
  import { mode } from "mode-watcher";

  import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker.js?worker";
  import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker.js?worker";

  type Lang = "javascript" | "typescript" | "css" | "html" | "json" | "markdown";

  const langMap: Record<Lang, string> = {
    javascript: "javascript",
    typescript: "typescript",
    css: "css",
    html: "html",
    json: "json",
    markdown: "markdown",
  };

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
    theme,
    placeholder = "",
    readonly = false,
    style = "",
  }: Props = $props();

  let effectiveTheme = $derived(theme ?? (mode.current === "dark" ? "dark" : "light"));

  let container: HTMLDivElement;
  let editor: import("monaco-editor").editor.IStandaloneCodeEditor | undefined = $state();
  let monacoModule: typeof import("monaco-editor") | undefined = $state();
  let alive = true;
  let inSync = false;

  onMount(() => {
    init();
    return () => {
      alive = false;
      editor?.dispose();
    };
  });

  async function init() {
    self.MonacoEnvironment = {
      getWorker(_workerId: string, label: string) {
        if (label === "javascript" || label === "typescript") return new TsWorker();
        return new EditorWorker();
      },
    };

    const monaco = await import("monaco-editor");
    monacoModule = monaco;
    if (!alive) return;

    editor = monaco.editor.create(container, {
      value,
      language: langMap[lang],
      theme: effectiveTheme === "dark" ? "vs-dark" : "vs",
      readOnly: readonly,
      placeholder,
      minimap: { enabled: false },
      fontSize: 13,
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 8, bottom: 8 },
    });

    editor.onDidChangeModelContent(() => {
      if (!inSync) value = editor!.getValue();
    });
  }

  $effect(() => {
    if (!editor || !monacoModule) return;
    lang;
    effectiveTheme;
    readonly;
    const model = editor.getModel();
    if (model) monacoModule.editor.setModelLanguage(model, langMap[lang]);
    monacoModule.editor.setTheme(effectiveTheme === "dark" ? "vs-dark" : "vs");
    editor.updateOptions({ readOnly: readonly });
  });

  $effect(() => {
    if (!editor) return;
    const current = editor.getValue();
    if (value !== current) {
      inSync = true;
      editor.setValue(value);
      inSync = false;
    }
  });
</script>

<div bind:this={container} class="monaco-container" class:readonly {style}></div>

<style>
  .monaco-container {
    height: 100%;
    min-height: 120px;
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-md);
    overflow: hidden;
  }
</style>
