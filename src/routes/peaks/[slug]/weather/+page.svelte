<script lang="ts">
  import type { ElevationBandForecast } from '$lib/types/database';
  import Container from '$lib/components/ui/Container.svelte';
  import ElevationBandSelector from '$lib/components/weather/ElevationBandSelector.svelte';
  import WeatherSummaryText from '$lib/components/weather/WeatherSummaryText.svelte';
  import HikerInsights from '$lib/components/weather/HikerInsights.svelte';
  import WeatherHero from '$lib/components/weather/WeatherHero.svelte';
  import { onMount } from 'svelte';

  let ForecastTable: typeof import('$lib/components/weather/ForecastTable.svelte').default | null = $state(null);
  onMount(async () => {
    const mod = await import('$lib/components/weather/ForecastTable.svelte');
    ForecastTable = mod.default;
  });
  import Skeleton from '$lib/components/ui/Skeleton.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const peak = $derived(data.peak);
  const forecast = $derived(data.forecast);
  const userIsPro = $derived(data.isPro);

  type BandKey = 'summit' | 'mid' | 'base';
  let selectedBand: BandKey = $state('summit');

  const bandInfos = $derived(
    forecast
      ? [
          { key: 'summit' as const, label: 'Summit', elevation_ft: forecast.bands.summit.elevation_ft },
          { key: 'mid' as const, label: 'Mid Mountain', elevation_ft: forecast.bands.mid.elevation_ft },
          { key: 'base' as const, label: 'Trailhead', elevation_ft: forecast.bands.base.elevation_ft }
        ]
      : []
  );

  const activeBand: ElevationBandForecast | null = $derived(
    forecast ? forecast.bands[selectedBand] : null
  );

  const today = $derived(activeBand?.days[0] ?? null);

  function timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }

  // Sunrise/sunset from first day
  const sunTimes = $derived(today ? { sunrise: today.sunrise, sunset: today.sunset } : null);

  function formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  const canonicalUrl = $derived(`https://saltgoat.co/peaks/${peak.slug}/weather`);
  const pageTitle = $derived(`${peak.name} Weather Forecast — 7-Day Mountain Forecast`);
  const pageDescription = $derived(
    `7-day mountain weather forecast for ${peak.name} (${peak.elevation.toLocaleString()}') in Colorado. Elevation-banded conditions for summit, mid-mountain, and trailhead with hiker insights and sub-daily detail.`
  );

  const jsonLd = $derived(
    forecast && activeBand
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: pageTitle,
          description: pageDescription,
          url: canonicalUrl,
          mainEntity: {
            '@type': 'Place',
            name: peak.name,
            geo: {
              '@type': 'GeoCoordinates',
              latitude: peak.latitude,
              longitude: peak.longitude,
              elevation: {
                '@type': 'QuantitativeValue',
                value: peak.elevation,
                unitCode: 'FOT'
              }
            }
          },
          specialty: 'Mountain Weather Forecasting',
          about: {
            '@type': 'Dataset',
            name: `${peak.name} Mountain Weather Forecast`,
            description: `7-day elevation-banded weather forecast for ${peak.name}, Colorado 14er`,
            temporalCoverage: forecast.bands.summit.days.length > 0
              ? `${forecast.bands.summit.days[0].date}/${forecast.bands.summit.days[forecast.bands.summit.days.length - 1].date}`
              : undefined,
            dateModified: forecast.fetched_at
          },
          publisher: {
            '@type': 'Organization',
            name: 'SaltGoat',
            url: 'https://saltgoat.co'
          }
        })
      : null
  );
</script>

