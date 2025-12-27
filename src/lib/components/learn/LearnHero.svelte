<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
    variant?: 'hub' | 'page';
  }

  let { title, subtitle, variant = 'page' }: Props = $props();

  const stats = [
    { value: '58', label: 'Peaks' },
    { value: "14,439'", label: 'Highest' },
    { value: '4', label: 'Classes' },
    { value: '7', label: 'Ranges' }
  ];
</script>

<div class="relative overflow-hidden bg-gradient-to-br from-mountain-navy via-mountain-blue to-mountain-mist dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
  <!-- Subtle grid pattern -->
  <div
    class="absolute inset-0 opacity-10"
    style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 40px 40px;"
  ></div>

  <!-- Animated particles -->
  {#each Array(12) as _, i}
    <div
      class="absolute h-1 w-1 rounded-full bg-white/20 animate-pulse-subtle"
      style="
        left: {8 + (i * 7) % 85}%;
        top: {15 + (i * 11) % 60}%;
        animation-delay: {(i * 0.4) % 2}s;
      "
    ></div>
  {/each}

  <!-- Decorative glow -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sunrise/10 rounded-full blur-3xl"></div>

  <!-- Mountain silhouettes -->
  <div class="absolute inset-x-0 bottom-0 h-32 pointer-events-none">
    <svg class="absolute bottom-0 w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
      <!-- Far mountains -->
      <path
        class="fill-white/5 dark:fill-white/5"
        d="M0,120 L0,80 L180,100 L360,60 L540,90 L720,50 L900,75 L1080,40 L1260,70 L1440,55 L1440,120 Z"
      />
      <!-- Mid mountains -->
      <path
        class="fill-white/10 dark:fill-slate-800/50"
        d="M0,120 L0,90 L120,110 L300,70 L480,95 L660,55 L840,80 L1020,45 L1200,75 L1380,60 L1440,80 L1440,120 Z"
      />
      <!-- Near mountains / transition -->
      <path
        class="fill-white dark:fill-slate-900"
        d="M0,120 L0,100 L200,115 L400,95 L600,110 L800,90 L1000,105 L1200,85 L1440,100 L1440,120 Z"
      />
    </svg>
  </div>

  <!-- Content -->
  <div class="relative px-4 {variant === 'hub' ? 'py-16 sm:py-24 md:py-28' : 'py-14 sm:py-18 md:py-20'}">
    <div class="max-w-4xl mx-auto text-center">
      <!-- Badge -->
      {#if variant === 'hub'}
        <p class="text-sunrise font-medium tracking-widest uppercase text-sm mb-4 animate-fade-in-up">
          The Complete Guide
        </p>
      {/if}

      <h1 class="text-4xl sm:text-5xl {variant === 'hub' ? 'md:text-6xl' : ''} font-display font-bold text-white tracking-tight animate-fade-in-up">
        {title}
      </h1>

      {#if subtitle}
        <p class="mt-4 sm:mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto animate-fade-in-up" style="animation-delay: 100ms">
          {subtitle}
        </p>
      {/if}

      <!-- Stats row for hub -->
      {#if variant === 'hub'}
        <div class="flex flex-wrap justify-center gap-6 sm:gap-10 mt-10 animate-fade-in-up" style="animation-delay: 200ms">
          {#each stats as stat}
            <div class="flex items-center gap-2">
              <span class="text-2xl sm:text-3xl font-bold text-white">{stat.value}</span>
              <span class="text-sm text-white/60">{stat.label}</span>
            </div>
          {/each}
        </div>

        <!-- CTA Button -->
        <div class="mt-10 animate-fade-in-up" style="animation-delay: 300ms">
          <a
            href="#start"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sunrise text-white font-semibold hover:bg-sunrise-coral transition-colors shadow-lg shadow-sunrise/25"
          >
            Start Learning
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      {/if}
    </div>
  </div>
</div>
