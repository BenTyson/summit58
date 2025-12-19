<script lang="ts">
  import type { Route } from '$lib/types/database';

  interface Props {
    route:
      | Route
      | Pick<
          Route,
          'distance_miles' | 'elevation_gain_ft' | 'difficulty_class' | 'typical_time_hours'
        >;
    compact?: boolean;
    class?: string;
  }

  let { route, compact = false, class: className = '' }: Props = $props();

  const classGradients: Record<number, string> = {
    1: 'from-class-1 to-green-700',
    2: 'from-class-2 to-blue-700',
    3: 'from-class-3 to-yellow-600',
    4: 'from-class-4 to-red-700'
  };

  const classGlows: Record<number, string> = {
    1: 'shadow-glow-class-1',
    2: 'shadow-glow-class-2',
    3: 'shadow-glow-class-3',
    4: 'shadow-glow-class-4'
  };
</script>

<div
  class="
    grid grid-cols-2 gap-3 rounded-xl border p-4 sm:grid-cols-4
    bg-gradient-to-br from-slate-50 to-white
    border-slate-200/80
    dark:from-slate-800/50 dark:to-slate-900/50
    dark:border-slate-700/50
    {className}
  "
>
  <!-- Distance -->
  <div
    class="
      group relative flex flex-col items-center p-3 rounded-lg
      transition-all duration-300 hover:scale-105
      hover:bg-white/50 dark:hover:bg-slate-700/50
    "
  >
    <svg
      class="h-5 w-5 mb-2 text-slate-400 dark:text-slate-500 group-hover:text-sunrise transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
    <div class="stats-number text-xl font-bold text-mountain-blue dark:text-white sm:text-2xl">
      {route.distance_miles}
    </div>
    <div class="text-xs uppercase tracking-wider mt-1 text-slate-500 dark:text-slate-400">
      miles RT
    </div>
  </div>

  <!-- Elevation Gain -->
  <div
    class="
      group relative flex flex-col items-center p-3 rounded-lg
      transition-all duration-300 hover:scale-105
      hover:bg-white/50 dark:hover:bg-slate-700/50
    "
  >
    <svg
      class="h-5 w-5 mb-2 text-slate-400 dark:text-slate-500 group-hover:text-sunrise transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M7 11l5-5m0 0l5 5m-5-5v12"
      />
    </svg>
    <div class="stats-number text-xl font-bold text-mountain-blue dark:text-white sm:text-2xl">
      {route.elevation_gain_ft.toLocaleString()}
    </div>
    <div class="text-xs uppercase tracking-wider mt-1 text-slate-500 dark:text-slate-400">
      ft gain
    </div>
  </div>

  <!-- Difficulty Class -->
  <div
    class="
      group relative flex flex-col items-center p-3 rounded-lg
      transition-all duration-300 hover:scale-105
      bg-gradient-to-br {classGradients[route.difficulty_class]} text-white
      {classGlows[route.difficulty_class]}
    "
  >
    <svg
      class="h-5 w-5 mb-2 text-white/80"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div class="stats-number text-xl font-bold text-white sm:text-2xl">
      Class {route.difficulty_class}
    </div>
    <div class="text-xs uppercase tracking-wider mt-1 text-white/70">difficulty</div>
  </div>

  <!-- Time -->
  <div
    class="
      group relative flex flex-col items-center p-3 rounded-lg
      transition-all duration-300 hover:scale-105
      hover:bg-white/50 dark:hover:bg-slate-700/50
    "
  >
    <svg
      class="h-5 w-5 mb-2 text-slate-400 dark:text-slate-500 group-hover:text-sunrise transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div class="stats-number text-xl font-bold text-mountain-blue dark:text-white sm:text-2xl">
      {route.typical_time_hours || '—'}
    </div>
    <div class="text-xs uppercase tracking-wider mt-1 text-slate-500 dark:text-slate-400">
      hours
    </div>
  </div>
</div>
