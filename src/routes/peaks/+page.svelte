<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import PeakCard from '$lib/components/peak/PeakCard.svelte';
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

  const classOptions = [
    { value: null, label: 'All' },
    { value: 1, label: 'Class 1' },
    { value: 2, label: 'Class 2' },
    { value: 3, label: 'Class 3' },
    { value: 4, label: 'Class 4' }
  ];
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
  <div class="mb-10">
    <h1 class="heading-page text-slate-900 dark:text-white">
      Colorado <span class="text-sunrise">14ers</span>
    </h1>
    <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">
      All {data.peaks.length} fourteeners, sorted by elevation
    </p>
  </div>

  <!-- Filters -->
  <div
    class="
      mb-8 p-4 rounded-xl
      bg-slate-50 dark:bg-slate-800/50
      border border-slate-200 dark:border-slate-700
    "
  >
    <div class="flex flex-wrap items-end gap-6">
      <!-- Class Filter - Chip Style -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Difficulty
        </label>
        <div class="flex flex-wrap gap-2">
          {#each classOptions as option}
            <button
              onclick={() => (selectedClass = option.value)}
              class="
                px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200
                border
                {selectedClass === option.value
                  ? option.value
                    ? `bg-class-${option.value} text-white border-class-${option.value} shadow-glow-class-${option.value}`
                    : 'bg-mountain-blue text-white border-mountain-blue'
                  : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'}
              "
            >
              {option.label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Range Filter -->
      <div class="flex-1 min-w-[200px]">
        <label
          for="range-filter"
          class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3"
        >
          Mountain Range
        </label>
        <select
          id="range-filter"
          bind:value={selectedRange}
          class="
            w-full tap-target rounded-lg
            border border-slate-200 dark:border-slate-600
            bg-white dark:bg-slate-700
            px-4 py-2.5 text-sm
            text-slate-900 dark:text-white
            focus:border-sunrise focus:outline-none focus:ring-2 focus:ring-sunrise/20
            transition-all duration-200
          "
        >
          <option value={null}>All Ranges</option>
          {#each ranges as range}
            <option value={range}>{range}</option>
          {/each}
        </select>
      </div>

      <!-- Clear Filters -->
      {#if selectedClass || selectedRange}
        <button
          onclick={clearFilters}
          class="
            tap-target px-4 py-2.5 rounded-lg
            text-sm font-medium text-slate-600 dark:text-slate-400
            border border-slate-200 dark:border-slate-600
            hover:bg-slate-100 dark:hover:bg-slate-700
            transition-all duration-200
            flex items-center gap-2
          "
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear
        </button>
      {/if}
    </div>
  </div>

  <!-- Results count -->
  <p class="mb-6 text-sm text-slate-600 dark:text-slate-400">
    Showing <span class="font-semibold text-slate-900 dark:text-white">{filteredPeaks.length}</span>
    of {data.peaks.length} peaks
  </p>

  <!-- Peak List -->
  {#if filteredPeaks.length > 0}
    <div class="space-y-4 stagger-children">
      {#each filteredPeaks as peak, i}
        <div
          class="animate-fade-in-up"
          style="animation-delay: {Math.min(i * 50, 500)}ms"
        >
          <PeakCard {peak} />
        </div>
      {/each}
    </div>
  {:else}
    <div
      class="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800"
    >
      <div
        class="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4"
      >
        <svg
          class="h-8 w-8 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <p class="text-lg font-medium text-slate-900 dark:text-white">No peaks match your filters</p>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Try adjusting your search criteria
      </p>
      <button
        onclick={clearFilters}
        class="mt-6 btn-primary"
      >
        Clear all filters
      </button>
    </div>
  {/if}
</Container>
