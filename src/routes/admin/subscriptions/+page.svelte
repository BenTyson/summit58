<script lang="ts">
  import StatCard from '$lib/components/admin/StatCard.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const metrics = $derived(data.metrics);
</script>

<svelte:head>
  <title>Subscriptions | Admin | SaltGoat</title>
</svelte:head>

<!-- Metrics -->
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <StatCard label="Pro Subscribers" value={metrics.totalPro} variant="accent" />
  <StatCard label="Free Users" value={metrics.totalFree} />
  <StatCard label="Conversion Rate" value="{metrics.conversionRate.toFixed(1)}%" variant={metrics.conversionRate > 5 ? 'success' : 'default'} />
  <StatCard
    label="Past Due"
    value={metrics.pastDueCount}
    variant={metrics.pastDueCount > 0 ? 'danger' : 'default'}
  />
</div>

<!-- Status Breakdown -->
<div class="mb-8">
  <h2 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">Status Breakdown</h2>
  <div class="flex flex-wrap gap-3">
    {#each [
      { label: 'Active', value: metrics.activeCount, color: 'bg-semantic-success/10 text-semantic-success-dark dark:text-semantic-success-light' },
      { label: 'Trialing', value: metrics.trialingCount, color: 'bg-accent/10 text-accent' },
      { label: 'Canceled', value: metrics.canceledCount, color: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400' },
      { label: 'Past Due', value: metrics.pastDueCount, color: 'bg-semantic-danger/10 text-semantic-danger-dark dark:text-semantic-danger-light' }
    ] as item}
      <div class="px-4 py-2 rounded-lg {item.color} text-sm font-medium">
        {item.label}: {item.value}
      </div>
    {/each}
  </div>
</div>

<!-- Subscriptions Table -->
<div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-card">
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
          <th class="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
          <th class="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Plan</th>
          <th class="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
          <th class="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Period End</th>
          <th class="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Created</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
        {#each metrics.subscriptions as sub}
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
            <td class="px-4 py-3">
              <a href="/users/{sub.username ?? sub.user_id}" class="font-medium text-slate-900 dark:text-white hover:text-accent transition-colors">
                {sub.display_name ?? sub.username ?? 'Unknown'}
              </a>
            </td>
            <td class="px-4 py-3">
              {#if sub.plan === 'pro'}
                <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">PRO</span>
              {:else}
                <span class="text-xs text-slate-400">{sub.plan}</span>
              {/if}
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded-full text-xs font-medium
                {sub.status === 'active' ? 'bg-semantic-success/10 text-semantic-success-dark dark:text-semantic-success-light' :
                 sub.status === 'past_due' ? 'bg-semantic-danger/10 text-semantic-danger-dark dark:text-semantic-danger-light' :
                 sub.status === 'trialing' ? 'bg-accent/10 text-accent' :
                 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}
              ">
                {sub.status ?? 'unknown'}
              </span>
            </td>
            <td class="px-4 py-3 text-right text-xs text-slate-400 dark:text-slate-500">
              {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : '--'}
            </td>
            <td class="px-4 py-3 text-right text-xs text-slate-400 dark:text-slate-500">
              {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : ''}
            </td>
          </tr>
        {/each}
        {#if metrics.subscriptions.length === 0}
          <tr>
            <td colspan="5" class="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
              No subscriptions yet.
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</div>
