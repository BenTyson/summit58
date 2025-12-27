<script lang="ts">
  interface Props {
    peakId: string;
    onSubmit: (data: TrailReportFormData) => Promise<void>;
  }

  export interface TrailReportFormData {
    hike_date: string;
    trail_status: string;
    snow_depth_inches: number | null;
    crowd_level: string;
    road_status: string;
    parking_status: string | null;
    arrival_time: string | null;
    parking_notes: string;
    hazards: string[];
    notes: string;
  }

  let { peakId, onSubmit }: Props = $props();

  let hikeDate = $state(new Date().toISOString().split('T')[0]);
  let trailStatus = $state('clear');
  let snowDepth = $state<number | null>(null);
  let crowdLevel = $state('moderate');
  let roadStatus = $state('open');
  let parkingStatus = $state<string | null>(null);
  let arrivalTime = $state<string | null>(null);
  let parkingNotes = $state('');
  let hazards = $state<string[]>([]);
  let notes = $state('');
  let isSubmitting = $state(false);
  let isExpanded = $state(false);

  const trailStatusOptions = [
    { value: 'clear', label: 'Clear', icon: '✓' },
    { value: 'muddy', label: 'Muddy', icon: '💧' },
    { value: 'snowy', label: 'Snowy', icon: '❄️' },
    { value: 'icy', label: 'Icy', icon: '🧊' },
    { value: 'mixed', label: 'Mixed', icon: '⚡' }
  ];

  const crowdOptions = [
    { value: 'empty', label: 'Empty' },
    { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'crowded', label: 'Crowded' },
    { value: 'packed', label: 'Packed' }
  ];

  const roadOptions = [
    { value: 'open', label: 'Open' },
    { value: 'rough', label: 'Rough' },
    { value: '4wd_required', label: '4WD Required' },
    { value: 'closed', label: 'Closed' }
  ];

  const parkingStatusOptions = [
    { value: 'empty', label: 'Empty', description: 'Plenty of spots' },
    { value: 'filling', label: 'Filling', description: 'Some spots taken' },
    { value: 'nearly_full', label: 'Nearly Full', description: 'Few spots left' },
    { value: 'full', label: 'Full', description: 'Main lot full' },
    { value: 'overflow', label: 'Overflow', description: 'Used overflow' }
  ];

  const hazardOptions = [
    { value: 'fallen_trees', label: 'Fallen Trees' },
    { value: 'stream_crossing', label: 'Stream Crossing' },
    { value: 'rockfall', label: 'Rockfall' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'lightning_risk', label: 'Lightning Risk' }
  ];

  function toggleHazard(hazard: string) {
    if (hazards.includes(hazard)) {
      hazards = hazards.filter((h) => h !== hazard);
    } else {
      hazards = [...hazards, hazard];
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;

    try {
      await onSubmit({
        hike_date: hikeDate,
        trail_status: trailStatus,
        snow_depth_inches: trailStatus === 'snowy' || trailStatus === 'icy' ? snowDepth : null,
        crowd_level: crowdLevel,
        road_status: roadStatus,
        parking_status: parkingStatus,
        arrival_time: arrivalTime,
        parking_notes: parkingNotes || '',
        hazards,
        notes: notes || ''
      });

      // Reset form
      isExpanded = false;
      notes = '';
      parkingNotes = '';
      parkingStatus = null;
      arrivalTime = null;
      hazards = [];
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
  {#if !isExpanded}
    <button
      onclick={() => (isExpanded = true)}
      class="w-full p-4 flex items-center justify-center gap-2 text-sunrise hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span class="font-medium">Report Trail Conditions</span>
    </button>
  {:else}
    <form onsubmit={handleSubmit} class="p-4 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-slate-900 dark:text-white">Report Trail Conditions</h3>
        <button
          type="button"
          onclick={() => (isExpanded = false)}
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Hike Date -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          When did you hike?
        </label>
        <input
          type="date"
          bind:value={hikeDate}
          max={new Date().toISOString().split('T')[0]}
          class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sunrise focus:border-transparent"
          required
        />
      </div>

      <!-- Trail Status -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Trail Conditions
        </label>
        <div class="flex flex-wrap gap-2">
          {#each trailStatusOptions as option}
            <button
              type="button"
              onclick={() => (trailStatus = option.value)}
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                {trailStatus === option.value
                  ? 'bg-sunrise text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}"
            >
              {option.icon} {option.label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Snow Depth (conditional) -->
      {#if trailStatus === 'snowy' || trailStatus === 'icy' || trailStatus === 'mixed'}
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Snow Depth (inches)
          </label>
          <input
            type="number"
            bind:value={snowDepth}
            min="0"
            max="120"
            placeholder="Estimated depth"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sunrise focus:border-transparent"
          />
        </div>
      {/if}

      <!-- Crowd Level -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Crowd Level
        </label>
        <div class="flex flex-wrap gap-2">
          {#each crowdOptions as option}
            <button
              type="button"
              onclick={() => (crowdLevel = option.value)}
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                {crowdLevel === option.value
                  ? 'bg-mountain-blue text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}"
            >
              {option.label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Road Status -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Road Access
        </label>
        <div class="flex flex-wrap gap-2">
          {#each roadOptions as option}
            <button
              type="button"
              onclick={() => (roadStatus = option.value)}
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                {roadStatus === option.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}"
            >
              {option.label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Parking Status -->
      <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
        <div class="flex items-center gap-2 mb-3">
          <svg class="h-4 w-4 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17h.01M16 17h.01M9 11h6M5 11l1.5-4.5A2 2 0 018.38 5h7.24a2 2 0 011.88 1.316L19 11M5 11h14v6a1 1 0 01-1 1H6a1 1 0 01-1-1v-6z" />
          </svg>
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Parking Info (optional)</span>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              Parking lot status when you arrived
            </label>
            <div class="flex flex-wrap gap-1.5">
              {#each parkingStatusOptions as option}
                <button
                  type="button"
                  onclick={() => (parkingStatus = parkingStatus === option.value ? null : option.value)}
                  class="px-2.5 py-1 rounded text-xs font-medium transition-colors
                    {parkingStatus === option.value
                      ? 'bg-sunrise text-white'
                      : 'bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-500 hover:border-sunrise'}"
                >
                  {option.label}
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              What time did you arrive at the trailhead?
            </label>
            <input
              type="time"
              bind:value={arrivalTime}
              class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sunrise focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Hazards -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Hazards (select any that apply)
        </label>
        <div class="flex flex-wrap gap-2">
          {#each hazardOptions as option}
            <button
              type="button"
              onclick={() => toggleHazard(option.value)}
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                {hazards.includes(option.value)
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}"
            >
              {option.label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Additional Notes
        </label>
        <textarea
          bind:value={notes}
          rows="2"
          placeholder="Any other details about conditions, parking, route finding..."
          class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sunrise focus:border-transparent resize-none"
        ></textarea>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        disabled={isSubmitting}
        class="w-full py-2.5 rounded-lg bg-sunrise text-white font-medium hover:bg-sunrise-coral transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  {/if}
</div>
