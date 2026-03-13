<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import LearnHero from '$lib/components/learn/LearnHero.svelte';
  import ContentSection from '$lib/components/learn/ContentSection.svelte';
  import TableOfContents from '$lib/components/learn/TableOfContents.svelte';

  const tocItems = [
    { id: 'getting-started', title: 'Getting Started', icon: 'mountain' },
    { id: 'on-the-mountain', title: 'On the Mountain', icon: 'warning' },
    { id: 'gear-preparation', title: 'Gear & Preparation', icon: 'backpack' },
    { id: 'after-the-hike', title: 'After the Hike', icon: 'check' }
  ];

  interface FaqItem {
    question: string;
    answer: string;
  }

  const gettingStarted: FaqItem[] = [
    {
      question: 'What is a 14er?',
      answer: 'A "fourteener" or "14er" is a mountain peak with an elevation of at least 14,000 feet (4,267 meters). Colorado has 58 named 14ers\u2014more than any other state\u2014ranging from relatively straightforward hikes to serious technical climbs.'
    },
    {
      question: 'How many 14ers are in Colorado?',
      answer: '58 named peaks over 14,000 feet, spread across 7 mountain ranges: Sawatch, Sangre de Cristo, Elk Mountains, San Juan, Mosquito, Tenmile, and Front Range.'
    },
    {
      question: 'Which 14er should I climb first?',
      answer: 'Quandary Peak, Grays Peak, or Mt. Bierstadt are popular first choices\u2014all Class 1 with well-marked trails, moderate distance, and accessible trailheads. Each offers a rewarding summit experience without technical challenges.'
    },
    {
      question: 'When is the best time to climb?',
      answer: 'The prime season is mid-June through early September when most trails are snow-free. July and August offer the most stable conditions, but also the highest crowds. Start early\u2014aim to be off the summit by noon to avoid afternoon thunderstorms.'
    },
    {
      question: 'How fit do I need to be?',
      answer: 'You should be comfortable hiking 6\u201310 miles with 3,000\u20134,000 feet of elevation gain. If you can do that at lower altitude, you\'re ready for an easier 14er\u2014just expect it to feel harder up high. Start training at least 6\u20138 weeks before your first attempt.'
    },
    {
      question: 'Do I need a permit?',
      answer: 'Most 14ers don\'t require permits, but some trailheads (like Mt. Sneffels, Maroon Bells) require reservations during peak season. Check the specific peak page on Cairn58 or the managing agency\'s website before your trip.'
    }
  ];

  const onTheMountain: FaqItem[] = [
    {
      question: 'What does "Class 1\u20134" mean?',
      answer: 'The Yosemite Decimal System rates terrain difficulty. Class 1: Trail hiking. Class 2: Off-trail, hands for balance. Class 3: Scrambling, exposure. Class 4: Climbing, ropes recommended. Start with Class 1 or easy Class 2 routes for your first 14er.'
    },
    {
      question: 'What time should I start hiking?',
      answer: 'Most hikers start between 4\u20136 AM to summit before afternoon storms. Earlier is better in summer. A pre-dawn start also means cooler temperatures for the climb and the best chance of clear skies on the summit.'
    },
    {
      question: 'What if I can\'t make the summit?',
      answer: 'Turning around is always the right call. Weather, altitude sickness, or simply running out of energy are all valid reasons. The mountain will be there next time. Experienced mountaineers turn back more often than you\'d think.'
    },
    {
      question: 'How do I deal with altitude sickness?',
      answer: 'Hydrate well, ascend gradually, and don\'t push through severe symptoms (headache, nausea, dizziness). Descend immediately if symptoms worsen. Spending a night at 8,000\u201310,000 feet before your climb helps with acclimatization.'
    },
    {
      question: 'Is it safe to hike alone?',
      answer: 'Solo hiking is common but riskier. Tell someone your plan, carry a satellite communicator, and stick to well-traveled routes. If you\'re new to 14ers, consider joining a group or finding a hiking partner.'
    }
  ];

  const gearPreparation: FaqItem[] = [
    {
      question: 'What should I bring?',
      answer: 'The 10 essentials: navigation (map/compass/GPS), sun protection, insulation (extra layers), illumination (headlamp), first aid kit, fire starter, repair tools, nutrition (extra food), hydration (extra water), and emergency shelter. These aren\'t optional\u2014they\'re the baseline.'
    },
    {
      question: 'Do I need special shoes?',
      answer: 'Sturdy hiking boots with ankle support are recommended. Trail runners work for Class 1 routes but offer less protection on rocky terrain. Whatever you choose, make sure they\'re broken in before your first 14er.'
    },
    {
      question: 'Do I need trekking poles?',
      answer: 'Highly recommended, especially for knee-saving descents and balance on loose scree. Collapsible poles are easy to stow when you need your hands free for scrambling. Most experienced 14er hikers consider them essential.'
    }
  ];

  const afterTheHike: FaqItem[] = [
    {
      question: 'How do I track my summits?',
      answer: 'Create a free Cairn58 account to log summits, write reviews, and track your progress toward all 58. You can also upload photos, share your achievements, and see how you compare on the leaderboard.'
    },
    {
      question: 'What\'s the "58 Club"?',
      answer: 'Summiting all 58 Colorado 14ers is a bucket-list achievement. Many hikers spend years (or decades!) completing the list. Cairn58 tracks your progress and awards achievements along the way.'
    },
    {
      question: 'How do I leave a trail report?',
      answer: 'Visit any peak page on Cairn58 and submit a trail report with current conditions to help fellow hikers. Include details like snow coverage, trail status, and any hazards you encountered.'
    }
  ];

  const allQuestions = [
    ...gettingStarted,
    ...onTheMountain,
    ...gearPreparation,
    ...afterTheHike
  ];
