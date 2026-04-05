<script lang="ts">
  import type { ForumCategory } from '$lib/server/forum';
  import CategoryIcon from './CategoryIcon.svelte';

  interface Props {
    category: ForumCategory;
    class?: string;
  }

  let { category, class: className = '' }: Props = $props();

  const colorMap: Record<string, { border: string; icon: string; bg: string }> = {
    'class-1': {
      border: 'border-l-class-1',
      icon: 'text-class-1',
      bg: 'bg-class-1/10 dark:bg-class-1/20'
    },
    'class-2': {
      border: 'border-l-class-2',
      icon: 'text-class-2',
      bg: 'bg-class-2/10 dark:bg-class-2/20'
    },
    'class-3': {
      border: 'border-l-class-3',
      icon: 'text-class-3',
      bg: 'bg-class-3/10 dark:bg-class-3/20'
    },
    'class-4': {
      border: 'border-l-class-4',
      icon: 'text-class-4',
      bg: 'bg-class-4/10 dark:bg-class-4/20'
    },
    accent: {
      border: 'border-l-accent',
      icon: 'text-accent',
      bg: 'bg-accent/10 dark:bg-accent/20'
    },
    'mountain-blue': {
      border: 'border-l-mountain-blue',
      icon: 'text-mountain-blue dark:text-mountain-mist',
      bg: 'bg-mountain-blue/10 dark:bg-mountain-blue/20'
    }
  };

  const colors = $derived(colorMap[category.color] ?? colorMap['mountain-blue']);
</script>

<a
  href="/community/{category.slug}"
  class="
    group relative block overflow-hidden rounded-xl
    border border-slate-200 border-l-4 bg-white
    shadow-card transition-all duration-300
    hover:-translate-y-1 hover:shadow-card-hover
    dark:border-slate-700 dark:bg-slate-800/90
    {colors.border}
    {className}
  "
>
  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>

  <div class="relative p-5">
    <div class="flex items-start gap-4">
      <!-- Icon -->
      <div class="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl {colors.bg} transition-transform duration-300 group-hover:scale-110">
        <CategoryIcon icon={category.icon} class="h-5 w-5 {colors.icon}" />
      </div>

      <!-- Content -->
      <div class="min-w-0 flex-1">
        <h3 class="font-bold text-slate-900 dark:text-white group-hover:text-mountain-blue dark:group-hover:text-accent transition-colors">
          {category.name}
        </h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {category.description}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-4 flex items-center justify-between">
      <span class="text-xs text-slate-400 dark:text-slate-500">
        {category.topic_count} topic{category.topic_count !== 1 ? 's' : ''}
      </span>
      <div class="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:translate-x-0.5 dark:bg-slate-700 dark:text-slate-400">
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
</a>
