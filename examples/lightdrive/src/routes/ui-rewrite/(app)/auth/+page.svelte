<script lang="ts">
  import { goto } from "$app/navigation";

  let tab = $state("login");
  let errorMessage = $state("");
  let showError = $state(false);

  async function handleLogin(e: SubmitEvent) {
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const email = fd.get("l-email");
    const password = fd.get("l-password");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) goto("/ui-rewrite/drive");
    else { const r = await res.json(); errorMessage = r.error; showError = true; }
  }

  async function handleSignup(e: SubmitEvent) {
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const name = fd.get("s-name");
    const email = fd.get("s-email");
    const password = fd.get("s-password");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) goto("/ui-rewrite/drive");
    else { const r = await res.json(); errorMessage = r.error; showError = true; }
  }
</script>

<div class="auth-page">
  <div class="auth-container">
    <div class="auth-header">
      <h1>Welcome</h1>
      <p>Sign in or create an account</p>
    </div>

    <div class="auth-card">
      <div class="tabs">
        <button class="tab" class:active={tab === "login"} onclick={() => tab = "login"}>Sign In</button>
        <button class="tab" class:active={tab === "signup"} onclick={() => tab = "signup"}>Sign Up</button>
      </div>

      {#if tab === "login"}
        <form class="auth-form" onsubmit={handleLogin}>
          <div class="field">
            <label for="l-email">Email</label>
            <input id="l-email" name="l-email" type="email" placeholder="you@example.com" required />
          </div>
          <div class="field">
            <label for="l-password">Password</label>
            <input id="l-password" name="l-password" type="password" placeholder="Enter password" required />
          </div>
          <button type="submit" class="btn-primary">Sign In</button>
        </form>
      {:else}
        <form class="auth-form" onsubmit={handleSignup}>
          <div class="field">
            <label for="s-name">Full Name</label>
            <input id="s-name" name="s-name" placeholder="Jane Doe" required />
          </div>
          <div class="field">
            <label for="s-email">Email</label>
            <input id="s-email" name="s-email" type="email" placeholder="you@example.com" required />
          </div>
          <div class="field">
            <label for="s-password">Password</label>
            <input id="s-password" name="s-password" type="password" placeholder="Create a password" required />
          </div>
          <button type="submit" class="btn-primary">Create Account</button>
        </form>
      {/if}
    </div>
  </div>
</div>

{#if showError}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="modal-overlay" role="button" tabindex="0" onclick={() => showError = false}>
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
      <h2>Error</h2>
      <p>{errorMessage}</p>
      <button class="btn-primary" onclick={() => showError = false}>OK</button>
    </div>
  </div>
{/if}
