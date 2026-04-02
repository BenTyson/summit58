<script lang="ts">
  import type { PeriodForecast, DayForecast } from '$lib/types/database';
  import { weatherCodeToDescription, degreesToCardinal, getUvLevel } from '$lib/utils/weather';
  import WeatherIcon from './WeatherIcon.svelte';

  interface Props {
    day: DayForecast;
  }

  let { day }: Props = $props();

  // Use afternoon as "current" if available, else morning
  const current: PeriodForecast = $derived(day.afternoon ?? day.morning);

  const uvLevel = $derived(getUvLevel(current.uv_index));
  const uvColor = $derived(
    uvLevel === 'low' ? 'text-class-1' :
    uvLevel === 'moderate' ? 'text-semantic-warning' :
    uvLevel === 'high' ? 'text-orange-500' :
    uvLevel === 'very_high' ? 'text-semantic-danger' :
    'text-purple-600'
  );
</script>

<div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 shadow-card p-6">
  <div class="flex flex-wrap items-start justify-between gap-6">
    <!-- Temperature & Conditions -->
    <div class="flex items-center gap-4">
      <div class="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center">
        <WeatherIcon code={current.weather_code} class="h-10 w-10" />
      </div>
      <div>
        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-bold text-slate-900 dark:text-white">{current.temperature_f}°</span>
          {#if current.feels_like_f !== current.temperature_f}
            <span class="text-sm text-slate-500 dark:text-slate-400">Feels {current.feels_like_f}°</span>
          {/if}
        </div>
        <p class="text-slate-600 dark:text-slate-400">{weatherCodeToDescription(current.weather_code)}</p>
      </div>
    </div>

    <!-- Stat pills -->
    <div class="flex flex-wrap gap-3">
      <div class="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-center">
        <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">High / Low</span>
        <span class="text-sm font-semibold text-slate-900 dark:text-white">{day.high_f}° / {day.low_f}°</span>
      </div>

      <div class="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-center">
        <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Wind</span>
        <span class="text-sm font-semibold text-slate-900 dark:text-white">
          {current.wind_speed_mph} mph {degreesToCardinal(current.wind_direction)}
        </span>
      </div>

      <div class="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-center">
        <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Humidity</span>
        <span class="text-sm font-semibold text-slate-900 dark:text-white">{current.humidity_percent}%</span>
      </div>

      <div class="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-center">
        <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">UV</span>
        <span class="text-sm font-semibold {uvColor}">{current.uv_index}</span>
      </div>

      <div class="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-center">
        <span class="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Cloud</span>
        <span class="text-sm font-semibold text-slate-900 dark:text-white">{current.cloud_cover_percent}%</span>
      </div>
    </div>
  </div>
</div>
