<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Flex, Spinner, Text } from "flewui";

  onMount(() => {
    goto(`/app/drive/${$page.params.token}`, { replaceState: true });
  });
</script>

<Flex direction="column" align="center" justify="center" style="height: 100dvh;" gap="var(--flew-spacing-3)">
  <Spinner />
  <Text color="secondary">Redirecting...</Text>
</Flex>
