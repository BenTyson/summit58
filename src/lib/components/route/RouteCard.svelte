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

  const classBorderColors: Record<number, string> = {
    1: 'border-l-class-1',
    2: 'border-l-class-2',
    3: 'border-l-class-3',
    4: 'border-l-class-4'
  };
</script>

<a
  href="/peaks/{peakSlug}/{route.slug}"
  class="
    group block rounded-xl overflow-hidden
    border border-slate-200 dark:border-slate-700
    border-l-4 {classBorderColors[route.difficulty_class]}
    bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80
    p-5
    shadow-sm hover:shadow-card
    transition-all duration-300
    hover:-translate-y-0.5
  "
>
  <div class="flex items-start justify-between gap-4">
    <div class="min-w-0 flex-1">
      <!-- Route Name -->
      <div class="flex items-center gap-2 flex-wrap">
        <h3
          class="font-semibold text-lg text-slate-900 transition-colors group-hover:text-mountain-blue dark:text-white dark:group-hover:text-sunrise"
        >
          {route.name}
        </h3>
        {#if route.is_standard}
          <Badge variant="gold" size="sm">Standard Route</Badge>
        {/if}
      </div>

      <!-- Quick Stats -->
      <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span class="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <svg class="h-4 w-4 text-mountain-blue dark:text-mountain-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span class="stats-number font-medium">{route.distance_miles} mi</span>
        </span>
        <span class="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <svg class="h-4 w-4 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span class="stats-number font-medium">{route.elevation_gain_ft.toLocaleString()}' gain</span>
        </span>
        <span class="flex items-center gap-1.5 font-medium {classColors[route.difficulty_class]}">
          <span class="h-2 w-2 rounded-full bg-current"></span>
          Class {route.difficulty_class}
        </span>
        {#if route.typical_time_hours}
          <span class="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">{route.typical_time_hours} hrs</span>
          </span>
        {/if}
      </div>

      <!-- Exposure indicator -->
      {#if route.exposure && route.exposure !== 'Low'}
        <div class="mt-3">
          <span
            class="
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
              {route.exposure === 'Extreme'
                ? 'bg-class-4/10 text-class-4'
                : route.exposure === 'High'
                  ? 'bg-class-3/10 text-class-3'
                  : 'bg-class-2/10 text-class-2'}
            "
          >
            <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
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
      class="
        flex-shrink-0 p-2 rounded-full
        bg-slate-100 dark:bg-slate-700
        text-slate-400
        transition-all duration-300
        group-hover:bg-sunrise/10 group-hover:text-sunrise
        group-hover:translate-x-1
      "
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</a>
