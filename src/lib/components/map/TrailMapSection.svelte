<script lang="ts">
  import type { TrailGeometry } from '$lib/server/gpx';
  import type { ForecastResponse } from '$lib/types/database';
  import GpxUploader from '$lib/components/trail/GpxUploader.svelte';
  import ViewModeToggle from './ViewModeToggle.svelte';
  import { isWebGLSupported } from '$lib/utils/webgl';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';

  interface Route {
    name: string;
    difficulty_class: number;
    distance_miles: number;
    elevation_gain_ft: number;
    trailhead_latitude?: number | null;
    trailhead_longitude?: number | null;
    trail_geometry?: TrailGeometry | null;
    gpx_file_url?: string | null;
  }

  interface Peak {
    name: string;
    latitude: number;
    longitude: number;
  }

  interface TraceInfo {
    id: string;
    uploaderName: string;
    uploaderId: string;
    voteCount: number;
    userVoted: boolean;
    trailGeometry: TrailGeometry;
    storagePath: string;
    pointCount: number;
    distanceMiles: number | null;
    elevationGain: number | null;
  }

  interface Props {
    route: Route;
    peak: Peak;
    bestTrace?: TrailGeometry | null;
    allTraces?: TraceInfo[];
    isLoggedIn?: boolean;
    currentUserId?: string;
    isPro?: boolean;
    forecast?: ForecastResponse | null;
    onUpload?: (file: File) => Promise<void>;
    onVote?: (traceId: string) => Promise<void>;
    onDelete?: (traceId: string) => Promise<void>;
    onDownload?: (storagePath: string) => string;
  }

  let {
    route,
    peak,
    bestTrace = null,
    allTraces = [],
    isLoggedIn = false,
    currentUserId,
    isPro = false,
    forecast = null,
    onUpload,
    onVote,
    onDelete,
    onDownload
  }: Props = $props();

  // Lazy load map components (client-side only)
  let TrailMap: typeof import('./TrailMap.svelte').default | null = $state(null);
  let ElevationProfile: typeof import('./ElevationProfile.svelte').default | null = $state(null);
  let TerrainViewer3D: typeof import('./TerrainViewer3D.svelte').default | null = $state(null);
  let isLoading = $state(true);

  // View mode
  let viewMode = $state<'2d' | '3d'>('2d');
  let loading3D = $state(false);
  let webglSupported = $state(false);

  // Shared hover state
  let hoveredIndex = $state<number | null>(null);

  // Trace selection
  let selectedTraceIndex = $state(0);
  let showUploader = $state(false);

  // Active geometry: official data > selected community trace > best trace
  const activeGeometry = $derived.by(() => {
    const official = route.trail_geometry as TrailGeometry | null;
    if (official && official.coordinates.length > 1) return official;
    if (allTraces.length > 0) return allTraces[selectedTraceIndex]?.trailGeometry ?? null;
    if (bestTrace && bestTrace.coordinates.length > 1) return bestTrace;
    return null;
  });

  const hasTrail = $derived(!!activeGeometry && activeGeometry.coordinates.length > 1);
  const isOfficialData = $derived(!!route.trail_geometry && (route.trail_geometry as TrailGeometry).coordinates?.length > 1);
  const selectedTrace = $derived(allTraces.length > 0 ? allTraces[selectedTraceIndex] : null);

  // Trailhead coordinates
  const trailheadCoords = $derived(
    route.trailhead_latitude && route.trailhead_longitude
      ? { lat: route.trailhead_latitude, lng: route.trailhead_longitude }
      : null
  );

  // Summit coordinates
  const summitCoords = $derived({ lat: peak.latitude, lng: peak.longitude });

  // Load components dynamically + check WebGL
  $effect(() => {
    if (typeof window !== 'undefined') {
      webglSupported = isWebGLSupported();
      Promise.all([
        import('./TrailMap.svelte'),
        import('./ElevationProfile.svelte')
      ]).then(([trailMapModule, elevationModule]) => {
        TrailMap = trailMapModule.default;
        ElevationProfile = elevationModule.default;
        isLoading = false;
      });
    }
  });

  function handleHover(index: number | null) {
    hoveredIndex = index;
  }

  async function handleViewModeChange(mode: '2d' | '3d') {
    if (mode === '3d' && !webglSupported) {
      viewMode = '2d';
      return;
    }
    viewMode = mode;
    if (mode === '3d' && !TerrainViewer3D) {
      loading3D = true;
      try {
        const mod = await import('./TerrainViewer3D.svelte');
        TerrainViewer3D = mod.default;
      } finally {
        loading3D = false;
      }
    }
  }

  function handleWebGLUnsupported() {
    webglSupported = false;
    viewMode = '2d';
  }

  async function handleVote(traceId: string) {
    if (onVote) await onVote(traceId);
  }

  async function handleDelete(traceId: string) {
    if (onDelete) await onDelete(traceId);
  }
