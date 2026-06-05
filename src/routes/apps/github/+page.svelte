<script lang="ts">
  import Avatar from "$lib/components/avatar.svelte";
  import Badge from "$lib/components/badge.svelte";
  import Button from "$lib/components/button.svelte";
  import Card from "$lib/components/card.svelte";
  import Divider from "$lib/components/divider.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Grid from "$lib/components/grid.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Input from "$lib/components/input.svelte";
  import Tag from "$lib/components/tag.svelte";
  import Text from "$lib/components/text.svelte";
  import { Code2, Star, GitFork, Users, MapPin, Link, Mail, Search } from "@lucide/svelte";

  const repos = [
    { name: "svelte-kit", desc: "The fastest way to build Svelte apps", lang: "TypeScript", stars: 18400, forks: 1200, updated: "2 days ago" },
    { name: "flewui", desc: "A Svelte 5 component library with reactive validation", lang: "TypeScript", stars: 890, forks: 43, updated: "5 days ago" },
    { name: "vite", desc: "Next generation frontend tooling", lang: "TypeScript", stars: 68000, forks: 6200, updated: "1 week ago" },
    { name: "rust-analyzer", desc: "A Rust compiler front-end for IDEs", lang: "Rust", stars: 14400, forks: 1200, updated: "2 weeks ago" },
    { name: "react", desc: "A declarative, efficient, and flexible JavaScript library", lang: "JavaScript", stars: 228000, forks: 46500, updated: "3 weeks ago" },
    { name: "tailwindcss", desc: "A utility-first CSS framework", lang: "CSS", stars: 84000, forks: 4200, updated: "1 month ago" },
  ];

  function langColor(lang: string): string {
    const colors: Record<string, string> = {
      TypeScript: "#3178c6",
      Rust: "#dea584",
      JavaScript: "#f1e05a",
      CSS: "#563d7c",
    };
    return colors[lang] || "#8b8b8b";
  }
</script>

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6); max-width: 960px; margin: 0 auto;">
  <Heading depth={1} margin="none" style="padding-bottom: var(--flew-spacing-2); border-bottom: 1px solid var(--flew-color-border); width: 100%;"><Code2 size={24} /> GitHub Profile</Heading>

  <Grid columns={3} gap="var(--flew-spacing-6)">
    <Flex direction="vertical" gap="var(--flew-spacing-4)">
      <Flex direction="vertical" gap="var(--flew-spacing-2)" align="center" style="text-align: center;">
        <Avatar size="xl" initials="JD" />
        <Flex direction="vertical" gap="0">
          <Heading depth={3}>Jane Doe</Heading>
          <Text color="secondary">janedoe</Text>
        </Flex>
        <Text size="sm">Full-stack developer passionate about Svelte, Rust, and building great developer tools.</Text>
        <Button variant="outline" fullWidth>Follow</Button>
      </Flex>

      <Flex direction="vertical" gap="var(--flew-spacing-2)">
        <Flex gap="var(--flew-spacing-2)" align="center">
          <Users size={14} />
          <Text size="sm">342 followers · 128 following</Text>
        </Flex>
        <Flex gap="var(--flew-spacing-2)" align="center">
          <MapPin size={14} />
          <Text size="sm">San Francisco, CA</Text>
        </Flex>
        <Flex gap="var(--flew-spacing-2)" align="center">
          <Link size={14} />
          <Text size="sm">janedoe.dev</Text>
        </Flex>
        <Flex gap="var(--flew-spacing-2)" align="center">
          <Mail size={14} />
          <Text size="sm">jane@example.com</Text>
        </Flex>
      </Flex>

      <Divider />

      <Text weight="semibold" size="sm">Achievements</Text>
      <Flex gap="var(--flew-spacing-1)" wrap>
        <Tag variant="primary" size="sm">⭐ Starstruck</Tag>
        <Tag variant="success" size="sm">🏆 Pair Extraordinaire</Tag>
        <Tag variant="info" size="sm">🚀 YOLO</Tag>
      </Flex>
    </Flex>

    <div style="grid-column: span 2;">
      <Flex direction="vertical" gap="var(--flew-spacing-4)">
        <Flex gap="var(--flew-spacing-2)">
          <Input placeholder="Find a repository..." style="flex: 1;">
            {#snippet leading()}
              <Search size={14} />
            {/snippet}
          </Input>
          <Button variant="primary" stretch>New</Button>
        </Flex>

        <Flex direction="vertical">
          {#each repos as r, i}
            <Flex direction="vertical" gap="var(--flew-spacing-2)" style="padding: var(--flew-spacing-4) 0;">
              <Flex align="center" gap="var(--flew-spacing-2)">
                <a href="/apps/github" style="text-decoration: none;">
                  <Text weight="semibold" color="primary">{r.name}</Text>
                </a>
                <Badge variant="neutral" size="sm">Public</Badge>
              </Flex>
              <Text size="sm" color="secondary">{r.desc}</Text>
              <Flex gap="var(--flew-spacing-4)" align="center">
                <Flex gap="var(--flew-spacing-1)" align="center">
                  <span style="width: 12px; height: 12px; border-radius: 50%; background: {langColor(r.lang)}; display: inline-block;"></span>
                  <Text size="xs" color="secondary">{r.lang}</Text>
                </Flex>
                <Flex gap="var(--flew-spacing-1)" align="center">
                  <Star size={14} />
                  <Text size="xs" color="secondary">{r.stars}</Text>
                </Flex>
                <Flex gap="var(--flew-spacing-1)" align="center">
                  <GitFork size={14} />
                  <Text size="xs" color="secondary">{r.forks}</Text>
                </Flex>
                <Text size="xs" color="tertiary">Updated {r.updated}</Text>
              </Flex>
            </Flex>
            {#if i < repos.length - 1}
              <Divider />
            {/if}
          {/each}
        </Flex>
      </Flex>
    </div>
  </Grid>
</Flex>
