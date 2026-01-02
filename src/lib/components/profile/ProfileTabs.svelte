<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  interface Tab {
    id: string;
    label: string;
    count?: number;
    comingSoon?: boolean;
  }

  interface Props {
    tabs: Tab[];
    activeTab?: string;
    baseUrl?: string;
  }

  let { tabs, activeTab = 'overview', baseUrl = '' }: Props = $props();

  function handleTabClick(tabId: string) {
    const url = baseUrl ? `${baseUrl}?tab=${tabId}` : `?tab=${tabId}`;
    goto(url, { replaceState: true, noScroll: true });
  }
</script>

<div class="border-b border-slate-200 dark:border-slate-700">
  <nav class="-mb-px flex space-x-1 sm:space-x-2 overflow-x-auto px-4 sm:px-6 lg:px-8" aria-label="Tabs">
    {#each tabs as tab}
      <button
        onclick={() => handleTabClick(tab.id)}
        class="
          relative whitespace-nowrap py-3 px-3 sm:px-4 text-sm font-medium transition-colors
          {activeTab === tab.id
            ? 'text-sunrise border-b-2 border-sunrise'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-b-2 border-transparent'}
        "
        aria-current={activeTab === tab.id ? 'page' : undefined}
      >
        <span class="flex items-center gap-2">
          {tab.label}
          {#if tab.count !== undefined}
            <span class="
              px-2 py-0.5 text-xs rounded-full
              {activeTab === tab.id
                ? 'bg-sunrise/10 text-sunrise'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}
            ">
              {tab.count}
            </span>
          {/if}
          {#if tab.comingSoon}
            <span class="px-1.5 py-0.5 text-[10px] uppercase tracking-wide rounded bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
              Soon
            </span>
          {/if}
        </span>
      </button>
    {/each}
  </nav>
</div>
