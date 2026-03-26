<script lang="ts">
  import { page } from '$app/stores';

  interface Tab {
    id: string;
    label: string;
    href: string;
    count?: number;
  }

  interface Props {
    tabs: Tab[];
  }

  let { tabs }: Props = $props();

  const currentPath = $derived($page.url.pathname);

  function isActive(tab: Tab): boolean {
    if (tab.href === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(tab.href);
  }
</script>

<div class="border-b border-slate-200 dark:border-slate-700">
  <nav class="-mb-px flex space-x-1 sm:space-x-2 overflow-x-auto" aria-label="Admin tabs">
    {#each tabs as tab}
      <a
        href={tab.href}
        class="
          relative whitespace-nowrap py-3 px-3 sm:px-4 text-sm font-medium transition-colors
          {isActive(tab)
            ? 'text-accent border-b-2 border-accent'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-b-2 border-transparent'}
        "
        aria-current={isActive(tab) ? 'page' : undefined}
      >
        <span class="flex items-center gap-2">
          {tab.label}
          {#if tab.count !== undefined && tab.count > 0}
            <span class="
              px-2 py-0.5 text-xs rounded-full
              {isActive(tab)
                ? 'bg-accent/10 text-accent'
                : 'bg-semantic-danger/10 text-semantic-danger-dark dark:text-semantic-danger-light'}
            ">
              {tab.count}
            </span>
          {/if}
        </span>
      </a>
    {/each}
  </nav>
</div>
