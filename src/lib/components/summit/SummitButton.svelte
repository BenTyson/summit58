<script lang="ts">
  import type { UserSummit } from '$lib/server/summits';

  interface Props {
    summits: UserSummit[];
    isLoggedIn: boolean;
    onLogSummit: () => void;
  }

  let { summits, isLoggedIn, onLogSummit }: Props = $props();

  const hasSummited = $derived(summits.length > 0);
  const summitCount = $derived(summits.length);
  const latestSummit = $derived(summits[0]);

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
</script>

{#if !isLoggedIn}
  <a
    href="/auth"
    class="
      inline-flex items-center gap-2 rounded-lg
      border border-slate-200 dark:border-slate-600
      bg-white dark:bg-slate-800
      px-4 py-2
      text-sm font-medium text-slate-600 dark:text-slate-300
      hover:border-sunrise hover:text-sunrise
      transition-colors
    "
  >
    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
    Log in to track
  </a>
{:else if hasSummited}
  <button
    onclick={onLogSummit}
    class="
      group inline-flex items-center gap-2 rounded-lg
      border border-emerald-200 dark:border-emerald-700
      bg-emerald-50 dark:bg-emerald-900/30
      px-4 py-2
      text-sm font-medium text-emerald-700 dark:text-emerald-300
      hover:bg-emerald-100 dark:hover:bg-emerald-900/50
      hover:border-emerald-300 dark:hover:border-emerald-600
      transition-all
    "
  >
    <svg class="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>
    <span class="flex flex-col items-start leading-tight">
      <span>
        Summited{#if summitCount > 1} {summitCount}x{/if}
      </span>
      <span class="text-xs text-emerald-600 dark:text-emerald-400">
        {formatDate(latestSummit.date_summited)}
      </span>
    </span>
    <svg
      class="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  </button>
{:else}
  <button
    onclick={onLogSummit}
    class="
      inline-flex items-center gap-2 rounded-lg
      bg-gradient-to-r from-sunrise to-sunrise-coral
      px-4 py-2
      text-sm font-medium text-white
      hover:from-sunrise-coral hover:to-sunrise
      shadow-md hover:shadow-lg
      transition-all duration-300
      hover:scale-105
    "
  >
    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
    Log Summit
  </button>
{/if}
