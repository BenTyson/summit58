<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import StatsBar from '$lib/components/peak/StatsBar.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const { peak, route } = data;

  const exposureColors: Record<string, string> = {
    Low: 'text-class-1',
    Moderate: 'text-class-2',
    High: 'text-class-3',
    Extreme: 'text-class-4'
  };
</script>

<svelte:head>
  <title>{route.name} - {peak.name} | Summit58</title>
  <meta
    name="description"
    content="{route.name} route on {peak.name}. {route.distance_miles} miles, {route.elevation_gain_ft.toLocaleString()}' gain, Class {route.difficulty_class}. {route.description?.slice(0, 100)}..."
  />
</svelte:head>

<Container class="py-8 sm:py-12">
  <!-- Breadcrumb -->
  <nav class="mb-6 text-sm text-slate-500 dark:text-slate-400">
    <a href="/peaks" class="hover:text-mountain-blue dark:hover:text-sunrise">Peaks</a>
    <span class="mx-2">/</span>
    <a href="/peaks/{peak.slug}" class="hover:text-mountain-blue dark:hover:text-sunrise"
      >{peak.name}</a
    >
    <span class="mx-2">/</span>
    <span class="text-slate-700 dark:text-slate-200">{route.name}</span>
  </nav>

  <!-- Route Header -->
  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
        {route.name}
      </h1>
      <p class="mt-1 text-slate-600 dark:text-slate-400">
        <a
          href="/peaks/{peak.slug}"
          class="hover:text-mountain-blue dark:hover:text-sunrise"
        >
          {peak.name}
        </a>
        · {peak.elevation.toLocaleString()}' · #{peak.rank}
      </p>
    </div>

    <div class="flex flex-wrap gap-2">
      <Badge variant="class-{route.difficulty_class}">Class {route.difficulty_class}</Badge>
      {#if route.is_standard}
        <Badge variant="default">Standard Route</Badge>
      {/if}
    </div>
  </div>

  <!-- Stats Bar -->
  <div class="mt-6">
    <StatsBar {route} />
  </div>

  <!-- Main Content Grid -->
  <div class="mt-8 grid gap-8 lg:grid-cols-3">
    <!-- Left Column - Main Info -->
    <div class="lg:col-span-2 space-y-8">
      <!-- Description -->
      {#if route.description}
        <section>
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Route Description</h2>
          <p class="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
            {route.description}
          </p>
        </section>
      {/if}

      <!-- Gear Notes -->
      {#if route.gear_notes}
        <section>
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Gear & Preparation</h2>
          <div class="mt-4 rounded-card border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <p class="text-slate-700 dark:text-slate-300">{route.gear_notes}</p>
          </div>
        </section>
      {/if}
    </div>

    <!-- Right Column - Quick Info -->
    <div class="space-y-6">
      <!-- Route Details Card -->
      <div class="rounded-card border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
        <h3 class="font-semibold text-slate-900 dark:text-white">Route Details</h3>

        <dl class="mt-4 space-y-3 text-sm">
          <div class="flex justify-between">
            <dt class="text-slate-500 dark:text-slate-400">Distance</dt>
            <dd class="stats-number font-medium text-slate-900 dark:text-white">
              {route.distance_miles} miles RT
            </dd>
          </div>

          <div class="flex justify-between">
            <dt class="text-slate-500 dark:text-slate-400">Elevation Gain</dt>
            <dd class="stats-number font-medium text-slate-900 dark:text-white">
              {route.elevation_gain_ft.toLocaleString()}'
            </dd>
          </div>

          <div class="flex justify-between">
            <dt class="text-slate-500 dark:text-slate-400">Difficulty</dt>
            <dd class="font-medium text-class-{route.difficulty_class}">
              Class {route.difficulty_class}
            </dd>
          </div>

          {#if route.exposure}
            <div class="flex justify-between">
              <dt class="text-slate-500 dark:text-slate-400">Exposure</dt>
              <dd class="font-medium {exposureColors[route.exposure]}">
                {route.exposure}
              </dd>
            </div>
          {/if}

          {#if route.typical_time_hours}
            <div class="flex justify-between">
              <dt class="text-slate-500 dark:text-slate-400">Typical Time</dt>
              <dd class="font-medium text-slate-900 dark:text-white">
                {route.typical_time_hours} hours
              </dd>
            </div>
          {/if}
        </dl>
      </div>

      <!-- Trailhead Card -->
      {#if route.trailhead_name}
        <div class="rounded-card border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h3 class="font-semibold text-slate-900 dark:text-white">Trailhead</h3>

          <dl class="mt-4 space-y-3 text-sm">
            <div>
              <dt class="text-slate-500 dark:text-slate-400">Name</dt>
              <dd class="mt-1 font-medium text-slate-900 dark:text-white">
                {route.trailhead_name}
              </dd>
            </div>

            {#if route.trailhead_elevation}
              <div class="flex justify-between">
                <dt class="text-slate-500 dark:text-slate-400">Elevation</dt>
                <dd class="stats-number font-medium text-slate-900 dark:text-white">
                  {route.trailhead_elevation.toLocaleString()}'
                </dd>
              </div>
            {/if}

            {#if route.trailhead_latitude && route.trailhead_longitude}
              <div>
                <dt class="text-slate-500 dark:text-slate-400">Coordinates</dt>
                <dd class="stats-number mt-1 text-slate-700 dark:text-slate-300">
                  {route.trailhead_latitude.toFixed(4)}°N, {Math.abs(route.trailhead_longitude).toFixed(4)}°W
                </dd>
              </div>
            {/if}
          </dl>
        </div>
      {/if}
    </div>
  </div>

  <!-- Back to Peak -->
  <div class="mt-12 border-t border-slate-200 pt-8 dark:border-slate-700">
    <a
      href="/peaks/{peak.slug}"
      class="inline-flex items-center gap-2 text-sm font-medium text-mountain-blue hover:underline dark:text-sunrise"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to {peak.name}
    </a>
  </div>
</Container>
