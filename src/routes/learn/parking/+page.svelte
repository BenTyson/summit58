<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import LearnHero from '$lib/components/learn/LearnHero.svelte';
  import ContentSection from '$lib/components/learn/ContentSection.svelte';
  import CalloutBox from '$lib/components/learn/CalloutBox.svelte';
  import TableOfContents from '$lib/components/learn/TableOfContents.svelte';

  const tocItems = [
    { id: 'reality', title: 'The Parking Reality', icon: 'warning' },
    { id: 'types', title: 'Types of Parking', icon: 'map' },
    { id: 'timing', title: 'Timing Strategies', icon: 'clock' },
    { id: 'full', title: 'When the Lot is Full', icon: 'shield' },
    { id: 'shuttles', title: 'Shuttle Systems', icon: 'car' },
    { id: 'permits', title: 'Permits & Reservations', icon: 'ticket' },
    { id: 'seasonal', title: 'Seasonal Differences', icon: 'sun' }
  ];
</script>

<svelte:head>
  <title>Trailhead Parking Guide | Learn | Summit58</title>
  <meta
    name="description"
    content="A complete guide to trailhead parking at Colorado 14ers. Timing strategies, permit requirements, shuttle options, and what to do when the lot is full."
  />
</svelte:head>

<LearnHero
  title="Trailhead Parking"
  subtitle="Navigating the most competitive parking in Colorado"
/>