</script>

{#if hasTrail}
  <section class="animate-fade-in-up" style="animation-delay: 175ms">
    <div class="flex items-center justify-between mb-4">
      <h2 class="heading-section text-slate-900 dark:text-white flex items-center gap-2">
        <svg class="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Trail Map & Elevation
      </h2>
      {#if webglSupported}
        <ViewModeToggle mode={viewMode} onChange={handleViewModeChange} {loading3D} />
      {/if}
    </div>

    <div class="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-card">
      {#if isLoading}
        <!-- Loading skeleton -->
        <div class="grid lg:grid-cols-5 gap-0">
          <div class="lg:col-span-3 h-[350px] bg-slate-100 dark:bg-slate-700 animate-pulse flex items-center justify-center">
            <svg class="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div class="lg:col-span-2 h-[350px] lg:h-auto lg:min-h-[250px] bg-slate-50 dark:bg-slate-800 animate-pulse flex items-center justify-center">
            <svg class="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        </div>
      {:else if TrailMap && ElevationProfile && activeGeometry}
        <div class="grid lg:grid-cols-5 gap-0">
          <!-- Map (60% on desktop) -->
          <div class="lg:col-span-3 h-[350px] lg:h-[400px] relative">
            {#if viewMode === '2d'}
              <div class="absolute inset-0" transition:fade={{ duration: 200 }}>
                <TrailMap
                  trailGeometry={activeGeometry}
                  {trailheadCoords}
                  {summitCoords}
                  difficultyClass={route.difficulty_class}
                  peakName={peak.name}
                  routeName={route.name}
                  {hoveredIndex}
                  onPointHover={handleHover}
                />
              </div>
            {:else if TerrainViewer3D}
              <div class="absolute inset-0" transition:fade={{ duration: 200 }}>
                <TerrainViewer3D
                  trailGeometry={activeGeometry}
                  {trailheadCoords}
                  {summitCoords}
                  difficultyClass={route.difficulty_class}
                  peakName={peak.name}
                  routeName={route.name}
                  {hoveredIndex}
                  onPointHover={handleHover}
                  {isPro}
                  onWebGLUnsupported={handleWebGLUnsupported}
                  {allTraces}
                  {forecast}
                />
              </div>
            {/if}
          </div>

          <!-- Elevation Profile (40% on desktop) -->
          <div class="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700">
            <div class="p-4 h-full flex flex-col">
              <!-- Stats header -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gain</div>
                    <div class="text-lg font-bold text-slate-900 dark:text-white">
                      {(activeGeometry.properties.elevationGain || route.elevation_gain_ft).toLocaleString()}'
                    </div>
                  </div>
                  <div class="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Max</div>
                    <div class="text-lg font-bold text-slate-900 dark:text-white">
                      {activeGeometry.properties.maxElevation.toLocaleString()}'
                    </div>
                  </div>
                  <div class="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Min</div>
                    <div class="text-lg font-bold text-slate-900 dark:text-white">
                      {activeGeometry.properties.minElevation.toLocaleString()}'
                    </div>
                  </div>
                </div>
              </div>

              <!-- Elevation chart -->
              <div class="flex-1 min-h-[200px]">
                <ElevationProfile
                  coordinates={activeGeometry.coordinates}
                  difficultyClass={route.difficulty_class}
                  {hoveredIndex}
                  onHover={handleHover}
                />
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Footer: trace selector, voting, download, upload -->
      {#if !isOfficialData && allTraces.length > 0}
        <div class="border-t border-slate-200 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <!-- Trace selector -->
            {#if allTraces.length > 1}
              <div class="flex-1 min-w-0">
                <select
                  bind:value={selectedTraceIndex}
                  class="
                    w-full rounded-lg border border-slate-300 dark:border-slate-600
                    bg-white dark:bg-slate-700
                    px-3 py-1.5 text-sm
                    text-slate-900 dark:text-white
                    focus:border-mountain-blue focus:ring-2 focus:ring-mountain-blue/20
                    transition-colors
                  "
                >
                  {#each allTraces as trace, i}
                    <option value={i}>
                      {trace.uploaderName || 'Anonymous'} -- {trace.voteCount} {trace.voteCount === 1 ? 'upvote' : 'upvotes'}
                      {#if trace.distanceMiles} ({trace.distanceMiles} mi){/if}
                    </option>
                  {/each}
                </select>
              </div>
            {:else if selectedTrace}
              <div class="flex-1 text-sm text-slate-500 dark:text-slate-400">
                Trace by <span class="font-medium text-slate-700 dark:text-slate-300">{selectedTrace.uploaderName || 'Anonymous'}</span>
                -- {selectedTrace.voteCount} {selectedTrace.voteCount === 1 ? 'upvote' : 'upvotes'}
              </div>
            {/if}

            <!-- Actions -->
            <div class="flex items-center gap-2 flex-shrink-0">
              {#if selectedTrace && isLoggedIn}
                <button
                  onclick={() => selectedTrace && handleVote(selectedTrace.id)}
                  class="
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    {selectedTrace.userVoted
                      ? 'bg-accent/10 text-accent border border-accent/30'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-accent hover:text-accent'}
                  "
                >
                  <svg class="h-4 w-4" fill={selectedTrace.userVoted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                  {selectedTrace.voteCount}
                </button>
              {/if}

              {#if selectedTrace && onDownload}
                <a
                  href={onDownload(selectedTrace.storagePath)}
                  download
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-mountain-blue hover:text-mountain-blue transition-colors"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  GPX
                </a>
              {/if}

              {#if selectedTrace && currentUserId === selectedTrace.uploaderId}
                <button
                  onclick={() => selectedTrace && handleDelete(selectedTrace.id)}
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 text-semantic-danger border border-slate-300 dark:border-slate-600 hover:border-semantic-danger-light hover:bg-semantic-danger/5 dark:hover:bg-semantic-danger/15 transition-colors"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              {/if}

              {#if isLoggedIn && onUpload}
                <button
                  onclick={() => showUploader = !showUploader}
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-mountain-blue text-white hover:bg-mountain-navy transition-colors"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Trace
                </button>
              {/if}
            </div>
          </div>

          {#if showUploader && onUpload}
            <div class="mt-3">
              <GpxUploader {onUpload} />
            </div>
          {/if}
        </div>
      {:else if route.gpx_file_url}
        <div class="border-t border-slate-200 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Download for offline navigation</span>
          </div>
          <a
            href={route.gpx_file_url}
            download
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-mountain-blue text-white text-sm font-medium hover:bg-mountain-navy transition-colors"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download GPX
          </a>
        </div>
      {/if}
    </div>
  </section>
{:else}
  <!-- No trail data: community contribution CTA -->
  <section class="animate-fade-in-up" style="animation-delay: 175ms">
    <h2 class="heading-section text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <svg class="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      Trail Map
    </h2>

    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/80 shadow-card overflow-hidden">
      <div class="p-8 text-center">
        <div class="mx-auto h-16 w-16 rounded-full bg-mountain-blue/10 dark:bg-mountain-blue/20 flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-mountain-blue dark:text-mountain-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">No trail data yet</h3>
        <p class="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-1">
          Be the first to contribute a GPS trace for this route.
        </p>
        {#if !isLoggedIn}
          <p class="text-sm text-slate-400 dark:text-slate-500">
            <a href="/auth?redirectTo={encodeURIComponent($page.url.pathname)}" class="text-mountain-blue dark:text-accent hover:underline">Log in</a> to upload a GPX file.
          </p>
        {/if}
      </div>

      {#if isLoggedIn && onUpload}
        <div class="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
          <GpxUploader {onUpload} />
        </div>
      {/if}
    </div>
  </section>
{/if}
