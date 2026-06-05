<script lang="ts">
  import Alert from "$lib/components/alert.svelte";
  import Badge from "$lib/components/badge.svelte";
  import Card from "$lib/components/card.svelte";
  import Dot from "$lib/components/dot.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Progress from "$lib/components/progress.svelte";
  import Spinner from "$lib/components/spinner.svelte";
  import Tag from "$lib/components/tag.svelte";
  import Text from "$lib/components/text.svelte";
</script>

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6);">
  <Heading depth={1}>Feedback</Heading>
  <Text size="lg" color="secondary">Alert, Badge, Tag, Progress, Spinner, Dot</Text>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Alert</Heading>
    <Flex direction="vertical" gap="var(--flew-spacing-3)">
      <Alert variant="info" title="Info">This is an informational message.</Alert>
      <Alert variant="success" title="Success" closable>Operation completed successfully.</Alert>
      <Alert variant="warning" title="Warning">Proceed with caution.</Alert>
      <Alert variant="error" title="Error" closable>Something went wrong.</Alert>
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Badge</Heading>
    <Flex gap="var(--flew-spacing-2)" wrap>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Tag</Heading>
    <Text size="sm" color="secondary">Inline tags/chips with variants, sizes, and optional close button.</Text>
    <Flex direction="vertical" gap="var(--flew-spacing-3)">
      <Flex gap="var(--flew-spacing-2)" wrap>
        <Tag variant="primary">Primary</Tag>
        <Tag variant="success">Success</Tag>
        <Tag variant="warning">Warning</Tag>
        <Tag variant="error">Error</Tag>
        <Tag variant="info">Info</Tag>
        <Tag variant="neutral">Neutral</Tag>
      </Flex>
      <Flex gap="var(--flew-spacing-2)" align="center">
        <Tag size="sm" closable>Small</Tag>
        <Tag size="md" closable>Medium</Tag>
      </Flex>
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Progress</Heading>
    <Flex direction="vertical" gap="var(--flew-spacing-3)">
      <Progress value={65} label="Storage" showValue />
      <Progress value={40} variant="success" size="sm" />
      <Progress variant="warning" label="Uploading" indeterminate />
      <Progress value={100} variant="error" showValue />
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Spinner & Dot</Heading>
    <Flex gap="var(--flew-spacing-4)" align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Flex>
    <Flex gap="var(--flew-spacing-3)" wrap style="margin-top: var(--flew-spacing-3);">
      <Dot color="primary" />
      <Dot color="success" />
      <Dot color="error" />
      <Dot color="warning" />
      <Dot color="info" />
      <Dot color="secondary" />
    </Flex>
  </Card>
</Flex>
