<script lang="ts">
  import Card from "$lib/components/card.svelte";
  import Chart from "$lib/components/chart.svelte";
  import Monaco from "$lib/components/monaco.svelte";
  import FileTree from "$lib/components/file-tree.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Text from "$lib/components/text.svelte";

  let code = $state(`function hello() {
  console.log("Hello, world!");
}`);

  let chartData = $state({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Revenue",
      data: [12, 19, 15, 22, 28, 24],
      borderColor: "var(--flew-color-primary)",
      backgroundColor: "var(--flew-color-primary-bg)",
    }]
  });

  let treeNodes = $state([
    {
      name: "src",
      type: "folder" as const,
      children: [
        {
          name: "components",
          type: "folder" as const,
          children: [
            { name: "button.svelte", type: "file" as const },
            { name: "card.svelte", type: "file" as const },
          ]
        },
        { name: "routes", type: "folder" as const, children: [] },
        { name: "app.html", type: "file" as const },
      ]
    },
    { name: "package.json", type: "file" as const },
  ]);
</script>

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6);">
  <Heading depth={1}>Data Display</Heading>
  <Text size="lg" color="secondary">Chart, Monaco Editor, FileTree</Text>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Chart</Heading>
    <Text size="sm" color="secondary">Chart.js wrapper supporting line, bar, radar, doughnut, pie, and more.</Text>
    <div style="max-width: 500px; margin-top: var(--flew-spacing-2);">
      <Chart type="line" data={chartData} height="240px" />
    </div>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Monaco</Heading>
    <Text size="sm" color="secondary">Full-featured code editor (VS Code powered by Monaco) with syntax highlighting for JavaScript, TypeScript, HTML, CSS, JSON, and Markdown.</Text>
    <Monaco bind:value={code} lang="javascript" style="margin-top: var(--flew-spacing-2); height: 180px;" />
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>FileTree</Heading>
    <Text size="sm" color="secondary">Recursive file tree with customizable snippet slot for rendering nodes.</Text>
    <div style="border: 1px solid var(--flew-color-border); border-radius: var(--flew-radius-md); padding: var(--flew-spacing-3); max-width: 300px;">
      <FileTree nodes={treeNodes}>
        {#snippet children(node, depth)}
          <Text size="sm" style="padding-left: {depth * 16}px;">
            {#if node.type === "folder"}📁 {:else}📄 {/if}
            {node.name}
          </Text>
        {/snippet}
      </FileTree>
    </div>
  </Card>
</Flex>
