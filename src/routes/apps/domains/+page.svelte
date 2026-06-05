<script lang="ts">
  import Badge from "$lib/components/badge.svelte";
  import Button from "$lib/components/button.svelte";
  import Card from "$lib/components/card.svelte";
  import Divider from "$lib/components/divider.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Input from "$lib/components/input.svelte";
  import Tabs from "$lib/components/tabs.svelte";
  import Text from "$lib/components/text.svelte";
  import { Globe, Search, Plus, ExternalLink } from "@lucide/svelte";

  let search = $state("");
  let activeTab = $state("domains");

  const domains = [
    { name: "example.com", status: "active", plan: "Free", ns: "earl.ns.cloudflare.com", records: 6 },
    { name: "myshop.dev", status: "active", plan: "Pro", ns: "nancy.ns.cloudflare.com", records: 12 },
    { name: "blog.io", status: "pending", plan: "Free", ns: "miguel.ns.cloudflare.com", records: 4 },
    { name: "old-project.xyz", status: "active", plan: "Business", ns: "olga.ns.cloudflare.com", records: 18 },
    { name: "test-app.com", status: "error", plan: "Free", ns: "trevor.ns.cloudflare.com", records: 3 },
  ];

  const dnsRecords = [
    { name: "example.com", type: "A", value: "192.0.2.1", ttl: "Auto", proxy: true },
    { name: "www", type: "CNAME", value: "example.com", ttl: "Auto", proxy: true },
    { name: "mail", type: "MX", value: "mail.example.com", ttl: "3600", proxy: false },
    { name: "blog", type: "CNAME", value: "blog.github.io", ttl: "Auto", proxy: false },
    { name: "_domainkey", type: "TXT", value: "v=DKIM1; k=rsa;", ttl: "Auto", proxy: false },
    { name: "@", type: "TXT", value: "v=spf1 include:_spf.mx.cloudflare.net ~all", ttl: "Auto", proxy: false },
  ];

  let filteredDomains = $derived.by(() =>
    domains.filter(d => d.name.includes((search ?? "").toLowerCase()))
  );

  function statusVariant(status: string) {
    if (status === "active") return "success" as const;
    if (status === "pending") return "warning" as const;
    return "error" as const;
  }

  function planVariant(plan: string) {
    if (plan === "Free") return "neutral" as const;
    if (plan === "Pro") return "primary" as const;
    return "info" as const;
  }
</script>

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6); max-width: 900px; margin: 0 auto;">
  <Heading depth={1} margin="none"><Globe size={24} /> Domains</Heading>

  <Tabs bind:value={activeTab} tabs={[
    { value: "domains", label: "Domains" },
    { value: "dns", label: "DNS Records" },
  ]}>
    {#if activeTab === "domains"}
      <Flex direction="vertical" gap="var(--flew-spacing-4)">
        <Flex gap="var(--flew-spacing-2)">
          <Input bind:value={search} placeholder="Search domains..." style="flex: 1;">
            {#snippet leading()}
              <Search size={14} />
            {/snippet}
          </Input>
          <Button variant="primary" stretch>
            <Plus size={16} /> Add Domain
          </Button>
        </Flex>

        <Flex direction="vertical">
          {#each filteredDomains as d}
            <Card variant="outlined">
              <Flex direction="vertical" gap="var(--flew-spacing-2)">
                <Flex align="center" gap="var(--flew-spacing-3)">
                  <Text weight="semibold">{d.name}</Text>
                  <Badge variant={statusVariant(d.status)} size="sm">{d.status}</Badge>
                  <Badge variant={planVariant(d.plan)} size="sm">{d.plan}</Badge>
                  <div style="flex: 1;"></div>
                  <Button variant="ghost" size="xs" icon aria-label="Manage">
                    <ExternalLink size={14} />
                  </Button>
                </Flex>
                <Flex gap="var(--flew-spacing-4)" style="margin-top: var(--flew-spacing-1);">
                  <Text size="xs" color="tertiary">NS: {d.ns}</Text>
                  <Text size="xs" color="tertiary">{d.records} records</Text>
                </Flex>
              </Flex>
            </Card>
          {:else}
            <Text color="tertiary" align="center">No domains found.</Text>
          {/each}
        </Flex>
      </Flex>
    {:else}
      <Flex direction="vertical" gap="var(--flew-spacing-3)">
        <Flex gap="var(--flew-spacing-2)">
          <Input placeholder="Search records..." style="flex: 1;">
            {#snippet leading()}
              <Search size={14} />
            {/snippet}
          </Input>
          <Button variant="primary" stretch><Plus size={16} /> Add Record</Button>
        </Flex>

        <Card variant="outlined" paddingSize="xs" style="padding: 0;">
          <table style="width: 100%; border-collapse: collapse; font-family: var(--flew-font-sans); font-size: var(--flew-font-size-sm);">
            <thead>
              <tr style="border-bottom: 1px solid var(--flew-color-border);">
                <th style="text-align: left; padding: var(--flew-spacing-2) var(--flew-spacing-3); color: var(--flew-color-text-secondary); font-weight: 500; font-size: var(--flew-font-size-xs);">Type</th>
                <th style="text-align: left; padding: var(--flew-spacing-2) var(--flew-spacing-3); color: var(--flew-color-text-secondary); font-weight: 500; font-size: var(--flew-font-size-xs);">Name</th>
                <th style="text-align: left; padding: var(--flew-spacing-2) var(--flew-spacing-3); color: var(--flew-color-text-secondary); font-weight: 500; font-size: var(--flew-font-size-xs);">Value</th>
                <th style="text-align: left; padding: var(--flew-spacing-2) var(--flew-spacing-3); color: var(--flew-color-text-secondary); font-weight: 500; font-size: var(--flew-font-size-xs);">TTL</th>
                <th style="text-align: left; padding: var(--flew-spacing-2) var(--flew-spacing-3); color: var(--flew-color-text-secondary); font-weight: 500; font-size: var(--flew-font-size-xs);">Proxy</th>
              </tr>
            </thead>
            <tbody>
              {#each dnsRecords as r}
                <tr style="border-bottom: 1px solid var(--flew-color-border);">
                  <td style="padding: var(--flew-spacing-2) var(--flew-spacing-3);"><Badge variant="info" size="sm">{r.type}</Badge></td>
                  <td style="padding: var(--flew-spacing-2) var(--flew-spacing-3);"><Text size="sm">{r.name}</Text></td>
                  <td style="padding: var(--flew-spacing-2) var(--flew-spacing-3);"><Text size="xs" color="secondary">{r.value}</Text></td>
                  <td style="padding: var(--flew-spacing-2) var(--flew-spacing-3);"><Text size="sm">{r.ttl}</Text></td>
                  <td style="padding: var(--flew-spacing-2) var(--flew-spacing-3);">
                    {#if r.proxy}
                      <Badge variant="success" size="sm">Proxied</Badge>
                    {:else}
                      <Badge variant="neutral" size="sm">DNS Only</Badge>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </Card>
      </Flex>
    {/if}
  </Tabs>
</Flex>
