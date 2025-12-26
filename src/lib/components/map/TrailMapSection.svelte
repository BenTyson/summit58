<script lang="ts">
  import type { TrailGeometry } from '$lib/server/gpx';

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

  interface Props {
    route: Route;
    peak: Peak;
  }

  let { route, peak }: Props = $props();

  // Lazy load map components (client-side only)
  let TrailMap: typeof import('./TrailMap.svelte').default | null = $state(null);
  let ElevationProfile: typeof import('./ElevationProfile.svelte').default | null = $state(null);
  let isLoading = $state(true);

  // Shared hover state
  let hoveredIndex = $state<number | null>(null);

  // Extract trail geometry with type assertion
  const trailGeometry = $derived(route.trail_geometry as TrailGeometry | null);
  const hasTrail = $derived(!!trailGeometry && trailGeometry.coordinates.length > 1);

  // Trailhead coordinates
  const trailheadCoords = $derived(
    route.trailhead_latitude && route.trailhead_longitude
      ? { lat: route.trailhead_latitude, lng: route.trailhead_longitude }
      : null
  );

  // Summit coordinates
  const summitCoords = $derived({ lat: peak.latitude, lng: peak.longitude });

  // Load components dynamically
  $effect(() => {
    if (typeof window !== 'undefined') {
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
</script>

{#if hasTrail}
  <section class="animate-fade-in-up" style="animation-delay: 175ms">
    <h2 class="heading-section text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      Trail Map & Elevation
    </h2>

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
      {:else if TrailMap && ElevationProfile && trailGeometry}
        <div class="grid lg:grid-cols-5 gap-0">
          <!-- Map (60% on desktop) -->
          <div class="lg:col-span-3 h-[350px] lg:h-[400px]">
            <TrailMap
              {trailGeometry}
              {trailheadCoords}
              {summitCoords}
              difficultyClass={route.difficulty_class}
              peakName={peak.name}
              routeName={route.name}
              {hoveredIndex}
              onPointHover={handleHover}
            />
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
                      {(trailGeometry.properties.elevationGain || route.elevation_gain_ft).toLocaleString()}'
                    </div>
                  </div>
                  <div class="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Max</div>
                    <div class="text-lg font-bold text-slate-900 dark:text-white">
                      {trailGeometry.properties.maxElevation.toLocaleString()}'
                    </div>
                  </div>
                  <div class="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Min</div>
                    <div class="text-lg font-bold text-slate-900 dark:text-white">
                      {trailGeometry.properties.minElevation.toLocaleString()}'
                    </div>
                  </div>
                </div>
              </div>

              <!-- Elevation chart -->
              <div class="flex-1 min-h-[200px]">
                <ElevationProfile
                  coordinates={trailGeometry.coordinates}
                  difficultyClass={route.difficulty_class}
                  {hoveredIndex}
                  onHover={handleHover}
                />
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- GPX Download footer -->
      {#if route.gpx_file_url}
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
  <!-- No trail data placeholder -->
  <section class="animate-fade-in-up" style="animation-delay: 175ms">
    <h2 class="heading-section text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      Trail Map
    </h2>

    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/80 p-8 text-center shadow-card">
      <div class="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">Trail data coming soon</h3>
      <p class="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        We're working on adding detailed trail maps and elevation profiles for this route.
      </p>
    </div>
  </section>
{/if}
