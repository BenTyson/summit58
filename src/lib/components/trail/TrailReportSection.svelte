<script lang="ts">
  import type { Tables } from '$lib/types/database';
  import TrailReportForm from './TrailReportForm.svelte';
  import type { TrailReportFormData } from './TrailReportForm.svelte';
  import TrailReportCard from './TrailReportCard.svelte';

  type TrailReportWithProfile = Tables<'trail_reports'> & {
    profile: { display_name: string | null; avatar_url: string | null } | null;
  };

  interface Props {
    peakId: string;
    reports: TrailReportWithProfile[];
    isLoggedIn: boolean;
    onSubmit: (data: TrailReportFormData) => Promise<void>;
  }

  let { peakId, reports, isLoggedIn, onSubmit }: Props = $props();
</script>

<section class="mt-10 animate-fade-in-up" style="animation-delay: 325ms">
  <h2 class="heading-section text-slate-900 dark:text-white flex items-center gap-2 mb-4">
    <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
    Trail Reports
    {#if reports.length > 0}
      <span class="text-sm font-normal text-slate-500 dark:text-slate-400">
        ({reports.length} recent)
      </span>
    {/if}
  </h2>

  <!-- Report Form (logged in users) -->
  {#if isLoggedIn}
    <div class="mb-4">
      <TrailReportForm {peakId} {onSubmit} />
    </div>
  {:else}
    <div class="mb-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center">
      <p class="text-slate-600 dark:text-slate-400">
        <a href="/auth" class="text-sunrise hover:text-sunrise-coral font-medium">Sign in</a> to report trail conditions
      </p>
    </div>
  {/if}

  <!-- Reports List -->
  {#if reports.length > 0}
    <div class="space-y-3">
      {#each reports as report (report.id)}
        <TrailReportCard {report} />
      {/each}
    </div>
  {:else}
    <div class="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center">
      <svg class="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <p class="text-slate-500 dark:text-slate-400">
        No recent trail reports. Be the first to share conditions!
      </p>
    </div>
  {/if}
</section>
