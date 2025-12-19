<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import PeakHero from '$lib/components/peak/PeakHero.svelte';
  import StatsBar from '$lib/components/peak/StatsBar.svelte';
  import RouteCard from '$lib/components/route/RouteCard.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const peak = data.peak;
  const standardRoute = peak.routes?.find((r) => r.is_standard);
</script>

<svelte:head>
  <title>{peak.name} ({peak.elevation.toLocaleString()}') | Summit58</title>
  <meta
    name="description"
    content="{peak.name} is Colorado's #{peak.rank} highest peak at {peak.elevation.toLocaleString()} feet. {peak.description?.slice(0, 120)}..."
  />
</svelte:head>

<!-- Hero Image -->
<PeakHero {peak} />

<Container class="relative -mt-20 pb-12">
  <!-- Peak Header Card -->
  <div
    class="
      animate-fade-in-up
      rounded-2xl overflow-hidden
      bg-white/90 dark:bg-slate-800/90
      backdrop-blur-md
      shadow-card-elevated
      border border-slate-200/50 dark:border-slate-700/50
    "
  >
    <!-- Gradient top border based on difficulty -->
    <div
      class="
        h-1.5
        {standardRoute?.difficulty_class === 1 ? 'bg-gradient-to-r from-class-1 to-emerald-400' :
         standardRoute?.difficulty_class === 2 ? 'bg-gradient-to-r from-class-2 to-blue-400' :
         standardRoute?.difficulty_class === 3 ? 'bg-gradient-to-r from-class-3 to-amber-400' :
         standardRoute?.difficulty_class === 4 ? 'bg-gradient-to-r from-class-4 to-rose-400' :
         'bg-gradient-to-r from-sunrise to-sunrise-coral'}
      "
    ></div>

    <div class="p-6 sm:p-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <!-- Breadcrumb -->
          <nav class="mb-3 text-sm text-slate-500 dark:text-slate-400">
            <a
              href="/peaks"
              class="hover:text-mountain-blue dark:hover:text-sunrise transition-colors"
            >
              Peaks
            </a>
            <span class="mx-2">›</span>
            <span class="text-slate-700 dark:text-slate-200">{peak.name}</span>
          </nav>

          <h1 class="heading-page text-slate-900 dark:text-white">
            {peak.name}
          </h1>

          <div class="mt-3 flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400">
            <span class="stat-display text-2xl text-sunrise">{peak.elevation.toLocaleString()}'</span>
            <span class="text-slate-300 dark:text-slate-600">·</span>
            <span class="flex items-center gap-1.5">
              <svg class="h-4 w-4 text-sunrise" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
              </svg>
              Rank #{peak.rank}
            </span>
            <span class="text-slate-300 dark:text-slate-600">·</span>
            <span class="flex items-center gap-1.5">
              <svg class="h-4 w-4 text-mountain-blue dark:text-mountain-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {peak.range}
            </span>
          </div>
        </div>

        {#if standardRoute}
          <Badge variant="class-{standardRoute.difficulty_class}" size="lg" glow class="flex-shrink-0">
            Class {standardRoute.difficulty_class}
          </Badge>
        {/if}
      </div>

      <!-- Stats Bar -->
      {#if standardRoute}
        <div class="mt-8">
          <StatsBar route={standardRoute} />
        </div>
      {/if}
    </div>
  </div>

  <!-- Description -->
  {#if peak.description}
    <section class="mt-10 animate-fade-in-up" style="animation-delay: 150ms">
      <h2 class="heading-section text-slate-900 dark:text-white flex items-center gap-2">
        <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Overview
      </h2>
      <p class="mt-4 leading-relaxed text-slate-700 dark:text-slate-300 text-lg">
        {peak.description}
      </p>
    </section>
  {/if}

  <!-- Location -->
  <section class="mt-10 animate-fade-in-up" style="animation-delay: 200ms">
    <h2 class="heading-section text-slate-900 dark:text-white flex items-center gap-2">
      <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Location
    </h2>
    <div
      class="
        mt-4 rounded-xl
        border border-slate-200 dark:border-slate-700
        bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50
        p-6 shadow-card
      "
    >
      <div class="flex flex-wrap gap-8">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-mountain-blue/10 dark:bg-mountain-blue/20 flex items-center justify-center">
            <svg class="h-5 w-5 text-mountain-blue dark:text-mountain-mist" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Range</span>
            <span class="font-semibold text-slate-900 dark:text-white">{peak.range}</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-sunrise/10 dark:bg-sunrise/20 flex items-center justify-center">
            <svg class="h-5 w-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Coordinates</span>
            <span class="stats-number font-semibold text-slate-900 dark:text-white">
              {peak.latitude.toFixed(4)}°N, {Math.abs(peak.longitude).toFixed(4)}°W
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Routes -->
  <section class="mt-10 animate-fade-in-up" style="animation-delay: 250ms">
    <h2 class="heading-section text-slate-900 dark:text-white flex items-center gap-2">
      <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      Routes
    </h2>
    {#if peak.routes && peak.routes.length > 0}
      <div class="mt-4 space-y-4 stagger-children">
        {#each peak.routes.sort((a, b) => (a.is_standard === b.is_standard ? 0 : a.is_standard ? -1 : 1)) as route, i}
          <div class="animate-fade-in-up" style="animation-delay: {300 + i * 75}ms">
            <RouteCard {route} peakSlug={peak.slug} />
          </div>
        {/each}
      </div>
    {:else}
      <div
        class="
          mt-4 rounded-xl border border-slate-200 dark:border-slate-700
          bg-slate-50 dark:bg-slate-800 p-8 text-center
        "
      >
        <div class="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
          <svg class="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <p class="text-slate-600 dark:text-slate-400">No routes available yet.</p>
      </div>
    {/if}
  </section>
</Container>
