<script lang="ts">
  type Crumb = { label: string; href?: string };

  type Props = {
    items: Crumb[];
    separator?: string;
  };

  let { items, separator = "/" }: Props = $props();
</script>

<nav class="breadcrumbs" aria-label="breadcrumb">
  <ol>
    {#each items as item, i}
      <li>
        {#if item.href && i < items.length - 1}
          <a href={item.href}>{item.label}</a>
        {:else}
          <span class="current" aria-current={i === items.length - 1 ? "page" : undefined}>
            {item.label}
          </span>
        {/if}
        {#if i < items.length - 1}
          <span class="sep" aria-hidden="true">{separator}</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  .breadcrumbs ol {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 0;
  }

  .breadcrumbs li {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .breadcrumbs a {
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-tertiary);
    text-decoration: none;
    transition: color var(--flew-transition-fast);
  }

  .breadcrumbs a:hover {
    color: var(--flew-color-primary);
  }

  .current {
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text);
  }

  .sep {
    font-family: var(--flew-font-sans);
    font-size: var(--flew-font-size-sm);
    color: var(--flew-color-text-tertiary);
    margin: 0 8px;
  }
</style>
