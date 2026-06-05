<script lang="ts">
  import Card from "$lib/components/card.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Grid from "$lib/components/grid.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Text from "$lib/components/text.svelte";
  import {
    AlignLeft, CheckSquare, Columns, GanttChartSquare, Layers, MessageSquare, SquareStack,
  } from "@lucide/svelte";

  const groups = [
    { href: "/components/typography", label: "Typography", icon: AlignLeft, desc: "Heading, Text, Paragraph, Code, Kbd, Link" },
    { href: "/components/form", label: "Form", icon: CheckSquare, desc: "Input, Select, Textarea, Checkbox, Toggle, Radio, Slider, Form, Button" },
    { href: "/components/layout", label: "Layout", icon: Columns, desc: "Flex, Grid, Card, Container, Divider, Avatar, IconBox, PaneGroup" },
    { href: "/components/feedback", label: "Feedback", icon: MessageSquare, desc: "Alert, Badge, Tag, Progress, Spinner, Dot" },
    { href: "/components/navigation", label: "Navigation", icon: GanttChartSquare, desc: "Tabs, Breadcrumbs, Menu, Dropdown, Accordion" },
    { href: "/components/overlay", label: "Overlay", icon: SquareStack, desc: "Modal, Tooltip" },
    { href: "/components/data", label: "Data", icon: Layers, desc: "Chart, Monaco Editor, FileTree" },
  ];
</script>

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6); max-width: 800px; margin: 0 auto;">
  <Flex direction="vertical" gap="var(--flew-spacing-1)">
    <Heading depth={1}>Components</Heading>
    <Text size="lg" color="secondary">Browse component groups.</Text>
  </Flex>

  <Grid columns={2} gap="var(--flew-spacing-4)">
    {#each groups as { href, label, icon: Icon, desc }}
      <a href={href} style="text-decoration: none;">
        <Card variant="outlined" paddingSize="lg" style="cursor: pointer;">
          <Flex direction="vertical" gap="var(--flew-spacing-2)">
            <Flex gap="var(--flew-spacing-2)" align="center">
              <Icon size={18} />
              <Text weight="semibold">{label}</Text>
            </Flex>
            <Text size="sm" color="secondary">{desc}</Text>
          </Flex>
        </Card>
      </a>
    {/each}
  </Grid>
</Flex>
