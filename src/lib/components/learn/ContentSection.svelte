<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    id?: string;
    title: string;
    icon?: string;
    delay?: number;
    children: Snippet;
  }

  let { id, title, icon, delay = 0, children }: Props = $props();

  // Common icon paths
  const iconPaths: Record<string, string> = {
    mountain: 'M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z',
    sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    lightning: 'M13 10V3L4 14h7v7l9-11h-7z',
    heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    map: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    backpack: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    car: 'M8 17h.01M16 17h.01M9 11h6M5 11l1.5-4.5A2 2 0 018.38 5h7.24a2 2 0 011.88 1.316L19 11M5 11h14v6a1 1 0 01-1 1H6a1 1 0 01-1-1v-6z',
    parking: 'M8 21V7a4 4 0 014-4h0a4 4 0 014 4v14M8 10h8',
    ticket: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
  };
</script>

<section
  {id}
  class="mt-12 first:mt-0 animate-fade-in-up scroll-mt-24"
  style="animation-delay: {delay}ms"
>
  <h2 class="heading-section text-slate-900 dark:text-white flex items-center gap-3 mb-6">
    {#if icon && iconPaths[icon]}
      <svg
        class="h-7 w-7 text-sunrise flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d={iconPaths[icon]}
        />
      </svg>
    {/if}
    {title}
  </h2>
  <div class="prose prose-slate dark:prose-invert max-w-none">
    {@render children()}
  </div>
</section>
