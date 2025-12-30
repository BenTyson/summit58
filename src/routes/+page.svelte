<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import PeakCard from '$lib/components/peak/PeakCard.svelte';
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
  <title>Cairn58 - The Modern Guide to Colorado's 14ers</title>
  <meta
    name="description"
    content="Beautiful, mobile-first guide to all 58 Colorado fourteeners. Stats at a glance, conditions reports, and everything you need to summit."
  />
  <link rel="canonical" href="https://cairn58.com" />
  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Cairn58",
      "url": "https://cairn58.com",
      "description": "The modern guide to Colorado's 58 fourteeners",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://cairn58.com/peaks?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  </script>`}
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-[85vh] flex items-center overflow-hidden">
  <!-- Animated gradient background -->
  <div
    class="
      absolute inset-0
      bg-gradient-to-br from-mountain-navy via-mountain-blue to-mountain-mist
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
    "
  >
    <!-- Subtle grid pattern -->
    <div
      class="absolute inset-0 opacity-10"
      style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 40px 40px;"
    ></div>

    <!-- Animated particles/stars -->
    {#each Array(20) as _, i}
      <div
        class="absolute rounded-full bg-white/20 animate-pulse-subtle"
        style="
          width: {1 + (i % 3)}px;
          height: {1 + (i % 3)}px;
          left: {5 + (i * 5) % 90}%;
          top: {5 + (i * 7) % 60}%;
          animation-delay: {(i * 0.2) % 3}s;
        "
      ></div>
    {/each}

    <!-- Sunrise glow -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sunrise/10 rounded-full blur-3xl"></div>
  </div>

  <!-- Mountain silhouette layers -->
  <div class="absolute inset-x-0 bottom-0 h-56 pointer-events-none">
    <svg
      class="absolute bottom-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 1440 320"
    >
      <!-- Far mountains -->
      <path
        class="fill-mountain-mist/30 dark:fill-slate-700/30"
        d="M0,320 L0,200 L240,280 L480,160 L720,220 L960,120 L1200,180 L1440,100 L1440,320 Z"
      ></path>
      <!-- Mid mountains -->
      <path
        class="fill-mountain-blue-light/50 dark:fill-slate-800/50"
        d="M0,320 L0,240 L180,300 L400,200 L600,260 L800,160 L1000,220 L1200,140 L1440,200 L1440,320 Z"
      ></path>
      <!-- Near mountains -->
      <path
        class="fill-white dark:fill-slate-900"
        d="M0,320 L0,280 L200,320 L360,260 L520,300 L680,240 L840,290 L1000,220 L1160,280 L1320,240 L1440,280 L1440,320 Z"
      ></path>
    </svg>
  </div>

  <!-- Content -->
  <Container class="relative z-10 py-24 text-center">
    <div class="animate-fade-in-up">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-white/90 text-sm font-medium">58 peaks. 66 routes. One goal.</span>
      </div>
      <h1 class="heading-hero text-white">
        Cairn<span class="text-sunrise">58</span>
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-xl text-white/90 sm:text-2xl font-light">
        Your companion for conquering Colorado's fourteeners
      </p>
      <p class="mx-auto mt-4 max-w-xl text-slate-300 leading-relaxed">
        Track summits. Check conditions. Plan routes. Join thousands of peak baggers on the journey to all 58.
      </p>
    </div>

    <div class="mt-10 flex flex-col justify-center gap-4 sm:flex-row animate-fade-in-up" style="animation-delay: 200ms">
      <a href="/peaks" class="btn-primary text-lg px-8 py-4 shadow-lg shadow-sunrise/25">
        Explore All Peaks
        <svg
          class="h-5 w-5 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </a>
      <a href="/map" class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        View Map
      </a>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
      <svg class="h-6 w-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </Container>
</section>

<!-- Stats Section -->
<section class="relative py-20 bg-white dark:bg-slate-900 overflow-hidden">
  <Container class="relative">
    <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {#each stats as stat, i}
        {@const colors = [
          { bg: 'from-sunrise/10 to-orange-500/10', icon: 'text-sunrise', border: 'border-sunrise/20' },
          { bg: 'from-amber-500/10 to-yellow-500/10', icon: 'text-amber-500', border: 'border-amber-500/20' },
          { bg: 'from-mountain-blue/10 to-cyan-500/10', icon: 'text-mountain-blue', border: 'border-mountain-blue/20' },
          { bg: 'from-emerald-500/10 to-teal-500/10', icon: 'text-emerald-500', border: 'border-emerald-500/20' }
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

<!-- Featured Peaks -->
<section class="py-20 bg-slate-50 dark:bg-slate-800/50">
  <Container>
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div>
        <p class="text-sunrise font-medium tracking-wide uppercase text-sm mb-2">Popular Summits</p>
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
          Where to Start
        </h2>
        <p class="mt-3 text-slate-600 dark:text-slate-400 max-w-xl">
          These crowd-favorites offer accessible trails, stunning views, and that unforgettable first-summit feeling.
        </p>
      </div>
      <a
        href="/peaks"
        class="inline-flex items-center gap-2 font-semibold text-mountain-blue hover:text-sunrise transition-colors dark:text-sunrise dark:hover:text-sunrise-light whitespace-nowrap"
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
      <a href="/peaks" class="btn-primary px-8 py-3">
        Explore All Peaks
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

      <!-- Visual: Stylized Range Silhouettes -->
      <div class="order-1 lg:order-2 relative">
        <div class="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-mountain-mist/30 via-mountain-blue/20 to-mountain-navy/30 dark:from-slate-800 dark:to-slate-700 relative shadow-2xl shadow-mountain-blue/10">
          <!-- Layered mountain silhouettes -->
          <svg class="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <!-- Sky gradient -->
            <defs>
              <linearGradient id="sky-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#1e3a5f" stop-opacity="0.1" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="400" height="300" fill="url(#sky-gradient)" />

            <!-- Back range - San Juans -->
            <path d="M0,300 L0,180 L40,200 L80,140 L120,170 L160,110 L200,150 L240,90 L280,130 L320,100 L360,140 L400,120 L400,300 Z" class="fill-mountain-mist/50 dark:fill-slate-600/50" />
            <!-- Mid range - Sawatch -->
            <path d="M0,300 L0,200 L50,220 L100,160 L150,190 L200,130 L250,170 L300,120 L350,160 L400,140 L400,300 Z" class="fill-mountain-blue/60 dark:fill-slate-500/60" />
            <!-- Front range - Elks -->
            <path d="M0,300 L0,220 L60,250 L120,180 L180,220 L240,160 L300,200 L360,170 L400,190 L400,300 Z" class="fill-mountain-navy/70 dark:fill-slate-400/40" />
            <!-- Accent peaks with snow caps -->
            <path d="M180,160 L200,100 L220,160" class="fill-sunrise" />
            <path d="M190,140 L200,110 L210,140" class="fill-white/80" />
            <path d="M300,140 L320,90 L340,140" class="fill-sunrise/80" />
            <path d="M308,125 L320,100 L332,125" class="fill-white/70" />
          </svg>

          <!-- Range labels floating -->
          <div class="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg">
            <span class="text-xs font-bold text-mountain-blue dark:text-mountain-mist">7 Ranges</span>
          </div>
          <div class="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg">
            <span class="text-xs font-bold text-sunrise">58 Peaks</span>
          </div>
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
          <div class="absolute top-0 right-0 w-48 h-48 bg-sunrise/20 rounded-full blur-3xl"></div>
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
                    <div class="w-[65%] h-full rounded-full bg-gradient-to-r from-sunrise to-amber-400"></div>
                  </div>
                  <span class="text-white/40 text-xs">20 to go</span>
                </div>
              </div>
            </div>

            <!-- Achievement badges -->
            <div>
              <div class="text-white/50 text-xs uppercase tracking-wide mb-2">Achievements</div>
              <div class="flex gap-2">
                <div class="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                  <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
                </div>
                <div class="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
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
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <span class="text-white font-medium text-sm">Mt. Elbert</span>
                  <span class="text-white/40 text-xs ml-auto">2 days ago</span>
                </div>
                <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
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
        <p class="text-sunrise font-medium tracking-wide uppercase text-sm mb-3">Your Peak Bagging Journey</p>
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
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Progress tracking
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Achievement badges
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Public profile
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Leaderboard rankings
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-8">
          <a
            href="/leaderboard"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sunrise to-sunrise-coral text-white font-semibold hover:from-sunrise-coral hover:to-sunrise transition-all shadow-md hover:shadow-lg"
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
        <p class="text-emerald-500 font-medium tracking-wide uppercase text-sm mb-3">New to 14ers?</p>
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
          <a href="/learn/first-fourteener" class="group p-4 rounded-xl bg-gradient-to-br from-sunrise/5 to-orange-500/5 border border-sunrise/20 hover:border-sunrise/40 transition-colors">
            <svg class="w-6 h-6 text-sunrise mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
            <div class="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-sunrise transition-colors">First 14er</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pick your peak</div>
          </a>
          <a href="/learn/safety" class="group p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <svg class="w-6 h-6 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <div class="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-500 transition-colors">Safety</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Weather & altitude</div>
          </a>
          <a href="/learn/gear" class="group p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <svg class="w-6 h-6 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
            <div class="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-emerald-500 transition-colors">Gear</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">The essentials</div>
          </a>
          <a href="/learn/parking" class="group p-4 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
            <svg class="w-6 h-6 text-amber-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <div class="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-amber-500 transition-colors">Parking</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Beat the crowds</div>
          </a>
        </div>

        <a
          href="/learn"
          class="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all shadow-md hover:shadow-lg"
        >
          Explore All Guides
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

      <!-- Visual: Checklist/Preparation Illustration -->
      <div class="order-1 lg:order-2 relative">
        <div class="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-800/30 relative p-5 sm:p-7 shadow-xl shadow-emerald-500/5">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-200/50 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-teal-200/50 dark:bg-teal-500/10 rounded-full blur-2xl"></div>

          <!-- Checklist visual -->
          <div class="relative space-y-2.5">
            <div class="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              Summit Day Checklist
            </div>

            {#each [
              { text: 'Check weather forecast', done: true },
              { text: 'Start before sunrise', done: true },
              { text: 'Pack the ten essentials', done: true },
              { text: 'Tell someone your plans', done: true },
              { text: 'Know your turnaround time', done: false },
              { text: 'Summit by noon', done: false }
            ] as item}
              <div class="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-sm border border-emerald-100/50 dark:border-slate-700/50">
                <div class="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center {item.done ? 'bg-emerald-500' : 'border-2 border-slate-300 dark:border-slate-600'}">
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
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-sunrise/20 rounded-full blur-3xl"></div>
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
        <a href="/peaks" class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-mountain-navy font-bold text-lg hover:bg-slate-100 transition-all shadow-lg">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
          </svg>
          Browse All Peaks
        </a>
        <a href="/auth" class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-sunrise text-white font-bold text-lg hover:bg-sunrise-coral transition-all shadow-lg">
          Create Free Account
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  </Container>
</section>
