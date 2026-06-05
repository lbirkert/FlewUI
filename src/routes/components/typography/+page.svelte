<script lang="ts">
  import Card from "$lib/components/card.svelte";
  import Code from "$lib/components/code.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Grid from "$lib/components/grid.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Kbd from "$lib/components/kbd.svelte";
  import Link from "$lib/components/link.svelte";
  import Paragraph from "$lib/components/paragraph.svelte";
  import Text from "$lib/components/text.svelte";
</script>

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6);">
  <Heading depth={1}>Typography</Heading>
  <Text size="lg" color="secondary">Heading, Text, Paragraph, Code, Kbd, Link</Text>

  <Card variant="outlined" paddingSize="lg">
    <Flex direction="vertical" gap="var(--flew-spacing-3)">
      <Heading depth={2}>Heading</Heading>
      <Text size="sm" color="secondary">Depth prop controls the heading level (1–4).</Text>
      <Heading depth={1}>Heading 1</Heading>
      <Heading depth={2}>Heading 2</Heading>
      <Heading depth={3}>Heading 3</Heading>
      <Heading depth={4}>Heading 4</Heading>
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Flex direction="vertical" gap="var(--flew-spacing-3)">
      <Heading depth={2}>Text</Heading>
      <Text size="sm" color="secondary">Size, weight, color, and alignment props.</Text>
      <Grid columns={2} gap="var(--flew-spacing-4)">
        <Flex direction="vertical" gap="var(--flew-spacing-2)">
          <Text size="xs">Size xs</Text>
          <Text size="sm">Size sm</Text>
          <Text size="base">Size base</Text>
          <Text size="lg">Size lg</Text>
          <Text size="xl">Size xl</Text>
        </Flex>
        <Flex direction="vertical" gap="var(--flew-spacing-2)">
          <Text color="default">Default</Text>
          <Text color="secondary">Secondary</Text>
          <Text color="tertiary">Tertiary</Text>
          <Text color="primary">Primary</Text>
          <Text color="success">Success</Text>
          <Text color="error">Error</Text>
          <Text color="warning">Warning</Text>
        </Flex>
      </Grid>
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Flex direction="vertical" gap="var(--flew-spacing-3)">
      <Heading depth={2}>Code</Heading>
      <Text size="sm" color="secondary">Inline and block variants.</Text>
      <Text>Inline code: <Code variant="inline">const x = 42</Code></Text>
      <Code variant="block" lang="typescript" code={`function greet(name: string) {
  return \`Hello, \${name}!\`;
}`} />
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Flex direction="vertical" gap="var(--flew-spacing-3)">
      <Heading depth={2}>Paragraph</Heading>
      <Text size="sm" color="secondary">Standard paragraph text with proper line-height for reading.</Text>
      <Paragraph>This is a paragraph component for longer-form text content. It renders a semantic <Code variant="inline">&lt;p&gt;</Code> element with standard font sizing.</Paragraph>
      <Paragraph>Multiple paragraphs stack with consistent vertical spacing.</Paragraph>
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Flex direction="vertical" gap="var(--flew-spacing-3)">
      <Heading depth={2}>Kbd & Link</Heading>
      <Flex gap="var(--flew-spacing-4)" wrap>
        <Kbd>Ctrl+S</Kbd>
        <Kbd>⌘+K</Kbd>
        <Kbd>Shift+Enter</Kbd>
        <Kbd>Escape</Kbd>
      </Flex>
      <Flex gap="var(--flew-spacing-4)">
        <Link href="#">Default link</Link>
        <Link href="#" variant="subtle">Subtle link</Link>
        <Link href="#" variant="muted">Muted link</Link>
        <Link href="#" external>External ↗</Link>
      </Flex>
    </Flex>
  </Card>
</Flex>
