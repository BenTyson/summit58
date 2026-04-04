<script lang="ts">
  interface Crumb {
    label: string;
    href?: string;
  }

  interface Props {
    crumbs: Crumb[];
  }

  let { crumbs }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
  <a href="/community" class="hover:text-accent dark:hover:text-accent-light transition-colors">
    Community
  </a>
  {#each crumbs as crumb}
    <svg class="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
    {#if crumb.href}
      <a href={crumb.href} class="hover:text-accent dark:hover:text-accent-light transition-colors truncate">
        {crumb.label}
      </a>
    {:else}
      <span class="text-slate-900 dark:text-white font-medium truncate">
        {crumb.label}
      </span>
    {/if}
  {/each}
</nav>
