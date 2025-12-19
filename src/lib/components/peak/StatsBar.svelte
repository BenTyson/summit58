<script lang="ts">
  import type { Route } from '$lib/types/database';

  interface Props {
    route: Route | Pick<Route, 'distance_miles' | 'elevation_gain_ft' | 'difficulty_class' | 'typical_time_hours'>;
    class?: string;
  }

  let { route, class: className = '' }: Props = $props();

  const classColors: Record<number, string> = {
    1: 'text-class-1',
    2: 'text-class-2',
    3: 'text-class-3',
    4: 'text-class-4'
  };
</script>

<div class="stats-bar {className}">
  <!-- Distance -->
  <div class="stats-bar-item">
    <div class="stats-bar-value">
      {route.distance_miles}
    </div>
    <div class="stats-bar-label">miles RT</div>
  </div>

  <!-- Elevation Gain -->
  <div class="stats-bar-item">
    <div class="stats-bar-value">
      {route.elevation_gain_ft.toLocaleString()}
    </div>
    <div class="stats-bar-label">ft gain</div>
  </div>

  <!-- Class -->
  <div class="stats-bar-item">
    <div class="stats-bar-value {classColors[route.difficulty_class]}">
      Class {route.difficulty_class}
    </div>
    <div class="stats-bar-label">difficulty</div>
  </div>

  <!-- Time -->
  <div class="stats-bar-item">
    <div class="stats-bar-value">
      {route.typical_time_hours || '—'}
    </div>
    <div class="stats-bar-label">hours</div>
  </div>
</div>
