<script lang="ts">
  import Avatar from "$lib/components/avatar.svelte";
  import Card from "$lib/components/card.svelte";
  import Container from "$lib/components/container.svelte";
  import Divider from "$lib/components/divider.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Grid from "$lib/components/grid.svelte";
  import Heading from "$lib/components/heading.svelte";
  import IconBox from "$lib/components/icon-box.svelte";
  import Pane from "$lib/components/pane.svelte";
  import PaneGroup from "$lib/components/pane-group.svelte";
  import PaneHandle from "$lib/components/pane-handle.svelte";
  import Text from "$lib/components/text.svelte";
  import { Settings, User, Bell, Mail } from "@lucide/svelte";
</script>

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6);">
  <Heading depth={1}>Layout</Heading>
  <Text size="lg" color="secondary">Flex, Grid, Card, Container, Divider, Avatar, IconBox, PaneGroup</Text>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Flex</Heading>
    <Text size="sm" color="secondary">Direction, gap, align, justify, wrap.</Text>
    <Flex gap="var(--flew-spacing-2)" wrap>
      <Card variant="filled" padding="4px 12px"><Text size="sm">Item 1</Text></Card>
      <Card variant="filled" padding="4px 12px"><Text size="sm">Item 2</Text></Card>
      <Card variant="filled" padding="4px 12px"><Text size="sm">Item 3</Text></Card>
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Grid</Heading>
    <Text size="sm" color="secondary">Columns, gap, align, justify.</Text>
    <Grid columns={3} gap="var(--flew-spacing-2)">
      {#each [1, 2, 3, 4, 5, 6] as n}
        <Card variant="filled" paddingSize="xs" style="text-align: center;">
          <Text size="sm">{n}</Text>
        </Card>
      {/each}
    </Grid>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Card</Heading>
    <Text size="sm" color="secondary">Filled, outlined, and elevated variants.</Text>
    <Flex gap="var(--flew-spacing-3)" wrap>
      <Card variant="filled"><Text size="sm">Filled</Text></Card>
      <Card variant="outlined"><Text size="sm">Outlined</Text></Card>
      <Card variant="elevated"><Text size="sm">Elevated</Text></Card>
    </Flex>
    <Text size="sm" color="secondary" style="margin-top: var(--flew-spacing-3);">Padding sizes: xs, sm, md (default), lg.</Text>
    <Flex gap="var(--flew-spacing-3)" align="center" wrap>
      <Card variant="outlined" paddingSize="xs"><Text size="sm">xs</Text></Card>
      <Card variant="outlined" paddingSize="sm"><Text size="sm">sm</Text></Card>
      <Card variant="outlined"><Text size="sm">md</Text></Card>
      <Card variant="outlined" paddingSize="lg"><Text size="sm">lg</Text></Card>
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Container</Heading>
    <Text size="sm" color="secondary">Centered, max-width constrained. Sizes: sm, md, lg, xl, full.</Text>
    <Container size="sm">
      <Card variant="filled" paddingSize="xs">
          <Text size="sm" align="center">sm container — 480px max</Text>
      </Card>
    </Container>
  </Card>

  <Card variant="outlined" paddingSize="lg">
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

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Avatar</Heading>
    <Text size="sm" color="secondary">Image avatar with initials fallback. Sizes: xs, sm, md, lg, xl. Variants: circle, square.</Text>
    <Flex gap="var(--flew-spacing-3)" align="center" wrap>
      <Avatar size="xs" initials="A" />
      <Avatar size="sm" initials="B" />
      <Avatar size="md" initials="JD" />
      <Avatar size="lg" initials="JD" />
      <Avatar size="xl" initials="JD" />
      <Avatar variant="square" size="md" initials="SQ" />
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>IconBox</Heading>
    <Text size="sm" color="secondary">Colored square container for icons with semantic variants.</Text>
    <Flex gap="var(--flew-spacing-3)" align="center" wrap>
      <IconBox color="primary"><User size={16} /></IconBox>
      <IconBox color="success"><Bell size={16} /></IconBox>
      <IconBox color="warning"><Mail size={16} /></IconBox>
      <IconBox color="error"><Settings size={16} /></IconBox>
      <IconBox color="info" size="md"><Bell size={20} /></IconBox>
      <IconBox color="secondary" size="md"><User size={20} /></IconBox>
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>PaneGroup</Heading>
    <Text size="sm" color="secondary">Resizable split panes with draggable handles.</Text>
    <div style="height: 200px; border: 1px solid var(--flew-color-border); border-radius: var(--flew-radius-md); overflow: hidden; margin-top: var(--flew-spacing-2);">
      <PaneGroup dir="horizontal">
        <Pane pad>
          <Text size="sm">Left pane — drag the divider to resize</Text>
        </Pane>
        <PaneHandle />
        <Pane pad>
          <Text size="sm">Right pane</Text>
        </Pane>
      </PaneGroup>
    </div>
  </Card>
</Flex>
