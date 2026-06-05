<script lang="ts">
  import "$lib/styles/tokens.css";
  import { ModeWatcher, toggleMode, mode } from "mode-watcher";
  import Text from "$lib/components/text.svelte";
  import Button from "$lib/components/button.svelte";
  import { page } from "$app/stores";
  import { ExternalLink, Sun, Moon } from "@lucide/svelte";

  let { children }: { children: import("svelte").Snippet } = $props();

  let links = [
    { href: "/", label: "Home" },
    { href: "/components", label: "Overview" },
    { href: "/components/typography", label: "Typography" },
    { href: "/components/form", label: "Form" },
    { href: "/components/layout", label: "Layout" },
    { href: "/components/feedback", label: "Feedback" },
    { href: "/components/navigation", label: "Nav" },
    { href: "/components/overlay", label: "Overlay" },
    { href: "/components/shell", label: "Shell" },
  ];
</script>

<div class="app-shell">
  <header class="app-header">
    <div class="app-header-inner">
      <a href="/" class="app-logo">
        <ExternalLink size={20} strokeWidth={2.5} />
        FlewUI
      </a>
      <ModeWatcher defaultMode="dark" />
      <nav class="app-nav">
        {#each links as link}
          <a
            href={link.href}
            class="nav-link"
            class:active={$page.url.pathname === link.href || ($page.url.pathname.startsWith(link.href) && link.href !== "/")}
          >
            {link.label}
          </a>
        {/each}
      </nav>
      <Button variant="ghost" icon size="sm" onclick={toggleMode} aria-label="Toggle theme">
        {#if mode.current === "dark"}
          <Sun size={14} />
        {:else}
          <Moon size={14} />
        {/if}
      </Button>
    </div>
  </header>
  <main class="app-main">
    {@render children()}
  </main>
</div>

<style>
  :global(*),
  :global(*::before),
  :global(*::after) {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  :global(body) {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: var(--flew-color-bg);
    color: var(--flew-color-text);
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .app-shell {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .app-header {
    flex-shrink: 0;
    height: 42px;
    background: var(--flew-color-bg-elevated);
    border-bottom: 1px solid var(--flew-color-border);
    display: flex;
    align-items: center;
    z-index: 100;
  }

  .app-header-inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-4);
    padding: 0 var(--flew-spacing-4);
  }

  .app-logo {
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-2);
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-base);
    font-weight: 700;
    color: var(--flew-color-text);
    text-decoration: none;
    white-space: nowrap;
  }

  .app-logo :global(.lucide) {
    color: var(--flew-color-primary);
  }

  .app-nav {
    display: flex;
    align-items: center;
    gap: var(--flew-spacing-3);
    overflow-x: auto;
    flex: 1;
  }

  .app-nav::-webkit-scrollbar {
    height: 0;
  }

  .nav-link {
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-sm);
    font-weight: 500;
    color: var(--flew-color-text-secondary);
    text-decoration: none;
    white-space: nowrap;
    padding: 4px 8px;
    border-radius: var(--flew-radius-sm);
    transition: all var(--flew-transition-fast);
  }

  .nav-link:hover {
    color: var(--flew-color-text);
    background: var(--flew-color-bg-hover);
  }

  .nav-link.active {
    color: var(--flew-color-text);
    background: var(--flew-color-bg-active);
  }

  .app-main {
    flex: 1;
    min-height: 0;
    display: flex;
  }

  .app-main > :global(*) {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
  }
</style>
