<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Card from "$lib/components/card.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Modal from "$lib/components/modal.svelte";
  import Text from "$lib/components/text.svelte";
  import Tooltip from "$lib/components/tooltip.svelte";

  let modalOpen = $state(false);
</script>

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6);">
  <Heading depth={1}>Overlay</Heading>
  <Text size="lg" color="secondary">Modal, Tooltip</Text>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Tooltip</Heading>
    <Flex gap="var(--flew-spacing-3)" wrap>
      <Tooltip text="Top tooltip" position="top">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip text="Bottom tooltip" position="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip text="Left tooltip" position="left">
        <Button variant="outline">Left</Button>
      </Tooltip>
      <Tooltip text="Right tooltip" position="right">
        <Button variant="outline">Right</Button>
      </Tooltip>
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Modal</Heading>
    <Button variant="primary" onclick={() => modalOpen = true}>Open Modal</Button>

    <Modal bind:open={modalOpen} title="Confirm Action" onClose={() => modalOpen = false}>
      <Text>Are you sure you want to proceed? This action cannot be undone.</Text>
      {#snippet footer()}
        <Flex gap="var(--flew-spacing-2)" justify="end">
          <Button variant="ghost" onclick={() => modalOpen = false}>Cancel</Button>
          <Button variant="primary" onclick={() => modalOpen = false}>Confirm</Button>
        </Flex>
      {/snippet}
    </Modal>
  </Card>
</Flex>
