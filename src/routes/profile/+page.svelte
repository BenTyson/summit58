<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import ProfileHeader from '$lib/components/profile/ProfileHeader.svelte';
  import ProfileTabs from '$lib/components/profile/ProfileTabs.svelte';
  import ProfileStats from '$lib/components/profile/ProfileStats.svelte';
  import EditProfileModal from '$lib/components/profile/EditProfileModal.svelte';
  import Achievements from '$lib/components/profile/Achievements.svelte';
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const profile = $derived(data.profile);
  const favoritePeak = $derived(data.favoritePeak);
  const peaksForSelector = $derived(data.peaksForSelector);
  const activeTab = $derived(data.activeTab);
  let isPublic = $state(data.profile?.is_public ?? true);
  let saving = $state(false);
  let editModalOpen = $state(false);

  const stats = $derived(data.summitStats);
  const allPeaks = $derived(data.allPeaks);
  const summitedPeaks = $derived(data.summitedPeaksMap);
  const rangeStats = $derived(data.rangeStats);
  const classStats = $derived(data.classStats);
  const peakClassMap = $derived(data.peakClassMap);
  const userAchievements = $derived(data.userAchievements);

  // Get supabase client from page store
  const supabase = $derived($page.data.supabase);

  // Tabs configuration
  const tabs = $derived([
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity', comingSoon: true },
    { id: 'photos', label: 'Photos', comingSoon: true },
    { id: 'trips', label: 'Trips', comingSoon: true },
    { id: 'buddies', label: 'Buddies', comingSoon: true }
  ]);

  // Quick stats for the stats bar
  const quickStats = $derived([
    { value: stats.uniquePeaks, label: 'Peaks' },
    { value: `${stats.progress.toFixed(0)}%`, label: 'Progress' },
    { value: stats.totalSummits, label: 'Summits' },
    { value: userAchievements.length, label: 'Badges' }
  ]);

  // Color map for difficulty classes
  const classColors: Record<number, string> = {
    1: 'bg-class-1',
    2: 'bg-class-2',
    3: 'bg-class-3',
    4: 'bg-class-4'
  };

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Get ranges sorted by summited count (descending)
  const sortedRanges = $derived(
    Object.entries(rangeStats)
      .sort((a, b) => b[1].summited - a[1].summited || b[1].total - a[1].total)
  );

  async function handleSaveProfile(updates: Record<string, unknown>) {
    if (!supabase || !profile) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    if (error) throw new Error(error.message);

    await invalidateAll();
  }
</script>

