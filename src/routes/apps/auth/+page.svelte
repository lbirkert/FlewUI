<script lang="ts">
  import Alert from "$lib/components/alert.svelte";
  import Button from "$lib/components/button.svelte";
  import Card from "$lib/components/card.svelte";
  import Checkbox from "$lib/components/checkbox.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Form from "$lib/components/form.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Input from "$lib/components/input.svelte";
  import Tabs from "$lib/components/tabs.svelte";
  import Text from "$lib/components/text.svelte";
  import {
    checked,
    email,
    matchesField,
    minLength,
    pipe,
    required,
  } from "$lib/validators.js";
  import { LogIn, Search } from "@lucide/svelte";

  let tab = $state("login");
  let submitted = $state(false);

  function handleLogin(_values: Record<string, any>) {
    submitted = true;
  }

  function handleSignup(_values: Record<string, any>) {
    submitted = true;
  }
</script>

<Flex
  direction="vertical"
  gap="var(--flew-spacing-6)"
  style="padding: var(--flew-spacing-6); max-width: 440px; margin: 0 auto;"
>
  <Flex direction="vertical" gap="var(--flew-spacing-1)" align="center">
    <LogIn size={28} />
    <Heading depth={1} margin="none">Welcome</Heading>
    <Text color="secondary">Sign in or create an account</Text>
  </Flex>

  <Card variant="outlined" paddingSize="lg">
    {#if submitted}
      <Alert variant="success" title="Success" closable>
        {tab === "login" ? "Logged in successfully!" : "Account created!"}
      </Alert>
      <div style="margin-top: var(--flew-spacing-3);">
        <Button variant="outline" onclick={() => (submitted = false)}
          >Back</Button
        >
      </div>
    {:else}
      <Tabs
        bind:value={tab}
        tabs={[
          { value: "login", label: "Login" },
          { value: "signup", label: "Sign Up" },
        ]}
      >
        {#if tab === "login"}
          <Form onSubmit={handleLogin}>
            <Flex direction="vertical" gap="var(--flew-spacing-3)">
              <Input
                placeholder="Enter email"
                id="l-email"
                type="email"
                label="Email"
                required
                validate={pipe(required(), email())}
              />
              <Input
                id="l-password"
                type="password"
                label="Password"
                placeholder="Enter password"
                required
                validate={pipe(required(), minLength(4))}
              />
              <Checkbox id="l-remember" label="Remember me" />
            </Flex>
            {#snippet actions({ hasErrors })}
              <Flex
                gap="var(--flew-spacing-2)"
                style="margin-top: var(--flew-spacing-2);"
              >
                <Button
                  variant="primary"
                  type="submit"
                  fullWidth
                  disabled={hasErrors}>Sign In</Button
                >
              </Flex>
            {/snippet}
          </Form>
        {:else}
          <Form onSubmit={handleSignup}>
            <Flex direction="vertical" gap="var(--flew-spacing-3)">
              <Input
                id="s-name"
                label="Full Name"
                placeholder="Enter full name"
                required
                validate={required()}
              />
              <Input
                id="s-email"
                type="email"
                label="Email"
                placeholder="Enter email"
                required
                validate={pipe(required(), email())}
              />
              <Input
                id="s-password"
                type="password"
                label="Password"
                placeholder="Create a password"
                required
                validate={pipe(
                  required(),
                  minLength(8, "At least 8 characters"),
                )}
              />
              <Input
                id="s-confirm"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                validate={pipe(required(), matchesField("s-password"))}
              />
              <Checkbox
                id="s-terms"
                label="I agree to the Terms"
                validate={checked("You must agree")}
                required
              />
            </Flex>
            {#snippet actions({ hasErrors })}
              <Flex
                gap="var(--flew-spacing-2)"
                style="margin-top: var(--flew-spacing-2);"
              >
                <Button
                  variant="primary"
                  type="submit"
                  fullWidth
                  disabled={hasErrors}>Create Account</Button
                >
              </Flex>
            {/snippet}
          </Form>
        {/if}
      </Tabs>
    {/if}
  </Card>

  <Text size="xs" color="tertiary" align="center">
    Demo app — no real data is sent anywhere.
  </Text>
</Flex>
