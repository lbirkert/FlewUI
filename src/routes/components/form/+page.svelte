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
  <Text size="lg" color="secondary">Input, Select, Textarea, Checkbox, Toggle, Radio, Field, Form — all with reactive validation.</Text>

  <Card variant="outlined" padding="var(--flew-spacing-5)">
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

  <Card variant="outlined" padding="var(--flew-spacing-5)">
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
