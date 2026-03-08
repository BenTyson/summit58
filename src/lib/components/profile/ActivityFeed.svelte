<script lang="ts">
  import type {
    ActivityItem,
    SummitActivity,
    ReviewActivity,
    TrailReportActivity,
    AchievementActivity
  } from '$lib/server/activity';
  import AchievementIcon from '$lib/components/ui/AchievementIcon.svelte';

  interface Props {
    activities: ActivityItem[];
    showUser?: boolean;
  }

  let { activities, showUser = false }: Props = $props();

  // Group activities by date
  function groupByDate(items: ActivityItem[]): Map<string, ActivityItem[]> {
    const groups = new Map<string, ActivityItem[]>();

    items.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)!.push(item);
    });

    return groups;
  }

  const groupedActivities = $derived(groupByDate(activities));

  function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  function getRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }

  // Type guards
  function isSummit(data: ActivityItem['data']): data is SummitActivity {
    return 'date_summited' in data;
  }

  function isReview(data: ActivityItem['data']): data is ReviewActivity {
    return 'rating' in data;
  }

  function isTrailReport(data: ActivityItem['data']): data is TrailReportActivity {
    return 'trail_status' in data;
  }

  function isAchievement(data: ActivityItem['data']): data is AchievementActivity {
    return 'definition' in data;
  }

  // Trail status colors
  const trailStatusColors: Record<string, string> = {
    clear: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    muddy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    snowy: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icy: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    mixed: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
  };
</script>

<div class="space-y-6">
  {#each [...groupedActivities] as [date, items]}
    <div>
      <!-- Date Header -->
      <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        {getRelativeDate(items[0].date)}
      </h3>

      <!-- Activity Cards -->
      <div class="space-y-3">
        {#each items as item}
          <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-card hover:shadow-card-hover transition-shadow">
            {#if showUser && item.user}
              <div class="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                {#if item.user.avatar_url}
                  <img src={item.user.avatar_url} alt="" class="w-6 h-6 rounded-full object-cover" />
                {:else}
                  <div class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                    <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                {/if}
                <a href="/users/{item.user.id}" class="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sunrise transition-colors">
                  {item.user.display_name || 'Climber'}
                </a>
              </div>
            {/if}
            {#if item.type === 'summit' && isSummit(item.data)}
              <!-- Summit Activity -->
              <div class="flex items-start gap-4">
                <!-- Icon -->
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-sunrise to-sunrise-coral flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l7 9 7-9M5 21l7-9 7 9" />
                  </svg>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium text-slate-900 dark:text-white">Summited</span>
                    <a
                      href="/peaks/{item.data.peak.slug}"
                      class="font-semibold text-sunrise hover:text-sunrise-coral transition-colors"
                    >
                      {item.data.peak.name}
                    </a>
                  </div>

                  <div class="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span>{item.data.peak.elevation.toLocaleString()}ft</span>
                    {#if item.data.route}
                      <span class="flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-class-{item.data.route.difficulty_class}"></span>
                        {item.data.route.name}
                      </span>
                    {/if}
                  </div>

                  {#if item.data.conditions}
                    <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 italic">
                      "{item.data.conditions}"
                    </p>
                  {/if}
                </div>

                <!-- Thumbnail -->
                {#if item.data.peak.thumbnail_url}
                  <img
                    src={item.data.peak.thumbnail_url}
                    alt={item.data.peak.name}
                    class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                {/if}
              </div>

            {:else if item.type === 'review' && isReview(item.data)}
              <!-- Review Activity -->
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium text-slate-900 dark:text-white">Reviewed</span>
                    <a
                      href="/peaks/{item.data.peak.slug}#reviews"
                      class="font-semibold text-sunrise hover:text-sunrise-coral transition-colors"
                    >
                      {item.data.peak.name}
                    </a>
                  </div>

                  <div class="flex items-center gap-1 mb-2">
                    {#each Array(5) as _, i}
                      <svg
                        class="w-4 h-4 {i < item.data.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    {/each}
                  </div>

                  {#if item.data.title}
                    <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {item.data.title}
                    </p>
                  {/if}

                  {#if item.data.body}
                    <p class="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                      {item.data.body}
                    </p>
                  {/if}
                </div>
              </div>

            {:else if item.type === 'trail_report' && isTrailReport(item.data)}
              <!-- Trail Report Activity -->
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium text-slate-900 dark:text-white">Trail report for</span>
                    <a
                      href="/peaks/{item.data.peak.slug}#conditions"
                      class="font-semibold text-sunrise hover:text-sunrise-coral transition-colors"
                    >
                      {item.data.peak.name}
                    </a>
                  </div>

                  <div class="flex items-center gap-2 flex-wrap">
                    {#if item.data.trail_status}
                      <span class="px-2 py-0.5 rounded-full text-xs font-medium {trailStatusColors[item.data.trail_status] || trailStatusColors.mixed}">
                        {item.data.trail_status.charAt(0).toUpperCase() + item.data.trail_status.slice(1)}
                      </span>
                    {/if}

                    {#if item.data.hazards?.length}
                      {#each item.data.hazards.slice(0, 2) as hazard}
                        <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          {hazard.replace('_', ' ')}
                        </span>
                      {/each}
                    {/if}
                  </div>

                  {#if item.data.notes}
                    <p class="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mt-2">
                      {item.data.notes}
                    </p>
                  {/if}
                </div>
              </div>

            {:else if item.type === 'achievement' && isAchievement(item.data)}
              <!-- Achievement Activity -->
              <div class="flex items-center gap-4 bg-gradient-to-r from-sunrise/5 to-sunrise-coral/5 -m-4 p-4 rounded-xl">
                <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-sunrise to-sunrise-coral flex items-center justify-center shadow-md">
                  <AchievementIcon icon={item.data.definition.icon} earned={true} class="w-6 h-6 text-white" />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="font-medium text-slate-900 dark:text-white">Earned achievement</span>
                  </div>
                  <p class="font-semibold text-sunrise">
                    {item.data.definition.title}
                  </p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">
                    {item.data.definition.description}
                  </p>
                </div>

                <svg class="w-8 h-8 text-sunrise/30 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/each}

  <!-- Empty State -->
  {#if activities.length === 0}
    <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-12 text-center shadow-card">
      <div class="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">No activity yet</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-6">
        Your summit logs, reviews, trail reports, and achievements will appear here.
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
  {/if}
</div>
