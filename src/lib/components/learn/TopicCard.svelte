<script lang="ts">
  interface Props {
    href: string;
    title: string;
    description: string;
    icon: string;
    color?: 'sunrise' | 'blue' | 'green' | 'amber' | 'violet';
    comingSoon?: boolean;
    number?: number;
  }

  let { href, title, description, icon, color = 'sunrise', comingSoon = false, number }: Props = $props();

  const colorConfig = {
    sunrise: {
      gradient: 'from-sunrise/20 via-sunrise-coral/15 to-orange-400/20',
      icon: 'text-sunrise',
      iconBg: 'bg-sunrise/20',
      badge: 'bg-sunrise/10 text-sunrise',
      glow: 'group-hover:shadow-sunrise/20'
    },
    blue: {
      gradient: 'from-blue-500/20 via-blue-400/15 to-cyan-400/20',
      icon: 'text-blue-500',
      iconBg: 'bg-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      glow: 'group-hover:shadow-blue-500/20'
    },
    green: {
      gradient: 'from-emerald-500/20 via-green-400/15 to-teal-400/20',
      icon: 'text-emerald-500',
      iconBg: 'bg-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      glow: 'group-hover:shadow-emerald-500/20'
    },
    amber: {
      gradient: 'from-amber-500/20 via-yellow-400/15 to-orange-400/20',
      icon: 'text-amber-500',
      iconBg: 'bg-amber-500/20',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      glow: 'group-hover:shadow-amber-500/20'
    },
    violet: {
      gradient: 'from-violet-500/20 via-purple-400/15 to-fuchsia-400/20',
      icon: 'text-violet-500',
      iconBg: 'bg-violet-500/20',
      badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
      glow: 'group-hover:shadow-violet-500/20'
    }
  };

  const iconPaths: Record<string, string> = {
    mountain: 'M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z',
    shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    backpack: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    map: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    question: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    compass: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    car: 'M8 17h.01M16 17h.01M9 11h6M5 11l1.5-4.5A2 2 0 018.38 5h7.24a2 2 0 011.88 1.316L19 11M5 11h14v6a1 1 0 01-1 1H6a1 1 0 01-1-1v-6z'
  };

  const config = $derived(colorConfig[color]);
</script>

{#if comingSoon}
  <div
    class="
      group relative rounded-2xl overflow-hidden
      bg-white dark:bg-slate-800
      border border-slate-200 dark:border-slate-700
      opacity-60
    "
  >
    <!-- Gradient header -->
    <div class="h-24 bg-gradient-to-br {config.gradient} relative">
      <div class="absolute inset-0 flex items-center justify-center">
        <svg class="h-12 w-12 {config.icon} opacity-40" fill="currentColor" viewBox="0 0 24 24">
          <path d={iconPaths[icon] || iconPaths.mountain} />
        </svg>
      </div>
      <div class="absolute top-3 right-3">
        <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-500 dark:text-slate-400 shadow-sm">
          Coming Soon
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
{:else}
  <a
    {href}
    class="
      group relative rounded-2xl overflow-hidden
      bg-white dark:bg-slate-800
      border border-slate-200 dark:border-slate-700
      shadow-card hover:shadow-card-elevated {config.glow}
      transition-all duration-300
      hover:-translate-y-1
    "
  >
    <!-- Gradient header -->
    <div class="h-28 bg-gradient-to-br {config.gradient} relative overflow-hidden">
      <!-- Decorative shapes -->
      <div class="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10"></div>
      <div class="absolute -left-2 -bottom-6 w-20 h-20 rounded-full bg-white/5"></div>

      <!-- Icon -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="relative">
          <svg class="h-14 w-14 {config.icon} opacity-60 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d={iconPaths[icon] || iconPaths.mountain} />
          </svg>
        </div>
      </div>

      <!-- Number badge (optional) -->
      {#if number}
        <div class="absolute top-3 left-3">
          <span class="flex items-center justify-center w-7 h-7 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-sm font-bold {config.icon} shadow-sm">
            {number}
          </span>
        </div>
      {/if}
    </div>

    <!-- Content -->
    <div class="p-5">
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-sunrise transition-colors">
          {title}
        </h3>
        <svg
          class="flex-shrink-0 h-5 w-5 text-slate-400 group-hover:text-sunrise group-hover:translate-x-1 transition-all mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  </a>
{/if}
