<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import LearnHero from '$lib/components/learn/LearnHero.svelte';
  import ContentSection from '$lib/components/learn/ContentSection.svelte';
  import CalloutBox from '$lib/components/learn/CalloutBox.svelte';
  import TableOfContents from '$lib/components/learn/TableOfContents.svelte';

  const tocItems = [
    { id: 'yds-overview', title: 'YDS Overview', icon: 'mountain' },
    { id: 'class-1', title: 'Class 1', icon: 'check' },
    { id: 'class-2', title: 'Class 2', icon: 'shield' },
    { id: 'class-3', title: 'Class 3', icon: 'warning' },
    { id: 'class-4', title: 'Class 4', icon: 'lightning' },
    { id: 'exposure', title: 'Exposure Ratings', icon: 'heart' },
    { id: 'reference', title: 'Quick Reference', icon: 'map' }
  ];
</script>

<svelte:head>
  <title>Difficulty Ratings | Learn | Cairn58</title>
  <meta
    name="description"
    content="Understanding the Yosemite Decimal System for Colorado 14ers. Class 1 through Class 4 terrain explained with real peak examples."
  />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cairn58.com/" },
      { "@type": "ListItem", "position": 2, "name": "Learn", "item": "https://cairn58.com/learn" },
      { "@type": "ListItem", "position": 3, "name": "Difficulty Ratings", "item": "https://cairn58.com/learn/difficulty-ratings" }
    ]
  })}</script>`}
</svelte:head>

<LearnHero
  title="Difficulty Ratings"
  subtitle="Understanding the Yosemite Decimal System"
/>

<Container size="wide" class="py-12 sm:py-16">
  <!-- Breadcrumb -->
  <nav class="mb-8 animate-fade-in-up">
    <ol class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <li><a href="/learn" class="hover:text-sunrise transition-colors">Learn</a></li>
      <li class="text-slate-400">/</li>
      <li class="text-slate-900 dark:text-white font-medium">Difficulty Ratings</li>
    </ol>
  </nav>

  <div class="flex gap-12">
    <!-- Main Content -->
    <div class="flex-1 max-w-3xl">
      <ContentSection id="yds-overview" title="YDS Overview" icon="mountain">
        <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          The Yosemite Decimal System (YDS) is the standard rating system for hiking and climbing difficulty in North America. Originally developed for Yosemite Valley rock climbs, it has become the universal language for describing terrain on peaks across the continent.
        </p>
        <p class="mt-4 text-slate-600 dark:text-slate-400">
          For Colorado 14ers, routes range from Class 1 through Class 4. Class 5 (technical rock climbing) exists but is extremely rare on standard 14er routes. Understanding these ratings is essential for picking routes that match your experience level.
        </p>

        <CalloutBox type="info" title="Ratings Describe the Hardest Move">
          A route's class rating reflects the single most difficult section, not the overall character. A Class 3 route might be 95% Class 1 trail with one short Class 3 scramble near the summit.
        </CalloutBox>
      </ContentSection>

      <ContentSection id="class-1" title="Class 1 — Trail Hiking" icon="check" delay={100}>
        <div class="flex items-center gap-3 mb-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-class-1/10 text-class-1 font-semibold text-sm">
            <span class="w-2.5 h-2.5 rounded-full bg-class-1"></span>
            Class 1
          </span>
          <span class="text-sm text-slate-500 dark:text-slate-400">Low risk of falls</span>
        </div>

        <p class="text-slate-600 dark:text-slate-400 mb-4">
          Well-maintained trail the entire way. Normal hiking with no hands needed. This is what most people picture when they think of hiking a mountain—follow the path to the top.
        </p>

        <h3 class="font-semibold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-class-1/20 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-class-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z"/>
            </svg>
          </span>
          Example Routes
        </h3>
        <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li><strong>Quandary Peak</strong> — East Ridge</li>
          <li><strong>Mt. Bierstadt</strong> — West Slopes</li>
          <li><strong>Grays Peak</strong> — North Slopes</li>
          <li><strong>Handies Peak</strong> — West Slopes</li>
        </ul>

        <CalloutBox type="tip" title="Bottom Line">
          If you can walk a trail in the woods, you can do a Class 1 fourteener. The challenge is altitude and distance, not terrain.
        </CalloutBox>
      </ContentSection>

      <ContentSection id="class-2" title="Class 2 — Off-Trail / Simple Scrambling" icon="shield" delay={200}>
        <div class="flex items-center gap-3 mb-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-class-2/10 text-class-2 font-semibold text-sm">
            <span class="w-2.5 h-2.5 rounded-full bg-class-2"></span>
            Class 2
          </span>
          <span class="text-sm text-slate-500 dark:text-slate-400">Moderate risk</span>
        </div>

        <p class="text-slate-600 dark:text-slate-400 mb-4">
          Some off-trail travel over talus and scree fields. Hands are occasionally used for balance but not for actual climbing. Route-finding skills become important—cairns and wear patterns mark the way, but there's no maintained path.
        </p>

        <h3 class="font-semibold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-class-2/20 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-class-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z"/>
            </svg>
          </span>
          Example Routes
        </h3>
        <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li><strong>Mt. Elbert</strong> — Northeast Ridge</li>
          <li><strong>Longs Peak</strong> — Keyhole Route</li>
          <li><strong>La Plata Peak</strong> — Northwest Ridge</li>
          <li><strong>Mt. Massive</strong> — East Slopes</li>
        </ul>

        <CalloutBox type="info" title="What to Expect">
          Expect loose rock and some route-finding. Trekking poles help on the talus fields. Ankle-supporting boots are strongly recommended.
        </CalloutBox>
      </ContentSection>

      <ContentSection id="class-3" title="Class 3 — Scrambling with Exposure" icon="warning" delay={300}>
        <div class="flex items-center gap-3 mb-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-class-3/10 text-class-3 font-semibold text-sm">
            <span class="w-2.5 h-2.5 rounded-full bg-class-3"></span>
            Class 3
          </span>
          <span class="text-sm text-slate-500 dark:text-slate-400">Significant exposure</span>
        </div>

        <p class="text-slate-600 dark:text-slate-400 mb-4">
          Steep terrain requiring hands for actual climbing, not just balance. Significant exposure means long falls are possible if you slip. A helmet is strongly recommended to protect against rockfall from climbers above.
        </p>

        <CalloutBox type="danger" title="Where Most Accidents Happen">
          Class 3 routes are where most 14er accidents occur. Exposure means a fall could be fatal. Do not attempt without prior scrambling experience.
        </CalloutBox>

        <h3 class="font-semibold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-class-3/20 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-class-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z"/>
            </svg>
          </span>
          Example Routes
        </h3>
        <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li><strong>Capitol Peak</strong> — Northeast Ridge</li>
          <li><strong>Pyramid Peak</strong> — Northeast Ridge</li>
          <li><strong>Crestone Needle</strong> — South Face</li>
          <li><strong>Little Bear Peak</strong> — West Ridge</li>
        </ul>

        <div class="mt-6 p-5 rounded-xl bg-class-3/5 border border-class-3/20">
          <h4 class="font-semibold text-slate-900 dark:text-white mb-3">Before Attempting Class 3</h4>
          <ul class="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <li class="flex items-start gap-2">
              <svg class="h-5 w-5 text-class-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
              </svg>
              Complete several Class 2 peaks first
            </li>
            <li class="flex items-start gap-2">
              <svg class="h-5 w-5 text-class-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
              </svg>
              Practice scrambling on lower-elevation terrain
            </li>
            <li class="flex items-start gap-2">
              <svg class="h-5 w-5 text-class-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
              </svg>
              Bring a helmet and know how to self-arrest
            </li>
            <li class="flex items-start gap-2">
              <svg class="h-5 w-5 text-class-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
              </svg>
              Go with someone experienced on the route
            </li>
          </ul>
        </div>
      </ContentSection>

      <ContentSection id="class-4" title="Class 4 — Steep Climbing" icon="lightning" delay={400}>
        <div class="flex items-center gap-3 mb-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-class-4/10 text-class-4 font-semibold text-sm">
            <span class="w-2.5 h-2.5 rounded-full bg-class-4"></span>
            Class 4
          </span>
          <span class="text-sm text-slate-500 dark:text-slate-400">Severe exposure — falls likely fatal</span>
        </div>

        <p class="text-slate-600 dark:text-slate-400 mb-4">
          Steep rock with severe exposure. Handholds and footholds are smaller and more technical. A fall would likely be fatal. Most climbers use a rope and harness on Class 4 terrain.
        </p>

        <CalloutBox type="danger" title="Ropes Recommended">
          Most hikers use a rope and harness on Class 4 terrain. If you don't know how to use climbing protection, hire a guide or go with an experienced partner who does.
        </CalloutBox>

        <h3 class="font-semibold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-class-4/20 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-class-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z"/>
            </svg>
          </span>
          Example Routes
        </h3>
        <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li><strong>Capitol Peak</strong> — Knife Edge</li>
          <li><strong>Little Bear Peak</strong> — Hourglass</li>
          <li><strong>Crestone Needle</strong> — Ellingwood Ledges</li>
        </ul>

        <div class="mt-6 p-5 rounded-xl bg-class-4/5 border border-class-4/20">
          <h4 class="font-semibold text-slate-900 dark:text-white mb-2">Class 4 Is Not Hiking</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            These routes cross into mountaineering. You need climbing skills, proper gear (rope, harness, helmet, protection), and ideally a partner or guide. There is no shame in hiring a professional for your first Class 4 peak.
          </p>
        </div>
      </ContentSection>

      <ContentSection id="exposure" title="Exposure Ratings" icon="heart" delay={500}>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          Exposure refers to how far you could fall if you lose your footing. It's independent of the climbing difficulty—a Class 2 route can have high exposure if there's a cliff next to the trail. Understanding exposure helps you gauge the real consequence of a slip.
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="p-5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h4 class="font-semibold text-green-900 dark:text-green-200 mb-2">Low Exposure</h4>
            <p class="text-sm text-green-800 dark:text-green-300">
              A fall means a short stumble or tumble. You might get scraped up but unlikely to be seriously hurt.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <h4 class="font-semibold text-amber-900 dark:text-amber-200 mb-2">Moderate Exposure</h4>
            <p class="text-sm text-amber-800 dark:text-amber-300">
              A fall of 10-20 feet is possible. Injuries likely, but usually survivable with caution.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <h4 class="font-semibold text-orange-900 dark:text-orange-200 mb-2">High Exposure</h4>
            <p class="text-sm text-orange-800 dark:text-orange-300">
              A fall of 50+ feet is possible. Serious injury or death likely. Full attention required at all times.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <h4 class="font-semibold text-red-900 dark:text-red-200 mb-2">Severe Exposure</h4>
            <p class="text-sm text-red-800 dark:text-red-300">
              A fall of 100+ feet is possible. Almost certainly fatal. Rope and protection strongly recommended.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection id="reference" title="Quick Reference Table" icon="map" delay={600}>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          Use this table to quickly compare the four classes and decide which routes match your skill level.
        </p>

        <div class="overflow-x-auto -mx-4 sm:mx-0">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b-2 border-slate-200 dark:border-slate-700">
                <th class="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Class</th>
                <th class="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Terrain</th>
                <th class="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Hands?</th>
                <th class="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Fall Risk</th>
                <th class="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Examples</th>
                <th class="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Best For</th>
              </tr>
            </thead>
            <tbody class="text-slate-600 dark:text-slate-400">
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="py-3 px-4">
                  <span class="inline-flex items-center gap-1.5 font-semibold text-class-1">
                    <span class="w-2 h-2 rounded-full bg-class-1"></span>
                    1
                  </span>
                </td>
                <td class="py-3 px-4">Maintained trail</td>
                <td class="py-3 px-4">No</td>
                <td class="py-3 px-4">Low</td>
                <td class="py-3 px-4">Quandary, Grays, Bierstadt</td>
                <td class="py-3 px-4">Beginners</td>
              </tr>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="py-3 px-4">
                  <span class="inline-flex items-center gap-1.5 font-semibold text-class-2">
                    <span class="w-2 h-2 rounded-full bg-class-2"></span>
                    2
                  </span>
                </td>
                <td class="py-3 px-4">Talus, scree, off-trail</td>
                <td class="py-3 px-4">For balance</td>
                <td class="py-3 px-4">Moderate</td>
                <td class="py-3 px-4">Elbert, Longs, La Plata</td>
                <td class="py-3 px-4">Experienced hikers</td>
              </tr>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="py-3 px-4">
                  <span class="inline-flex items-center gap-1.5 font-semibold text-class-3">
                    <span class="w-2 h-2 rounded-full bg-class-3"></span>
                    3
                  </span>
                </td>
                <td class="py-3 px-4">Steep rock, ledges</td>
                <td class="py-3 px-4">Yes, for climbing</td>
                <td class="py-3 px-4">High (fatal possible)</td>
                <td class="py-3 px-4">Capitol, Pyramid, Crestone Needle</td>
                <td class="py-3 px-4">Experienced scramblers</td>
              </tr>
              <tr>
                <td class="py-3 px-4">
                  <span class="inline-flex items-center gap-1.5 font-semibold text-class-4">
                    <span class="w-2 h-2 rounded-full bg-class-4"></span>
                    4
                  </span>
                </td>
                <td class="py-3 px-4">Steep rock, small holds</td>
                <td class="py-3 px-4">Yes, constant</td>
                <td class="py-3 px-4">Severe (likely fatal)</td>
                <td class="py-3 px-4">Capitol Knife Edge, Little Bear</td>
                <td class="py-3 px-4">Climbers with gear</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CalloutBox type="tip" title="Start Low, Build Up">
          Do several Class 1 peaks before trying Class 2. Do several Class 2 peaks before trying Class 3. There's no rush—the mountains will wait.
        </CalloutBox>
      </ContentSection>

      <!-- Navigation -->
      <div class="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between">
        <a
          href="/learn/parking"
          class="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sunrise transition-colors"
        >
          <svg class="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Trailhead Parking
        </a>
        <a
          href="/learn"
          class="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sunrise transition-colors sm:flex-row-reverse"
        >
          All Guides
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