<svelte:head>
  <title>My Profile | Cairn58</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
  <!-- Profile Header -->
  {#if profile}
    <ProfileHeader
      {profile}
      {favoritePeak}
      isOwnProfile={true}
      onEditClick={() => editModalOpen = true}
    />
  {/if}

  <!-- Quick Stats Bar -->
  <ProfileStats stats={quickStats} />

  <!-- Tabs -->
  <ProfileTabs {tabs} {activeTab} baseUrl="/profile" />

  <!-- Tab Content -->
  <Container class="py-8">
    {#if activeTab === 'overview'}
      <!-- Settings Row -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Summit Progress</h2>

        <div class="flex items-center gap-4">
          <!-- Privacy Toggle -->
          <form
            method="POST"
            action="?/updatePrivacy"
            use:enhance={() => {
              saving = true;
              return async ({ update }) => {
                await update();
                saving = false;
              };
            }}
          >
            <input type="hidden" name="is_public" value={isPublic ? 'false' : 'true'} />
            <button
              type="submit"
              disabled={saving}
              class="flex items-center gap-3 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm"
              onclick={() => { isPublic = !isPublic; }}
            >
              <span class="text-slate-600 dark:text-slate-300">Public Profile</span>
              <div class="relative w-10 h-6 rounded-full transition-colors {isPublic ? 'bg-sunrise' : 'bg-slate-300 dark:bg-slate-600'}">
                <div class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform {isPublic ? 'translate-x-4' : 'translate-x-0'}"></div>
              </div>
            </button>
          </form>

          {#if isPublic && profile?.id}
            <a
              href="/users/{profile.id}"
              class="inline-flex items-center gap-2 text-sm text-sunrise hover:text-sunrise-coral transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Public Profile
            </a>
          {/if}
        </div>
      </div>

      <!-- Journey Stats -->
      {#if stats.totalSummits > 0}
        <div class="rounded-xl bg-gradient-to-br from-sunrise/5 to-sunrise-coral/5 border border-sunrise/20 p-6 mb-8">
          <h3 class="text-sm font-semibold text-sunrise uppercase tracking-wider mb-4">Journey Stats</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div class="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalElevationGain.toLocaleString()}'
              </div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Total Elevation Gained</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalDistanceMiles.toFixed(1)} mi
              </div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Total Distance Hiked</div>
            </div>
            {#if stats.highestPeak}
              <div>
                <div class="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.highestPeak.elevation.toLocaleString()}'
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400">
                  Highest: {stats.highestPeak.name}
                </div>
              </div>
            {/if}
            <div>
              <div class="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.avgElevation.toLocaleString()}'
              </div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Avg Peak Elevation</div>
            </div>
          </div>
        </div>
      {/if}

      <!-- The Grid -->
      <section class="mb-8">
        <h2 class="heading-section text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="h-6 w-6 text-sunrise" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
          </svg>
          The 58
        </h2>
        <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-card">
          <div class="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-1.5 sm:gap-2">
            {#each allPeaks as peak}
              {@const isSummited = peak.id in summitedPeaks}
              {@const diffClass = peakClassMap[peak.id] || 1}
              <a
                href="/peaks/{peak.slug}"
                class="
                  group relative aspect-square rounded-md transition-all duration-200
                  {isSummited
                    ? `${classColors[diffClass]} hover:scale-110 shadow-sm`
                    : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}
                "
                title="{peak.name} ({peak.elevation.toLocaleString()}')"
              >
                {#if isSummited}
                  <span class="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {peak.rank}
                  </span>
                {:else}
                  <span class="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-500 text-[10px] font-medium">
                    {peak.rank}
                  </span>
                {/if}
              </a>
            {/each}
          </div>
          <!-- Legend -->
          <div class="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm">
            <span class="text-slate-500 dark:text-slate-400">Legend:</span>
            <div class="flex items-center gap-1.5">
              <div class="w-4 h-4 rounded bg-class-1"></div>
              <span class="text-slate-600 dark:text-slate-300">Class 1</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-4 h-4 rounded bg-class-2"></div>
              <span class="text-slate-600 dark:text-slate-300">Class 2</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-4 h-4 rounded bg-class-3"></div>
              <span class="text-slate-600 dark:text-slate-300">Class 3</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-4 h-4 rounded bg-class-4"></div>
              <span class="text-slate-600 dark:text-slate-300">Class 4</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
              <span class="text-slate-600 dark:text-slate-300">Not summited</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Achievements -->
      <Achievements
        uniquePeaks={stats.uniquePeaks}
        {rangeStats}
        {classStats}
        earnedAchievements={userAchievements}
      />

      <div class="grid md:grid-cols-2 gap-6 mt-8">
        <!-- Class Progress -->
        <section>
          <h2 class="heading-section text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            By Difficulty
          </h2>
          <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-card space-y-4">
            {#each [1, 2, 3, 4] as classNum}
              {@const classData = classStats[classNum]}
              {@const pct = classData.total > 0 ? (classData.summited / classData.total) * 100 : 0}
              <div>
                <div class="flex justify-between text-sm mb-1.5">
                  <span class="font-medium text-slate-700 dark:text-slate-200">Class {classNum}</span>
                  <span class="text-slate-500 dark:text-slate-400">{classData.summited}/{classData.total}</span>
                </div>
                <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    class="{classColors[classNum]} h-full rounded-full transition-all duration-500"
                    style="width: {pct}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        </section>

        <!-- Range Progress -->
        <section>
          <h2 class="heading-section text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            By Range
          </h2>
          <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-card space-y-4 max-h-[320px] overflow-y-auto">
            {#each sortedRanges as [range, rangeData]}
              {@const pct = rangeData.total > 0 ? (rangeData.summited / rangeData.total) * 100 : 0}
              <div>
                <div class="flex justify-between text-sm mb-1.5">
                  <span class="font-medium text-slate-700 dark:text-slate-200 truncate">{range}</span>
                  <span class="text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">{rangeData.summited}/{rangeData.total}</span>
                </div>
                <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    class="bg-gradient-to-r from-sunrise to-sunrise-coral h-full rounded-full transition-all duration-500"
                    style="width: {pct}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        </section>
      </div>

      <!-- Recent Summits -->
      {#if stats.recentSummits.length > 0}
        <section class="mt-8">
          <h2 class="heading-section text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Summits
          </h2>
          <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
            <div class="divide-y divide-slate-200 dark:divide-slate-700">
              {#each stats.recentSummits as summit}
                <a
                  href="/peaks/{summit.peak.slug}"
                  class="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {#if summit.peak.thumbnail_url}
                    <img
                      src={summit.peak.thumbnail_url}
                      alt={summit.peak.name}
                      class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  {:else}
                    <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-mountain-blue to-mountain-mist flex items-center justify-center flex-shrink-0">
                      <svg class="h-8 w-8 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
                      </svg>
                    </div>
                  {/if}
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-slate-900 dark:text-white">{summit.peak.name}</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(summit.date_summited)}
                      {#if summit.route}
                        <span class="mx-1.5">·</span>
                        {summit.route.name}
                      {/if}
                    </div>
                    {#if summit.conditions}
                      <div class="text-sm text-slate-500 dark:text-slate-400">{summit.conditions}</div>
                    {/if}
                  </div>
                  <svg class="h-5 w-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              {/each}
            </div>
          </div>
        </section>
      {:else}
        <section class="mt-8">
          <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-12 text-center shadow-card">
            <div class="mx-auto h-16 w-16 rounded-full bg-sunrise/10 flex items-center justify-center mb-4">
              <svg class="h-8 w-8 text-sunrise" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">No summits yet</h3>
            <p class="text-slate-600 dark:text-slate-400 mb-6">
              Start your 14er journey by logging your first summit!
            </p>
            <a
              href="/peaks"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-sunrise to-sunrise-coral text-white font-medium hover:from-sunrise-coral hover:to-sunrise transition-all shadow-md hover:shadow-lg"
            >
              Browse Peaks
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      {/if}

    {:else if activeTab === 'activity'}
      <!-- Activity Tab - Coming Soon -->
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-12 text-center shadow-card">
        <div class="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Activity Feed</h3>
        <p class="text-slate-600 dark:text-slate-400">
          Your summit logs, achievement unlocks, and trail reports will appear here.
        </p>
        <p class="text-sm text-slate-400 dark:text-slate-500 mt-4">Coming soon</p>
      </div>

    {:else if activeTab === 'photos'}
      <!-- Photos Tab - Coming Soon -->
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-12 text-center shadow-card">
        <div class="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Photo Gallery</h3>
        <p class="text-slate-600 dark:text-slate-400">
          Your summit photos and memories will be displayed here.
        </p>
        <p class="text-sm text-slate-400 dark:text-slate-500 mt-4">Coming soon</p>
      </div>

    {:else if activeTab === 'trips'}
      <!-- Trips Tab - Coming Soon -->
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-12 text-center shadow-card">
        <div class="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Upcoming Trips</h3>
        <p class="text-slate-600 dark:text-slate-400">
          Plan trips and find hiking partners for your next adventure.
        </p>
        <p class="text-sm text-slate-400 dark:text-slate-500 mt-4">Coming soon</p>
      </div>

    {:else if activeTab === 'buddies'}
      <!-- Buddies Tab - Coming Soon -->
      <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-12 text-center shadow-card">
        <div class="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Hiking Buddies</h3>
        <p class="text-slate-600 dark:text-slate-400">
          Connect with other peak baggers and find hiking partners.
        </p>
        <p class="text-sm text-slate-400 dark:text-slate-500 mt-4">Coming soon</p>
      </div>
    {/if}
  </Container>
</div>

<!-- Edit Profile Modal -->
{#if profile && supabase}
  <EditProfileModal
    open={editModalOpen}
    {profile}
    peaks={peaksForSelector}
    {supabase}
    onClose={() => editModalOpen = false}
    onSave={handleSaveProfile}
  />
{/if}
