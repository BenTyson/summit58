<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import LearnHero from '$lib/components/learn/LearnHero.svelte';
  import ContentSection from '$lib/components/learn/ContentSection.svelte';
  import CalloutBox from '$lib/components/learn/CalloutBox.svelte';
  import PeakRecommender from '$lib/components/learn/PeakRecommender.svelte';
  import TableOfContents from '$lib/components/learn/TableOfContents.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const tocItems = [
    { id: 'what', title: 'What Is a 14er?', icon: 'mountain' },
    { id: 'when', title: 'When to Go', icon: 'sun' },
    { id: 'expect', title: 'What to Expect', icon: 'map' },
    { id: 'choosing', title: 'Choosing Your Peak', icon: 'check' },
    { id: 'recommender', title: 'Find Your Peak', icon: 'mountain' },
    { id: 'before', title: 'Before You Go', icon: 'backpack' }
  ];
</script>

<svelte:head>
  <title>Your First 14er | Learn | Summit58</title>
  <meta
    name="description"
    content="A complete guide to climbing your first Colorado 14er. What to expect, when to go, and an interactive quiz to find the perfect peak for you."
  />
</svelte:head>

<LearnHero
  title="Your First 14er"
  subtitle="Everything you need to know before your first summit"
/>

<Container size="wide" class="py-12 sm:py-16">
  <!-- Breadcrumb -->
  <nav class="mb-8 animate-fade-in-up">
    <ol class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <li><a href="/learn" class="hover:text-sunrise transition-colors">Learn</a></li>
      <li class="text-slate-400">/</li>
      <li class="text-slate-900 dark:text-white font-medium">Your First 14er</li>
    </ol>
  </nav>

  <div class="flex gap-12">
    <!-- Main Content -->
    <div class="flex-1 max-w-3xl">
    <ContentSection id="what" title="What Is a 14er?" icon="mountain">
      <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
        A "fourteener" is any mountain peak with an elevation of at least 14,000 feet. Colorado has 58 of them—more than any other state in the lower 48. They range from straightforward trail hikes to serious technical climbs requiring ropes and specialized gear.
      </p>
      <p class="mt-4 text-slate-600 dark:text-slate-400">
        Climbing a 14er isn't like a typical day hike. The altitude changes everything. Air pressure is about 60% of what it is at sea level, which means less oxygen with every breath. Even fit people struggle. That's part of what makes reaching the summit so rewarding.
      </p>
    </ContentSection>

    <ContentSection id="when" title="When to Go" icon="sun" delay={100}>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        The prime climbing season runs from <strong>mid-June through early September</strong>. This is when most trails are snow-free and conditions are most stable—though "stable" is relative in the mountains.
      </p>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3 flex items-center gap-2">
        <span class="w-6 h-6 rounded-full bg-sunrise/10 flex items-center justify-center">
          <svg class="w-3.5 h-3.5 text-sunrise" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
          </svg>
        </span>
        The Daily Pattern
      </h3>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        Colorado summer days follow a predictable rhythm:
      </p>
      <div class="grid gap-2">
        <div class="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <span class="flex-shrink-0 w-16 text-xs font-bold text-indigo-600 dark:text-indigo-400">4-6 AM</span>
          <span class="text-sm text-indigo-900 dark:text-indigo-200"><strong>Pre-dawn:</strong> Clear, cold, calm. Best time to start.</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <span class="flex-shrink-0 w-16 text-xs font-bold text-amber-600 dark:text-amber-400">6-10 AM</span>
          <span class="text-sm text-amber-900 dark:text-amber-200"><strong>Morning:</strong> Sun warms the valleys. Thermals begin rising.</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <span class="flex-shrink-0 w-16 text-xs font-bold text-orange-600 dark:text-orange-400">10-12 PM</span>
          <span class="text-sm text-orange-900 dark:text-orange-200"><strong>Late morning:</strong> Clouds start building over peaks.</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <span class="flex-shrink-0 w-16 text-xs font-bold text-red-600 dark:text-red-400">12-4 PM</span>
          <span class="text-sm text-red-900 dark:text-red-200"><strong>Early afternoon:</strong> Thunderstorms develop. Lightning is deadly.</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <span class="flex-shrink-0 w-16 text-xs font-bold text-slate-500 dark:text-slate-400">Evening</span>
          <span class="text-sm text-slate-700 dark:text-slate-300"><strong>Post-storm:</strong> Storms pass. Too late to start a hike.</span>
        </div>
      </div>

      <CalloutBox type="warning" title="Start Early, Finish Early">
        Plan to be off the summit by noon. This isn't a suggestion—it's how you avoid getting caught in lightning. Most summit attempts start between 4-6 AM.
      </CalloutBox>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3">Shoulder Seasons</h3>
      <p class="text-slate-600 dark:text-slate-400">
        May-June and September-October can offer great conditions but require more experience. Snow lingers on many routes into July. Fall brings shorter days and unpredictable early-season storms. These months are best saved for after you've got a few summer summits under your belt.
      </p>
    </ContentSection>

    <ContentSection id="expect" title="What to Expect" icon="map" delay={200}>
      <h3 class="font-semibold text-slate-900 dark:text-white mb-3">The Physical Challenge</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        A typical 14er involves 6-12 miles of hiking and 3,000-4,500 feet of elevation gain. That would be a solid workout at sea level. At 14,000 feet, it's significantly harder.
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        Expect to move slower than you think. What takes you an hour at home might take 90 minutes or more at altitude. Your heart rate will be higher. You'll need more breaks. This is normal.
      </p>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3">The Terrain</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        Colorado 14ers are rated using the Yosemite Decimal System:
      </p>
      <div class="space-y-3">
        <div class="flex gap-3 p-3 rounded-lg bg-class-1/10 border border-class-1/30">
          <span class="flex-shrink-0 w-20 font-semibold text-class-1">Class 1</span>
          <span class="text-slate-600 dark:text-slate-400">Trail hiking. Following a path. No hands needed.</span>
        </div>
        <div class="flex gap-3 p-3 rounded-lg bg-class-2/10 border border-class-2/30">
          <span class="flex-shrink-0 w-20 font-semibold text-class-2">Class 2</span>
          <span class="text-slate-600 dark:text-slate-400">Off-trail hiking. May use hands for balance occasionally. Rocky terrain.</span>
        </div>
        <div class="flex gap-3 p-3 rounded-lg bg-class-3/10 border border-class-3/30">
          <span class="flex-shrink-0 w-20 font-semibold text-class-3">Class 3</span>
          <span class="text-slate-600 dark:text-slate-400">Scrambling. Hands required frequently. Exposure possible. Falls could cause injury.</span>
        </div>
        <div class="flex gap-3 p-3 rounded-lg bg-class-4/10 border border-class-4/30">
          <span class="flex-shrink-0 w-20 font-semibold text-class-4">Class 4</span>
          <span class="text-slate-600 dark:text-slate-400">Climbing. Steep, exposed terrain. Falls would likely be fatal. Ropes recommended.</span>
        </div>
      </div>

      <CalloutBox type="tip" title="Start with Class 1 or Easy Class 2">
        For your first 14er, stick to Class 1 routes. Master the altitude and endurance challenge before adding technical terrain.
      </CalloutBox>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3">Time Commitment</h3>
      <p class="text-slate-600 dark:text-slate-400">
        A typical first 14er takes 6-10 hours round trip. Add drive time to the trailhead (often 2-4 hours from Denver), and you're looking at a very long day. Many climbers camp near the trailhead the night before to get an early start and reduce fatigue.
      </p>
    </ContentSection>

    <ContentSection id="choosing" title="Choosing Your First Peak" icon="check" delay={300}>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        Not all 14ers are created equal. Some are walk-ups on good trails. Others require technical climbing skills. For your first summit, look for:
      </p>
      <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
        <li><strong>Class 1 or easy Class 2 terrain:</strong> Clear trail, minimal scrambling</li>
        <li><strong>Shorter distance:</strong> 6-8 miles round trip is plenty for a first attempt</li>
        <li><strong>Moderate elevation gain:</strong> Under 3,500 feet is reasonable</li>
        <li><strong>Good trail access:</strong> No 4WD required to reach the trailhead</li>
        <li><strong>Popularity:</strong> More people means more trip reports and a clearer path</li>
      </ul>

      <CalloutBox type="info" title="Popular First Peaks">
        Common recommendations include Quandary Peak, Mt. Bierstadt, Grays & Torreys, Mt. Elbert, and Mt. Sherman. Each has well-maintained trails and straightforward routes.
      </CalloutBox>
    </ContentSection>

    <!-- Peak Recommender -->
    <section id="recommender" class="mt-12 animate-fade-in-up scroll-mt-24" style="animation-delay: 400ms">
      <h2 class="heading-section text-slate-900 dark:text-white flex items-center gap-3 mb-6">
        <svg class="h-7 w-7 text-sunrise flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
        </svg>
        Find Your Peak
      </h2>
      <p class="text-slate-600 dark:text-slate-400 mb-6">
        Not sure where to start? Take our quick quiz to get personalized recommendations based on your experience, fitness, and preferences.
      </p>

      <PeakRecommender peaks={data.peaks} />
    </section>

    <ContentSection id="before" title="Before You Go" icon="backpack" delay={500}>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        Once you've picked a peak:
      </p>
      <ol class="list-decimal list-inside space-y-3 text-slate-600 dark:text-slate-400">
        <li>
          <strong>Read recent trip reports</strong> — Conditions change. Check what other hikers encountered in the past week or two.
        </li>
        <li>
          <strong>Study the route</strong> — Look at maps, photos, and descriptions until you know what to expect.
        </li>
        <li>
          <strong>Check the weather</strong> — Not just for your summit day, but for the days before. Recent storms affect trail conditions.
        </li>
        <li>
          <strong>Tell someone your plan</strong> — Route, start time, expected return, when to call for help.
        </li>
        <li>
          <strong>Pack right</strong> — See our <a href="/learn/gear" class="text-sunrise hover:underline">gear guide</a> for what to bring.
        </li>
        <li>
          <strong>Get sleep</strong> — You're waking up at 3-4 AM. Don't start exhausted.
        </li>
      </ol>

      <CalloutBox type="warning" title="It's OK to Turn Back">
        Weather changes. Bodies don't cooperate. The summit isn't going anywhere. Making the call to turn around is a sign of good judgment, not failure. Read our <a href="/learn/safety" class="text-sunrise hover:underline">safety guide</a> for more.
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
        href="/learn/safety"
        class="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sunrise transition-colors sm:flex-row-reverse"
      >
        Mountain Safety
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
