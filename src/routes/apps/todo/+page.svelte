<script lang="ts">
  import Badge from "$lib/components/badge.svelte";
  import Button from "$lib/components/button.svelte";
  import Card from "$lib/components/card.svelte";
  import Checkbox from "$lib/components/checkbox.svelte";
  import Flex from "$lib/components/flex.svelte";
  import Heading from "$lib/components/heading.svelte";
  import Input from "$lib/components/input.svelte";
  import Text from "$lib/components/text.svelte";
  import { Trash2, Plus, ListTodo } from "@lucide/svelte";

  type Todo = { id: number; text: string; done: boolean };

  let todos = $state<Todo[]>([
    { id: 1, text: "Learn Svelte 5 runes", done: true },
    { id: 2, text: "Build a component library", done: false },
    { id: 3, text: "Write documentation", done: false },
  ]);
  let newText = $state("");
  let filter = $state<"all" | "active" | "completed">("all");
  let nextId = $state(4);

  let filtered = $derived.by(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "completed") return todos.filter((t) => t.done);
    return todos;
  });

  function addTodo() {
    const text = (newText ?? "").trim();
    if (!text) return;
    todos = [...todos, { id: nextId++, text, done: false }];
    newText = "";
  }

  function toggleTodo(id: number) {
    todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  }

  function deleteTodo(id: number) {
    todos = todos.filter((t) => t.id !== id);
  }

  let activeCount = $derived(todos.filter((t) => !t.done).length);
  let doneCount = $derived(todos.filter((t) => t.done).length);
</script>

<Flex
  direction="vertical"
  gap="var(--flew-spacing-6)"
  style="padding: var(--flew-spacing-6); max-width: 600px; margin: 0 auto;"
>
  <Heading depth={1} margin="none"><ListTodo size={24} /> Todo</Heading>

  <Flex gap="var(--flew-spacing-2)">
    <Input
      bind:value={newText}
      placeholder="Add a new task..."
      onkeydown={(e) => e.key === "Enter" && addTodo()}
      style="flex: 1;"
    />
    <Button
      variant="primary"
      stretch
      onclick={addTodo}
      disabled={!newText?.trim()}
    >
      <Plus size={16} /> Add
    </Button>
  </Flex>

  <Flex gap="var(--flew-spacing-2)" style="margin-top: var(--flew-spacing-2);">
    {#each ["all", "active", "completed"] as f}
      <Button
        variant={filter === f ? "primary" : "ghost"}
        size="sm"
        onclick={() => (filter = f as typeof filter)}
      >
        {f.charAt(0).toUpperCase() + f.slice(1)}
      </Button>
    {/each}
    <div style="flex: 1;"></div>
    <Text size="sm" color="secondary"
      >{activeCount} active, {doneCount} done</Text
    >
  </Flex>

  <Flex direction="vertical" gap="var(--flew-spacing-2)">
    {#each filtered as todo (todo.id)}
      <Card variant="filled" paddingSize="xs">
        <Flex gap="var(--flew-spacing-2)" align="center">
          <Checkbox checked={todo.done} onchange={() => toggleTodo(todo.id)} />
          <Text
            style={todo.done
              ? "text-decoration: line-through; opacity: 0.6;"
              : ""}
          >
            {todo.text}
          </Text>
          <div style="flex: 1;"></div>
          {#if todo.done}
            <Badge variant="success" size="sm">Done</Badge>
          {:else}
            <Badge variant="info" size="sm">Active</Badge>
          {/if}
          <Button
            variant="ghost"
            icon
            size="xs"
            onclick={() => deleteTodo(todo.id)}
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </Button>
        </Flex>
      </Card>
    {:else}
      <Text color="tertiary" align="center">No tasks yet — add one above!</Text>
    {/each}
  </Flex>
</Flex>
