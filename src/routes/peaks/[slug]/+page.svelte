<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { browser } from '$app/environment';
  import { PUBLIC_SUPABASE_URL } from '$env/static/public';
  import Container from '$lib/components/ui/Container.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import PeakHero from '$lib/components/peak/PeakHero.svelte';
  import StatsBar from '$lib/components/peak/StatsBar.svelte';
  import QuickFacts from '$lib/components/peak/QuickFacts.svelte';
  import RouteCard from '$lib/components/route/RouteCard.svelte';
  import PeakCard from '$lib/components/peak/PeakCard.svelte';
  import ShareButton from '$lib/components/ui/ShareButton.svelte';
  import SummitButton from '$lib/components/summit/SummitButton.svelte';
  import SummitModal from '$lib/components/summit/SummitModal.svelte';
  import ReviewSection from '$lib/components/review/ReviewSection.svelte';
  import ImageGallery from '$lib/components/gallery/ImageGallery.svelte';
  import ImageUploader from '$lib/components/gallery/ImageUploader.svelte';
  import WeatherCard from '$lib/components/weather/WeatherCard.svelte';
  import TrailReportSection from '$lib/components/trail/TrailReportSection.svelte';
  import type { SummitFormData } from '$lib/components/summit/SummitModal.svelte';
  import type { ReviewFormData } from '$lib/components/review/ReviewForm.svelte';
  import type { TrailReportFormData } from '$lib/components/trail/TrailReportForm.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const peak = $derived(data.peak);
  const standardRoute = $derived(peak.routes?.find((r) => r.is_standard));
  const userSummits = $derived(data.userSummits);
  const isLoggedIn = $derived(data.isLoggedIn);
  const currentUserId = $derived(data.currentUserId);
  const isAdmin = $derived(data.isAdmin);
  const reviews = $derived(data.reviews);
  const userReview = $derived(data.userReview);
  const avgRating = $derived(data.avgRating);
  const totalReviews = $derived(data.totalReviews);
  const images = $derived(data.images);
  const conditions = $derived(data.conditions);
  const trailReports = $derived(data.trailReports);
  const summitLimit = $derived(data.summitLimit);
  const photoLimit = $derived(data.photoLimit);
  const isWatched = $derived(data.isWatched);
  const relatedPeaks = $derived(data.relatedPeaks);

  let modalOpen = $state(false);
  let showUpgradePrompt = $state(false);
  let showPhotoUpgradePrompt = $state(false);
  let showSharePrompt = $state(false);
  let watchlistSubmitting = $state(false);

  // Build public URL for storage images
  function getImageUrl(storagePath: string): string {
    return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/peak-images/${storagePath}`;
  }

  function openModal() {
    if (summitLimit && !summitLimit.allowed) {
      showUpgradePrompt = true;
      return;
    }
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
  }

  async function handleSummitSubmit(formData: SummitFormData) {
    const form = new FormData();
    form.set('peak_id', peak.id);
    form.set('date_summited', formData.date_summited);
    if (formData.route_id) form.set('route_id', formData.route_id);
    if (formData.conditions) form.set('conditions', formData.conditions);
    if (formData.notes) form.set('notes', formData.notes);
    if (formData.start_time) form.set('start_time', formData.start_time);
    if (formData.summit_time) form.set('summit_time', formData.summit_time);
    if (formData.party_size) form.set('party_size', String(formData.party_size));

    const response = await fetch('?/logSummit', {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      await invalidateAll();
      closeModal();
      showSharePrompt = true;
      setTimeout(() => { showSharePrompt = false; }, 8000);
    }
  }

  async function handleSummitDelete(summitId: string) {
    const form = new FormData();
    form.set('summit_id', summitId);

    const response = await fetch('?/deleteSummit', {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      await invalidateAll();
    }
  }

  // Review handlers
  async function handleReviewSubmit(reviewData: ReviewFormData) {
    const form = new FormData();
    form.set('peak_id', peak.id);
    form.set('rating', String(reviewData.rating));
    if (reviewData.title) form.set('title', reviewData.title);
    if (reviewData.body) form.set('body', reviewData.body);
    if (reviewData.date_climbed) form.set('date_climbed', reviewData.date_climbed);
    if (reviewData.conditions) form.set('conditions', reviewData.conditions);

    const response = await fetch('?/submitReview', {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      await invalidateAll();
    }
  }

  async function handleReviewUpdate(reviewId: string, reviewData: ReviewFormData) {
    const form = new FormData();
    form.set('review_id', reviewId);
    form.set('rating', String(reviewData.rating));
    if (reviewData.title) form.set('title', reviewData.title);
    if (reviewData.body) form.set('body', reviewData.body);
    if (reviewData.date_climbed) form.set('date_climbed', reviewData.date_climbed);
    if (reviewData.conditions) form.set('conditions', reviewData.conditions);

    const response = await fetch('?/updateReview', {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      await invalidateAll();
    }
  }

  async function handleReviewDelete(reviewId: string) {
    const form = new FormData();
    form.set('review_id', reviewId);

    const response = await fetch('?/deleteReview', {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      await invalidateAll();
    }
  }

  // Trail report handler
  async function handleTrailReportSubmit(reportData: TrailReportFormData) {
    const form = new FormData();
    form.set('peak_id', peak.id);
    form.set('hike_date', reportData.hike_date);
    form.set('trail_status', reportData.trail_status);
    form.set('crowd_level', reportData.crowd_level);
    form.set('road_status', reportData.road_status);
    if (reportData.snow_depth_inches) form.set('snow_depth_inches', String(reportData.snow_depth_inches));
    if (reportData.parking_notes) form.set('parking_notes', reportData.parking_notes);
    if (reportData.hazards.length > 0) form.set('hazards', JSON.stringify(reportData.hazards));
    if (reportData.notes) form.set('notes', reportData.notes);

    const response = await fetch('?/submitTrailReport', {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      await invalidateAll();
    }
  }

  // Image upload handler
  async function handleImageUpload(file: File, caption: string, isPrivate: boolean, category: string) {
    const form = new FormData();
    form.set('peak_id', peak.id);
    form.set('file', file);
    if (caption) form.set('caption', caption);
    if (isPrivate) form.set('is_private', 'true');
    if (category) form.set('category', category);

    const response = await fetch('?/uploadImage', {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      await invalidateAll();
    } else {
      const result = await response.json();
      if (result?.data?.photoLimitReached) {
        showPhotoUpgradePrompt = true;
        return;
      }
      throw new Error('Upload failed');
    }
  }

  // Image flag handler
  async function handleFlagImage(imageId: string, reason: string) {
    const form = new FormData();
    form.set('image_id', imageId);
    form.set('reason', reason);

    await fetch('?/flagImage', {
      method: 'POST',
      body: form
    });
  }

  // SEO meta values
  const ogDescription = $derived(`${peak.name} is Colorado's #${peak.rank} highest peak at ${peak.elevation.toLocaleString()} feet. ${peak.description?.slice(0, 100) || ''}`);
  const ogImage = $derived(peak.hero_image_url || `https://cairn58.com/images/peaks/${peak.slug}.jpg`);
  const canonicalUrl = $derived(`https://cairn58.com/peaks/${peak.slug}`);
</script>

<svelte:head>
  <title>{peak.name} ({peak.elevation.toLocaleString()}') | Cairn58</title>
  <meta name="description" content={ogDescription} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content="{peak.name} - {peak.elevation.toLocaleString()}' | Cairn58" />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:site_name" content="Cairn58" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{peak.name} - {peak.elevation.toLocaleString()}'" />
  <meta name="twitter:description" content={ogDescription} />
  <meta name="twitter:image" content={ogImage} />

  <!-- Structured Data (JSON-LD) -->
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        "name": peak.name,
        "description": peak.description,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": peak.latitude,
          "longitude": peak.longitude,
          "elevation": {
            "@type": "QuantitativeValue",
            "value": peak.elevation,
            "unitCode": "FOT"
          }
        },
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": peak.range + ", Colorado"
        },
        "url": canonicalUrl,
        "image": ogImage,
        ...(totalReviews > 0 ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": avgRating.toFixed(1),
            "reviewCount": totalReviews,
            "bestRating": 5,
            "worstRating": 1
          }
        } : {})
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cairn58.com/" },
          { "@type": "ListItem", "position": 2, "name": "Peaks", "item": "https://cairn58.com/peaks" },
          { "@type": "ListItem", "position": 3, "name": peak.name, "item": canonicalUrl }
        ]
      }
    ]
  })}</script>`}
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
      <!-- Top row: Breadcrumb + Summit button -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <nav class="flex flex-wrap items-center gap-x-2 text-sm text-slate-500 dark:text-slate-400">
          <a href="/peaks" class="hover:text-sunrise transition-colors">Peaks</a>
          <span>›</span>
          <a
            href="/ranges/{peak.range?.toLowerCase().replace(/\s+/g, '-')}"
            class="hover:text-sunrise transition-colors"
          >
            {peak.range}
          </a>
        </nav>
        <div class="flex items-center gap-2">
          {#if isLoggedIn}
            <form
              method="POST"
              action="?/{isWatched ? 'removeFromWatchlist' : 'addToWatchlist'}"
              use:enhance={() => {
                watchlistSubmitting = true;
                return async ({ update }) => {
                  await update();
                  watchlistSubmitting = false;
                };
              }}
            >
              <input type="hidden" name="peak_id" value={peak.id} />
              <button
                type="submit"
                disabled={watchlistSubmitting}
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {isWatched ? 'text-sunrise hover:bg-sunrise/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}"
                title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <svg class="w-4 h-4" fill={isWatched ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span class="hidden sm:inline">{isWatched ? 'Watching' : 'Watch'}</span>
              </button>
            </form>
          {/if}
          <ShareButton
            url={canonicalUrl}
            title="{peak.name} ({peak.elevation.toLocaleString()}') | Cairn58"
            text="Check out {peak.name} on Cairn58"
          />
          <SummitButton
            summits={userSummits}
            {isLoggedIn}
            onLogSummit={openModal}
          />
        </div>
      </div>

      <!-- Hero section: Route name + Peak stats -->
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          {#if standardRoute}
            <p class="text-xs uppercase tracking-widest text-sunrise font-semibold mb-2">
              Standard Route
            </p>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {standardRoute.name}
            </h2>
          {/if}
          <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span class="text-lg font-medium text-slate-700 dark:text-slate-300">
              {peak.name}
            </span>
            <div class="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-1.5">
                <svg class="h-4 w-4 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span class="font-semibold text-slate-700 dark:text-slate-200">{peak.elevation.toLocaleString()}'</span>
              </span>
              <span class="text-slate-300 dark:text-slate-600">·</span>
              <span class="flex items-center gap-1.5">
                <svg class="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="font-semibold text-slate-700 dark:text-slate-200">#{peak.rank}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Quick stats pills -->
        {#if standardRoute}
          <div class="flex flex-wrap gap-2">
            <div class="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700/50 text-sm font-medium text-slate-700 dark:text-slate-300">
              {standardRoute.distance_miles} mi
            </div>
            <div class="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700/50 text-sm font-medium text-slate-700 dark:text-slate-300">
              {standardRoute.elevation_gain_ft.toLocaleString()}' gain
            </div>
            <div class="px-4 py-2 rounded-full bg-class-{standardRoute.difficulty_class}/10 text-sm font-semibold text-class-{standardRoute.difficulty_class}">
              Class {standardRoute.difficulty_class}
            </div>
          </div>
        {/if}
      </div>

      <!-- Stats Bar -->
      {#if standardRoute}
        <div class="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <StatsBar route={standardRoute} />
        </div>
      {/if}
    </div>
  </div>

  <!-- Weather Conditions -->
  <WeatherCard {conditions} />

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

  <!-- Quick Facts (shows when new content fields are populated) -->
  <div class="mt-10 animate-fade-in-up" style="animation-delay: 175ms">
    <QuickFacts
      nearestTown={peak.nearest_town}
      nationalForest={peak.national_forest}
      prominenceFt={peak.prominence_ft}
      range={peak.range}
    />
  </div>

  <!-- Photo Gallery -->
  <ImageGallery {images} {getImageUrl} {currentUserId} onFlag={isLoggedIn ? handleFlagImage : undefined} />

  <!-- Image Upload (all logged-in users) -->
  {#if isLoggedIn}
    <section class="mt-10 animate-fade-in-up" style="animation-delay: 275ms">
      <div class="flex items-center justify-between mb-4">
        <h2 class="heading-section text-slate-900 dark:text-white flex items-center gap-2">
          <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Photo
        </h2>
        {#if photoLimit && !photoLimit.isPro}
          <span class="text-sm text-slate-500 dark:text-slate-400">
            {photoLimit.remaining} of 5 uploads remaining
          </span>
        {:else if photoLimit?.isPro}
          <span class="text-sm text-sunrise font-medium">Unlimited uploads</span>
        {/if}
      </div>
      {#if photoLimit && !photoLimit.allowed}
        <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 text-center">
          <p class="text-slate-600 dark:text-slate-400 mb-3">You've reached the free photo limit for this peak.</p>
          <a
            href="/pricing"
            class="inline-block px-6 py-2.5 rounded-lg bg-gradient-to-r from-sunrise to-sunrise-coral text-white font-medium hover:from-sunrise-coral hover:to-sunrise transition-all"
          >
            Upgrade to Pro for unlimited uploads
          </a>
        </div>
      {:else}
        <ImageUploader peakId={peak.id} onUpload={handleImageUpload} />
      {/if}
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

  <!-- Reviews Section -->
  <ReviewSection
    peakId={peak.id}
    {reviews}
    {userReview}
    {isLoggedIn}
    {avgRating}
    {totalReviews}
    {currentUserId}
    onSubmit={handleReviewSubmit}
    onUpdate={handleReviewUpdate}
    onDelete={handleReviewDelete}
  />

  <!-- Trail Reports Section -->
  <TrailReportSection
    peakId={peak.id}
    reports={trailReports}
    {isLoggedIn}
    onSubmit={handleTrailReportSubmit}
  />
</Container>

<!-- Full-width Map Section -->
<section class="mt-16 border-t border-slate-200 dark:border-slate-700">
  <div class="bg-slate-50 dark:bg-slate-800/50 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="heading-section text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Location
      </h2>
      <div class="rounded-xl overflow-hidden shadow-card-elevated border border-slate-200 dark:border-slate-700 h-[400px]">
        {#if browser}
          {#await import('$lib/components/map/PeakMap.svelte') then { default: PeakMap }}
            <PeakMap
              peaks={[{
                id: peak.id,
                name: peak.name,
                slug: peak.slug,
                elevation: peak.elevation,
                latitude: peak.latitude,
                longitude: peak.longitude,
                rank: peak.rank,
                range: peak.range,
                difficultyClass: standardRoute?.difficulty_class ?? 1
              }]}
              summitedPeakIds={new Set(userSummits.length > 0 ? [peak.id] : [])}
              selectedPeakId={peak.id}
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
      <div class="mt-4 flex items-center justify-between text-sm">
        <span class="text-slate-600 dark:text-slate-400">
          {peak.latitude.toFixed(4)}°N, {Math.abs(peak.longitude).toFixed(4)}°W
        </span>
        <a
          href="https://www.google.com/maps/search/?api=1&query={peak.latitude},{peak.longitude}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sunrise hover:text-sunrise-coral transition-colors flex items-center gap-1"
        >
          Open in Google Maps
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Hikers Also Climbed -->
{#if relatedPeaks.length > 0}
  <section class="mt-12 animate-fade-in-up">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="heading-section text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <span class="flex items-center justify-center w-10 h-10 rounded-xl bg-sunrise/10">
          <svg class="h-5 w-5 text-sunrise" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
          </svg>
        </span>
        Hikers Also Climbed
      </h2>
      <div class="grid gap-4 sm:grid-cols-2">
        {#each relatedPeaks as relatedPeak (relatedPeak.id)}
          <PeakCard peak={relatedPeak} />
        {/each}
      </div>
    </div>
  </section>
{/if}

<!-- Summit Limit Indicator (free users) -->
{#if isLoggedIn && summitLimit && !summitLimit.isPro}
  <div class="fixed bottom-4 right-4 z-40">
    <div class="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card text-sm text-slate-600 dark:text-slate-400">
      {summitLimit.remaining} of 5 free summits remaining
    </div>
  </div>
{/if}

<!-- Upgrade Prompt Modal -->
{#if showUpgradePrompt}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 text-center">
      <div class="mx-auto h-16 w-16 rounded-full bg-sunrise/10 flex items-center justify-center mb-4">
        <svg class="h-8 w-8 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Free Summit Limit Reached
      </h3>
      <p class="text-slate-600 dark:text-slate-400 mb-6">
        You've used all 5 free summits. Upgrade to Cairn58 Pro for unlimited summit logging.
      </p>
      <div class="flex flex-col gap-3">
        <a
          href="/pricing"
          class="block w-full px-6 py-3 rounded-lg bg-gradient-to-r from-sunrise to-sunrise-coral text-white font-medium hover:from-sunrise-coral hover:to-sunrise transition-all shadow-md"
        >
          Upgrade to Pro -- $29.99/yr
        </a>
        <button
          onclick={() => showUpgradePrompt = false}
          class="px-6 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Photo Upload Limit Modal -->
{#if showPhotoUpgradePrompt}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 text-center">
      <div class="mx-auto h-16 w-16 rounded-full bg-sunrise/10 flex items-center justify-center mb-4">
        <svg class="h-8 w-8 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Photo Limit Reached
      </h3>
      <p class="text-slate-600 dark:text-slate-400 mb-6">
        Free accounts can upload 5 public photos per peak. Upgrade to Pro for unlimited uploads.
      </p>
      <div class="flex flex-col gap-3">
        <a
          href="/pricing"
          class="block w-full px-6 py-3 rounded-lg bg-gradient-to-r from-sunrise to-sunrise-coral text-white font-medium hover:from-sunrise-coral hover:to-sunrise transition-all shadow-md"
        >
          Upgrade to Pro -- $29.99/yr
        </a>
        <button
          onclick={() => showPhotoUpgradePrompt = false}
          class="px-6 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Summit Share Prompt -->
{#if showSharePrompt}
  <div class="fixed bottom-20 right-4 z-50 animate-fade-in-up">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-card-elevated border border-slate-200 dark:border-slate-700 p-4 max-w-sm">
      <div class="flex items-start gap-3">
        <div class="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
          <svg class="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="font-semibold text-slate-900 dark:text-white text-sm">Summit logged!</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Share your achievement</p>
          <div class="mt-2">
            <ShareButton
              url="https://cairn58.com/peaks/{peak.slug}"
              title="I just summited {peak.name}!"
              text="I summited {peak.name} ({peak.elevation.toLocaleString()}') on Cairn58"
            />
          </div>
        </div>
        <button
          onclick={() => showSharePrompt = false}
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="Dismiss"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Summit Modal -->
<SummitModal
  open={modalOpen}
  peakName={peak.name}
  peakId={peak.id}
  routes={peak.routes ?? []}
  existingSummits={userSummits}
  onClose={closeModal}
  onSubmit={handleSummitSubmit}
  onDelete={handleSummitDelete}
/>
