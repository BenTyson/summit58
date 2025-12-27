<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import LearnHero from '$lib/components/learn/LearnHero.svelte';
  import ContentSection from '$lib/components/learn/ContentSection.svelte';
  import CalloutBox from '$lib/components/learn/CalloutBox.svelte';
  import TableOfContents from '$lib/components/learn/TableOfContents.svelte';

  const tocItems = [
    { id: 'reality', title: 'The Reality', icon: 'warning' },
    { id: 'weather', title: 'Weather & Lightning', icon: 'lightning' },
    { id: 'altitude', title: 'Altitude Sickness', icon: 'heart' },
    { id: 'turnaround', title: 'When to Turn Back', icon: 'shield' },
    { id: 'emergency', title: 'Emergency Prep', icon: 'map' },
    { id: 'lnt', title: 'Leave No Trace', icon: 'heart' }
  ];
</script>

<svelte:head>
  <title>Mountain Safety | Learn | Summit58</title>
  <meta
    name="description"
    content="Essential safety knowledge for climbing Colorado 14ers. Weather, altitude sickness, and knowing when to turn back."
  />
</svelte:head>

<LearnHero
  title="Mountain Safety"
  subtitle="The knowledge that keeps you coming back"
/>

<Container size="wide" class="py-12 sm:py-16">
  <!-- Breadcrumb -->
  <nav class="mb-8 animate-fade-in-up">
    <ol class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <li><a href="/learn" class="hover:text-sunrise transition-colors">Learn</a></li>
      <li class="text-slate-400">/</li>
      <li class="text-slate-900 dark:text-white font-medium">Safety</li>
    </ol>
  </nav>

  <div class="flex gap-12">
    <!-- Main Content -->
    <div class="flex-1 max-w-3xl">
      <ContentSection id="reality" title="The Reality" icon="warning">
        <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          People die on Colorado's 14ers every year. Not just reckless thrill-seekers—experienced hikers, athletes, people who "knew what they were doing." The mountains don't care about your fitness level, your summit count, or your timeline.
        </p>
        <p class="mt-4 text-slate-600 dark:text-slate-400">
          This isn't meant to scare you away. It's meant to make you take preparation seriously. Understanding the risks is the first step to managing them.
        </p>
      </ContentSection>

      <ContentSection id="weather" title="Weather & Lightning" icon="lightning" delay={100}>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          Summer in Colorado follows a predictable pattern: clear mornings, building clouds by late morning, afternoon thunderstorms. Lightning is the single biggest weather threat on 14ers.
        </p>

        <CalloutBox type="danger" title="The Noon Rule">
          Plan to be off the summit by noon. This isn't arbitrary—it's when storms typically develop. If you're still climbing when clouds are building, you've already made a mistake.
        </CalloutBox>

        <h3 class="font-semibold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
          </span>
          Reading the Sky
        </h3>
        <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li><strong>Cumulus clouds (puffy white):</strong> Normal fair weather. Watch if they start growing vertically.</li>
          <li><strong>Towering cumulus:</strong> Storms are building. Time to descend.</li>
          <li><strong>Cumulonimbus (anvil-shaped):</strong> Active thunderstorm. Get off exposed terrain immediately.</li>
          <li><strong>Dark bases, distant rumbles:</strong> Lightning is already happening. Move now.</li>
        </ul>

        <h3 class="font-semibold text-slate-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
            </svg>
          </span>
          If You're Caught in a Storm
        </h3>
        <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li>Get off ridges, summits, and exposed terrain immediately</li>
          <li>Avoid tall isolated objects (trees, poles, rock towers)</li>
          <li>Spread out from your group (at least 50 feet apart)</li>
          <li>Crouch on the balls of your feet with your head down—minimize ground contact</li>
          <li>Don't lie flat—it increases your surface area for ground current</li>
        </ul>
      </ContentSection>

      <ContentSection id="altitude" title="Altitude Sickness" icon="heart" delay={200}>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          Above 8,000 feet, your body starts struggling with less oxygen. By 14,000 feet, the air has about 60% of the oxygen available at sea level. Your body needs time to adjust.
        </p>

        <CalloutBox type="warning" title="Anyone Can Get Altitude Sick">
          Fitness doesn't protect you. Olympic athletes get altitude sickness. The only reliable factors are genetics and acclimatization time.
        </CalloutBox>

        <div class="mt-8 grid gap-6 sm:grid-cols-2">
          <div class="p-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <h4 class="font-semibold text-amber-900 dark:text-amber-200 mb-3">Acute Mountain Sickness (AMS)</h4>
            <p class="text-sm text-amber-800 dark:text-amber-300 mb-2">Common and usually manageable:</p>
            <ul class="text-sm text-amber-700 dark:text-amber-300/80 space-y-1">
              <li>• Headache (the classic sign)</li>
              <li>• Nausea, loss of appetite</li>
              <li>• Fatigue beyond normal tiredness</li>
              <li>• Dizziness, difficulty sleeping</li>
            </ul>
            <p class="text-sm text-amber-800 dark:text-amber-300 mt-3 font-medium">
              Response: Stop ascending. Descend if symptoms worsen.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <h4 class="font-semibold text-red-900 dark:text-red-200 mb-3">HAPE & HACE</h4>
            <p class="text-sm text-red-800 dark:text-red-300 mb-2">Life-threatening. Require immediate descent:</p>
            <ul class="text-sm text-red-700 dark:text-red-300/80 space-y-1">
              <li>• Breathlessness at rest</li>
              <li>• Persistent cough (possibly pink/frothy)</li>
              <li>• Severe headache, confusion</li>
              <li>• Loss of coordination</li>
            </ul>
            <p class="text-sm text-red-800 dark:text-red-300 mt-3 font-medium">
              Response: Descend immediately. These kill within hours.
            </p>
          </div>
        </div>

        <h3 class="font-semibold text-slate-900 dark:text-white mt-8 mb-4">Prevention</h3>
        <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li><strong>Acclimatize:</strong> Spend a night or two at 8,000-10,000 feet before your climb</li>
          <li><strong>Ascend gradually:</strong> Don't go from sea level to a 14er in one day</li>
          <li><strong>Hydrate aggressively:</strong> Drink 3-4 liters per day at altitude</li>
          <li><strong>Avoid alcohol and sleeping pills:</strong> They suppress your breathing response</li>
          <li><strong>Listen to your body:</strong> Symptoms are messages. Pay attention.</li>
        </ul>
      </ContentSection>

      <ContentSection id="turnaround" title="Know When to Turn Back" icon="shield" delay={300}>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          The summit will be there next time. You might not be if you push through when you shouldn't.
        </p>

        <CalloutBox type="tip" title="A Turnaround Is Not a Failure">
          Some of the most experienced mountaineers have turned back more times than they've summited. It takes more judgment to turn around than to push blindly forward.
        </CalloutBox>

        <h3 class="font-semibold text-slate-900 dark:text-white mt-8 mb-4">Turn Back When:</h3>
        <div class="grid gap-3 sm:grid-cols-2">
          {#each [
            { icon: '⛈️', text: 'Weather is deteriorating' },
            { icon: '⏰', text: "You're behind turnaround time" },
            { icon: '🤒', text: 'Altitude sickness not improving' },
            { icon: '😰', text: 'Terrain feels beyond comfort' },
            { icon: '🔮', text: 'Your gut says something is wrong' },
            { icon: '😴', text: "Too tired to descend safely" }
          ] as item}
            <div class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span class="text-xl">{item.icon}</span>
              <span class="text-sm text-slate-700 dark:text-slate-300">{item.text}</span>
            </div>
          {/each}
        </div>

        <h3 class="font-semibold text-slate-900 dark:text-white mt-8 mb-4">Set a Turnaround Time Before You Start</h3>
        <p class="text-slate-600 dark:text-slate-400">
          Pick a time—say, 11 AM or noon—and commit to it. When that time hits, you turn around no matter how close the summit looks. "Just 20 more minutes" is how people get caught in storms.
        </p>
      </ContentSection>

      <ContentSection id="emergency" title="Emergency Preparedness" icon="map" delay={400}>
        <div class="grid gap-6 sm:grid-cols-2 mb-6">
          <div class="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 class="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <svg class="h-5 w-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Tell Someone Your Plan
            </h4>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Before every hike: where you're starting, your route, expected return, and when to call for help.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 class="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <svg class="h-5 w-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              Cell Service Reality
            </h4>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Don't count on it. Many trailheads and most backcountry have no coverage. A phone is not a rescue plan.
            </p>
          </div>
        </div>

        <CalloutBox type="info" title="Consider a Satellite Communicator">
          Devices like the Garmin inReach or Zoleo let you send SOS signals and text messages via satellite from anywhere. They're not cheap, but they work when phones don't.
        </CalloutBox>

        <h3 class="font-semibold text-slate-900 dark:text-white mt-8 mb-4">If Something Goes Wrong</h3>
        <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li>Stay calm. Panic makes everything worse.</li>
          <li>Assess the situation: Is anyone hurt? What are your resources?</li>
          <li>If you can move, get to a safer location (off ridges, out of weather)</li>
          <li>If you can't move, make yourself visible and conserve energy</li>
          <li>Use your emergency whistle (3 blasts = distress)</li>
          <li>Stay with your group. Splitting up rarely helps.</li>
        </ul>
      </ContentSection>

      <ContentSection id="lnt" title="Leave No Trace" icon="heart" delay={500}>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          These peaks get hundreds of thousands of visitors each year. The alpine environment is fragile. What you do matters.
        </p>

        <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li><strong>Pack out everything you pack in.</strong> Yes, including food scraps and toilet paper.</li>
          <li><strong>Stay on trail</strong> where trails exist. Alpine plants take decades to recover from trampling.</li>
          <li><strong>Human waste:</strong> Pack it out with WAG bags, or bury it 6-8 inches deep at least 200 feet from water. Pack out toilet paper.</li>
          <li><strong>Don't build cairns</strong> or rock sculptures. The ones that exist mark routes. Extra ones just confuse people.</li>
          <li><strong>Give wildlife space.</strong> You're in their home.</li>
        </ul>

        <CalloutBox type="tip" title="Leave It Better">
          Pick up trash when you see it—even if it's not yours. The mountains give us a lot. Give something back.
        </CalloutBox>
      </ContentSection>

      <!-- Navigation -->
      <div class="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between">
        <a
          href="/learn/first-fourteener"
          class="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sunrise transition-colors"
        >
          <svg class="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Your First 14er
        </a>
        <a
          href="/learn/gear"
          class="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sunrise transition-colors sm:flex-row-reverse"
        >
          Gear & Preparation
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
