<script lang="ts">
    import PaneGroup from "$lib/components/pane-group.svelte";
    import Pane from "$lib/components/pane.svelte";
    import PaneHandle from "$lib/components/pane-handle.svelte";
    import Heading from "$lib/components/heading.svelte";
    import Paragraph from "$lib/components/paragraph.svelte";

</script>

<PaneGroup dir="horizontal">

  <!-- LEFT SIDEBAR (Explorer) -->
  <Pane>
    <div class="panel">
      <Heading depth={2}>Explorer</Heading>

      <Paragraph>project/</Paragraph>
      <Paragraph>src/</Paragraph>
      <Paragraph>components/</Paragraph>
      <Paragraph>main.ts</Paragraph>
    </div>
  </Pane>

  <PaneHandle />

  <!-- CENTER + BOTTOM TERMINAL -->
  <Pane>
    <PaneGroup dir="vertical">

      <Pane>
        <div class="editor">
          <Heading depth={1}>main.ts</Heading>

          <pre class="code">
{`function add(a: number, b: number) {
  return a + b;
}

console.log(add(2, 3));`}
          </pre>
        </div>
      </Pane>

      <PaneHandle />

      <Pane>
        <div class="terminal">
          <Heading depth={4}>Terminal</Heading>
          <Paragraph> build complete</Paragraph>
        </div>
      </Pane>

    </PaneGroup>
  </Pane>

  <PaneHandle />

  <!-- RIGHT SIDEBAR (Inspector) -->
  <Pane>
    <div class="panel">
      <Heading depth={2}>Inspector</Heading>

      <Heading depth={3}>Symbol</Heading>
      <Paragraph>add(a, b)</Paragraph>

      <Heading depth={3}>Type</Heading>
      <Paragraph>function</Paragraph>

      <Heading depth={3}>Return</Heading>
      <Paragraph>number</Paragraph>
    </div>
  </Pane>

</PaneGroup>

<style>
  :global(*) {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  :global(body) {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .panel {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .editor {
    padding: 12px;
    overflow: hidden;
  }

  .terminal {
    padding: 12px;
    border-top: 1px solid rgba(255,255,255,0.08);
    background: rgba(0,0,0,0.2);
  }

  .code {
    margin-top: 12px;
    font-family: monospace;
    font-size: 12px;
    opacity: 0.9;
    white-space: pre;
  }
</style>