<svelte:head>
  <title>{pageTitle} | SaltGoat</title>
  <meta name="description" content={pageDescription} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content="{pageTitle} | SaltGoat" />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:site_name" content="SaltGoat" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="{pageTitle} | SaltGoat" />
  <meta name="twitter:description" content={pageDescription} />
  {#if jsonLd}
    {@html `<script type="application/ld+json">${jsonLd}</script>`}
  {/if}
</svelte:head>

<Container class="py-8 sm:py-12">
  <!-- Breadcrumb -->
  <nav class="mb-6 text-sm text-slate-500 dark:text-slate-400 animate-fade-in-up">
    <a href="/peaks" class="hover:text-accent transition-colors">Peaks</a>
    <span class="mx-2">&rsaquo;</span>
    <a href="/peaks/{peak.slug}" class="hover:text-accent transition-colors">{peak.name}</a>
    <span class="mx-2">&rsaquo;</span>
    <span class="text-slate-700 dark:text-slate-200">Weather</span>
  </nav>

  <!-- Header -->
  <div class="mb-6 animate-fade-in-up" style="animation-delay: 50ms">
    <h1 class="font-serif text-3xl sm:text-4xl text-slate-900 dark:text-white">
      {peak.name} Weather Forecast
    </h1>
    <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
      <span>{peak.elevation.toLocaleString()}' elevation</span>
      {#if forecast}
        <span class="text-slate-300 dark:text-slate-600">&middot;</span>
        <span>Updated {timeAgo(forecast.fetched_at)}</span>
      {/if}
    </div>
  </div>

  {#if forecast && activeBand}
    <!-- Elevation Band Selector (Pro only) -->
    <div class="animate-fade-in-up relative" style="animation-delay: 100ms">
      {#if !userIsPro}
        <div class="pointer-events-none select-none blur-[2px] opacity-50">
          <ElevationBandSelector
            bands={bandInfos}
            selected={selectedBand}
            onSelect={() => {}}
          />
        </div>
      {:else}
        <ElevationBandSelector
          bands={bandInfos}
          selected={selectedBand}
          onSelect={(band) => { selectedBand = band; }}
        />
      {/if}
    </div>

    <!-- Pro Upgrade Banner (free users) -->
    {#if !userIsPro}
      <div class="mt-6 animate-fade-in-up rounded-xl border border-accent/30 bg-accent/5 dark:bg-accent/10 p-5" style="animation-delay: 125ms">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div class="flex-1">
            <h3 class="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <svg class="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Unlock Full Mountain Forecast
            </h3>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Upgrade to Pro for elevation-banded forecasts, sub-daily detail (AM/PM/Night), hiker insights, and natural language summaries.
            </p>
          </div>
          <a
            href="/pricing"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-accent hover:bg-accent/90 transition-colors shrink-0"
          >
            Upgrade to Pro
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    {/if}

    <!-- Forecast content panel -->
    <div id="forecast-panel" role="tabpanel" aria-label="{activeBand.label} forecast">

    <!-- Natural Language Summary (Pro only) -->
    {#if userIsPro}
      <div class="mt-6 animate-fade-in-up" style="animation-delay: 150ms">
        <WeatherSummaryText summary={activeBand.summary} />
      </div>
    {/if}

    <!-- Hiker Insights (Pro only) -->
    {#if userIsPro && forecast.insights.length > 0}
      <div class="mt-6 animate-fade-in-up" style="animation-delay: 175ms">
        <h2 class="heading-section text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Hiker Insights
        </h2>
        <HikerInsights insights={forecast.insights} />
      </div>
    {/if}

    <!-- Current Conditions Hero -->
    {#if today}
      <div class="mt-6 animate-fade-in-up" style="animation-delay: 200ms">
        <h2 class="heading-section text-slate-900 dark:text-white mb-3">
          Current Conditions — {activeBand.label}
        </h2>
        <WeatherHero day={today} />
      </div>
    {/if}

    <!-- Forecast Table (lazy-loaded) -->
    <div class="mt-8 animate-fade-in-up" style="animation-delay: 250ms">
      <h2 class="heading-section text-slate-900 dark:text-white mb-3">
        {userIsPro ? '7-Day Detailed Forecast' : '7-Day Summit Forecast'}
      </h2>
      {#if ForecastTable}
        <ForecastTable days={activeBand.days} bandElevation={activeBand.elevation_ft} />
      {:else}
        <div class="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden" role="status" aria-label="Loading forecast table">
          {#each Array(8) as _, row}
            <div class="flex gap-2 px-4 py-2.5 {row < 7 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''}">
              <Skeleton width="120px" height="0.875rem" />
              {#each Array(7) as _}
                <Skeleton width="60px" height="0.875rem" class="flex-shrink-0" />
              {/each}
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Sunrise / Sunset -->
    {#if sunTimes}
      <div class="mt-6 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 animate-fade-in-up" style="animation-delay: 275ms">
        <span class="flex items-center gap-1.5">
          <svg class="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a5 5 0 100-10 5 5 0 000 10z" clip-rule="evenodd" />
            <path d="M2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zm13 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0115 10z" />
          </svg>
          Sunrise {formatTime(sunTimes.sunrise)}
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="h-4 w-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15a5 5 0 100-10 5 5 0 000 10z" />
            <path d="M2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zm13 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0115 10zM4 16h12" stroke="currentColor" stroke-width="1" fill="none" />
          </svg>
          Sunset {formatTime(sunTimes.sunset)}
        </span>
      </div>
    {/if}

    </div><!-- /forecast-panel -->

    <!-- Attribution -->
    <p class="mt-8 text-xs text-slate-400 dark:text-slate-500 animate-fade-in-up" style="animation-delay: 300ms">
      Powered by Open-Meteo. Forecasts are model-based estimates and may not reflect actual conditions.
      Always check current conditions before heading above treeline.
    </p>
  {:else}
    <!-- No forecast data -->
    <div class="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-8 text-center">
      <div class="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
        <svg class="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      </div>
      <p class="text-slate-600 dark:text-slate-400">No forecast data available yet.</p>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-500">Weather data is updated several times daily.</p>
    </div>
  {/if}

  <!-- Back link -->
  <div class="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
    <a
      href="/peaks/{peak.slug}"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-mountain-blue dark:text-accent hover:bg-mountain-blue/10 dark:hover:bg-accent/10 transition-colors"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to {peak.name}
    </a>
  </div>
</Container>
