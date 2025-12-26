<script lang="ts">
  import type { Tables } from '$lib/types/database';
  import { weatherCodeToDescription, weatherCodeToIcon, degreesToCardinal } from '$lib/utils/weather';

  type PeakConditions = Tables<'peak_conditions'>;

  interface Props {
    conditions: PeakConditions[];
  }

  let { conditions }: Props = $props();

  const today = $derived(conditions[0]);
  const forecast = $derived(conditions.slice(1));

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function formatShortDay(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  function timeAgo(dateStr: string | null): string {
    if (!dateStr) return '';
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
</script>

{#if conditions.length > 0 && today}
  <section class="mt-10 animate-fade-in-up" style="animation-delay: 175ms">
    <h2 class="heading-section text-slate-900 dark:text-white flex items-center gap-2 mb-4">
      <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
      Summit Weather
    </h2>

    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 shadow-card overflow-hidden">
      <!-- Today's Conditions -->
      <div class="p-6">
        <div class="flex flex-wrap items-start justify-between gap-6">
          <!-- Temperature & Conditions -->
          <div class="flex items-center gap-4">
            <!-- Weather Icon -->
            <div class="h-16 w-16 rounded-2xl bg-sunrise/10 flex items-center justify-center">
              {#if weatherCodeToIcon(today.weather_code) === 'sun'}
                <svg class="h-10 w-10 text-sunrise" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              {:else if weatherCodeToIcon(today.weather_code) === 'cloud'}
                <svg class="h-10 w-10 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
                </svg>
              {:else if weatherCodeToIcon(today.weather_code) === 'cloud-sun'}
                <svg class="h-10 w-10 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
                  <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" opacity="0.5" />
                </svg>
              {:else if weatherCodeToIcon(today.weather_code) === 'cloud-rain' || weatherCodeToIcon(today.weather_code) === 'cloud-drizzle'}
                <svg class="h-10 w-10 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
                  <path d="M8 17v3M12 17v3M16 17v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
                </svg>
              {:else if weatherCodeToIcon(today.weather_code) === 'snowflake'}
                <svg class="h-10 w-10 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" stroke-width="1.5" fill="none" />
                </svg>
              {:else if weatherCodeToIcon(today.weather_code) === 'cloud-lightning'}
                <svg class="h-10 w-10 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
                  <path d="M13 12l-2 4h3l-2 4" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </svg>
              {:else}
                <svg class="h-10 w-10 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
                </svg>
              {/if}
            </div>

            <div>
              {#if today.temperature_f !== null}
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-bold text-slate-900 dark:text-white">{today.temperature_f}°</span>
                  {#if today.feels_like_f !== null && today.feels_like_f !== today.temperature_f}
                    <span class="text-sm text-slate-500 dark:text-slate-400">Feels {today.feels_like_f}°</span>
                  {/if}
                </div>
              {:else}
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold text-slate-900 dark:text-white">{today.high_f}°</span>
                  <span class="text-lg text-slate-500 dark:text-slate-400">/ {today.low_f}°</span>
                </div>
              {/if}
              <p class="text-slate-600 dark:text-slate-400">{weatherCodeToDescription(today.weather_code)}</p>
            </div>
          </div>

          <!-- High/Low & Details -->
          <div class="flex flex-wrap gap-6">
            <div class="text-center">
              <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">High / Low</span>
              <span class="text-lg font-semibold text-slate-900 dark:text-white">{today.high_f}° / {today.low_f}°</span>
            </div>

            {#if today.wind_speed_mph !== null}
              <div class="text-center">
                <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Wind</span>
                <span class="text-lg font-semibold text-slate-900 dark:text-white">
                  {today.wind_speed_mph} mph {degreesToCardinal(today.wind_direction)}
                </span>
              </div>
            {/if}

            {#if (today.snow_in ?? 0) > 0}
              <div class="text-center">
                <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Snow</span>
                <span class="text-lg font-semibold text-sky-500">{today.snow_in}" </span>
              </div>
            {:else if (today.precipitation_in ?? 0) > 0}
              <div class="text-center">
                <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Precip</span>
                <span class="text-lg font-semibold text-blue-500">{today.precipitation_in}"</span>
              </div>
            {/if}

            {#if today.humidity_percent !== null}
              <div class="text-center">
                <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Humidity</span>
                <span class="text-lg font-semibold text-slate-900 dark:text-white">{today.humidity_percent}%</span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Updated timestamp -->
        {#if today.fetched_at}
          <p class="mt-4 text-xs text-slate-400 dark:text-slate-500">
            Updated {timeAgo(today.fetched_at)}
          </p>
        {/if}
      </div>

      <!-- 7-Day Forecast Strip -->
      {#if forecast.length > 0}
        <div class="border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-4">
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {#each forecast as day}
              <div class="text-center p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <span class="block text-xs font-medium text-slate-500 dark:text-slate-400">{formatShortDay(day.forecast_date)}</span>
                <div class="my-1">
                  {#if weatherCodeToIcon(day.weather_code) === 'sun'}
                    <svg class="h-6 w-6 mx-auto text-sunrise" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
                    </svg>
                  {:else if weatherCodeToIcon(day.weather_code) === 'snowflake'}
                    <svg class="h-6 w-6 mx-auto text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                    </svg>
                  {:else if weatherCodeToIcon(day.weather_code) === 'cloud-rain' || weatherCodeToIcon(day.weather_code) === 'cloud-drizzle'}
                    <svg class="h-6 w-6 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
                    </svg>
                  {:else}
                    <svg class="h-6 w-6 mx-auto text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
                    </svg>
                  {/if}
                </div>
                <span class="text-sm font-semibold text-slate-900 dark:text-white">{day.high_f}°</span>
                <span class="text-sm text-slate-400 dark:text-slate-500"> / {day.low_f}°</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </section>
{/if}
