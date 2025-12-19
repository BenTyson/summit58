<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import PeakCard from '$lib/components/peak/PeakCard.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const stats = [
    { value: '58', label: 'Fourteeners' },
    { value: "14,439'", label: 'Highest Peak' },
    { value: '7', label: 'Mountain Ranges' },
    { value: '4', label: 'Difficulty Classes' }
  ];
</script>

<svelte:head>
  <title>Summit58 - The Modern Guide to Colorado's 14ers</title>
  <meta
    name="description"
    content="Beautiful, mobile-first guide to all 58 Colorado fourteeners. Stats at a glance, conditions reports, and everything you need to summit."
  />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-[70vh] flex items-center overflow-hidden">
  <!-- Animated gradient background -->
  <div
    class="
      absolute inset-0
      bg-gradient-to-br from-mountain-navy via-mountain-blue to-mountain-mist
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
    "
  >
    <!-- Subtle grid pattern -->
    <div
      class="absolute inset-0 opacity-10"
      style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 40px 40px;"
    ></div>

    <!-- Animated particles/stars -->
    {#each Array(15) as _, i}
      <div
        class="absolute h-1 w-1 rounded-full bg-white/30 animate-pulse-subtle"
        style="
          left: {5 + (i * 7) % 90}%;
          top: {10 + (i * 11) % 70}%;
          animation-delay: {(i * 0.3) % 2}s;
        "
      ></div>
    {/each}
  </div>

  <!-- Mountain silhouette layers -->
  <div class="absolute inset-x-0 bottom-0 h-48 pointer-events-none">
    <svg
      class="absolute bottom-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 1440 320"
    >
      <!-- Far mountains -->
      <path
        class="fill-mountain-mist/30 dark:fill-slate-700/30"
        d="M0,320 L0,200 L240,280 L480,160 L720,220 L960,120 L1200,180 L1440,100 L1440,320 Z"
      ></path>
      <!-- Mid mountains -->
      <path
        class="fill-mountain-blue-light/50 dark:fill-slate-800/50"
        d="M0,320 L0,240 L180,300 L400,200 L600,260 L800,160 L1000,220 L1200,140 L1440,200 L1440,320 Z"
      ></path>
      <!-- Near mountains -->
      <path
        class="fill-white dark:fill-slate-900"
        d="M0,320 L0,280 L200,320 L360,260 L520,300 L680,240 L840,290 L1000,220 L1160,280 L1320,240 L1440,280 L1440,320 Z"
      ></path>
    </svg>
  </div>

  <!-- Content -->
  <Container class="relative z-10 py-20 text-center">
    <div class="animate-fade-in-up">
      <p class="text-sunrise font-medium tracking-widest uppercase text-sm mb-4">
        Colorado's Finest
      </p>
      <h1 class="heading-hero text-white">
        Summit<span class="text-sunrise">58</span>
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-xl text-slate-300 sm:text-2xl">
        The modern guide to Colorado's 14ers
      </p>
      <p class="mx-auto mt-3 max-w-xl text-slate-400">
        Mobile-first. Stats at a glance. Everything you need to summit.
      </p>
    </div>

    <div class="mt-10 flex flex-col justify-center gap-4 sm:flex-row animate-fade-in-up" style="animation-delay: 200ms">
      <a href="/peaks" class="btn-primary text-lg px-8 py-4">
        Explore All Peaks
        <svg
          class="h-5 w-5 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </a>
    </div>
  </Container>
</section>

<!-- Stats Section -->
<section class="relative py-16 bg-white dark:bg-slate-900 overflow-hidden">
  <!-- Subtle background pattern -->
  <div class="absolute inset-0 opacity-5 pointer-events-none">
    <div
      class="absolute inset-0"
      style="background: radial-gradient(circle at center, var(--color-sunrise) 0%, transparent 50%);"
    ></div>
  </div>

  <Container class="relative">
    <h2 class="text-center heading-section text-slate-900 dark:text-white mb-12">
      By the Numbers
    </h2>

    <div class="grid grid-cols-2 gap-6 md:grid-cols-4 stagger-children">
      {#each stats as stat, i}
        <div
          class="
            group relative p-6 rounded-2xl
            bg-gradient-to-br from-slate-50 to-white
            border border-slate-200
            transition-all duration-300
            hover:shadow-card-elevated hover:-translate-y-1
            dark:from-slate-800 dark:to-slate-800/50 dark:border-slate-700
            animate-fade-in-up
          "
          style="animation-delay: {i * 100}ms"
        >
          <div class="stat-display text-mountain-blue dark:text-sunrise">
            {stat.value}
          </div>
          <div class="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            {stat.label}
          </div>

          <!-- Decorative corner accent -->
          <div
            class="
              absolute top-0 right-0 h-16 w-16
              bg-gradient-to-br from-sunrise/10 to-transparent
              rounded-tr-2xl rounded-bl-full
              opacity-0 group-hover:opacity-100 transition-opacity
            "
          ></div>
        </div>
      {/each}
    </div>
  </Container>
</section>

<!-- Featured Peaks -->
<section class="py-16 bg-slate-50 dark:bg-slate-800/50">
  <Container>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="heading-section text-slate-900 dark:text-white">
          Featured <span class="text-sunrise">Peaks</span>
        </h2>
        <p class="mt-2 text-slate-600 dark:text-slate-400">
          Start with these popular fourteeners
        </p>
      </div>
      <a
        href="/peaks"
        class="hidden sm:inline-flex items-center gap-2 font-medium text-mountain-blue hover:text-sunrise transition-colors dark:text-sunrise dark:hover:text-sunrise-light"
      >
        View all
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </div>

    {#if data.peaks && data.peaks.length > 0}
      <div class="space-y-4 stagger-children">
        {#each data.peaks as peak, i}
          <div class="animate-fade-in-up" style="animation-delay: {i * 75}ms">
            <PeakCard {peak} featured={i === 0} />
          </div>
        {/each}
      </div>
    {:else}
      <div
        class="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
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
              d="M12 2L2 22h20L12 2z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
          No peaks loaded
        </h3>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Make sure Supabase is running and the database is seeded.
        </p>
      </div>
    {/if}

    <div class="mt-10 text-center">
      <a href="/peaks" class="btn-secondary">
        View all {data.totalPeaks || 0} peaks
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </div>
  </Container>
</section>
