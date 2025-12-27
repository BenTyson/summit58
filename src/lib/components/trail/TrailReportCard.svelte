<script lang="ts">
  import type { Tables } from '$lib/types/database';

  type TrailReportWithProfile = Tables<'trail_reports'> & {
    profile: { display_name: string | null; avatar_url: string | null } | null;
  };

  interface Props {
    report: TrailReportWithProfile;
  }

  let { report }: Props = $props();

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function daysAgo(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }

  const trailStatusConfig: Record<string, { label: string; color: string; icon: string }> = {
    clear: { label: 'Clear', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: '✓' },
    muddy: { label: 'Muddy', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: '💧' },
    snowy: { label: 'Snowy', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400', icon: '❄️' },
    icy: { label: 'Icy', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '🧊' },
    mixed: { label: 'Mixed', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: '⚡' }
  };

  const crowdConfig: Record<string, { label: string; color: string }> = {
    empty: { label: 'Empty', color: 'text-emerald-600 dark:text-emerald-400' },
    light: { label: 'Light', color: 'text-green-600 dark:text-green-400' },
    moderate: { label: 'Moderate', color: 'text-amber-600 dark:text-amber-400' },
    crowded: { label: 'Crowded', color: 'text-orange-600 dark:text-orange-400' },
    packed: { label: 'Packed', color: 'text-red-600 dark:text-red-400' }
  };

  const roadConfig: Record<string, { label: string; color: string }> = {
    open: { label: 'Open', color: 'text-emerald-600' },
    rough: { label: 'Rough', color: 'text-amber-600' },
    '4wd_required': { label: '4WD', color: 'text-orange-600' },
    closed: { label: 'Closed', color: 'text-red-600' }
  };

  const parkingConfig: Record<string, { label: string; color: string }> = {
    empty: { label: 'Empty', color: 'text-emerald-600 dark:text-emerald-400' },
    filling: { label: 'Filling', color: 'text-green-600 dark:text-green-400' },
    nearly_full: { label: 'Nearly Full', color: 'text-amber-600 dark:text-amber-400' },
    full: { label: 'Full', color: 'text-red-600 dark:text-red-400' },
    overflow: { label: 'Overflow', color: 'text-red-600 dark:text-red-400' }
  };

  const hazardLabels: Record<string, string> = {
    fallen_trees: 'Fallen Trees',
    stream_crossing: 'Stream Crossing',
    rockfall: 'Rockfall',
    wildlife: 'Wildlife',
    lightning_risk: 'Lightning Risk'
  };

  const trailInfo = $derived(report.trail_status ? trailStatusConfig[report.trail_status] : null);
  const crowdInfo = $derived(report.crowd_level ? crowdConfig[report.crowd_level] : null);
  const roadInfo = $derived(report.road_status ? roadConfig[report.road_status] : null);
  const parkingInfo = $derived(report.parking_status ? parkingConfig[report.parking_status] : null);

  function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }
</script>

<div class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
  <!-- Header -->
  <div class="flex items-start justify-between gap-3 mb-3">
    <div class="flex items-center gap-2">
      {#if report.profile?.avatar_url}
        <img
          src={report.profile.avatar_url}
          alt=""
          class="h-8 w-8 rounded-full object-cover"
        />
      {:else}
        <div class="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <svg class="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      {/if}
      <div>
        <span class="text-sm font-medium text-slate-900 dark:text-white">
          {report.profile?.display_name || 'Anonymous'}
        </span>
        <span class="text-xs text-slate-500 dark:text-slate-400 block">
          Hiked {formatDate(report.hike_date)} ({daysAgo(report.hike_date)})
        </span>
      </div>
    </div>

    {#if trailInfo}
      <span class="px-2 py-1 rounded-md text-xs font-medium {trailInfo.color}">
        {trailInfo.icon} {trailInfo.label}
      </span>
    {/if}
  </div>

  <!-- Conditions Grid -->
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
    {#if crowdInfo}
      <div>
        <span class="text-xs text-slate-500 dark:text-slate-400 block">Crowds</span>
        <span class="font-medium {crowdInfo.color}">{crowdInfo.label}</span>
      </div>
    {/if}

    {#if roadInfo}
      <div>
        <span class="text-xs text-slate-500 dark:text-slate-400 block">Road</span>
        <span class="font-medium {roadInfo.color}">{roadInfo.label}</span>
      </div>
    {/if}

    {#if report.snow_depth_inches}
      <div>
        <span class="text-xs text-slate-500 dark:text-slate-400 block">Snow</span>
        <span class="font-medium text-sky-600 dark:text-sky-400">{report.snow_depth_inches}"</span>
      </div>
    {/if}

    {#if parkingInfo}
      <div>
        <span class="text-xs text-slate-500 dark:text-slate-400 block">
          Parking{#if report.arrival_time} @ {formatTime(report.arrival_time)}{/if}
        </span>
        <span class="font-medium {parkingInfo.color}">{parkingInfo.label}</span>
      </div>
    {/if}
  </div>

  <!-- Hazards -->
  {#if report.hazards && report.hazards.length > 0}
    <div class="mt-3 flex flex-wrap gap-1">
      {#each report.hazards as hazard}
        <span class="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          {hazardLabels[hazard] || hazard}
        </span>
      {/each}
    </div>
  {/if}

  <!-- Notes -->
  {#if report.notes}
    <p class="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      "{report.notes}"
    </p>
  {/if}
</div>