<Container size="wide" class="py-12 sm:py-16">
  <!-- Breadcrumb -->
  <nav class="mb-8 animate-fade-in-up">
    <ol class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <li><a href="/learn" class="hover:text-sunrise transition-colors">Learn</a></li>
      <li class="text-slate-400">/</li>
      <li class="text-slate-900 dark:text-white font-medium">Trailhead Parking</li>
    </ol>
  </nav>

  <div class="flex gap-12">
    <!-- Main Content -->
    <div class="flex-1 max-w-3xl">
    <ContentSection id="reality" title="The Parking Reality" icon="warning">
      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
        Colorado's 14ers have exploded in popularity. Over 500,000 people attempt these peaks each year, and the infrastructure hasn't kept up. Trailhead parking has become one of the most frustrating—and important—aspects of planning a climb.
      </p>
      <p class="mt-4 text-slate-600 dark:text-slate-400">
        The reality is stark: at popular trailheads on summer weekends, lots fill completely by 4:00-5:00 AM. Arriving at 6:00 AM on a Saturday to climb Quandary Peak? You're likely walking an extra mile from overflow parking—if you're lucky.
      </p>

      <CalloutBox type="danger" title="The 4 AM Rule">
        On summer weekends at popular peaks, plan to arrive at the trailhead before 4:00 AM. This isn't an exaggeration. By sunrise, most lots are full and overflow areas are filling.
      </CalloutBox>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3">The Busiest Trailheads</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        These peaks see the highest visitor volumes and most severe parking issues:
      </p>
      <div class="grid gap-2">
        <div class="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <span class="flex-shrink-0 w-28 text-xs font-bold text-red-600 dark:text-red-400">Quandary Peak</span>
          <span class="text-sm text-red-900 dark:text-red-200">~20 spots. Full by 4:30 AM on summer weekends.</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <span class="flex-shrink-0 w-28 text-xs font-bold text-red-600 dark:text-red-400">Mt. Bierstadt</span>
          <span class="text-sm text-red-900 dark:text-red-200">Limited parking. Shuttle system in place (see below).</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <span class="flex-shrink-0 w-28 text-xs font-bold text-orange-600 dark:text-orange-400">Grays & Torreys</span>
          <span class="text-sm text-orange-900 dark:text-orange-200">~100 spots. Full by 5:00 AM on weekends.</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <span class="flex-shrink-0 w-28 text-xs font-bold text-amber-600 dark:text-amber-400">Maroon Bells</span>
          <span class="text-sm text-amber-900 dark:text-amber-200">Requires timed-entry reservation. Shuttle mandatory.</span>
        </div>
      </div>
    </ContentSection>

    <ContentSection id="types" title="Types of Parking" icon="map" delay={100}>
      <p class="text-slate-600 dark:text-slate-400 mb-6">
        Trailhead parking varies widely across the 58 peaks. Understanding what you'll encounter helps with planning.
      </p>

      <div class="space-y-4">
        <div class="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <h4 class="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Free Designated Lots</h4>
          <p class="text-sm text-emerald-700 dark:text-emerald-400">
            Most 14er trailheads have free gravel or paved lots maintained by the Forest Service. Capacity ranges from a handful of spots to 100+. Examples: Grays/Torreys, Mt. Elbert, Mt. Sherman.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <h4 class="font-semibold text-amber-800 dark:text-amber-300 mb-2">Fee Stations</h4>
          <p class="text-sm text-amber-700 dark:text-amber-400">
            Some trailheads charge daily fees ($10-15) or accept annual passes. Mt. Bierstadt requires a day-use fee. The America the Beautiful pass is accepted at most fee areas.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">Dispersed Pullouts</h4>
          <p class="text-sm text-blue-700 dark:text-blue-400">
            Remote peaks often have informal parking along the road—pullouts, wide shoulders, or clearings. Democrat and the Decalibron circuit are good examples. Capacity is flexible but can mean long walks.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
          <h4 class="font-semibold text-violet-800 dark:text-violet-300 mb-2">Permit Required</h4>
          <p class="text-sm text-violet-700 dark:text-violet-400">
            A few peaks require advance reservations, especially near Aspen. Maroon Bells is the most notable—you must book a timed shuttle entry or hold a camping permit.
          </p>
        </div>
      </div>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3">4WD Access</h3>
      <p class="text-slate-600 dark:text-slate-400">
        Some trailheads require high-clearance or 4WD vehicles. This affects both access and parking strategy—4WD roads often have fewer visitors but rougher conditions. Check route pages for specific requirements.
      </p>
    </ContentSection>

    <ContentSection id="timing" title="Timing Strategies" icon="clock" delay={200}>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        Your arrival time is the single biggest factor in finding a parking spot. Here's how to think about it:
      </p>

      <h3 class="font-semibold text-slate-900 dark:text-white mb-3">Summer Weekends (Peak Season)</h3>
      <div class="grid gap-2 mb-6">
        <div class="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <span class="flex-shrink-0 w-20 text-xs font-bold text-emerald-600 dark:text-emerald-400">3-4 AM</span>
          <span class="text-sm text-emerald-900 dark:text-emerald-200"><strong>Best bet.</strong> Spot in main lot guaranteed at all but Maroon Bells.</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <span class="flex-shrink-0 w-20 text-xs font-bold text-green-600 dark:text-green-400">4-5 AM</span>
          <span class="text-sm text-green-900 dark:text-green-200"><strong>Usually fine.</strong> May need overflow at busiest peaks.</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <span class="flex-shrink-0 w-20 text-xs font-bold text-amber-600 dark:text-amber-400">5-6 AM</span>
          <span class="text-sm text-amber-900 dark:text-amber-200"><strong>Risky.</strong> Popular lots filling or full. Expect overflow.</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <span class="flex-shrink-0 w-20 text-xs font-bold text-red-600 dark:text-red-400">After 6 AM</span>
          <span class="text-sm text-red-900 dark:text-red-200"><strong>Too late.</strong> Overflow full at popular peaks. Consider alternatives.</span>
        </div>
      </div>

      <CalloutBox type="tip" title="The Weekday Advantage">
        On weekdays, everything shifts by 2-3 hours. A 6:00 AM arrival is usually fine at most trailheads. If your schedule allows, hiking Tuesday-Thursday eliminates most parking stress.
      </CalloutBox>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3">Camp the Night Before</h3>
      <p class="text-slate-600 dark:text-slate-400">
        Many climbers solve parking by arriving the evening before. Some trailheads allow overnight parking (check local regulations). Dispersed camping on Forest Service land is often possible nearby. This also gives you time to acclimate to altitude before climbing.
      </p>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3">Afternoon Starts</h3>
      <p class="text-slate-600 dark:text-slate-400">
        For experienced hikers comfortable with afternoon weather patterns, arriving mid-afternoon can work. Morning hikers leave around 11 AM-2 PM, freeing spots. However, this strategy requires:
      </p>
      <ul class="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 mt-2">
        <li>Comfort with potential thunderstorms</li>
        <li>Willingness to turn back if weather deteriorates</li>
        <li>Headlamps for the descent</li>
        <li>Overnight gear in case you're delayed</li>
      </ul>
    </ContentSection>

    <ContentSection id="full" title="When the Lot is Full" icon="shield" delay={300}>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        It happens. You arrive and there's no parking. Here are your options:
      </p>

      <div class="space-y-4">
        <div class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h4 class="font-semibold text-slate-900 dark:text-white mb-2">1. Check Overflow Areas</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Most popular trailheads have designated overflow parking, typically 0.5-1 mile from the main lot. Ask rangers or check signage. This adds distance but is usually legal and safe.
          </p>
        </div>

        <div class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h4 class="font-semibold text-slate-900 dark:text-white mb-2">2. Wait for a Spot</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Early finishers start returning around 9-10 AM. If you're willing to wait, spots open up. Bring breakfast and coffee. This works best at smaller lots where turnover is visible.
          </p>
        </div>

        <div class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h4 class="font-semibold text-slate-900 dark:text-white mb-2">3. Pick a Different Peak</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Have a backup plan. Less popular peaks within an hour's drive often have available parking. The "big 4" (Quandary, Bierstadt, Grays/Torreys, Elbert) get the worst of it.
          </p>
        </div>
      </div>

      <CalloutBox type="warning" title="Never Block Roads">
        Parking illegally—on roadsides, blocking driveways, or in fire lanes—is dangerous and damages the resource. Emergency vehicles need access. Getting towed or ticketed ruins your day. If there's no legal spot, make a different plan.
      </CalloutBox>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3">Less Crowded Alternatives</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        These peaks rarely have parking issues:
      </p>
      <ul class="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
        <li><strong>San Luis Peak:</strong> Remote location, moderate traffic</li>
        <li><strong>Handies Peak:</strong> 4WD access limits crowds</li>
        <li><strong>Culebra Peak:</strong> Private land (fee required) means fewer visitors</li>
        <li><strong>Most Sangre de Cristo peaks:</strong> Long drives from Front Range</li>
      </ul>
    </ContentSection>

    <ContentSection id="shuttles" title="Shuttle Systems" icon="car" delay={400}>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        To address extreme parking pressure, some trailheads now operate shuttle systems. This is the future of 14er access—expect more shuttles in coming years.
      </p>

      <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-6">
        <h4 class="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Mt. Bierstadt Shuttle
        </h4>
        <p class="text-sm text-green-700 dark:text-green-400 mb-2">
          Operates summer weekends and holidays. Pick up at Georgetown, drops at Guanella Pass trailhead. Reservations recommended.
        </p>
        <ul class="list-disc list-inside text-sm text-green-700 dark:text-green-400 space-y-1">
          <li>First shuttle typically 4:30 AM</li>
          <li>Last return around 5:00 PM</li>
          <li>Fee: ~$15 round trip</li>
          <li>Book ahead at recreation.gov</li>
        </ul>
      </div>

      <div class="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <h4 class="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Maroon Bells Shuttle (Required)
        </h4>
        <p class="text-sm text-amber-700 dark:text-amber-400 mb-2">
          Mandatory during peak season. No personal vehicles allowed except for campers with reservations.
        </p>
        <ul class="list-disc list-inside text-sm text-amber-700 dark:text-amber-400 space-y-1">
          <li>Timed entry reservations required</li>
          <li>Shuttles from Aspen Highlands</li>
          <li>Books out weeks in advance</li>
          <li>Camping permits allow vehicle access</li>
        </ul>
      </div>

      <CalloutBox type="tip" title="Shuttle Advantages">
        Beyond guaranteed access, shuttles let you skip the early wake-up. Park at a convenient lot, take the first shuttle, and start hiking fresh rather than exhausted from driving.
      </CalloutBox>
    </ContentSection>

    <ContentSection id="permits" title="Permits & Reservations" icon="ticket" delay={500}>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        A few areas require advance reservations or permits. Check these requirements well before your trip—some book out months ahead.
      </p>

      <div class="space-y-4 mb-6">
        <div class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h4 class="font-semibold text-slate-900 dark:text-white mb-2">Maroon Bells Scenic Area</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Timed entry required for vehicle or shuttle access. Book at recreation.gov. Opens for reservations in spring—popular dates sell out immediately.
          </p>
        </div>

        <div class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h4 class="font-semibold text-slate-900 dark:text-white mb-2">Day Use Fees</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Several trailheads charge $10-15 daily or accept America the Beautiful Annual Pass ($80/year). Fee stations are typically self-pay with envelopes.
          </p>
        </div>

        <div class="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h4 class="font-semibold text-slate-900 dark:text-white mb-2">Culebra Peak</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Private land access fee ($150) required. Limit on daily visitors. Book through Culebra Peak website.
          </p>
        </div>
      </div>

      <CalloutBox type="info" title="America the Beautiful Pass">
        If you're climbing multiple 14ers, the $80 annual pass pays for itself quickly. Covers day use at most Forest Service fee areas. Available at recreation.gov or ranger stations.
      </CalloutBox>
    </ContentSection>

    <ContentSection id="seasonal" title="Seasonal Differences" icon="sun" delay={600}>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        Parking dynamics change dramatically through the year:
      </p>

      <div class="grid gap-3">
        <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <h4 class="font-semibold text-green-800 dark:text-green-300 mb-1">Summer (June-August)</h4>
          <p class="text-sm text-green-700 dark:text-green-400">
            Peak pressure. All strategies above apply. Weekdays significantly easier than weekends.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <h4 class="font-semibold text-amber-800 dark:text-amber-300 mb-1">Fall (September-October)</h4>
          <p class="text-sm text-amber-700 dark:text-amber-400">
            Moderate pressure. Weekends still busy but 6 AM arrivals usually fine. Leaf peeping adds traffic near Aspen peaks.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
          <h4 class="font-semibold text-sky-800 dark:text-sky-300 mb-1">Winter (November-May)</h4>
          <p class="text-sm text-sky-700 dark:text-sky-400">
            Light pressure, but many roads close. Access shifts to winter trailheads—longer approaches from lower parking. 4WD essential.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
          <h4 class="font-semibold text-rose-800 dark:text-rose-300 mb-1">Mud Season (April-May)</h4>
          <p class="text-sm text-rose-700 dark:text-rose-400">
            Roads impassable. Most trailheads unreachable. Not recommended for 14er attempts.
          </p>
        </div>
      </div>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3">Winter Road Closures</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        Many trailhead access roads close for winter. This changes the parking equation completely:
      </p>
      <ul class="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
        <li><strong>Guanella Pass:</strong> Closed above Georgetown (Mt. Bierstadt becomes 9+ mile approach)</li>
        <li><strong>Kite Lake:</strong> Closed below timberline (Democrat from Alma adds 2 miles)</li>
        <li><strong>Many 4WD roads:</strong> Snow-covered and impassable until June</li>
      </ul>

      <CalloutBox type="warning" title="Check Road Status">
        Before any winter/spring attempt, verify road conditions. CDOT and local ranger districts provide updates. Getting stuck on a closed road is dangerous and expensive.
      </CalloutBox>
    </ContentSection>

    <!-- Navigation -->
    <div class="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between">
      <a
        href="/learn"
        class="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sunrise transition-colors"
      >
        <svg class="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Learn
      </a>
      <a
        href="/learn/gear"
        class="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sunrise transition-colors sm:flex-row-reverse"
      >
        Gear Guide
        <svg class="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
    </div>

    <!-- Table of Contents (desktop only) -->
    <TableOfContents items={tocItems} />
  </div>
</Container>
