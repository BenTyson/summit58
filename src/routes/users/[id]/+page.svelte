<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import AchievementIcon from '$lib/components/ui/AchievementIcon.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const profile = $derived(data.profile);
  const stats = $derived(data.stats);
  const recentSummits = $derived(data.recentSummits);
  const achievements = $derived(data.achievements);
  const rangeStats = $derived(data.rangeStats);

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Sort ranges by count
  const sortedRanges = $derived(
    Object.entries(rangeStats).sort((a, b) => b[1] - a[1])
  );
</script>

<svelte:head>
  <title>{profile.display_name || 'Climber'} | Cairn58</title>
  <meta name="description" content="View {profile.display_name || 'this climber'}'s 14er progress on Cairn58." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
  <Container class="py-12">
    <!-- Profile Header -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
      <!-- Avatar -->
      {#if profile.avatar_url}
        <img
          src={profile.avatar_url}
          alt={profile.display_name}
          class="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
        />
      {:else}
        <div class="w-24 h-24 rounded-full bg-gradient-to-br from-sunrise to-sunrise-coral flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-slate-700 shadow-lg">
          {getInitials(profile.display_name || 'U')}
        </div>
      {/if}

      <!-- Name & Info -->
      <div class="text-center sm:text-left">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
          {profile.display_name || 'Anonymous Climber'}
        </h1>
        {#if profile.location}
          <p class="text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {profile.location}
          </p>
        {/if}
        {#if profile.bio}
          <p class="text-slate-600 dark:text-slate-300 mt-3 max-w-lg">
            {profile.bio}
          </p>
        {/if}

        <!-- Peak Bagger badge if completed all 58 -->
        {#if stats.uniquePeaks === 58}
          <div class="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-semibold shadow-md">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
            </svg>
            Peak Bagger
          </div>
        {/if}

        {#if data.isOwnProfile}
          <a
            href="/profile"
            class="inline-flex items-center gap-2 mt-4 text-sm text-sunrise hover:text-sunrise-coral transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </a>
        {/if}
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-card text-center">
        <div class="text-3xl font-bold text-sunrise">{stats.uniquePeaks}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Peaks Summited</div>
      </div>
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-card text-center">
        <div class="text-3xl font-bold text-mountain-blue dark:text-mountain-mist">{stats.progress.toFixed(0)}%</div>
        <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Progress</div>
      </div>
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-card text-center">
        <div class="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalSummits}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Summits</div>
      </div>
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-card text-center">
        <div class="text-3xl font-bold text-slate-900 dark:text-white">{achievements.length}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Achievements</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Achievements -->
        {#if achievements.length > 0}
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Achievements
              <span class="text-sm font-normal text-slate-500 dark:text-slate-400">
                ({achievements.length})
              </span>
            </h2>
            <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-card">
              <div class="flex flex-wrap gap-3">
                {#each achievements as achievement}
                  <div
                    class="
                      group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
                      bg-gradient-to-br from-sunrise/10 via-sunrise-coral/5 to-sunrise/10
                      border border-sunrise/20
                    "
                    title={achievement.definition.description}
                  >
                    <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-sunrise to-sunrise-coral shadow-sm">
                      <AchievementIcon icon={achievement.definition.icon} earned={true} class="text-white" />
                    </div>
                    <span class="font-medium text-slate-900 dark:text-white text-sm">{achievement.definition.title}</span>
                  </div>
                {/each}
              </div>
            </div>
          </section>
        {/if}

        <!-- Recent Summits -->
        {#if recentSummits.length > 0}
          <section>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Summits
            </h2>
            <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
              <div class="divide-y divide-slate-200 dark:divide-slate-700">
                {#each recentSummits as summit}
                  {@const peak = summit.peak as { name: string; slug: string; elevation: number; thumbnail_url: string | null }}
                  {@const route = summit.route as { name: string; difficulty_class: number } | null}
                  <a
                    href="/peaks/{peak.slug}"
                    class="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    {#if peak.thumbnail_url}
                      <img
                        src={peak.thumbnail_url}
                        alt={peak.name}
                        class="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                    {:else}
                      <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-mountain-blue to-mountain-mist flex items-center justify-center flex-shrink-0">
                        <svg class="h-7 w-7 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
                        </svg>
                      </div>
                    {/if}
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-slate-900 dark:text-white">{peak.name}</div>
                      <div class="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(summit.date_summited)}
                        {#if route}
                          <span class="mx-1.5">·</span>
                          {route.name}
                        {/if}
                      </div>
                    </div>
                    <svg class="h-5 w-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                {/each}
              </div>
            </div>
          </section>
        {/if}
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Progress by Range -->
        {#if sortedRanges.length > 0}
          <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-card">
            <h3 class="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Peaks by Range
            </h3>
            <div class="space-y-3">
              {#each sortedRanges as [range, count]}
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-300 truncate">{range}</span>
                  <span class="text-sm font-semibold text-slate-900 dark:text-white ml-2">{count}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Quick Stats -->
        <div class="rounded-xl bg-gradient-to-br from-sunrise/10 to-sunrise-coral/10 border border-sunrise/20 p-6">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-4">Quick Stats</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-600 dark:text-slate-400">Peaks Remaining</span>
              <span class="font-semibold text-slate-900 dark:text-white">{58 - stats.uniquePeaks}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600 dark:text-slate-400">Repeat Summits</span>
              <span class="font-semibold text-slate-900 dark:text-white">{stats.totalSummits - stats.uniquePeaks}</span>
            </div>
            {#if stats.uniquePeaks > 0}
              <div class="flex justify-between">
                <span class="text-slate-600 dark:text-slate-400">Avg Elevation</span>
                <span class="font-semibold text-slate-900 dark:text-white">{Math.round(stats.totalElevation / stats.uniquePeaks).toLocaleString()}'</span>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </Container>
</div>
