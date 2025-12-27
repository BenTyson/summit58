<script lang="ts">
  interface ParkingData {
    parking_type: string | null;
    parking_capacity: string | null;
    parking_fee_type: string | null;
    parking_fee_amount: number | null;
    parking_fee_notes: string | null;
    shuttle_available: boolean | null;
    shuttle_info: string | null;
    overflow_options: string | null;
    recommended_arrival_time: string | null;
    parking_notes: string | null;
    restroom_available: boolean | null;
    cell_service: string | null;
    four_wd_required: boolean | null;
  }

  interface ParkingReport {
    parking_status: string | null;
    arrival_time: string | null;
    hike_date: string;
  }

  interface Props {
    route: ParkingData;
    recentReports?: ParkingReport[];
  }

  let { route, recentReports = [] }: Props = $props();

  // Check if we have any parking data to display
  const hasParkingData = $derived(
    route.parking_type ||
    route.parking_capacity ||
    route.parking_fee_type ||
    route.shuttle_available ||
    route.recommended_arrival_time ||
    route.four_wd_required
  );

  // Capacity configuration
  const capacityConfig: Record<string, { label: string; color: string }> = {
    very_limited: { label: '<20 spots', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    limited: { label: '20-50 spots', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    moderate: { label: '50-100 spots', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    large: { label: '100+ spots', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    unlimited: { label: 'Dispersed', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
  };

  // Parking type labels
  const typeLabels: Record<string, string> = {
    free_lot: 'Free Lot',
    paid_lot: 'Paid Lot',
    street_parking: 'Street Parking',
    dispersed: 'Dispersed',
    pullout: 'Pullouts',
    private_lot: 'Private Lot',
    permit_required: 'Permit Required'
  };

  // Fee type labels
  const feeLabels: Record<string, string> = {
    free: 'Free',
    paid_daily: 'Daily Fee',
    paid_annual: 'Annual Pass',
    donation: 'Donation',
    permit_required: 'Permit Required'
  };

  // Parking status labels for reports
  const statusConfig: Record<string, { label: string; color: string }> = {
    empty: { label: 'Empty', color: 'bg-emerald-100 text-emerald-700' },
    filling: { label: 'Filling', color: 'bg-green-100 text-green-700' },
    nearly_full: { label: 'Nearly Full', color: 'bg-amber-100 text-amber-700' },
    full: { label: 'Full', color: 'bg-red-100 text-red-700' },
    overflow: { label: 'Overflow', color: 'bg-red-100 text-red-700' }
  };

  // Cell service labels
  const cellLabels: Record<string, string> = {
    none: 'No Service',
    weak: 'Weak',
    moderate: 'Moderate',
    good: 'Good'
  };

  const capacity = $derived(route.parking_capacity ? capacityConfig[route.parking_capacity] : null);
  const parkingType = $derived(route.parking_type ? typeLabels[route.parking_type] : null);
  const feeType = $derived(route.parking_fee_type ? feeLabels[route.parking_fee_type] : null);
</script>

{#if hasParkingData}
  <div
    class="
      animate-fade-in-up rounded-xl overflow-hidden
      border border-slate-200 dark:border-slate-700
      bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80
      shadow-card
    "
    style="animation-delay: 300ms"
  >
    <div class="p-5">
      <h3 class="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <svg class="h-5 w-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17h.01M16 17h.01M9 11h6M5 11l1.5-4.5A2 2 0 018.38 5h7.24a2 2 0 011.88 1.316L19 11M5 11h14v6a1 1 0 01-1 1H6a1 1 0 01-1-1v-6z" />
        </svg>
        Parking & Access
      </h3>

      <dl class="mt-4 space-y-3 text-sm">
        <!-- Parking Type & Capacity -->
        {#if parkingType || capacity}
          <div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
            <dt class="text-slate-500 dark:text-slate-400">Parking</dt>
            <dd class="flex items-center gap-2">
              {#if parkingType}
                <span class="font-medium text-slate-900 dark:text-white">{parkingType}</span>
              {/if}
              {#if capacity}
                <span class="px-2 py-0.5 rounded-full text-xs font-medium {capacity.color}">
                  {capacity.label}
                </span>
              {/if}
            </dd>
          </div>
        {/if}

        <!-- Fees -->
        {#if route.parking_fee_type && route.parking_fee_type !== 'free'}
          <div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
            <dt class="text-slate-500 dark:text-slate-400">Fee</dt>
            <dd class="font-semibold text-amber-600 dark:text-amber-400">
              {#if route.parking_fee_amount}
                ${route.parking_fee_amount}/day
              {:else}
                {feeType}
              {/if}
            </dd>
          </div>
          {#if route.parking_fee_notes}
            <div class="py-2 border-b border-slate-100 dark:border-slate-700">
              <p class="text-xs text-slate-500 dark:text-slate-400">{route.parking_fee_notes}</p>
            </div>
          {/if}
        {:else if route.parking_fee_type === 'free'}
          <div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
            <dt class="text-slate-500 dark:text-slate-400">Fee</dt>
            <dd class="font-medium text-green-600 dark:text-green-400">Free</dd>
          </div>
        {/if}

        <!-- 4WD Requirement -->
        {#if route.four_wd_required}
          <div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
            <dt class="text-slate-500 dark:text-slate-400">Vehicle</dt>
            <dd class="flex items-center gap-1.5">
              <svg class="h-4 w-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <span class="font-semibold text-orange-600 dark:text-orange-400">4WD/High Clearance</span>
            </dd>
          </div>
        {/if}

        <!-- Recommended Arrival -->
        {#if route.recommended_arrival_time}
          <div class="py-2 border-b border-slate-100 dark:border-slate-700">
            <dt class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Best Arrival (Weekends)</dt>
            <dd class="font-bold text-sunrise">{route.recommended_arrival_time}</dd>
          </div>
        {/if}

        <!-- Shuttle Available -->
        {#if route.shuttle_available}
          <div class="py-2 border-b border-slate-100 dark:border-slate-700">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Shuttle Available
            </span>
            {#if route.shuttle_info}
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{route.shuttle_info}</p>
            {/if}
          </div>
        {/if}

        <!-- Overflow Options -->
        {#if route.overflow_options}
          <div class="py-2 border-b border-slate-100 dark:border-slate-700">
            <dt class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">If Lot is Full</dt>
            <dd class="text-sm text-slate-700 dark:text-slate-300">{route.overflow_options}</dd>
          </div>
        {/if}

        <!-- Amenities Row -->
        {#if route.restroom_available !== null || route.cell_service}
          <div class="flex items-center gap-4 py-2">
            {#if route.restroom_available}
              <span class="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Restroom
              </span>
            {/if}
            {#if route.cell_service}
              <span class="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {cellLabels[route.cell_service] || route.cell_service}
              </span>
            {/if}
          </div>
        {/if}

        <!-- Parking Notes -->
        {#if route.parking_notes}
          <div class="py-2">
            <p class="text-xs text-slate-500 dark:text-slate-400 italic">{route.parking_notes}</p>
          </div>
        {/if}
      </dl>
    </div>

    <!-- Recent Parking Reports -->
    {#if recentReports.length > 0}
      <div class="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
        <h4 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Recent Parking Reports
        </h4>
        <div class="space-y-2">
          {#each recentReports.slice(0, 3) as report}
            {#if report.parking_status}
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-xs font-medium {statusConfig[report.parking_status]?.color || 'bg-slate-100 text-slate-600'}">
                    {statusConfig[report.parking_status]?.label || report.parking_status}
                  </span>
                  {#if report.arrival_time}
                    <span class="text-slate-500 dark:text-slate-400">@ {report.arrival_time}</span>
                  {/if}
                </div>
                <span class="text-xs text-slate-400">
                  {new Date(report.hike_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/if}

    <!-- Learn More Link -->
    <div class="border-t border-slate-200 dark:border-slate-700 p-4">
      <a
        href="/learn/parking"
        class="flex items-center justify-center gap-2 text-sm text-sunrise hover:text-sunrise-coral font-medium transition-colors"
      >
        Learn about parking strategies
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
{/if}
