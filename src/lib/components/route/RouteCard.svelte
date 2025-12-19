<script lang="ts">
  import type { Route } from '$lib/types/database';
  import Badge from '../ui/Badge.svelte';

  interface Props {
    route: Route;
    peakSlug: string;
  }

  let { route, peakSlug }: Props = $props();

  const classColors: Record<number, string> = {
    1: 'text-class-1',
    2: 'text-class-2',
    3: 'text-class-3',
    4: 'text-class-4'
  };
</script>

<a
  href="/peaks/{peakSlug}/{route.slug}"
  class="group block rounded-card border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
>
  <div class="flex items-start justify-between gap-4">
    <div class="min-w-0 flex-1">
      <!-- Route Name -->
      <div class="flex items-center gap-2">
        <h3
          class="truncate font-semibold text-slate-900 transition-colors group-hover:text-mountain-blue dark:text-white dark:group-hover:text-sunrise"
        >
          {route.name}
        </h3>
        {#if route.is_standard}
          <Badge variant="default">Standard</Badge>
        {/if}
      </div>

      <!-- Quick Stats -->
      <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
        <span class="stats-number">{route.distance_miles} mi</span>
        <span class="stats-number">{route.elevation_gain_ft.toLocaleString()}' gain</span>
        <span class={classColors[route.difficulty_class]}>Class {route.difficulty_class}</span>
        {#if route.typical_time_hours}
          <span>{route.typical_time_hours} hrs</span>
        {/if}
      </div>

      <!-- Exposure indicator -->
      {#if route.exposure && route.exposure !== 'Low'}
        <div class="mt-2">
          <span
            class="inline-flex items-center gap-1 text-xs {route.exposure === 'Extreme'
              ? 'text-class-4'
              : route.exposure === 'High'
                ? 'text-class-3'
                : 'text-class-2'}"
          >
            <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd"
              />
            </svg>
            {route.exposure} exposure
          </span>
        </div>
      {/if}
    </div>

    <!-- Chevron -->
    <div
      class="flex-shrink-0 text-slate-400 transition-colors group-hover:text-mountain-blue dark:group-hover:text-sunrise"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</a>
