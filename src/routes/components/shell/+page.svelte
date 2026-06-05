<script lang="ts">
  import ActivityBar from "$lib/components/activity-bar.svelte";
  import Card from "$lib/components/card.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Footer from "$lib/components/footer.svelte";
  import Header from "$lib/components/header.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Pane from "$lib/components/pane.svelte";
  import PaneGroup from "$lib/components/pane-group.svelte";
  import PaneHandle from "$lib/components/pane-handle.svelte";
  import Sidebar from "$lib/components/sidebar.svelte";
  import StatusBar from "$lib/components/status-bar.svelte";
  import TabBar from "$lib/components/tab-bar.svelte";
  import Text from "$lib/components/text.svelte";
  import Button from "$lib/components/button.svelte";
  import Code from "$lib/components/code.svelte";

  let tabs = $state([
    { label: "app.svelte", active: true },
    { label: "types.ts", active: false },
    { label: "styles.css", active: false },
  ]);
  let tabCount = $state(3);
</script>

{#snippet tabLeading()}
  <Button variant="ghost" size="xs" icon>+</Button>
{/snippet}

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6);">
  <Heading depth={1}>Shell</Heading>
  <Text size="lg" color="secondary">AppShell, ActivityBar, Sidebar, TabBar, Header, Footer, StatusBar, PaneGroup</Text>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Header</Heading>
    <Flex direction="vertical" gap="var(--flew-spacing-3)">
      <Header title="My App">
        {#snippet children()}
          <Button variant="ghost" size="sm">File</Button>
          <Button variant="ghost" size="sm">Edit</Button>
          <Button variant="ghost" size="sm">View</Button>
        {/snippet}
        {#snippet actions()}
          <Button variant="primary" size="sm">Save</Button>
        {/snippet}
      </Header>
      <Header title="Compact" compact>
        {#snippet actions()}
          <Button variant="ghost" size="xs">Minimise</Button>
        {/snippet}
      </Header>
    </Flex>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>TabBar</Heading>
    <TabBar {tabs}
      onSelect={(tab) => tabs = tabs.map(t => ({...t, active: t === tab}))}
      onClose={(tab) => tabs = tabs.filter(t => t !== tab)}
      leading={tabLeading}
    />
    <Text size="sm" color="secondary" style="margin-top: var(--flew-spacing-2);">Click tabs to switch, hover to close.</Text>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>PaneGroup — Resizable Panels</Heading>
    <Text size="sm" color="secondary">Drag the handles to resize. Panes clamp to a 50px minimum.</Text>
    <div style="height: 240px; border: 1px solid var(--flew-color-border); border-radius: var(--flew-radius-md); overflow: hidden; margin-top: var(--flew-spacing-2);">
      <PaneGroup dir="horizontal">
        <Pane initialSize={160} pad>
          <Text size="sm" weight="semibold">Explorer</Text>
          <Text size="xs" color="secondary">src/<br/>components/<br/>routes/<br/>lib/</Text>
        </Pane>
        <PaneHandle />
        <Pane pad>
          <Text size="sm" weight="semibold">Editor</Text>
          <Text size="xs" color="secondary">content area — drag the handle to resize</Text>
        </Pane>
        <PaneHandle />
        <Pane initialSize={200} pad>
          <Text size="sm" weight="semibold">Terminal</Text>
          <Text size="xs" color="secondary">output panel</Text>
        </Pane>
      </PaneGroup>
    </div>
    <div style="height: 160px; border: 1px solid var(--flew-color-border); border-radius: var(--flew-radius-md); overflow: hidden; margin-top: var(--flew-spacing-2);">
      <PaneGroup dir="vertical">
        <Pane initialFlex="1" pad>
          <Text size="sm">Top pane</Text>
        </Pane>
        <PaneHandle />
        <Pane initialSize={60} pad>
          <Text size="xs" color="secondary">Bottom pane — 60px</Text>
        </Pane>
      </PaneGroup>
    </div>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Sidebar</Heading>
    <Flex gap="var(--flew-spacing-3)" wrap>
      <div style="width: 220px; height: 200px; border: 1px solid var(--flew-color-border); border-radius: var(--flew-radius-md); overflow: hidden; display: flex;">
        <Sidebar title="Explorer" width="220px" variant="elevated">
          <Text size="sm">📁 src/<br/>&nbsp;&nbsp;📄 app.ts<br/>&nbsp;&nbsp;📁 components/<br/>&nbsp;&nbsp;📁 routes/<br/>📄 package.json</Text>
        </Sidebar>
      </div>
      <div style="width: 220px; height: 200px; border: 1px solid var(--flew-color-border); border-radius: var(--flew-radius-md); overflow: hidden; display: flex;">
        <Sidebar title="Properties" width="220px" variant="surface">
          <Text size="sm">Name: app<br/>Type: Svelte<br/>Size: 2.4 kB</Text>
        </Sidebar>
      </div>
    </Flex>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>ActivityBar</Heading>
    <div style="height: 200px; border: 1px solid var(--flew-color-border); border-radius: var(--flew-radius-md); overflow: hidden; display: flex;">
      <ActivityBar>
        {#snippet children()}
          <button class="active" aria-label="Explorer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <button aria-label="Git">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>
          </button>
        {/snippet}
        {#snippet bottom()}
          <button aria-label="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        {/snippet}
      </ActivityBar>
      <div style="flex: 1; padding: var(--flew-spacing-3);">
        <Text size="sm" weight="semibold">Explorer</Text>
        <Text size="xs" color="secondary">Click an activity icon</Text>
      </div>
    </div>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>StatusBar</Heading>
    <StatusBar>
      {#snippet left()}
        <span>main *</span>
        <span>TypeScript</span>
      {/snippet}
      {#snippet right()}
        <span>Ln 1, Col 1</span>
        <span>UTF-8</span>
        <span>Spaces: 2</span>
      {/snippet}
    </StatusBar>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Footer</Heading>
    <Footer>&copy; 2026 FlewUI — MIT License</Footer>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>AppShell — Full Layout</Heading>
    <Text size="sm" color="secondary">The AppShell combines all shell components into a viewport-filling layout. Below is a scaled-down demo:</Text>
    <div style="height: 360px; border: 1px solid var(--flew-color-border); border-radius: var(--flew-radius-md); overflow: hidden; display: flex; flex-direction: column; margin-top: var(--flew-spacing-2);">
      <Header title="IDE Demo" compact>
        {#snippet actions()}
          <Button variant="ghost" size="xs">Run</Button>
        {/snippet}
      </Header>
      <TabBar tabs={[
        { label: "index.ts", active: true },
        { label: "app.svelte", active: false },
      ]} />
      <div style="flex: 1; min-height: 0; display: flex; flex-direction: row;">
        <ActivityBar>
          {#snippet children()}
            <button class="active" aria-label="Files">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </button>
          {/snippet}
        </ActivityBar>
        <Sidebar title="Files" width="180px" variant="elevated">
          <Text size="xs">📁 src/<br/>&nbsp;&nbsp;📄 main.ts<br/>&nbsp;&nbsp;📁 routes/<br/>&nbsp;&nbsp;📁 components/</Text>
        </Sidebar>
        <div style="flex: 1; min-width: 0; display: flex;">
        <PaneGroup dir="vertical">
          <Pane pad>
            <Text size="xs" weight="semibold">index.ts</Text>
            <Code variant="block" code={`function greet(name: string) {\n  return \`Hello, \${name}!\`;\n}`} lang="typescript" />
          </Pane>
          <PaneHandle />
          <Pane initialSize={80} pad>
            <Text size="xs" color="secondary">Terminal — ready</Text>
          </Pane>
        </PaneGroup>
        </div>
      </div>
      <StatusBar>
        {#snippet left()}<span>main</span>{/snippet}
        {#snippet right()}<span>TypeScript</span><span>UTF-8</span>{/snippet}
      </StatusBar>
    </div>
  </Card>

  <Flex direction="vertical" gap="var(--flew-spacing-3)">
    <Heading depth={2}>Usage</Heading>
    <Code variant="block" lang="svelte" code={`<AppShell>
  {#snippet header()}
    <Header title="My App" />
    <TabBar {tabs} onSelect={fn} onClose={fn} />
  {/snippet}
  {#snippet sidebar()}
    <ActivityBar><!-- icons --></ActivityBar>
    <Sidebar title="Files"><!-- tree --></Sidebar>
  {/snippet}
  {#snippet children()}
    <PaneGroup dir="horizontal">
      <Pane initialSize={200}><!-- editor --></Pane>
      <PaneHandle />
      <Pane><!-- terminal --></Pane>
    </PaneGroup>
  {/snippet}
  {#snippet footer()}
    <StatusBar left={...} right={...} />
  {/snippet}
</AppShell>`} />
  </Flex>
</Flex>
