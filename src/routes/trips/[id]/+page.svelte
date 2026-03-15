<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import ShareButton from '$lib/components/ui/ShareButton.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const trip = $derived(data.trip);
  const isOwner = $derived(data.isOwner);

  function formatDate(dateStr: string): string {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function formatDateRange(startDate: string, endDate: string | null): string {
    if (!endDate || startDate === endDate) return formatDate(startDate);
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  const ownerName = $derived(trip.owner?.display_name || trip.owner?.username || 'A climber');
  const canonicalUrl = $derived(`https://saltgoat.co/trips/${trip.id}`);
</script>

<svelte:head>
  <title>{trip.title} | SaltGoat</title>
  <meta name="description" content="{ownerName}'s trip plan: {trip.peaks?.map(p => p.peak.name).join(', ')}" />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content="{trip.title} | SaltGoat" />
  <meta property="og:description" content="{ownerName}'s trip plan: {trip.peaks?.map(p => p.peak.name).join(', ')}" />
  <meta property="og:site_name" content="SaltGoat" />
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900">
  <Container class="py-8 sm:py-12">
    <!-- Private trip banner -->
    {#if isOwner && !trip.is_public}
      <div class="mb-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
        <svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p class="text-sm text-amber-700 dark:text-amber-400">This trip is private. Only you can see this page.</p>
      </div>
    {/if}

    <!-- Header -->
    <div class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
      <div class="p-6 sm:p-8">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <a href="/" class="hover:text-sunrise transition-colors">Home</a>
          <span>›</span>
          <span>Trip</span>
        </nav>

        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {trip.title}
            </h1>
            <p class="mt-2 text-slate-500 dark:text-slate-400">
              {formatDateRange(trip.start_date, trip.end_date)}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full text-xs font-medium {trip.is_public ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}">
              {trip.is_public ? 'Public' : 'Private'}
            </span>
            {#if trip.is_public}
              <ShareButton url={canonicalUrl} title={trip.title} text="{ownerName}'s trip plan on SaltGoat" />
            {/if}
          </div>
        </div>

        <!-- Owner info -->
        {#if trip.owner}
          <div class="mt-4 flex items-center gap-3">
            {#if trip.owner.avatar_url}
              <img src={trip.owner.avatar_url} alt="" class="w-8 h-8 rounded-full object-cover" />
            {:else}
              <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            {/if}
            <a href="/users/{trip.owner.id}" class="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-sunrise transition-colors">
              {ownerName}
            </a>
          </div>
        {/if}

        {#if trip.notes}
          <p class="mt-4 text-slate-600 dark:text-slate-400">{trip.notes}</p>
        {/if}
      </div>
    </div>

    <!-- Peaks -->
    {#if trip.peaks && trip.peaks.length > 0}
      <div class="mt-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Peaks ({trip.peaks.length})
        </h2>
        <div class="space-y-3">
          {#each trip.peaks as tripPeak}
            <a
              href="/peaks/{tripPeak.peak.slug}"
              class="block rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card p-4 hover:shadow-card-hover transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold text-slate-900 dark:text-white">{tripPeak.peak.name}</h3>
                  <div class="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <span>{tripPeak.peak.elevation.toLocaleString()}'</span>
                    <span>{tripPeak.peak.range}</span>
                    {#if tripPeak.route}
                      <span class="flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-class-{tripPeak.route.difficulty_class}"></span>
                        {tripPeak.route.name}
                      </span>
                    {/if}
                  </div>
                </div>
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </Container>
</div>
