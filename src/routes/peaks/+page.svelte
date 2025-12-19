<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import PeakCard from '$lib/components/peak/PeakCard.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  // Filter state
  let selectedClass = $state<number | null>(null);
  let selectedRange = $state<string | null>(null);

  // Get unique ranges
  const ranges = [...new Set(data.peaks.map((p) => p.range))].sort();

  // Filtered peaks
  let filteredPeaks = $derived(
    data.peaks.filter((peak) => {
      if (selectedClass && peak.standard_route?.difficulty_class !== selectedClass) {
        return false;
      }
      if (selectedRange && peak.range !== selectedRange) {
        return false;
      }
      return true;
    })
  );

  function clearFilters() {
    selectedClass = null;
    selectedRange = null;
  }
</script>

<svelte:head>
  <title>All 58 Colorado 14ers | Summit58</title>
  <meta
    name="description"
    content="Browse all 58 Colorado fourteeners sorted by elevation. Filter by difficulty class and mountain range. Find your next summit."
  />
</svelte:head>

<Container class="py-8 sm:py-12">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">Colorado 14ers</h1>
    <p class="mt-2 text-slate-600 dark:text-slate-400">
      All {data.peaks.length} fourteeners, sorted by elevation
    </p>
  </div>

  <!-- Filters -->
  <div class="mb-6 flex flex-wrap gap-4">
    <!-- Class Filter -->
    <div>
      <label for="class-filter" class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Difficulty
      </label>
      <select
        id="class-filter"
        bind:value={selectedClass}
        class="tap-target rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-mountain-blue focus:outline-none focus:ring-1 focus:ring-mountain-blue dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      >
        <option value={null}>All Classes</option>
        <option value={1}>Class 1</option>
        <option value={2}>Class 2</option>
        <option value={3}>Class 3</option>
        <option value={4}>Class 4</option>
      </select>
    </div>

    <!-- Range Filter -->
    <div>
      <label for="range-filter" class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Range
      </label>
      <select
        id="range-filter"
        bind:value={selectedRange}
        class="tap-target rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-mountain-blue focus:outline-none focus:ring-1 focus:ring-mountain-blue dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      >
        <option value={null}>All Ranges</option>
        {#each ranges as range}
          <option value={range}>{range}</option>
        {/each}
      </select>
    </div>

    <!-- Clear Filters -->
    {#if selectedClass || selectedRange}
      <div class="flex items-end">
        <button
          onclick={clearFilters}
          class="tap-target rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          Clear filters
        </button>
      </div>
    {/if}
  </div>

  <!-- Results count -->
  <p class="mb-4 text-sm text-slate-600 dark:text-slate-400">
    Showing {filteredPeaks.length} of {data.peaks.length} peaks
  </p>

  <!-- Peak List -->
  {#if filteredPeaks.length > 0}
    <div class="space-y-4">
      {#each filteredPeaks as peak}
        <PeakCard {peak} />
      {/each}
    </div>
  {:else}
    <div class="rounded-card border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <p class="text-slate-600 dark:text-slate-400">No peaks match your filters.</p>
      <button
        onclick={clearFilters}
        class="mt-4 text-sm font-medium text-mountain-blue hover:underline dark:text-sunrise"
      >
        Clear filters
      </button>
    </div>
  {/if}
</Container>
