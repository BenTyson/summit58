<script lang="ts">
  import type { PeakWithStandardRoute } from '$lib/types/database';
  import Badge from '../ui/Badge.svelte';

  interface Props {
    peak: PeakWithStandardRoute;
    featured?: boolean;
    class?: string;
  }

  let { peak, featured = false, class: className = '' }: Props = $props();

  const difficultyClass = peak.standard_route?.difficulty_class ?? 1;

  const classAccents: Record<number, string> = {
    1: 'border-l-class-1',
    2: 'border-l-class-2',
    3: 'border-l-class-3',
    4: 'border-l-class-4'
  };
</script>

<a
  href="/peaks/{peak.slug}"
  class="
    group relative block overflow-hidden rounded-xl
    border border-slate-200 border-l-4 bg-white
    shadow-card transition-all duration-300
    hover:-translate-y-1 hover:shadow-card-hover
    dark:border-slate-700 dark:bg-slate-800/90
    {classAccents[difficultyClass]}
    {featured ? 'ring-2 ring-sunrise/30' : ''}
    {className}
  "
>
  <!-- Hover gradient overlay -->
  <div
    class="
      absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-sunrise/5
      opacity-0 transition-opacity duration-300 group-hover:opacity-100
      pointer-events-none
    "
  ></div>

  <div class="relative flex gap-4 p-4">
    <!-- Image / Gradient Placeholder -->
    <div class="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg sm:h-36 sm:w-36">
      {#if peak.hero_image_url}
        <img
          src={peak.hero_image_url}
          alt={peak.name}
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <!-- Gradient overlay on hover -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        ></div>
      {:else}
        <div class="h-full w-full peak-gradient relative">
          <div class="absolute inset-0 flex items-center justify-center">
            <svg
              class="h-12 w-12 text-white/40 transition-transform duration-500 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 2L2 22h20L12 2z"
              />
            </svg>
          </div>
        </div>
      {/if}

      <!-- Rank badge overlay -->
      <div
        class="
          absolute top-2 left-2 flex items-center justify-center
          h-7 w-7 rounded-full bg-black/60 backdrop-blur-sm
          text-xs font-bold text-white
        "
      >
        #{peak.rank}
      </div>
    </div>

    <!-- Content -->
    <div class="min-w-0 flex-1 flex flex-col justify-between py-1">
      <div>
        <!-- Peak name -->
        <h3
          class="
            text-lg font-bold text-slate-900
            transition-colors duration-200
            group-hover:text-mountain-blue
            dark:text-white dark:group-hover:text-sunrise
            sm:text-xl
          "
        >
          {peak.name}
        </h3>

        <!-- Elevation with visual emphasis -->
        <div class="mt-1.5 flex items-baseline gap-3">
          <span class="font-display text-2xl font-medium text-mountain-blue dark:text-sunrise">
            {peak.elevation.toLocaleString()}'
          </span>
        </div>

        <!-- Range -->
        <div
          class="mt-2 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {peak.range}
        </div>
      </div>

      <!-- Bottom row: Badge + Stats -->
      <div class="mt-3 flex flex-wrap items-center gap-3">
        <Badge variant="class-{difficultyClass}" size="md">Class {difficultyClass}</Badge>
        {#if peak.standard_route?.distance_miles}
          <span class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            {peak.standard_route.distance_miles} mi
          </span>
        {/if}
        {#if peak.standard_route?.elevation_gain_ft}
          <span class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
            {peak.standard_route.elevation_gain_ft.toLocaleString()}'
          </span>
        {/if}
      </div>
    </div>

    <!-- Animated chevron -->
    <div class="flex items-center">
      <div
        class="
          flex h-10 w-10 items-center justify-center rounded-full
          bg-slate-100 text-slate-400
          transition-all duration-300
          group-hover:bg-sunrise group-hover:text-white
          group-hover:translate-x-1
          dark:bg-slate-700 dark:text-slate-400
        "
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  </div>
</a>
