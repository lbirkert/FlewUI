<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Card from "$lib/components/card.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Grid from "$lib/components/grid.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Text from "$lib/components/text.svelte";
  import { CheckSquare, TrendingUp, LogIn, Globe, Code2 } from "@lucide/svelte";

  const apps = [
    { href: "/apps/todo", label: "Todo App", icon: CheckSquare, desc: "Full CRUD todo list with filters, completion toggle, and delete — all reactive state." },
    { href: "/apps/finance", label: "Finance Dashboard", icon: TrendingUp, desc: "Revenue chart, summary cards, and recent transactions list." },
    { href: "/apps/auth", label: "Login / Signup", icon: LogIn, desc: "Form validation demo with email, password rules, cross-field matching, and tabs." },
    { href: "/apps/domains", label: "Domains Dashboard", icon: Globe, desc: "Cloudflare-style domain list with search, DNS records, and status badges." },
    { href: "/apps/github", label: "GitHub Profile", icon: Code2, desc: "Profile header, repo cards, language tags, and star/ fork counts." },
  ];
</script>

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6); max-width: 800px; margin: 0 auto;">
  <Flex direction="vertical" gap="var(--flew-spacing-1)">
    <Heading depth={1}>Demo Apps</Heading>
    <Text size="lg" color="secondary">Working demo applications built with FlewUI components.</Text>
  </Flex>

  <Grid columns={2} gap="var(--flew-spacing-4)">
    {#each apps as { href, label, icon: Icon, desc }}
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
