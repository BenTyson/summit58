<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import LearnHero from '$lib/components/learn/LearnHero.svelte';
  import ContentSection from '$lib/components/learn/ContentSection.svelte';
  import CalloutBox from '$lib/components/learn/CalloutBox.svelte';
  import GearChecklist from '$lib/components/learn/GearChecklist.svelte';
  import TableOfContents from '$lib/components/learn/TableOfContents.svelte';

  const tocItems = [
    { id: 'layering', title: 'The Layering System', icon: 'backpack' },
    { id: 'essentials', title: 'The 10 Essentials', icon: 'shield' },
    { id: 'summer', title: 'Summer Checklist', icon: 'check' },
    { id: 'shoulder', title: 'Shoulder Season', icon: 'sun' },
    { id: 'fitness', title: 'Physical Preparation', icon: 'heart' },
    { id: 'avoid', title: 'What NOT to Bring', icon: 'warning' }
  ];
</script>

<svelte:head>
  <title>Gear & Preparation | Learn | Cairn58</title>
  <meta
    name="description"
    content="What to wear, what to pack, and how to prepare for climbing Colorado 14ers. Layering systems, gear lists, and preparation tips."
  />
</svelte:head>

<LearnHero
  title="Gear & Preparation"
  subtitle="What to wear, what to pack, and how to get ready"
/>

