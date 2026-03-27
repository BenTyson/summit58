<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import PeakCard from '$lib/components/peak/PeakCard.svelte';
  import ActivityFeed from '$lib/components/profile/ActivityFeed.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const stats = [
    { value: '58', label: 'Fourteeners', icon: 'peaks', desc: 'Named summits over 14,000 ft' },
    { value: "14,439'", label: 'Mt. Elbert', icon: 'crown', desc: 'Colorado\'s highest point' },
    { value: '7', label: 'Ranges', icon: 'ranges', desc: 'From Front Range to San Juans' },
    { value: '66', label: 'Routes', icon: 'routes', desc: 'Standard and alternate paths' }
  ];
</script>

<svelte:head>
  <title>SaltGoat - The Modern Guide to Colorado's 14ers</title>
  <meta
    name="description"
    content="Beautiful, mobile-first guide to all 58 Colorado fourteeners. Stats at a glance, conditions reports, and everything you need to summit."
  />
  <link rel="canonical" href="https://saltgoat.co" />
  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SaltGoat",
      "url": "https://saltgoat.co",
      "description": "The modern guide to Colorado's 58 fourteeners",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://saltgoat.co/peaks?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  </script>`}
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-[85vh] flex items-center overflow-hidden">
  <!-- Background -->
  <div class="absolute inset-0 bg-mountain-navy dark:bg-slate-900">
    <img
      src="/images/SaltGoat_Mast3.jpg"
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
    />
    <!-- Overlay: lighter on left (goat), darker on right (text) -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(to right, rgba(8,12,24,0.15) 0%, rgba(8,12,24,0.3) 30%, rgba(8,12,24,0.7) 55%, rgba(8,12,24,0.85) 100%);"
    ></div>
    <div
      class="absolute inset-0"
      style="background: linear-gradient(to bottom, transparent 0%, rgba(8,12,24,0.3) 100%);"
    ></div>
  </div>

  <!-- Content: right-aligned on desktop, centered on mobile -->
  <Container class="relative z-10 py-24">
    <div class="grid lg:grid-cols-2 items-center min-h-[55vh]">
      <!-- Left: empty space for goat illustration to show -->
      <div class="hidden lg:block"></div>

      <!-- Right: text content -->
      <div class="text-center lg:text-left animate-fade-in-up">
        <h1 class="heading-hero text-white" style="text-shadow: 0 2px 16px rgba(0,0,0,0.6);">
          SaltGoat
        </h1>
        <p class="mt-6 max-w-lg text-xl text-white/90 sm:text-2xl font-light mx-auto lg:mx-0" style="text-shadow: 0 1px 8px rgba(0,0,0,0.4);">
          Your companion for conquering Colorado's fourteeners
        </p>
        <p class="mt-4 max-w-md text-white/60 leading-relaxed mx-auto lg:mx-0" style="text-shadow: 0 1px 6px rgba(0,0,0,0.4);">
          Track summits. Check conditions. Plan routes. Join the community on the journey to all 58.
        </p>

        <!-- Social proof (hidden until meaningful) -->
        {#if data.climberCount >= 10 || data.summitCount >= 10}
          <div class="mt-6 flex items-center gap-6 text-sm text-white/70 justify-center lg:justify-start">
            {#if data.climberCount >= 10}
              <span class="flex items-center gap-1.5">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <strong class="text-white">{data.climberCount.toLocaleString()}</strong> climbers
              </span>
            {/if}
            {#if data.summitCount >= 10}
              <span class="flex items-center gap-1.5">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z"/></svg>
                <strong class="text-white">{data.summitCount.toLocaleString()}</strong> summits logged
              </span>
            {/if}
          </div>
        {/if}

        <div class="mt-10 flex flex-col gap-3 sm:flex-row justify-center lg:justify-start animate-fade-in-up" style="animation-delay: 200ms">
          <a href="/peaks" class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-white/15 backdrop-blur-sm border border-white/25 text-white font-semibold hover:bg-white/25 transition-all">
            Explore All Peaks
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a href="/map" class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-white/15 backdrop-blur-sm border border-white/25 text-white font-semibold hover:bg-white/25 transition-all">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View Map
          </a>
        </div>
      </div>
    </div>
  </Container>

  <!-- Subtle bottom edge -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
</section>

<!-- Stats Section -->
<section class="relative py-20 bg-white dark:bg-slate-900 overflow-hidden">
  <Container class="relative">
    <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {#each stats as stat, i}
        {@const colors = [
          { bg: 'from-accent/10 to-semantic-warning/10', icon: 'text-accent', border: 'border-accent/20' },
          { bg: 'from-semantic-warning/10 to-semantic-warning-light/10', icon: 'text-semantic-warning', border: 'border-semantic-warning/20' },
          { bg: 'from-mountain-blue/10 to-cyan-500/10', icon: 'text-mountain-blue', border: 'border-mountain-blue/20' },
          { bg: 'from-semantic-success/10 to-semantic-success-light/10', icon: 'text-semantic-success', border: 'border-semantic-success/20' }
        ]}
        {@const color = colors[i]}
        <div
          class="
            group relative p-5 sm:p-6 rounded-2xl
            bg-gradient-to-br {color.bg}
            border {color.border}
            transition-all duration-300
            hover:shadow-card-elevated hover:-translate-y-1
            dark:bg-slate-800/50 dark:border-slate-700
            animate-fade-in-up
          "
          style="animation-delay: {i * 75}ms"
        >
          <!-- Icon -->
          <div class="mb-3">
            {#if stat.icon === 'peaks'}
              <svg class="w-8 h-8 {color.icon}" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z"/></svg>
            {:else if stat.icon === 'crown'}
              <svg class="w-8 h-8 {color.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l3.5 7L12 6l3.5 4L19 3M5 21h14M5 21V10m14 11V10"/></svg>
            {:else if stat.icon === 'ranges'}
              <svg class="w-8 h-8 {color.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4-8 4 4 4-8 4 8"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 20h20"/></svg>
            {:else if stat.icon === 'routes'}
              <svg class="w-8 h-8 {color.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            {/if}
          </div>

          <div class="stat-display text-slate-900 dark:text-white">
            {stat.value}
          </div>
          <div class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {stat.label}
          </div>
          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-snug hidden sm:block">
            {stat.desc}
          </div>
        </div>
      {/each}
    </div>
  </Container>
</section>

<!-- Friends Activity -->
{#if data.friendsActivity && data.friendsActivity.length > 0}
  <section class="py-16 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
    <Container>
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p class="text-accent font-medium tracking-wide uppercase text-sm mb-2">Your Network</p>
          <h2 class="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            Friends Activity
          </h2>
        </div>
        <a
          href="/profile?tab=buddies"
          class="inline-flex items-center gap-2 font-semibold text-mountain-blue hover:text-accent transition-colors dark:text-accent dark:hover:text-accent-light whitespace-nowrap text-sm"
        >
          See all
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
      <ActivityFeed activities={data.friendsActivity} showUser={true} reactions={data.summitReactions} comments={data.summitComments} currentUserId={data.currentUserId} />
    </Container>
  </section>
{/if}

<!-- Featured Peaks -->
<section class="py-20 bg-slate-50 dark:bg-slate-800/50">
  <Container>
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div>
        <p class="text-accent font-medium tracking-wide uppercase text-sm mb-2">Popular Summits</p>
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
          Where to Start
        </h2>
        <p class="mt-3 text-slate-600 dark:text-slate-400 max-w-xl">
          These crowd-favorites offer accessible trails, stunning views, and that unforgettable first-summit feeling.
        </p>
      </div>
      <a
        href="/peaks"
        class="inline-flex items-center gap-2 font-semibold text-mountain-blue hover:text-accent transition-colors dark:text-accent dark:hover:text-accent-light whitespace-nowrap"
      >
        View all {data.totalPeaks || 58}
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>

    {#if data.peaks && data.peaks.length > 0}
      <div class="space-y-4">
        {#each data.peaks as peak, i}
          <div class="animate-fade-in-up" style="animation-delay: {i * 75}ms">
            <PeakCard {peak} featured={i === 0} />
          </div>
        {/each}
      </div>
    {:else}
      <div class="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
        <div class="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">No peaks loaded</h3>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Check your connection and refresh the page.
        </p>
      </div>
    {/if}

    <div class="mt-10 text-center">
      <a href="/peaks" class="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-accent text-accent font-semibold hover:bg-accent hover:text-white transition-all">
        View All 58 Peaks
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </Container>
</section>

<!-- Seven Ranges -->
<section class="py-24 bg-white dark:bg-slate-900 overflow-hidden">
  <Container>
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <!-- Text Content -->
      <div class="order-2 lg:order-1">
        <p class="text-mountain-blue dark:text-mountain-mist font-medium tracking-wide uppercase text-sm mb-3">Explore by Range</p>
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          Seven ranges.<br class="hidden sm:block" /> Seven personalities.
        </h2>
        <div class="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            Colorado's fourteeners aren't scattered randomly—they're clustered into seven distinct mountain ranges, each with its own character and challenges.
          </p>
          <p>
            The <strong class="text-slate-900 dark:text-white">Sawatch</strong> offers gentle giants perfect for first-timers. The <strong class="text-slate-900 dark:text-white">Elk Mountains</strong> demand respect with infamous loose rock. The <strong class="text-slate-900 dark:text-white">San Juans</strong> reward those willing to venture into true wilderness.
          </p>
        </div>

        <!-- Range quick links -->
        <div class="flex flex-wrap gap-2 mt-6">
          <a href="/ranges/sawatch-range" class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-mountain-blue/10 hover:text-mountain-blue dark:hover:text-mountain-mist transition-colors">
            Sawatch <span class="text-slate-400">(15)</span>
          </a>
          <a href="/ranges/san-juan-mountains" class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-mountain-blue/10 hover:text-mountain-blue dark:hover:text-mountain-mist transition-colors">
            San Juans <span class="text-slate-400">(13)</span>
          </a>
          <a href="/ranges/sangre-de-cristo-range" class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-mountain-blue/10 hover:text-mountain-blue dark:hover:text-mountain-mist transition-colors">
            Sangre de Cristo <span class="text-slate-400">(10)</span>
          </a>
          <a href="/ranges/elk-mountains" class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-mountain-blue/10 hover:text-mountain-blue dark:hover:text-mountain-mist transition-colors">
            Elk Mountains <span class="text-slate-400">(6)</span>
          </a>
        </div>

        <a
          href="/ranges"
          class="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-mountain-blue text-white font-semibold hover:bg-mountain-navy transition-all shadow-md hover:shadow-lg"
        >
          Explore All Ranges
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

      <!-- Visual: Range Photo Grid -->
      <div class="order-1 lg:order-2">
        <div class="grid grid-cols-2 gap-3">
          <a href="/ranges/elk-mountains" class="group relative aspect-square rounded-2xl overflow-hidden shadow-lg">
            <img src="/images/peaks/Maroon_Peak.jpg" alt="Maroon Peak — Elk Mountains" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            <div class="absolute bottom-3 left-3 right-3">
              <p class="text-white font-semibold text-sm">Elk Mountains</p>
              <p class="text-white/70 text-xs">6 peaks</p>
            </div>
          </a>
          <a href="/ranges/san-juan-mountains" class="group relative aspect-square rounded-2xl overflow-hidden shadow-lg">
            <img src="/images/peaks/Handies_Peak.jpg" alt="Handies Peak — San Juan Mountains" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            <div class="absolute bottom-3 left-3 right-3">
              <p class="text-white font-semibold text-sm">San Juans</p>
              <p class="text-white/70 text-xs">13 peaks</p>
            </div>
          </a>
          <a href="/ranges/sawatch-range" class="group relative aspect-square rounded-2xl overflow-hidden shadow-lg">
            <img src="/images/peaks/Huron_Peak.jpg" alt="Huron Peak — Sawatch Range" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            <div class="absolute bottom-3 left-3 right-3">
              <p class="text-white font-semibold text-sm">Sawatch</p>
              <p class="text-white/70 text-xs">15 peaks</p>
            </div>
          </a>
          <a href="/ranges/sangre-de-cristo-range" class="group relative aspect-square rounded-2xl overflow-hidden shadow-lg">
            <img src="/images/peaks/Crestone_Peak.jpg" alt="Crestone Peak — Sangre de Cristo Range" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            <div class="absolute bottom-3 left-3 right-3">
              <p class="text-white font-semibold text-sm">Sangre de Cristo</p>
              <p class="text-white/70 text-xs">10 peaks</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </Container>
</section>

<!-- Track Your Journey -->
<section class="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-800/50 dark:via-slate-900 dark:to-slate-800/50 overflow-hidden">
  <Container>
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <!-- Visual: Progress Dashboard Mock -->
      <div class="relative">
        <div class="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-mountain-navy via-mountain-blue to-mountain-navy relative p-6 sm:p-8 shadow-2xl shadow-mountain-navy/20">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-40 h-40 bg-mountain-mist/20 rounded-full blur-3xl"></div>

          <!-- Mock dashboard content -->
          <div class="relative space-y-5">
            <!-- Progress ring -->
            <div class="flex items-center gap-5">
              <div class="relative w-24 h-24 sm:w-28 sm:h-28">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="white" stroke-opacity="0.15" stroke-width="2.5"></circle>
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="url(#progress-gradient)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="65, 100"></circle>
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#F97316"></stop>
                      <stop offset="100%" stop-color="#FBBF24"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-2xl sm:text-3xl font-bold text-white">38</span>
                  <span class="text-white/50 text-[10px] sm:text-xs">of 58</span>
                </div>
              </div>
              <div>
                <div class="text-white font-bold text-lg">Peak Progress</div>
                <div class="text-white/60 text-sm mt-1">65% complete</div>
                <div class="flex items-center gap-1 mt-2">
                  <div class="w-20 h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div class="w-[65%] h-full rounded-full bg-gradient-to-r from-accent to-semantic-warning-light"></div>
                  </div>
                  <span class="text-white/40 text-xs">20 to go</span>
                </div>
              </div>
            </div>

            <!-- Achievement badges -->
            <div>
              <div class="text-white/50 text-xs uppercase tracking-wide mb-2">Achievements</div>
              <div class="flex gap-2">
                <div class="w-11 h-11 rounded-xl bg-semantic-warning/20 flex items-center justify-center border border-semantic-warning/30">
                  <svg class="w-5 h-5 text-semantic-warning-light" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
                </div>
                <div class="w-11 h-11 rounded-xl bg-semantic-success/20 flex items-center justify-center border border-semantic-success/30">
                  <svg class="w-5 h-5 text-semantic-success-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div class="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                </div>
                <div class="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <div class="w-11 h-11 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center">
                  <span class="text-white/30 text-sm font-medium">+4</span>
                </div>
              </div>
            </div>

            <!-- Recent summits list -->
            <div>
              <div class="text-white/50 text-xs uppercase tracking-wide mb-2">Recent Summits</div>
              <div class="space-y-2">
                <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                  <div class="w-2.5 h-2.5 rounded-full bg-semantic-success-light"></div>
                  <span class="text-white font-medium text-sm">Mt. Elbert</span>
                  <span class="text-white/40 text-xs ml-auto">2 days ago</span>
                </div>
                <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                  <div class="w-2.5 h-2.5 rounded-full bg-semantic-success-light"></div>
                  <span class="text-white font-medium text-sm">Quandary Peak</span>
                  <span class="text-white/40 text-xs ml-auto">1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Text Content -->
      <div>
        <p class="text-accent font-medium tracking-wide uppercase text-sm mb-3">Your Peak Bagging Journey</p>
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          Track every summit.<br class="hidden sm:block" /> Earn your place.
        </h2>
        <div class="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            Every summit tells a story—the 3am alarm, the final push through talus, that moment when the world opens up beneath you. Don't let those memories fade.
          </p>
          <p>
            Log your summits, track your progress toward all 58, and <strong class="text-slate-900 dark:text-white">earn achievements</strong> along the way. First peak? Badge. Entire range? Badge. All 58? That's the ultimate badge—and your name on the leaderboard.
          </p>
        </div>

        <!-- Feature highlights -->
        <div class="grid grid-cols-2 gap-3 mt-6">
          <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <svg class="w-5 h-5 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Progress tracking
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <svg class="w-5 h-5 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Achievement badges
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <svg class="w-5 h-5 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Public profile
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <svg class="w-5 h-5 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Leaderboard rankings
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-8">
          <a
            href="/leaderboard"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-warm text-white font-semibold hover:from-accent-warm hover:to-accent transition-all shadow-md hover:shadow-lg"
          >
            View Leaderboard
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="/auth"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  </Container>
</section>

<!-- New to 14ers -->
<section class="py-24 bg-white dark:bg-slate-900 overflow-hidden">
  <Container>
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <!-- Text Content -->
      <div class="order-2 lg:order-1">
        <p class="text-semantic-success font-medium tracking-wide uppercase text-sm mb-3">New to 14ers?</p>
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          We've got you<br class="hidden sm:block" /> covered.
        </h2>
        <div class="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            Standing on a summit at 14,000 feet is unforgettable. The thin air, the endless views, the accomplishment—it stays with you.
          </p>
          <p>
            But getting there safely requires preparation. <strong class="text-slate-900 dark:text-white">Afternoon thunderstorms</strong> roll in like clockwork. <strong class="text-slate-900 dark:text-white">Altitude sickness</strong> can strike anyone. Our guides cover everything you need to know.
          </p>
        </div>

        <!-- Quick topic cards -->
        <div class="grid grid-cols-2 gap-3 mt-6">
          <a href="/learn/first-fourteener" class="group p-4 rounded-xl bg-gradient-to-br from-accent/5 to-semantic-warning/5 border border-accent/20 hover:border-accent/40 transition-colors">
            <svg class="w-6 h-6 text-accent mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
            <div class="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-accent transition-colors">First 14er</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pick your peak</div>
          </a>
          <a href="/learn/safety" class="group p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <svg class="w-6 h-6 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <div class="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-500 transition-colors">Safety</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Weather & altitude</div>
          </a>
          <a href="/learn/gear" class="group p-4 rounded-xl bg-gradient-to-br from-semantic-success/5 to-semantic-success-light/5 border border-semantic-success/20 hover:border-semantic-success/40 transition-colors">
            <svg class="w-6 h-6 text-semantic-success mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
            <div class="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-semantic-success transition-colors">Gear</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">The essentials</div>
          </a>
          <a href="/learn/parking" class="group p-4 rounded-xl bg-gradient-to-br from-semantic-warning/5 to-semantic-warning/5 border border-semantic-warning/20 hover:border-semantic-warning/40 transition-colors">
            <svg class="w-6 h-6 text-semantic-warning mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <div class="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-semantic-warning transition-colors">Parking</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Beat the crowds</div>
          </a>
        </div>

        <a
          href="/learn"
          class="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-semantic-success text-white font-semibold hover:bg-semantic-success-dark transition-all shadow-md hover:shadow-lg"
        >
          Explore All Guides
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

      <!-- Visual: Checklist/Preparation Illustration -->
      <div class="order-1 lg:order-2 relative">
        <div class="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-semantic-success/5 to-semantic-success-light/5 dark:from-semantic-success/15 dark:to-semantic-success-light/15 border border-semantic-success/15 dark:border-semantic-success-dark/30 relative p-5 sm:p-7 shadow-xl shadow-semantic-success/5">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-semantic-success/15 dark:bg-semantic-success/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-semantic-success-light/20 dark:bg-semantic-success-light/10 rounded-full blur-2xl"></div>

          <!-- Checklist visual -->
          <div class="relative space-y-2.5">
            <div class="text-sm font-bold text-semantic-success-dark dark:text-semantic-success-light mb-4 flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-semantic-success/20 flex items-center justify-center">
                <svg class="w-4 h-4 text-semantic-success-dark dark:text-semantic-success-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              Summit Day Checklist
            </div>

            {#each [
              { text: 'Check weather forecast', done: true },
              { text: 'Start before accent', done: true },
              { text: 'Pack the ten essentials', done: true },
              { text: 'Tell someone your plans', done: true },
              { text: 'Know your turnaround time', done: false },
              { text: 'Summit by noon', done: false }
            ] as item}
              <div class="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-sm border border-semantic-success/10/50 dark:border-slate-700/50">
                <div class="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center {item.done ? 'bg-semantic-success' : 'border-2 border-slate-300 dark:border-slate-600'}">
                  {#if item.done}
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  {/if}
                </div>
                <span class="text-sm {item.done ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600' : 'text-slate-700 dark:text-slate-200 font-medium'}">
                  {item.text}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </Container>
</section>

<!-- Final CTA -->
<section class="py-24 bg-gradient-to-br from-mountain-navy via-mountain-blue to-mountain-navy overflow-hidden relative">
  <!-- Decorative elements -->
  <div class="absolute inset-0 opacity-30">
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-mountain-mist/20 rounded-full blur-3xl"></div>
  </div>

  <!-- Mountain silhouette -->
  <div class="absolute inset-x-0 bottom-0 h-32 pointer-events-none opacity-20">
    <svg class="absolute bottom-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 200">
      <path d="M0,200 L0,150 L200,180 L400,100 L600,140 L800,80 L1000,120 L1200,60 L1440,100 L1440,200 Z" class="fill-white/20"></path>
    </svg>
  </div>

  <Container class="relative">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
        Ready to start your journey?
      </h2>
      <p class="text-xl text-white/80 mb-10 leading-relaxed">
        Join the community of peak baggers tracking their progress toward all 58 Colorado fourteeners.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/auth" class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-mountain-navy font-bold text-lg hover:bg-slate-100 transition-all shadow-lg">
          Create Free Account
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <a href="/leaderboard" class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-bold text-lg hover:bg-accent-warm transition-all shadow-lg">
          See the Leaderboard
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </a>
      </div>
    </div>
  </Container>
</section>
