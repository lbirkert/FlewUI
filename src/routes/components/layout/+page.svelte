<script lang="ts">
  import Card from "$lib/components/card.svelte";
  import Container from "$lib/components/container.svelte";
  import Divider from "$lib/components/divider.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Grid from "$lib/components/grid.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Text from "$lib/components/text.svelte";
</script>

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6);">
  <Heading depth={1}>Layout</Heading>
  <Text size="lg" color="secondary">Flex, Grid, Card, Container, Divider</Text>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Flex</Heading>
    <Text size="sm" color="secondary">Direction, gap, align, justify, wrap.</Text>
    <Flex gap="var(--flew-spacing-2)" wrap>
      <Card variant="filled" padding="4px 12px"><Text size="sm">Item 1</Text></Card>
      <Card variant="filled" padding="4px 12px"><Text size="sm">Item 2</Text></Card>
      <Card variant="filled" padding="4px 12px"><Text size="sm">Item 3</Text></Card>
    </Flex>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Grid</Heading>
    <Text size="sm" color="secondary">Columns, gap, align, justify.</Text>
    <Grid columns={3} gap="var(--flew-spacing-2)">
      {#each [1, 2, 3, 4, 5, 6] as n}
        <Card variant="filled" padding="var(--flew-spacing-2)" style="text-align: center;">
          <Text size="sm">{n}</Text>
        </Card>
      {/each}
    </Grid>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Card</Heading>
    <Text size="sm" color="secondary">Filled, outlined, and elevated variants.</Text>
    <Flex gap="var(--flew-spacing-3)" wrap>
      <Card variant="filled" padding="var(--flew-spacing-4)"><Text size="sm">Filled</Text></Card>
      <Card variant="outlined" padding="var(--flew-spacing-4)"><Text size="sm">Outlined</Text></Card>
      <Card variant="elevated" padding="var(--flew-spacing-4)"><Text size="sm">Elevated</Text></Card>
    </Flex>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Container</Heading>
    <Text size="sm" color="secondary">Centered, max-width constrained. Sizes: sm, md, lg, xl, full.</Text>
    <Container size="sm">
      <Card variant="filled" padding="var(--flew-spacing-3)">
        <Text size="sm" align="center">sm container — 480px max</Text>
      </Card>
    </Container>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Divider</Heading>
    <Flex direction="vertical" gap="var(--flew-spacing-3)">
      <Divider />
      <Divider label="Section" />
      <Flex gap="var(--flew-spacing-3)">
        <Text size="sm">Left</Text>
        <Divider orientation="vertical" />
        <Text size="sm">Right</Text>
      </Flex>
    </Flex>
  </Card>
</Flex>
