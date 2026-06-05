<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Card from "$lib/components/card.svelte";
  import Checkbox from "$lib/components/checkbox.svelte";
  import Field from "$lib/components/field.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Form from "$lib/components/form.svelte";
  import Grid from "$lib/components/grid.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Input from "$lib/components/input.svelte";
  import Radio from "$lib/components/radio.svelte";
  import Select from "$lib/components/select.svelte";
  import Slider from "$lib/components/slider.svelte";
  import Text from "$lib/components/text.svelte";
  import Textarea from "$lib/components/textarea.svelte";
  import Toggle from "$lib/components/toggle.svelte";
  import Code from "$lib/components/code.svelte";
  import { checked, email, matchesField, minLength, pipe, required } from "$lib/validators.js";

  let radioGroup = $state("");
  let submitted = $state(false);
</script>

<Flex direction="vertical" gap="var(--flew-spacing-6)" style="padding: var(--flew-spacing-6);">
  <Heading depth={1}>Form Controls</Heading>
  <Text size="lg" color="secondary">Input, Select, Textarea, Checkbox, Toggle, Radio, Slider, Field, Form, Button — all with reactive validation.</Text>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Form Example</Heading>
    <Text size="sm" color="secondary">All controls support <Code variant="inline">validate</Code> with <Code variant="inline">pipe()</Code>, cross-field rules, and <Code variant="inline">checked()</Code> for booleans.</Text>

    {#if submitted}
      <Text>Form submitted!</Text>
    {:else}
      <Form onSubmit={() => submitted = true}>
        <Flex direction="vertical" gap="var(--flew-spacing-4)">
          <Grid columns={2} gap="var(--flew-spacing-3)">
            <Input id="f-name" label="Name" required validate={required()} />
            <Input id="f-email" type="email" label="Email" required validate={pipe(required(), email())} />
          </Grid>

          <Select id="f-role" label="Role" required placeholder="Pick one..."
            options={[{ value: "dev", label: "Developer" }, { value: "designer", label: "Designer" }]}
            validate={required("Select a role")}
          />

          <Input id="f-pw" type="password" label="Password" required validate={pipe(required(), minLength(4))} />
          <Input id="f-confirm" type="password" label="Confirm" required validate={pipe(required(), matchesField("f-pw"))} />

          <Textarea id="f-bio" label="Bio" placeholder="Tell us about yourself..." validate={pipe(required(), minLength(10))} />

          <Field name="f-radio" label="Preference" required>
            <Flex gap="var(--flew-spacing-4)">
              <Radio value="a" name="f-radio" bind:group={radioGroup} label="Option A" />
              <Radio value="b" name="f-radio" bind:group={radioGroup} label="Option B" />
            </Flex>
          </Field>

          <Toggle id="f-toggle" label="Enable notifications" validate={checked()} />
          <Checkbox id="f-terms" label="I agree to the terms" validate={checked("You must agree")} />
        </Flex>

        {#snippet actions({ hasErrors })}
          <Flex gap="var(--flew-spacing-2)" justify="end" style="margin-top: var(--flew-spacing-2);">
            <Button variant="ghost" type="reset">Reset</Button>
            <Button variant="primary" type="submit" disabled={hasErrors}>Submit</Button>
          </Flex>
        {/snippet}
      </Form>
    {/if}
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Button</Heading>
    <Text size="sm" color="secondary">Primary, secondary, outline, ghost, and danger variants with sizes and loading state.</Text>
    <Flex direction="vertical" gap="var(--flew-spacing-3)">
      <Flex gap="var(--flew-spacing-2)" wrap>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </Flex>
      <Flex gap="var(--flew-spacing-2)" align="center">
        <Button size="xs">XS</Button>
        <Button size="sm">SM</Button>
        <Button size="md">MD</Button>
        <Button size="lg">LG</Button>
      </Flex>
      <Flex gap="var(--flew-spacing-2)" align="center">
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button icon variant="outline" aria-label="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </Button>
      </Flex>
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Slider</Heading>
    <Text size="sm" color="secondary">Range slider with min, max, step, label, and value display.</Text>
    <Flex direction="vertical" gap="var(--flew-spacing-4)">
      <Slider value={50} min={0} max={100} label="Volume" showValue />
      <Slider value={25} min={0} max={100} step={5} disabled label="Disabled" />
    </Flex>
  </Card>

  <Card variant="outlined" paddingSize="lg">
    <Heading depth={2}>Standalone Controls</Heading>
    <Flex direction="vertical" gap="var(--flew-spacing-4)">
      <Field name="s-name" label="Name">
        <Input id="s-name" placeholder="Enter name" />
      </Field>
      <Field name="s-select" label="Fruit">
        <Select id="s-select" options={[{ value: "a", label: "Apple" }, { value: "b", label: "Banana" }]} />
      </Field>
      <Field name="s-bio" label="Message">
        <Textarea id="s-bio" rows={2} placeholder="Write..." />
      </Field>
      <Checkbox id="s-check" label="Remember me" />
      <Toggle id="s-toggle" label="Dark mode" />
    </Flex>
  </Card>
</Flex>