</script>

<svelte:head>
  <title>FAQ | Learn | Cairn58</title>
  <meta
    name="description"
    content="Frequently asked questions about climbing Colorado's 58 fourteeners. Getting started, safety, gear, and tracking your progress."
  />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cairn58.com/" },
      { "@type": "ListItem", "position": 2, "name": "Learn", "item": "https://cairn58.com/learn" },
      { "@type": "ListItem", "position": 3, "name": "FAQ", "item": "https://cairn58.com/learn/faq" }
    ]
  })}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allQuestions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  })}</script>`}
</svelte:head>

<LearnHero
  title="Frequently Asked Questions"
  subtitle="Answers to common questions about Colorado 14ers"
/>

<Container size="wide" class="py-12 sm:py-16">
  <!-- Breadcrumb -->
  <nav class="mb-8 animate-fade-in-up">
    <ol class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <li><a href="/learn" class="hover:text-sunrise transition-colors">Learn</a></li>
      <li class="text-slate-400">/</li>
      <li class="text-slate-900 dark:text-white font-medium">FAQ</li>
    </ol>
  </nav>

  <div class="flex gap-12">
    <!-- Main Content -->
    <div class="flex-1 max-w-3xl">
      <ContentSection id="getting-started" title="Getting Started" icon="mountain">
        <div class="space-y-3">
          {#each gettingStarted as item}
            <details class="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-card transition-shadow">
              <summary class="flex items-center justify-between p-5 cursor-pointer list-none">
                <span class="font-semibold text-slate-900 dark:text-white">{item.question}</span>
                <div class="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-open:bg-sunrise/10 transition-colors">
                  <svg class="h-5 w-5 text-slate-400 group-open:text-sunrise transition-all group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div class="px-5 pb-5 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
                <p>{item.answer}</p>
              </div>
            </details>
          {/each}
        </div>
      </ContentSection>

      <ContentSection id="on-the-mountain" title="On the Mountain" icon="warning" delay={100}>
        <div class="space-y-3">
          {#each onTheMountain as item}
            <details class="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-card transition-shadow">
              <summary class="flex items-center justify-between p-5 cursor-pointer list-none">
                <span class="font-semibold text-slate-900 dark:text-white">{item.question}</span>
                <div class="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-open:bg-sunrise/10 transition-colors">
                  <svg class="h-5 w-5 text-slate-400 group-open:text-sunrise transition-all group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div class="px-5 pb-5 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
                <p>{item.answer}</p>
              </div>
            </details>
          {/each}
        </div>
      </ContentSection>

      <ContentSection id="gear-preparation" title="Gear & Preparation" icon="backpack" delay={200}>
        <div class="space-y-3">
          {#each gearPreparation as item}
            <details class="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-card transition-shadow">
              <summary class="flex items-center justify-between p-5 cursor-pointer list-none">
                <span class="font-semibold text-slate-900 dark:text-white">{item.question}</span>
                <div class="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-open:bg-sunrise/10 transition-colors">
                  <svg class="h-5 w-5 text-slate-400 group-open:text-sunrise transition-all group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div class="px-5 pb-5 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
                <p>{item.answer}</p>
              </div>
            </details>
          {/each}
        </div>
      </ContentSection>

      <ContentSection id="after-the-hike" title="After the Hike" icon="check" delay={300}>
        <div class="space-y-3">
          {#each afterTheHike as item}
            <details class="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-card transition-shadow">
              <summary class="flex items-center justify-between p-5 cursor-pointer list-none">
                <span class="font-semibold text-slate-900 dark:text-white">{item.question}</span>
                <div class="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-open:bg-sunrise/10 transition-colors">
                  <svg class="h-5 w-5 text-slate-400 group-open:text-sunrise transition-all group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div class="px-5 pb-5 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
                <p>{item.answer}</p>
              </div>
            </details>
          {/each}
        </div>
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
