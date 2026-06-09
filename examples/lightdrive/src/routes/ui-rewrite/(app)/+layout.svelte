<script lang="ts">
  import { page } from "$app/stores";

  let { data, children }: { data: { user: { id: string; name: string; email: string } | null }; children: import("svelte").Snippet } = $props();
  let user = $derived(data.user);

  let userMenuOpen = $state(false);

  function getInitials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }

  const links = [
    { href: "/ui-rewrite/drive", label: "Drive" },
    { href: "/ui-rewrite/dashboard", label: "Dashboard" },
  ];
</script>

<input type="checkbox" id="mobile-menu-toggle" class="mobile-menu-checkbox" />
<div class="app-shell">
  <header class="app-header">
    <a href="/ui-rewrite/drive" class="logo">LightDrive</a>

    <nav class="desktop-nav">
      <ul>
        {#each links as { href, label }}
          <li>
            <a href={href} class:active={$page.url.pathname.startsWith(href)}>{label}</a>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="header-spacer"></div>

    <div class="desktop-user">
      {#if user}
        <div class="user-menu">
          <button
            class="user-btn"
            onclick={() => userMenuOpen = !userMenuOpen}
            onblur={() => setTimeout(() => userMenuOpen = false, 150)}
          >
            <span class="avatar-inline">{getInitials(user.name)}</span>
            <span class="user-name">{user.name}</span>
          </button>
          {#if userMenuOpen}
            <nav class="user-dropdown">
              <ul>
                <li><a href="/ui-rewrite/account" onclick={() => userMenuOpen = false}>Account</a></li>
                <li><a href="/ui-rewrite/account/preferences" onclick={() => userMenuOpen = false}>Preferences</a></li>
                <li><a href="/ui-rewrite/account/shares" onclick={() => userMenuOpen = false}>Share Links</a></li>
                <li>
                  <form action="/api/auth/logout" method="POST" onsubmit={() => userMenuOpen = false}>
                    <button type="submit">Sign Out</button>
                  </form>
                </li>
              </ul>
            </nav>
          {/if}
        </div>
      {:else}
        <a href="/ui-rewrite/auth" class="sign-in-link">Sign In</a>
      {/if}
    </div>

    <label class="burger-label" for="mobile-menu-toggle" aria-label="Menu">&#9776;</label>
  </header>

  <div class="app-content">
    <div class="mobile-overlay">
      <label class="mobile-overlay-close" for="mobile-menu-toggle"></label>
      <nav class="mobile-menu">
        <ul>
          {#each links as { href, label }}
            <li>
              <a href={href} onclick={() => { const cb = document.getElementById('mobile-menu-toggle') as HTMLInputElement; if (cb) cb.checked = false; }}>
                {label}
              </a>
            </li>
          {/each}
        </ul>
        {#if user}
          <hr />
          <div class="mobile-user-info">
            <span class="avatar-large">{getInitials(user.name)}</span>
            <div>
              <span class="mobile-user-name">{user.name}</span>
              <span class="mobile-user-email">{user.email}</span>
            </div>
          </div>
          <ul>
            <li><a href="/ui-rewrite/account" onclick={() => { const cb = document.getElementById('mobile-menu-toggle') as HTMLInputElement; if (cb) cb.checked = false; }}>Account</a></li>
            <li><a href="/ui-rewrite/account/preferences" onclick={() => { const cb = document.getElementById('mobile-menu-toggle') as HTMLInputElement; if (cb) cb.checked = false; }}>Preferences</a></li>
            <li><a href="/ui-rewrite/account/shares" onclick={() => { const cb = document.getElementById('mobile-menu-toggle') as HTMLInputElement; if (cb) cb.checked = false; }}>Share Links</a></li>
            <li>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" onclick={() => { const cb = document.getElementById('mobile-menu-toggle') as HTMLInputElement; if (cb) cb.checked = false; }}>Sign Out</button>
              </form>
            </li>
          </ul>
        {:else}
          <hr />
          <ul>
            <li><a href="/ui-rewrite/auth" onclick={() => { const cb = document.getElementById('mobile-menu-toggle') as HTMLInputElement; if (cb) cb.checked = false; }}>Sign In</a></li>
          </ul>
        {/if}
      </nav>
    </div>
    <main class="app-main">
      {@render children()}
    </main>
  </div>
</div>

<style>
  .app-shell { display: flex; flex-direction: column; height: 100dvh; }
  .app-header { display: flex; align-items: center; padding: 8px 16px; flex-shrink: 0; }
  .app-content { flex: 1; position: relative; min-height: 0; }
  .app-main { position: absolute; inset: 0; overflow-y: auto; }
  .logo { text-decoration: none; }
  nav ul { list-style: none; margin: 0; padding: 0; display: flex; }
  nav li { margin: 0; }
  .desktop-nav a { text-decoration: none; }
  .header-spacer { flex: 1; }
  .desktop-user { display: flex; align-items: center; }
  .user-menu { position: relative; }
  .user-btn { display: flex; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; }
  .user-dropdown { position: absolute; right: 0; top: 100%; margin-top: 4px; min-width: 140px; z-index: 100; }
  .user-dropdown ul { flex-direction: column; }
  .user-dropdown a, .user-dropdown button { display: block; width: 100%; text-align: left; padding: 8px 12px; background: none; border: none; cursor: pointer; text-decoration: none; }
  .user-name { }
  .sign-in-link { }

  .burger-label { display: none; cursor: pointer; }
  .mobile-menu-checkbox { display: none; position: absolute; opacity: 0; width: 0; height: 0; }

  .mobile-overlay { display: none; position: absolute; inset: 0; z-index: 50; flex-direction: column; }
  #mobile-menu-toggle:checked ~ .app-shell .mobile-overlay { display: flex; }
  .mobile-overlay-close { position: absolute; inset: 0; cursor: default; }
  .mobile-menu { position: relative; z-index: 1; padding: 16px; overflow-y: auto; }
  .mobile-menu ul { flex-direction: column; gap: 4px; }
  .mobile-menu a, .mobile-menu button { display: flex; align-items: center; gap: 12px; padding: 14px 12px; text-decoration: none; background: none; border: none; cursor: pointer; text-align: left; width: 100%; }
  .mobile-user-info { display: flex; align-items: center; gap: 12px; padding: 12px; }
  .mobile-user-name { }
  .mobile-user-email { }
  hr { margin: 8px 0; }

  .avatar-inline, .avatar-large { }

  @media (max-width: 768px) {
    .desktop-nav { display: none; }
    .desktop-user { display: none; }
    .burger-label { display: block; }
  }
</style>
