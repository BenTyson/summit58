<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import PeakCard from '$lib/components/peak/PeakCard.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>Summit58 - The Modern Guide to Colorado's 14ers</title>
  <meta
    name="description"
    content="Beautiful, mobile-first guide to all 58 Colorado fourteeners. Stats at a glance, conditions reports, and everything you need to summit."
  />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-mountain-blue py-16 text-white sm:py-24 dark:bg-slate-900">
  <Container>
    <div class="text-center">
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Summit58</h1>
      <p class="mx-auto mt-4 max-w-2xl text-xl text-slate-300 sm:text-2xl">
        The modern guide to Colorado's 14ers
      </p>
      <p class="mx-auto mt-2 max-w-xl text-slate-400">
        Mobile-first. Stats at a glance. Everything you need to summit.
      </p>
      <div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <a
          href="/peaks"
          class="inline-flex items-center justify-center rounded-lg bg-sunrise px-6 py-3 font-semibold text-white transition-colors hover:bg-sunrise-dark"
        >
          Explore All Peaks
        </a>
      </div>
    </div>
  </Container>

  <!-- Decorative mountain silhouette -->
  <div class="absolute inset-x-0 bottom-0 h-16 overflow-hidden">
    <svg
      class="absolute bottom-0 h-24 w-full text-white dark:text-slate-900"
      preserveAspectRatio="none"
      viewBox="0 0 1200 120"
      fill="currentColor"
    >
      <path
        d="M0,120 L0,60 L200,100 L400,40 L600,80 L800,20 L1000,70 L1200,30 L1200,120 Z"
      ></path>
    </svg>
  </div>
</section>

<!-- Featured Peaks -->
<section class="py-12 sm:py-16">
  <Container>
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Featured Peaks</h2>
      <a
        href="/peaks"
        class="text-sm font-medium text-mountain-blue hover:underline dark:text-sunrise"
      >
        View all
      </a>
    </div>

    {#if data.peaks && data.peaks.length > 0}
      <div class="mt-6 space-y-4">
        {#each data.peaks as peak}
          <PeakCard {peak} />
        {/each}
      </div>
    {:else}
      <div class="mt-8 rounded-card border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
        <svg
          class="mx-auto h-12 w-12 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 2L2 22h20L12 2z"
          />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-slate-900 dark:text-white">No peaks loaded</h3>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Make sure Supabase is running and the database is seeded.
        </p>
      </div>
    {/if}

    <div class="mt-8 text-center">
      <a
        href="/peaks"
        class="inline-flex items-center gap-2 font-medium text-mountain-blue hover:underline dark:text-sunrise"
      >
        View all {data.totalPeaks || 0} peaks
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </Container>
</section>

<!-- Stats Section -->
<section class="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-700 dark:bg-slate-800">
  <Container>
    <div class="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
      <div>
        <div class="stats-number text-3xl font-bold text-mountain-blue dark:text-white">58</div>
        <div class="mt-1 text-sm text-slate-600 dark:text-slate-400">Fourteeners</div>
      </div>
      <div>
        <div class="stats-number text-3xl font-bold text-mountain-blue dark:text-white">14,439'</div>
        <div class="mt-1 text-sm text-slate-600 dark:text-slate-400">Highest (Mt. Elbert)</div>
      </div>
      <div>
        <div class="stats-number text-3xl font-bold text-mountain-blue dark:text-white">7</div>
        <div class="mt-1 text-sm text-slate-600 dark:text-slate-400">Mountain Ranges</div>
      </div>
      <div>
        <div class="stats-number text-3xl font-bold text-mountain-blue dark:text-white">4</div>
        <div class="mt-1 text-sm text-slate-600 dark:text-slate-400">Difficulty Classes</div>
      </div>
    </div>
  </Container>
</section>
