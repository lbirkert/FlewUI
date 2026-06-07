<script lang="ts">
  import { page } from "$app/stores";
  import { Button, Flex, Text, Avatar } from "flewui";
  import "flewui/styles";
  import { Folder, BarChart3, LogIn, LogOut, User, Menu } from "@lucide/svelte";

  let { children, user: serverUser }: { children: import("svelte").Snippet; user: { id: string; name: string; email: string } | null } = $props();

  let user = $state<{ id: string; name: string; email: string } | null>(serverUser);
  let userMenuOpen = $state(false);
  let mobileMenuOpen = $state(false);

  import { onMount } from "svelte";
  onMount(async () => {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      const data = await res.json();
      user = data.user;
    }
    const onResize = () => { if (window.innerWidth > 768) mobileMenuOpen = false; };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  }

  const links = [
    { href: "/app/drive", label: "Drive", icon: Folder },
    { href: "/app/dashboard", label: "Dashboard", icon: BarChart3 },
  ];
</script>

<div class="app-shell">
  <header class="app-header">
    <Flex gap="var(--flew-spacing-3)" align="center">
      <a href="/" class="logo">
        <Folder size={20} />
        <Text weight="semibold">LightDrive</Text>
      </a>
      <!-- Desktop nav -->
      <nav class="desktop-nav">
        <Flex gap="var(--flew-spacing-1)">
          {#each links as { href, label, icon: Icon }}
            <a href={href} class="nav-link" class:active={$page.url.pathname.startsWith(href)}>
              <Icon size={14} /> <Text size="sm">{label}</Text>
            </a>
          {/each}
          {#if user}
            <a href="/app/account" class="nav-link" class:active={$page.url.pathname.startsWith("/app/account")}>
              <User size={14} /> <Text size="sm">Account</Text>
            </a>
          {/if}
        </Flex>
      </nav>
      <div style="flex: 1;"></div>
      <!-- Desktop user section -->
      <div class="desktop-nav">
        {#if user}
          <div class="user-menu">
            <button class="user-btn" onclick={() => userMenuOpen = !userMenuOpen} onblur={() => setTimeout(() => userMenuOpen = false, 150)}>
              <Avatar initials={getInitials(user.name)} size="sm" />
              <Text size="sm" color="secondary">{user.name}</Text>
            </button>
            {#if userMenuOpen}
              <div class="user-dropdown">
                <a href="/app/account" class="dropdown-item" onclick={() => userMenuOpen = false}>
                  <Text size="sm">Account</Text>
                </a>
                <button class="dropdown-item" onclick={async () => { userMenuOpen = false; await fetch("/api/auth/logout", { method: "POST" }); location.href = "/"; }}>
                  <Text size="sm"><LogOut size={14} /> Sign Out</Text>
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <a href="/app/auth">
            <Button variant="ghost" size="sm"><LogIn size={14} /> Sign In</Button>
          </a>
        {/if}
      </div>
      <!-- Mobile burger -->
      <button class="mobile-burger" onclick={() => mobileMenuOpen = !mobileMenuOpen} aria-label="Menu">
        <Menu size={22} />
      </button>
    </Flex>
  </header>

  <div class="app-content">
    {#if mobileMenuOpen}
      <div class="mobile-overlay" onclick={() => mobileMenuOpen = false}>
        <div class="mobile-menu-items" onclick={(e) => e.stopPropagation()}>
          {#each links as { href, label, icon: Icon }}
            <a href={href} class="mobile-nav-link" class:active={$page.url.pathname.startsWith(href)} onclick={() => mobileMenuOpen = false}>
              <Icon size={20} />
              <Text size="lg">{label}</Text>
            </a>
          {/each}
          {#if user}
            <a href="/app/account" class="mobile-nav-link" class:active={$page.url.pathname.startsWith("/app/account")} onclick={() => mobileMenuOpen = false}>
              <User size={20} />
              <Text size="lg">Account</Text>
            </a>
            <div class="mobile-divider"></div>
            <div class="mobile-user-info">
              <Avatar initials={getInitials(user.name)} size="md" />
              <div>
                <Text size="sm" weight="medium">{user.name}</Text>
                <Text size="xs" color="tertiary">{user.email}</Text>
              </div>
            </div>
            <button class="mobile-nav-link" onclick={async () => { mobileMenuOpen = false; await fetch("/api/auth/logout", { method: "POST" }); location.href = "/"; }}>
              <LogOut size={20} />
              <Text size="lg">Sign Out</Text>
            </button>
          {:else}
            <div class="mobile-divider"></div>
            <a href="/app/auth" class="mobile-nav-link" onclick={() => mobileMenuOpen = false}>
              <LogIn size={20} />
              <Text size="lg">Sign In</Text>
            </a>
          {/if}
        </div>
      </div>
    {/if}
    <main class="app-main">
      {@render children()}
    </main>
  </div>
</div>

<svelte:window onkeydown={(e) => { if (e.key === "Escape") mobileMenuOpen = false; }} />

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100dvh;
  }

  .app-header {
    border-bottom: 1px solid var(--flew-color-border);
    padding: 8px 16px;
    background: var(--flew-color-bg);
    flex-shrink: 0;
  }

  .app-content {
    flex: 1;
    position: relative;
    min-height: 0;
  }

  .app-main {
    position: absolute;
    inset: 0;
    overflow-y: auto;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: inherit;
  }

  nav {
    display: flex;
  }

  .nav-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-secondary);
    text-decoration: none;
    padding: 4px 10px;
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

  .user-menu {
    position: relative;
  }

  .user-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: var(--flew-radius-sm);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .user-btn:hover {
    background: var(--flew-color-bg-hover);
  }

  .user-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 4px;
    background: var(--flew-color-bg-overlay);
    border: 1px solid var(--flew-color-border);
    border-radius: var(--flew-radius-md);
    box-shadow: var(--flew-shadow-lg);
    min-width: 140px;
    z-index: 100;
    overflow: hidden;
  }

  .dropdown-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 8px 12px;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    transition: background var(--flew-transition-fast);
  }

  .dropdown-item:hover {
    background: var(--flew-color-bg-hover);
  }

  .mobile-burger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--flew-color-text);
    padding: 4px;
    border-radius: var(--flew-radius-sm);
  }

  .mobile-burger:hover {
    background: var(--flew-color-bg-hover);
  }

  .mobile-overlay {
    position: absolute;
    inset: 0;
    z-index: 50;
    background: var(--flew-color-bg);
    display: flex;
    flex-direction: column;
  }

  .mobile-menu-items {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    flex: 1;
    overflow-y: auto;
  }

  .mobile-nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 12px;
    border-radius: var(--flew-radius-md);
    text-decoration: none;
    color: var(--flew-color-text);
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    width: 100%;
    font-size: inherit;
    transition: background var(--flew-transition-fast);
  }

  .mobile-nav-link:hover,
  .mobile-nav-link.active {
    background: var(--flew-color-bg-hover);
  }

  .mobile-divider {
    height: 1px;
    background: var(--flew-color-border);
    margin: 8px 0;
  }

  .mobile-user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
  }

  @media (max-width: 768px) {
    .desktop-nav {
      display: none !important;
    }
    .mobile-burger {
      display: block;
    }
  }
</style>
