<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const leaderboard = $derived(data.leaderboard);
  const stats = $derived(data.stats);
  const recentActivity = $derived(data.recentActivity);

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  function getRankStyle(rank: number): string {
    if (rank === 1) return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  }
</script>

<svelte:head>
  <title>Leaderboard | Summit58</title>
  <meta name="description" content="See who's leading the charge to summit all 58 Colorado 14ers. Track your rank among fellow peak baggers." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
  <Container class="py-12">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="heading-page text-slate-900 dark:text-white flex items-center gap-3">
        <svg class="h-8 w-8 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        Leaderboard
      </h1>
      <p class="text-slate-600 dark:text-slate-400 mt-2">
        The race to summit all 58 Colorado 14ers
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-card text-center">
        <div class="text-3xl font-bold text-sunrise">{stats.totalClimbers}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Active Climbers</div>
      </div>
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-card text-center">
        <div class="text-3xl font-bold text-mountain-blue dark:text-mountain-mist">{stats.totalSummitsLogged.toLocaleString()}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Summits Logged</div>
      </div>
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-card text-center">
        <div class="text-3xl font-bold text-slate-900 dark:text-white">{stats.peakBaggers}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Peak Baggers</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Leaderboard Table -->
      <div class="lg:col-span-2">
        <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
          <!-- Table Header -->
          <div class="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div class="col-span-1 text-center">Rank</div>
            <div class="col-span-5">Climber</div>
            <div class="col-span-2 text-center">Peaks</div>
            <div class="col-span-2 text-center">Progress</div>
            <div class="col-span-2 text-right">Last Summit</div>
          </div>

          <!-- Table Body -->
          {#if leaderboard.length > 0}
            <div class="divide-y divide-slate-200 dark:divide-slate-700">
              {#each leaderboard as entry, index}
                <a
                  href="/users/{entry.userId}"
                  class="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors {index < 3 ? 'bg-gradient-to-r from-transparent via-sunrise/5 to-transparent' : ''}"
                >
                  <!-- Rank -->
                  <div class="col-span-1 flex justify-center">
                    <span class="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold {getRankStyle(entry.rank)}">
                      {entry.rank}
                    </span>
                  </div>

                  <!-- Climber -->
                  <div class="col-span-5">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-mountain-blue to-mountain-mist flex items-center justify-center text-white text-sm font-bold">
                        {entry.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div class="font-medium text-slate-900 dark:text-white text-sm group-hover:text-sunrise transition-colors">
                          {entry.displayName}
                        </div>
                        {#if entry.uniquePeaks === 58}
                          <div class="text-xs text-sunrise font-medium flex items-center gap-1">
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L2 22h20L12 2z" />
                            </svg>
                            Peak Bagger
                          </div>
                        {:else if entry.totalSummits > entry.uniquePeaks}
                          <div class="text-xs text-slate-500 dark:text-slate-400">
                            {entry.totalSummits} total summits
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>

                  <!-- Peaks -->
                  <div class="col-span-2 text-center">
                    <span class="text-lg font-bold text-slate-900 dark:text-white">{entry.uniquePeaks}</span>
                    <span class="text-slate-400 dark:text-slate-500">/58</span>
                  </div>

                  <!-- Progress -->
                  <div class="col-span-2">
                    <div class="flex items-center gap-2">
                      <div class="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                        <div
                          class="h-full rounded-full bg-gradient-to-r from-sunrise to-sunrise-coral transition-all"
                          style="width: {entry.progress}%"
                        ></div>
                      </div>
                      <span class="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums w-10 text-right">
                        {entry.progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <!-- Last Summit -->
                  <div class="col-span-2 text-right text-sm text-slate-500 dark:text-slate-400">
                    {entry.lastSummitDate ? formatDate(entry.lastSummitDate) : '-'}
                  </div>
                </a>
              {/each}
            </div>
          {:else}
            <div class="p-12 text-center">
              <div class="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                <svg class="h-8 w-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">No climbers yet</h3>
              <p class="text-slate-500 dark:text-slate-400">
                Be the first to log a summit!
              </p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Recent Activity Sidebar -->
      <div>
        <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
          <div class="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <h2 class="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Recent Activity
            </h2>
          </div>

          {#if recentActivity.length > 0}
            <div class="divide-y divide-slate-200 dark:divide-slate-700">
              {#each recentActivity as activity}
                <div class="p-4">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-sunrise/20 to-sunrise-coral/20 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-sunrise" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 22h20L12 2z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-slate-900 dark:text-white">
                        <span class="font-medium">{activity.displayName}</span>
                        <span class="text-slate-500 dark:text-slate-400"> summited </span>
                        <a href="/peaks/{activity.peakSlug}" class="font-medium text-sunrise hover:text-sunrise-coral transition-colors">
                          {activity.peakName}
                        </a>
                      </p>
                      <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {formatDate(activity.dateSummited)}
                      </p>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              No recent activity
            </div>
          {/if}
        </div>

        <!-- Call to Action -->
        <div class="mt-6 rounded-xl bg-gradient-to-br from-sunrise/10 to-sunrise-coral/10 border border-sunrise/20 p-6 text-center">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-2">
            Join the Challenge
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Create an account to track your progress and compete with other climbers.
          </p>
          <a
            href="/auth"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sunrise to-sunrise-coral text-white font-medium text-sm hover:from-sunrise-coral hover:to-sunrise transition-all shadow-md hover:shadow-lg"
          >
            Get Started
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </Container>
</div>
