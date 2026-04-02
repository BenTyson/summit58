<script lang="ts">
  import type { ElevationBandForecast, DayForecast } from '$lib/types/database';
  import { weatherCodeToDescription, degreesToCardinal } from '$lib/utils/weather';
  import WeatherIcon from './WeatherIcon.svelte';

  interface Props {
    band: ElevationBandForecast;
    peakSlug: string;
  }

  let { band, peakSlug }: Props = $props();

  const days = $derived(band.days.slice(0, 2));

  function formatDayLabel(dateStr: string, index: number): string {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }
</script>

{#if days.length > 0}
  <div
    class="
      animate-fade-in-up rounded-xl overflow-hidden
      border border-slate-200 dark:border-slate-700
      bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80
      shadow-card
    "
    style="animation-delay: 275ms"
  >
    <div class="p-5">
      <h3 class="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
        <svg class="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        Trailhead Weather
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">{band.label}</p>

      <div class="space-y-3">
        {#each days as day, i}
          <div class="rounded-lg bg-slate-50 dark:bg-slate-700/30 p-3">
            <span class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {formatDayLabel(day.date, i)}
            </span>
            <div class="grid grid-cols-2 gap-3">
              <!-- Morning -->
              <div class="flex items-center gap-2">
                <WeatherIcon code={day.morning.weather_code} class="h-5 w-5" />
                <div class="text-sm">
                  <span class="font-semibold text-slate-900 dark:text-white">{day.morning.temperature_f}°</span>
                  <span class="text-xs text-slate-500 dark:text-slate-400 ml-1">
                    {day.morning.wind_speed_mph} mph {degreesToCardinal(day.morning.wind_direction)}
                  </span>
                </div>
                <span class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-auto">AM</span>
              </div>
              <!-- Afternoon -->
              <div class="flex items-center gap-2">
                <WeatherIcon code={day.afternoon.weather_code} class="h-5 w-5" />
                <div class="text-sm">
                  <span class="font-semibold text-slate-900 dark:text-white">{day.afternoon.temperature_f}°</span>
                  <span class="text-xs text-slate-500 dark:text-slate-400 ml-1">
                    {day.afternoon.wind_speed_mph} mph {degreesToCardinal(day.afternoon.wind_direction)}
                  </span>
                </div>
                <span class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-auto">PM</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Full forecast link -->
    <div class="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
      <a
        href="/peaks/{peakSlug}/weather"
        class="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 transition-colors"
      >
        Full Forecast
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
{/if}
