<script lang="ts">
  import Avatar from "$lib/components/avatar.svelte";
  import Badge from "$lib/components/badge.svelte";
  import Card from "$lib/components/card.svelte";
  import Chart from "$lib/components/chart.svelte";
  import Divider from "$lib/components/divider.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Grid from "$lib/components/grid.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Text from "$lib/components/text.svelte";
  import { TrendingUp, TrendingDown, DollarSign, Wallet } from "@lucide/svelte";

  let revenueData = $state({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [28, 35, 31, 42, 48, 52],
        borderColor: "var(--flew-color-primary)",
        backgroundColor: "var(--flew-color-primary-bg)",
        tension: 0.3,
        fill: true,
      },
    ],
  });

  const transactions = [
    {
      id: 1,
      name: "Alice Chen",
      amount: "+$2,400.00",
      type: "incoming",
      status: "completed",
      initials: "AC",
    },
    {
      id: 2,
      name: "Stripe Payout",
      amount: "+$890.00",
      type: "incoming",
      status: "completed",
      initials: "SP",
    },
    {
      id: 3,
      name: "AWS Hosting",
      amount: "-$320.00",
      type: "outgoing",
      status: "completed",
      initials: "AW",
    },
    {
      id: 4,
      name: "GitHub Copilot",
      amount: "-$19.00",
      type: "outgoing",
      status: "pending",
      initials: "GC",
    },
    {
      id: 5,
      name: "Freelance Project",
      amount: "+$3,200.00",
      type: "incoming",
      status: "completed",
      initials: "FP",
    },
    {
      id: 6,
      name: "Office Supplies",
      amount: "-$145.00",
      type: "outgoing",
      status: "completed",
      initials: "OS",
    },
  ];
</script>

<Flex
  direction="vertical"
  gap="var(--flew-spacing-6)"
  style="padding: var(--flew-spacing-6); max-width: 900px; margin: 0 auto;"
>
  <Heading depth={1} margin="none"
    ><DollarSign size={24} /> Finance Dashboard</Heading
  >

  <Grid columns={3} gap="var(--flew-spacing-4)">
    <Card variant="outlined" paddingSize="lg">
      <Flex direction="vertical" gap="var(--flew-spacing-1)">
        <Text size="sm" color="tertiary" margin="none">Total Revenue</Text>
        <Heading depth={3}>$52,400</Heading>
        <Flex gap="var(--flew-spacing-1)" align="center">
          <TrendingUp size={14} color="var(--flew-color-success)" />
          <Text size="xs" color="success" margin="none">+12.5%</Text>
          <Text size="xs" color="tertiary" margin="none">vs last month</Text>
        </Flex>
      </Flex>
    </Card>
    <Card variant="outlined" paddingSize="lg">
      <Flex direction="vertical" gap="var(--flew-spacing-1)">
        <Text size="sm" color="tertiary" margin="none">Total Expenses</Text>
        <Heading depth={3}>$31,200</Heading>
        <Flex gap="var(--flew-spacing-1)" align="center">
          <TrendingDown size={14} color="var(--flew-color-error)" />
          <Text size="xs" color="error" margin="none">+3.2%</Text>
          <Text size="xs" color="tertiary" margin="none">vs last month</Text>
        </Flex>
      </Flex>
    </Card>
    <Card variant="outlined" paddingSize="lg">
      <Flex direction="vertical" gap="var(--flew-spacing-1)">
        <Text size="sm" color="tertiary" margin="none">Net Profit</Text>
        <Heading depth={3}>$21,200</Heading>
        <Flex gap="var(--flew-spacing-1)" align="center">
          <Wallet size={14} color="var(--flew-color-primary)" />
          <Text size="xs" color="primary" margin="none">+40.6%</Text>
          <Text size="xs" color="tertiary" margin="none">margin</Text>
        </Flex>
      </Flex>
    </Card>
  </Grid>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Revenue Overview</Heading>
    <Chart type="line" data={revenueData} height="350px" />
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Recent Transactions</Heading>
    <Flex direction="vertical">
      {#each transactions as t, i}
        <Flex
          gap="var(--flew-spacing-3)"
          align="center"
          style="padding: var(--flew-spacing-2) 0; align-items: center;"
        >
          <Avatar size="sm" initials={t.initials} />
          <div style="flex: 1; min-width: 0;">
            <Text size="sm" margin="none">
              {t.name}
              <Badge
                variant={t.status === "completed" ? "success" : "warning"}
                size="sm">{t.status}</Badge>
            </Text>
          </div>
          <Text
            size="sm"
            weight="semibold"
            color={t.type === "incoming" ? "success" : "error"}
          >
            {t.amount}
          </Text>
        </Flex>
        {#if i < transactions.length - 1}
          <Divider />
        {/if}
      {/each}
    </Flex>
  </Card>
</Flex>
