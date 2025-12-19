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

<Container class="relative -mt-16 pb-12">
  <!-- Peak Header Card -->
  <div class="rounded-card border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <!-- Breadcrumb -->
        <nav class="mb-2 text-sm text-slate-500 dark:text-slate-400">
          <a href="/peaks" class="hover:text-mountain-blue dark:hover:text-sunrise">Peaks</a>
          <span class="mx-2">/</span>
          <span class="text-slate-700 dark:text-slate-200">{peak.name}</span>
        </nav>

        <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          {peak.name}
        </h1>

        <div class="mt-2 flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-400">
          <span class="stats-number text-lg font-semibold">{peak.elevation.toLocaleString()}'</span>
          <span class="text-slate-400">·</span>
          <span>Rank #{peak.rank}</span>
          <span class="text-slate-400">·</span>
          <span>{peak.range}</span>
        </div>
      </div>

      {#if standardRoute}
        <Badge variant="class-{standardRoute.difficulty_class}" class="flex-shrink-0">
          Class {standardRoute.difficulty_class}
        </Badge>
      {/if}
    </div>

    <!-- Stats Bar -->
    {#if standardRoute}
      <div class="mt-6">
        <StatsBar route={standardRoute} />
      </div>
    {/if}
  </div>

  <!-- Description -->
  {#if peak.description}
    <section class="mt-8">
      <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Overview</h2>
      <p class="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
        {peak.description}
      </p>
    </section>
  {/if}

  <!-- Location -->
  <section class="mt-8">
    <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Location</h2>
    <div class="mt-4 rounded-card border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <div class="flex flex-wrap gap-6 text-sm">
        <div>
          <span class="font-medium text-slate-700 dark:text-slate-300">Range:</span>
          <span class="ml-2 text-slate-600 dark:text-slate-400">{peak.range}</span>
        </div>
        <div>
          <span class="font-medium text-slate-700 dark:text-slate-300">Coordinates:</span>
          <span class="stats-number ml-2 text-slate-600 dark:text-slate-400">
            {peak.latitude.toFixed(4)}°N, {Math.abs(peak.longitude).toFixed(4)}°W
          </span>
        </div>
      </div>
    </div>
  </section>

  <!-- Routes -->
  <section class="mt-8">
    <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Routes</h2>
    {#if peak.routes && peak.routes.length > 0}
      <div class="mt-4 space-y-4">
        {#each peak.routes.sort((a, b) => (a.is_standard === b.is_standard ? 0 : a.is_standard ? -1 : 1)) as route}
          <RouteCard {route} peakSlug={peak.slug} />
        {/each}
      </div>
    {:else}
      <p class="mt-4 text-slate-600 dark:text-slate-400">No routes available yet.</p>
    {/if}
  </section>
</Container>
