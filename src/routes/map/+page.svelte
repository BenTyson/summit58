<script lang="ts">
  import { browser } from '$app/environment';
  import Container from '$lib/components/ui/Container.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const peaks = $derived(data.peaks);
  const summitedPeakIds = $derived(new Set(data.summitedPeakIds));
  const isLoggedIn = $derived(data.isLoggedIn);
  const trails = $derived(data.trails);

  // Stats
  const totalPeaks = $derived(peaks.length);
  const summitedCount = $derived(summitedPeakIds.size);
  const trailCount = $derived(trails.filter(t => t.geometry).length);

  // Filter state
  let showSummitedOnly = $state(false);
  let selectedClass = $state<number | null>(null);
  let selectedRange = $state<string | null>(null);
  let showTrails = $state(false);

  // Get unique ranges
  const ranges = $derived([...new Set(peaks.map(p => p.range))].sort());

  // Filtered peaks
  const filteredPeaks = $derived(() => {
    return peaks.filter(peak => {
      if (showSummitedOnly && !summitedPeakIds.has(peak.id)) return false;
      if (selectedClass !== null && peak.difficultyClass !== selectedClass) return false;
      if (selectedRange !== null && peak.range !== selectedRange) return false;
      return true;
    });
  });

  function clearFilters() {
    showSummitedOnly = false;
    selectedClass = null;
    selectedRange = null;
  }

  const hasFilters = $derived(showSummitedOnly || selectedClass !== null || selectedRange !== null);
</script>

<svelte:head>
  <title>Peak Map | Cairn58</title>
  <meta name="description" content="Interactive topographic map of all 58 Colorado 14ers. Filter by difficulty, range, and track your summited peaks." />
  <meta property="og:title" content="Interactive Peak Map | Cairn58" />
  <meta property="og:description" content="Explore all 58 Colorado 14ers on an interactive topographic map." />
  <link rel="canonical" href="https://cairn58.com/map" />
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900">
  <!-- Header -->
  <div class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
    <Container class="py-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="heading-page text-slate-900 dark:text-white flex items-center gap-3">
            <svg class="h-8 w-8 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Peak Map
          </h1>
          <p class="text-slate-600 dark:text-slate-400 mt-1">
            {#if isLoggedIn}
              {summitedCount} of {totalPeaks} peaks summited
            {:else}
              All {totalPeaks} Colorado 14ers
            {/if}
          </p>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap items-center gap-4 text-sm">
          <span class="text-slate-500 dark:text-slate-400">Class:</span>
          <div class="flex items-center gap-1">
            <svg class="w-5 h-5" viewBox="0 0 20 20"><path d="M10 2L18 16H2Z" fill="#22c55e" stroke="white" stroke-width="1.5"/></svg>
            <span class="text-slate-600 dark:text-slate-300 font-medium">1</span>
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-5 h-5" viewBox="0 0 20 20"><path d="M10 2L18 16H2Z" fill="#3b82f6" stroke="white" stroke-width="1.5"/></svg>
            <span class="text-slate-600 dark:text-slate-300 font-medium">2</span>
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-5 h-5" viewBox="0 0 20 20"><path d="M10 2L18 16H2Z" fill="#eab308" stroke="white" stroke-width="1.5"/></svg>
            <span class="text-slate-600 dark:text-slate-300 font-medium">3</span>
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-5 h-5" viewBox="0 0 20 20"><path d="M10 2L18 16H2Z" fill="#ef4444" stroke="white" stroke-width="1.5"/></svg>
            <span class="text-slate-600 dark:text-slate-300 font-medium">4</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-3 mt-4">
        {#if trailCount > 0}
          <button
            onclick={() => showTrails = !showTrails}
            class="
              px-3 py-1.5 rounded-full text-sm border transition-all flex items-center gap-1.5
              {showTrails
                ? 'border-sunrise bg-sunrise/10 text-sunrise font-medium'
                : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300'}
            "
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Show Trails ({trailCount})
          </button>
        {/if}

        {#if isLoggedIn}
          <button
            onclick={() => showSummitedOnly = !showSummitedOnly}
            class="
              px-3 py-1.5 rounded-full text-sm border transition-all
              {showSummitedOnly
                ? 'border-sunrise bg-sunrise/10 text-sunrise font-medium'
                : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300'}
            "
          >
            Summited only
          </button>
        {/if}

        <!-- Class filter -->
        <select
          bind:value={selectedClass}
          class="
            px-3 py-1.5 rounded-lg text-sm
            border border-slate-200 dark:border-slate-600
            bg-white dark:bg-slate-700
            text-slate-700 dark:text-slate-200
            focus:border-sunrise focus:ring-1 focus:ring-sunrise
          "
        >
          <option value={null}>All Classes</option>
          <option value={1}>Class 1</option>
          <option value={2}>Class 2</option>
          <option value={3}>Class 3</option>
          <option value={4}>Class 4</option>
        </select>

        <!-- Range filter -->
        <select
          bind:value={selectedRange}
          class="
            px-3 py-1.5 rounded-lg text-sm
            border border-slate-200 dark:border-slate-600
            bg-white dark:bg-slate-700
            text-slate-700 dark:text-slate-200
            focus:border-sunrise focus:ring-1 focus:ring-sunrise
          "
        >
          <option value={null}>All Ranges</option>
          {#each ranges as range}
            <option value={range}>{range}</option>
          {/each}
        </select>

        {#if hasFilters}
          <button
            onclick={clearFilters}
            class="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Clear filters
          </button>
        {/if}

        <span class="text-sm text-slate-500 dark:text-slate-400 ml-auto">
          Showing {filteredPeaks().length} peaks
        </span>
      </div>
    </Container>
  </div>

  <!-- Map -->
  <div class="h-[calc(100vh-12rem)]">
    {#if browser}
      {#await import('$lib/components/map/PeakMap.svelte') then { default: PeakMap }}
        <PeakMap
          peaks={filteredPeaks()}
          {summitedPeakIds}
          {trails}
          {showTrails}
        />
      {/await}
    {:else}
      <div class="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
        <div class="text-center">
          <svg class="h-12 w-12 text-slate-400 mx-auto mb-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p class="text-slate-500 dark:text-slate-400">Loading map...</p>
        </div>
      </div>
    {/if}
  </div>
</div>
