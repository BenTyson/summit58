<script lang="ts">
  import type { DayForecast, PeriodForecast } from '$lib/types/database';
  import {
    weatherCodeToDescription,
    degreesToCardinal,
    getTemperatureColor,
    getWindSeverity,
    getUvLevel
  } from '$lib/utils/weather';
  import WeatherIcon from './WeatherIcon.svelte';
  import WindArrow from './WindArrow.svelte';

  interface Props {
    days: DayForecast[];
    bandElevation: number;
  }

  let { days, bandElevation }: Props = $props();

  // Flatten days into period columns
  type PeriodColumn = {
    day: DayForecast;
    period: PeriodForecast;
    periodName: 'morning' | 'afternoon' | 'night';
    dayIndex: number;
  };

  const columns: PeriodColumn[] = $derived(
    days.flatMap((day, dayIndex) => [
      { day, period: day.morning, periodName: 'morning' as const, dayIndex },
      { day, period: day.afternoon, periodName: 'afternoon' as const, dayIndex },
      { day, period: day.night, periodName: 'night' as const, dayIndex }
    ])
  );

  function formatDayHeader(dateStr: string, index: number): string {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function periodLabel(name: string): string {
    return name === 'morning' ? 'AM' : name === 'afternoon' ? 'PM' : 'Night';
  }

  function tempColorClass(f: number): string {
    const color = getTemperatureColor(f);
    const map: Record<string, string> = {
      violet: 'text-violet-500',
      blue: 'text-blue-500',
      sky: 'text-sky-500',
      neutral: 'text-slate-700 dark:text-slate-300',
      amber: 'text-amber-600 dark:text-amber-400',
      orange: 'text-orange-500',
      red: 'text-red-500'
    };
    return map[color] ?? 'text-slate-700 dark:text-slate-300';
  }

  function windColorClass(mph: number): string {
    const severity = getWindSeverity(mph);
    const map: Record<string, string> = {
      calm: 'text-slate-700 dark:text-slate-300',
      moderate: 'text-amber-600 dark:text-amber-400',
      strong: 'text-orange-500',
      extreme: 'text-red-500 font-bold'
    };
    return map[severity];
  }

  function windBgClass(mph: number): string {
    const severity = getWindSeverity(mph);
    if (severity === 'extreme') return 'bg-red-50 dark:bg-red-900/20';
    if (severity === 'strong') return 'bg-orange-50 dark:bg-orange-900/10';
    return '';
  }

  function uvDotClass(index: number): string {
    const level = getUvLevel(index);
    const map: Record<string, string> = {
      low: 'bg-class-1',
      moderate: 'bg-yellow-500',
      high: 'bg-orange-500',
      very_high: 'bg-red-500',
      extreme: 'bg-purple-600'
    };
    return map[level];
  }

  function periodBgClass(name: string): string {
    if (name === 'morning') return 'bg-amber-50/50 dark:bg-amber-900/5';
    if (name === 'afternoon') return 'bg-sky-50/50 dark:bg-sky-900/5';
    return 'bg-slate-100/60 dark:bg-slate-900/40';
  }

  function nightTint(name: string): string {
    return name === 'night' ? 'bg-slate-50/80 dark:bg-slate-900/30' : '';
  }

  // Column template: 1 label col + N data cols
  const gridCols = $derived(`140px repeat(${columns.length}, minmax(72px, 1fr))`);

  function cellLabel(col: PeriodColumn, metric: string, value: string): string {
    const dayLabel = formatDayHeader(col.day.date, col.dayIndex);
    const period = periodLabel(col.periodName);
    return `${dayLabel} ${period}: ${metric} ${value}`;
  }
</script>

<div class="rounded-xl border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
  <!-- Scroll container -->
  <div class="overflow-x-auto relative">
    <div
      class="grid min-w-max"
      style="grid-template-columns: {gridCols};"
      role="grid"
      aria-label="7-day weather forecast table"
    >
      <!-- ═══ Row 1: Day headers ═══ -->
      <div
        class="sticky left-0 z-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
      ></div>
      {#each days as day, i}
        <div
          class="
            col-span-3 text-center py-2.5 text-sm font-semibold
            text-slate-900 dark:text-white
            border-b border-slate-200 dark:border-slate-700
            {i % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/80' : 'bg-white dark:bg-slate-800'}
            {i > 0 ? 'border-l border-slate-200 dark:border-slate-700' : ''}
          "
          style="grid-column: span 3"
        >
          {formatDayHeader(day.date, i)}
        </div>
      {/each}

      <!-- ═══ Row 2: Period headers ═══ -->
      <div
        class="sticky left-0 z-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
      ></div>
      {#each columns as col}
        <div
          class="
            text-center py-1.5 text-xs font-medium uppercase tracking-wider
            text-slate-500 dark:text-slate-400
            border-b border-slate-200 dark:border-slate-700
            {periodBgClass(col.periodName)}
          "
        >
          {periodLabel(col.periodName)}
        </div>
      {/each}

      <!-- ═══ Row 3: Weather icon ═══ -->
      <div class="sticky left-0 z-20 bg-white dark:bg-slate-800 px-4 py-2.5 flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700/50">
        Conditions
      </div>
      {#each columns as col}
        <div
          class="flex flex-col items-center justify-center py-2.5 border-b border-slate-100 dark:border-slate-700/50 {nightTint(col.periodName)}"
          role="gridcell"
          aria-label={cellLabel(col, 'conditions', weatherCodeToDescription(col.period.weather_code))}
        >
          <WeatherIcon code={col.period.weather_code} class="h-5 w-5" />
          <span class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 text-center leading-tight" aria-hidden="true">
            {weatherCodeToDescription(col.period.weather_code)}
          </span>
        </div>
      {/each}

      <!-- ═══ Row 4: Temperature ═══ -->
      <div class="sticky left-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700/50">
        Temp (°F)
      </div>
      {#each columns as col}
        <div
          class="flex items-center justify-center py-2 text-sm font-semibold stats-number border-b border-slate-100 dark:border-slate-700/50 {nightTint(col.periodName)} {tempColorClass(col.period.temperature_f)}"
          role="gridcell"
          aria-label={cellLabel(col, 'temperature', `${col.period.temperature_f} degrees`)}
        >
          {col.period.temperature_f}°
        </div>
      {/each}

      <!-- ═══ Row 5: Feels Like ═══ -->
      <div class="sticky left-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 flex items-center text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
        Feels Like
      </div>
      {#each columns as col}
        {@const diff = col.period.feels_like_f - col.period.temperature_f}
        <div
          class="flex items-center justify-center py-2 text-sm stats-number border-b border-slate-100 dark:border-slate-700/50 {nightTint(col.periodName)} {diff < -10 ? 'text-red-500 font-semibold' : 'text-slate-600 dark:text-slate-400'}"
          role="gridcell"
          aria-label={cellLabel(col, 'feels like', `${col.period.feels_like_f} degrees`)}
        >
          {col.period.feels_like_f}°
        </div>
      {/each}

      <!-- ═══ Row 6: Wind Speed ═══ -->
      <div class="sticky left-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700/50">
        Wind (mph)
      </div>
      {#each columns as col}
        <div
          class="flex items-center justify-center gap-1 py-2 text-sm stats-number border-b border-slate-100 dark:border-slate-700/50 {nightTint(col.periodName)} {windBgClass(col.period.wind_speed_mph)} {windColorClass(col.period.wind_speed_mph)}"
          role="gridcell"
          aria-label={cellLabel(col, 'wind', `${col.period.wind_speed_mph} mph from ${degreesToCardinal(col.period.wind_direction)}`)}
        >
          {col.period.wind_speed_mph}
          <WindArrow degrees={col.period.wind_direction} class="h-3 w-3" />
        </div>
      {/each}

      <!-- ═══ Row 7: Wind Gusts ═══ -->
      <div class="sticky left-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 flex items-center text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
        Gusts
      </div>
      {#each columns as col}
        <div class="flex items-center justify-center py-2 text-sm stats-number border-b border-slate-100 dark:border-slate-700/50 {nightTint(col.periodName)} {windColorClass(col.period.wind_gust_mph)}">
          {col.period.wind_gust_mph}
        </div>
      {/each}

      <!-- ═══ Row 8: Precipitation ═══ -->
      <div class="sticky left-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700/50">
        Precip (in)
      </div>
      {#each columns as col}
        <div class="flex items-center justify-center py-2 text-sm stats-number border-b border-slate-100 dark:border-slate-700/50 {nightTint(col.periodName)} {col.period.precipitation_in > 0 ? 'text-blue-500 font-semibold bg-blue-50/50 dark:bg-blue-900/10' : 'text-slate-400 dark:text-slate-500'}">
          {col.period.precipitation_in > 0 ? col.period.precipitation_in.toFixed(2) : '-'}
        </div>
      {/each}

      <!-- ═══ Row 9: Snow ═══ -->
      <div class="sticky left-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700/50">
        Snow (in)
      </div>
      {#each columns as col}
        <div class="flex items-center justify-center py-2 text-sm stats-number border-b border-slate-100 dark:border-slate-700/50 {nightTint(col.periodName)} {col.period.snow_in > 0 ? 'text-sky-500 font-semibold bg-sky-50/50 dark:bg-sky-900/10' : 'text-slate-400 dark:text-slate-500'}">
          {col.period.snow_in > 0 ? col.period.snow_in.toFixed(1) : '-'}
        </div>
      {/each}

      <!-- ═══ Row 10: Cloud Cover ═══ -->
      <div class="sticky left-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 flex items-center text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
        Cloud (%)
      </div>
      {#each columns as col}
        <div class="flex items-center justify-center py-2 text-sm stats-number border-b border-slate-100 dark:border-slate-700/50 {nightTint(col.periodName)} text-slate-600 dark:text-slate-400">
          {col.period.cloud_cover_percent}
        </div>
      {/each}

      <!-- ═══ Row 11: Cloud Base ═══ -->
      <div class="sticky left-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 flex items-center text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
        Cloud Base (ft)
      </div>
      {#each columns as col}
        {@const inClouds = col.period.cloud_base_ft !== null && col.period.cloud_base_ft < bandElevation}
        <div class="flex items-center justify-center py-2 text-sm stats-number border-b border-slate-100 dark:border-slate-700/50 {nightTint(col.periodName)} {inClouds ? 'text-slate-500 bg-slate-100 dark:bg-slate-700/50 font-medium' : 'text-slate-600 dark:text-slate-400'}">
          {#if col.period.cloud_base_ft === null}
            -
          {:else if inClouds}
            In clouds
          {:else}
            {col.period.cloud_base_ft.toLocaleString()}
          {/if}
        </div>
      {/each}

      <!-- ═══ Row 12: Freezing Level ═══ -->
      <div class="sticky left-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 flex items-center text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
        Freezing Lvl (ft)
      </div>
      {#each columns as col}
        {@const belowBand = col.period.freezing_level_ft < bandElevation}
        <div class="flex items-center justify-center py-2 text-sm stats-number border-b border-slate-100 dark:border-slate-700/50 {nightTint(col.periodName)} {belowBand ? 'text-sky-500 font-semibold' : 'text-slate-600 dark:text-slate-400'}">
          {col.period.freezing_level_ft.toLocaleString()}
        </div>
      {/each}

      <!-- ═══ Row 13: UV Index ═══ -->
      <div class="sticky left-0 z-20 bg-white dark:bg-slate-800 px-4 py-2 flex items-center text-sm text-slate-500 dark:text-slate-400">
        UV Index
      </div>
      {#each columns as col}
        <div
          class="flex items-center justify-center gap-1.5 py-2 text-sm stats-number {nightTint(col.periodName)}"
          role="gridcell"
          aria-label={cellLabel(col, 'UV index', `${col.period.uv_index}, ${getUvLevel(col.period.uv_index).replace('_', ' ')}`)}
        >
          <span class="h-2 w-2 rounded-full {uvDotClass(col.period.uv_index)}" aria-hidden="true"></span>
          <span class="text-slate-600 dark:text-slate-400">{col.period.uv_index}</span>
        </div>
      {/each}
    </div>

    <!-- Right fade gradient -->
    <div class="absolute top-0 right-0 bottom-0 w-6 pointer-events-none bg-gradient-to-l from-white dark:from-slate-800 to-transparent"></div>
  </div>
</div>
