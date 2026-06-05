<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Card from "$lib/components/card.svelte";
  import Code from "$lib/components/code.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Grid from "$lib/components/grid.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Kbd from "$lib/components/kbd.svelte";
  import Text from "$lib/components/text.svelte";
  import { ArrowRight, Check, Package, Palette, Shield, Sun, Zap } from "@lucide/svelte";
</script>

<Flex direction="vertical" gap="var(--flew-spacing-10)" style="padding: var(--flew-spacing-8); max-width: 800px; margin: 0 auto;">

  <Flex direction="vertical" gap="var(--flew-spacing-2)" align="center" style="text-align: center; padding-top: var(--flew-spacing-8);">
    <Heading depth={1}>FlewUI</Heading>
    <Text size="xl" color="secondary">A Svelte 5 component library with built-in reactive validation, composable rules, and cross-field support.</Text>
  </Flex>

  <Grid columns={2} gap="var(--flew-spacing-4)">
    <Card variant="outlined" padding="var(--flew-spacing-5)">
      <Flex direction="vertical" gap="var(--flew-spacing-2)">
        <Flex gap="var(--flew-spacing-2)" align="center"><Zap size={18} /><Text weight="semibold">Reactive Validation</Text></Flex>
        <Text size="sm" color="secondary">Pure <Code variant="inline">Rule</Code> functions that compose via <Code variant="inline">pipe()</Code> with automatic short-circuiting. Errors update on every keystroke.</Text>
      </Flex>
    </Card>
    <Card variant="outlined" padding="var(--flew-spacing-5)">
      <Flex direction="vertical" gap="var(--flew-spacing-2)">
        <Flex gap="var(--flew-spacing-2)" align="center"><Palette size={18} /><Text weight="semibold">Dark Mode</Text></Flex>
        <Text size="sm" color="secondary">Built-in dark/light mode with <Code variant="inline">mode-watcher</Code>. Toggle via the <Sun size={14} /> button in the header.</Text>
      </Flex>
    </Card>
    <Card variant="outlined" padding="var(--flew-spacing-5)">
      <Flex direction="vertical" gap="var(--flew-spacing-2)">
        <Flex gap="var(--flew-spacing-2)" align="center"><Shield size={18} /><Text weight="semibold">Cross-Field Rules</Text></Flex>
        <Text size="sm" color="secondary"><Code variant="inline">matchesField()</Code> re-evaluates when the source field changes. All rules receive form context — no unsafe <Code variant="inline">getContext()</Code> calls.</Text>
      </Flex>
    </Card>
    <Card variant="outlined" padding="var(--flew-spacing-5)">
      <Flex direction="vertical" gap="var(--flew-spacing-2)">
        <Flex gap="var(--flew-spacing-2)" align="center"><Package size={18} /><Text weight="semibold">Zero Dependencies</Text></Flex>
        <Text size="sm" color="secondary">Pure Svelte 5 stores and context. No validation library, no runtime overhead. ~2kB gzipped for the form system.</Text>
      </Flex>
    </Card>
  </Grid>

  <Flex direction="vertical" gap="var(--flew-spacing-4)">
    <Heading depth={2}>Quick Start</Heading>
    <Card variant="outlined" padding="var(--flew-spacing-5)">
      <Code variant="block" lang="svelte" code={`<Form onSubmit={handleSubmit}>
  <Input id="email" label="Email" validate={pipe(required(), email())} />
  <Input id="password" label="Password" validate={pipe(required(), minLength(8))} />
  <Button type="submit">Submit</Button>
</Form>`} />
    </Card>
  </Flex>

  <Flex direction="vertical" gap="var(--flew-spacing-4)">
    <Heading depth={2}>Explore</Heading>
    <Flex gap="var(--flew-spacing-3)" wrap>
      <Button variant="primary" href="/components" onclick={() => {}}>
        Components <ArrowRight size={16} />
      </Button>
      <Button variant="outline" href="/apps/dashboard" onclick={() => {}}>
        Demo Apps
      </Button>
    </Flex>
  </Flex>

  <Flex direction="vertical" gap="var(--flew-spacing-3)" align="center" style="padding: var(--flew-spacing-8) 0;">
    <Flex gap="var(--flew-spacing-4)" align="center">
      <Check size={16} color="var(--flew-color-success)" />
      <Text size="sm" color="secondary">Svelte 5 runes & snippets</Text>
    </Flex>
    <Flex gap="var(--flew-spacing-4)" align="center">
      <Check size={16} color="var(--flew-color-success)" />
      <Text size="sm" color="secondary">TypeScript — strict mode</Text>
    </Flex>
    <Flex gap="var(--flew-spacing-4)" align="center">
      <Check size={16} color="var(--flew-color-success)" />
      <Text size="sm" color="secondary">Keyboard shortcuts via <Kbd>Mod+Enter</Kbd> / <Kbd>Escape</Kbd></Text>
    </Flex>
  </Flex>

  <Flex direction="vertical" gap="var(--flew-spacing-2)" align="center" style="text-align: center; padding-bottom: var(--flew-spacing-8);">
    <Text size="sm" color="tertiary">FlewUI — MIT License</Text>
  </Flex>
</Flex>
