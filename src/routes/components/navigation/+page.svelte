<script lang="ts">
  import Accordion from "$lib/components/accordion.svelte";
  import AccordionItem from "$lib/components/accordion-item.svelte";
  import Breadcrumbs from "$lib/components/breadcrumbs.svelte";
  import Button from "$lib/components/button.svelte";
  import Card from "$lib/components/card.svelte";
  import Dropdown from "$lib/components/dropdown.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Menu from "$lib/components/menu.svelte";
  import Tabs from "$lib/components/tabs.svelte";
  import Text from "$lib/components/text.svelte";

  let tabValue = $state("tab1");
  let dropdownOpen = $state(false);
  let menuValue = $state("");
</script>

{#snippet dropdownTrigger()}
  <Button variant="outline" onclick={() => dropdownOpen = !dropdownOpen}>Open Dropdown</Button>
{/snippet}

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6);">
  <Heading depth={1}>Navigation</Heading>
  <Text size="lg" color="secondary">Tabs, Breadcrumbs, Menu, Dropdown, Accordion</Text>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Tabs</Heading>
    <Tabs bind:value={tabValue} tabs={[
      { value: "tab1", label: "Overview" },
      { value: "tab2", label: "Settings" },
      { value: "tab3", label: "Disabled", disabled: true },
    ]}>
      {#if tabValue === "tab1"}<Text size="sm">Overview content</Text>
      {:else if tabValue === "tab2"}<Text size="sm">Settings content</Text>
      {/if}
    </Tabs>
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Breadcrumbs</Heading>
    <Breadcrumbs items={[
      { label: "Home", href: "/" },
      { label: "Components" },
      { label: "Navigation" },
    ]} />
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Menu</Heading>
    <Menu items={[
      { label: "Edit", value: "edit" },
      { label: "Duplicate", value: "duplicate" },
      { label: "", value: "", divider: true },
      { label: "Delete", value: "delete", disabled: true },
    ]} onSelect={(v) => menuValue = v} />
    {#if menuValue}
      <Text size="sm" color="secondary">Selected: {menuValue}</Text>
    {/if}
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Dropdown</Heading>
    <Dropdown
      trigger={dropdownTrigger}
      open={dropdownOpen}
      items={[
        { label: "Profile", value: "profile" },
        { label: "Settings", value: "settings" },
        { label: "", value: "", divider: true },
        { label: "Logout", value: "logout" },
      ]}
      onSelect={(v) => { dropdownOpen = false; }}
    />
  </Card>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
    <Heading depth={2}>Accordion</Heading>
    <Accordion>
      <AccordionItem id="a1" title="Section 1">
        <Text size="sm">Content for section 1.</Text>
      </AccordionItem>
      <AccordionItem id="a2" title="Section 2">
        <Text size="sm">Content for section 2.</Text>
      </AccordionItem>
      <AccordionItem id="a3" title="Section 3">
        <Text size="sm">Content for section 3.</Text>
      </AccordionItem>
    </Accordion>
  </Card>
</Flex>
