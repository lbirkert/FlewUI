<script lang="ts">
  import { Button, Card, Flex, Text } from "flewui";

  let { data } = $props();
</script>

<Flex direction="column" align="center" justify="center" style="flex: 1; padding: var(--flew-spacing-6);">
  <Card variant="outlined" paddingSize="lg" style="text-align: center;">
    <Text color="secondary">Sign in to access your drive.</Text>
    <a href="/app/auth"><Button variant="primary" style="margin-top: var(--flew-spacing-2);">Sign In</Button></a>
  </Card>
</Flex>
