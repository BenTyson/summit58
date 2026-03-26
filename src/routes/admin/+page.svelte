<script lang="ts">
  import StatCard from '$lib/components/admin/StatCard.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const stats = $derived(data.stats);
  const pendingTotal = $derived(stats.pendingFlags + stats.flaggedImages);
</script>

<svelte:head>
  <title>Overview | Admin | SaltGoat</title>
</svelte:head>

<!-- Key Metrics -->
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard label="Total Users" value={stats.totalUsers} />
  <StatCard label="Active (7d)" value={stats.activeUsers7d} variant="success" />
  <StatCard label="Pro Subscribers" value={stats.proSubscribers} variant="accent" />
  <StatCard
    label="Pending Moderation"
    value={pendingTotal}
    variant={pendingTotal > 0 ? 'danger' : 'default'}
    href={pendingTotal > 0 ? '/admin/moderation' : undefined}
  />
</div>

<!-- Platform Totals -->
<div class="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard label="Summits Logged" value={stats.totalSummits.toLocaleString()} />
  <StatCard label="Reviews" value={stats.totalReviews.toLocaleString()} />
  <StatCard label="Photos" value={stats.totalPhotos.toLocaleString()} />
  <StatCard label="Trail Reports" value={stats.totalTrailReports.toLocaleString()} />
</div>

<!-- Alerts + Recent Signups -->
<div class="mt-8 grid gap-6 lg:grid-cols-2">
  <!-- Alerts -->
  {#if pendingTotal > 0}
    <div class="rounded-xl border border-semantic-danger/20 bg-semantic-danger/5 dark:bg-semantic-danger/10 p-5">
      <h2 class="text-sm font-semibold text-semantic-danger-dark dark:text-semantic-danger-light mb-3 flex items-center gap-2">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        Needs Attention
      </h2>
      <div class="space-y-2">
        {#if stats.flaggedImages > 0}
          <a href="/admin/moderation" class="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
            <span class="text-sm text-slate-700 dark:text-slate-300">{stats.flaggedImages} flagged {stats.flaggedImages === 1 ? 'photo' : 'photos'}</span>
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        {/if}
        {#if stats.pendingFlags > 0}
          <a href="/admin/moderation" class="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
            <span class="text-sm text-slate-700 dark:text-slate-300">{stats.pendingFlags} pending content {stats.pendingFlags === 1 ? 'flag' : 'flags'}</span>
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Recent Signups -->
  <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-card {pendingTotal === 0 ? 'lg:col-span-2' : ''}">
    <h2 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">Recent Signups</h2>
    {#if stats.recentSignups.length === 0}
      <p class="text-sm text-slate-500 dark:text-slate-400">No users yet.</p>
    {:else}
      <div class="divide-y divide-slate-100 dark:divide-slate-700">
        {#each stats.recentSignups as user}
          <div class="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <div class="flex items-center gap-3">
              <div class="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400">
                {(user.display_name ?? user.username ?? '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <a href="/users/{user.username ?? user.id}" class="text-sm font-medium text-slate-900 dark:text-white hover:text-accent transition-colors">
                  {user.display_name ?? user.username ?? 'Anonymous'}
                </a>
                {#if user.username}
                  <p class="text-xs text-slate-400 dark:text-slate-500">@{user.username}</p>
                {/if}
              </div>
            </div>
            <span class="text-xs text-slate-400 dark:text-slate-500">
              {#if user.created_at}
                {new Date(user.created_at).toLocaleDateString()}
              {/if}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
