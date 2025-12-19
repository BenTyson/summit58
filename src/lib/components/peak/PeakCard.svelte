<script lang="ts">
  import type { PeakWithStandardRoute } from '$lib/types/database';
  import Badge from '../ui/Badge.svelte';

  interface Props {
    peak: PeakWithStandardRoute;
  }

  let { peak }: Props = $props();

  const difficultyClass = peak.standard_route?.difficulty_class ?? 1;
</script>

<a
  href="/peaks/{peak.slug}"
  class="peak-card group block overflow-hidden rounded-card border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
>
  <div class="flex gap-4 p-4">
    <!-- Image / Gradient Placeholder -->
    <div
      class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-32"
    >
      {#if peak.hero_image_url}
        <img
          src={peak.hero_image_url}
          alt={peak.name}
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      {:else}
        <div
          class="flex h-full w-full items-center justify-center peak-gradient"
        >
          <svg
            class="h-12 w-12 text-white/60"
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
      {/if}
    </div>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <h3
        class="truncate text-lg font-semibold text-slate-900 transition-colors group-hover:text-mountain-blue dark:text-white dark:group-hover:text-sunrise"
      >
        {peak.name}
      </h3>

      <div class="mt-1 flex items-baseline gap-2 text-sm text-slate-600 dark:text-slate-400">
        <span class="stats-number font-medium">{peak.elevation.toLocaleString()}'</span>
        <span class="text-slate-400">·</span>
        <span>#{peak.rank}</span>
      </div>

      <div class="mt-2 flex flex-wrap items-center gap-2">
        <Badge variant="class-{difficultyClass}">Class {difficultyClass}</Badge>
        {#if peak.standard_route?.distance_miles}
          <span class="text-xs text-slate-500 dark:text-slate-400">
            {peak.standard_route.distance_miles} mi
          </span>
        {/if}
      </div>

      <div class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {peak.range}
      </div>
    </div>

    <!-- Chevron -->
    <div
      class="flex items-center text-slate-400 transition-colors group-hover:text-mountain-blue dark:group-hover:text-sunrise"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</a>