<Container size="wide" class="py-12 sm:py-16">
  <!-- Breadcrumb -->
  <nav class="mb-8 animate-fade-in-up">
    <ol class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <li><a href="/learn" class="hover:text-sunrise transition-colors">Learn</a></li>
      <li class="text-slate-400">/</li>
      <li class="text-slate-900 dark:text-white font-medium">Gear</li>
    </ol>
  </nav>

  <div class="flex gap-12">
    <!-- Main Content -->
    <div class="flex-1 max-w-3xl">
    <ContentSection id="layering" title="The Layering System" icon="backpack">
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        Mountain weather changes fast. You'll start in the dark at 40°F, work up a sweat on the climb, hit the windy summit at 30°F, and hike out in afternoon sun. The layering system lets you adapt without carrying a closet.
      </p>

      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
          <div class="flex items-center gap-2 mb-3">
            <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20">
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
            </span>
            <h4 class="font-semibold text-blue-900 dark:text-blue-200">Base Layer</h4>
          </div>
          <p class="text-sm text-blue-800 dark:text-blue-300 mb-2">Against your skin. Wicks sweat away.</p>
          <ul class="text-xs text-blue-700 dark:text-blue-300/80 space-y-1">
            <li>• Synthetic dries fastest</li>
            <li>• Merino regulates temperature</li>
            <li>• Never cotton</li>
          </ul>
        </div>

        <div class="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
          <div class="flex items-center gap-2 mb-3">
            <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20">
              <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
              </svg>
            </span>
            <h4 class="font-semibold text-amber-900 dark:text-amber-200">Mid Layer</h4>
          </div>
          <p class="text-sm text-amber-800 dark:text-amber-300 mb-2">Insulation. Traps body heat.</p>
          <ul class="text-xs text-amber-700 dark:text-amber-300/80 space-y-1">
            <li>• Fleece breathes well</li>
            <li>• Puffy packs smaller</li>
            <li>• For breaks & summits</li>
          </ul>
        </div>

        <div class="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800/50 dark:to-gray-800/50 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-2 mb-3">
            <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-500/20">
              <svg class="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
              </svg>
            </span>
            <h4 class="font-semibold text-slate-900 dark:text-slate-200">Outer Shell</h4>
          </div>
          <p class="text-sm text-slate-700 dark:text-slate-300 mb-2">Wind and rain protection.</p>
          <ul class="text-xs text-slate-600 dark:text-slate-300/80 space-y-1">
            <li>• Wind shell for summer</li>
            <li>• Rain shell for storms</li>
            <li>• Always carry one</li>
          </ul>
        </div>
      </div>

      <CalloutBox type="danger" title="Cotton Kills">
        Cotton absorbs water and loses all insulating ability when wet. A cotton shirt in a cold rain can lead to hypothermia. Leave the cotton at home.
      </CalloutBox>
    </ContentSection>

    <ContentSection id="essentials" title="The 10 Essentials" icon="shield" delay={100}>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        This list has been refined over decades of mountain accidents. It's not about what makes the hike comfortable—it's about what keeps you alive when things go wrong.
      </p>

      <ol class="list-decimal list-inside space-y-3 text-slate-600 dark:text-slate-400">
        <li>
          <strong class="text-slate-900 dark:text-white">Navigation</strong>
          <span class="block ml-6 text-sm">Map, compass, GPS device or phone with offline maps. Know how to use them.</span>
        </li>
        <li>
          <strong class="text-slate-900 dark:text-white">Headlamp</strong>
          <span class="block ml-6 text-sm">With extra batteries. You'll start before dawn or finish after dark. Probably both.</span>
        </li>
        <li>
          <strong class="text-slate-900 dark:text-white">Sun Protection</strong>
          <span class="block ml-6 text-sm">Sunscreen (SPF 30+), sunglasses, hat. UV is intense at altitude.</span>
        </li>
        <li>
          <strong class="text-slate-900 dark:text-white">First Aid Kit</strong>
          <span class="block ml-6 text-sm">Blister treatment, pain relievers, bandages, any personal medications.</span>
        </li>
        <li>
          <strong class="text-slate-900 dark:text-white">Knife or Multi-tool</strong>
          <span class="block ml-6 text-sm">For gear repair, first aid, and a hundred other uses.</span>
        </li>
        <li>
          <strong class="text-slate-900 dark:text-white">Fire</strong>
          <span class="block ml-6 text-sm">Waterproof matches, lighter, or fire starter. Emergency warmth if stranded.</span>
        </li>
        <li>
          <strong class="text-slate-900 dark:text-white">Emergency Shelter</strong>
          <span class="block ml-6 text-sm">Space blanket or lightweight bivy. Weighs ounces, could save your life.</span>
        </li>
        <li>
          <strong class="text-slate-900 dark:text-white">Extra Food</strong>
          <span class="block ml-6 text-sm">More than you think you need. High-calorie, no-cook options.</span>
        </li>
        <li>
          <strong class="text-slate-900 dark:text-white">Extra Water</strong>
          <span class="block ml-6 text-sm">3+ liters for a day hike. Plus a way to purify more if needed.</span>
        </li>
        <li>
          <strong class="text-slate-900 dark:text-white">Extra Clothes</strong>
          <span class="block ml-6 text-sm">Insulation layer, rain shell, warm hat, gloves. Even in summer.</span>
        </li>
      </ol>
    </ContentSection>

    <ContentSection id="summer" title="Summer Day Hike Checklist" icon="check" delay={200}>
      <p class="text-slate-600 dark:text-slate-400 mb-6">
        Everything you need for a typical summer 14er attempt. Check items off as you pack.
      </p>

      <GearChecklist variant="summer" />
    </ContentSection>

    <ContentSection id="shoulder" title="Shoulder Season Additions" icon="sun" delay={300}>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        Early season (May-June) and late season (September-October) require additional gear. Snow lingers, temperatures drop faster, and conditions are less predictable.
      </p>

      <GearChecklist variant="shoulder" />

      <CalloutBox type="warning" title="Know Before You Go">
        Check recent trip reports for current conditions. A route that's a walk-up in August might require crampons and ice axe in June.
      </CalloutBox>
    </ContentSection>

    <ContentSection id="fitness" title="Physical Preparation" icon="heart" delay={400}>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        A 14er is a serious physical effort. Even "easy" routes typically involve 6-10 miles and 3,000-4,000 feet of elevation gain—at altitude where every step is harder than it would be at sea level.
      </p>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3">Start Training Early</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        Give yourself 6-8 weeks minimum. Ideally longer. Your training should include:
      </p>
      <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
        <li><strong>Cardiovascular endurance:</strong> Hiking, running, cycling, stair climbing</li>
        <li><strong>Leg strength:</strong> Squats, lunges, step-ups</li>
        <li><strong>Elevation gain:</strong> Practice hiking uphill with a loaded pack</li>
        <li><strong>Time on feet:</strong> Build up to 4-6 hour hikes before your attempt</li>
      </ul>

      <h3 class="font-semibold text-slate-900 dark:text-white mt-6 mb-3">Altitude Acclimatization</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        If you're coming from low elevation, your body needs time to adjust. Consider:
      </p>
      <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
        <li>Arrive in Colorado 1-2 days before your climb</li>
        <li>Sleep at 8,000-10,000 feet the night before</li>
        <li>Do a shorter high-altitude hike first to test how you feel</li>
        <li>Stay hydrated and avoid alcohol</li>
      </ul>

      <CalloutBox type="tip" title="Test Yourself First">
        Before attempting a 14er, do a hike with similar stats at lower elevation. If you struggle with 3,500 feet of gain and 8 miles at 10,000 feet, you're not ready for a 14er.
      </CalloutBox>
    </ContentSection>

    <ContentSection id="avoid" title="What NOT to Bring" icon="warning" delay={500}>
      <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
        <li><strong>Cotton clothing:</strong> Gets wet, stays wet, makes you cold.</li>
        <li><strong>Jeans:</strong> Heavy, restrictive, cotton-based. Terrible for hiking.</li>
        <li><strong>Heavy boots:</strong> Unless you need ankle support or crampons, trail runners are lighter and faster.</li>
        <li><strong>Too much stuff:</strong> Every ounce matters at altitude. Pack what you need, nothing more.</li>
        <li><strong>Bluetooth speakers:</strong> No one wants to hear your music. Use earbuds or enjoy the silence.</li>
        <li><strong>Overconfidence:</strong> The mountain doesn't care about your ego.</li>
      </ul>
    </ContentSection>

    <!-- Navigation -->
    <div class="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between">
      <a
        href="/learn/safety"
        class="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sunrise transition-colors"
      >
        <svg class="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Mountain Safety
      </a>
      <a
        href="/learn"
        class="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sunrise transition-colors sm:flex-row-reverse"
      >
        Back to Learn
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
