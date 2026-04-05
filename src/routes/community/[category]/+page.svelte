<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import ForumBreadcrumb from '$lib/components/forum/ForumBreadcrumb.svelte';
  import TopicCard from '$lib/components/forum/TopicCard.svelte';
  import TopicCardSkeleton from '$lib/components/forum/TopicCardSkeleton.svelte';
  import CategoryIcon from '$lib/components/forum/CategoryIcon.svelte';
  import { isTopicUnread } from '$lib/utils/forum';
  import type { ForumTopicWithAuthor } from '$lib/server/forum';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const category = $derived(data.category);
  let topics = $state<ForumTopicWithAuthor[]>(data.topics);
  let nextCursor = $state<string | null>(data.nextCursor);
  let loading = $state(false);
  let initialCount = $state(data.topics.length);
  let topicViews = $state<Record<string, string>>(data.topicViews ?? {});

  // Reset topics when navigating between categories
  $effect(() => {
    topics = data.topics;
    nextCursor = data.nextCursor;
    initialCount = data.topics.length;
    topicViews = data.topicViews ?? {};
  });


  const colorMap: Record<string, string> = {
    'class-1': 'text-class-1',
    'class-2': 'text-class-2',
    'class-3': 'text-class-3',
    'class-4': 'text-class-4',
    accent: 'text-accent',
    'mountain-blue': 'text-mountain-blue dark:text-mountain-mist'
  };

  const iconColor = $derived(colorMap[category.color] ?? 'text-mountain-blue');

  async function loadMore() {
    if (loading || !nextCursor) return;
    loading = true;

    try {
      const res = await fetch(`/api/v1/forum/categories/${category.slug}/topics?cursor=${encodeURIComponent(nextCursor)}`);
      if (!res.ok) return;

      const result = await res.json();
      topics = [...topics, ...result.topics];
      nextCursor = result.nextCursor;
    } finally {
      loading = false;
    }
  }

  function handleScroll() {
    if (loading || !nextCursor) return;
    const scrollBottom = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    if (pageHeight - scrollBottom < 600) {
      loadMore();
    }
  }
</script>

<svelte:window onscroll={handleScroll} />

<svelte:head>
  <title>{category.name} | Community | SaltGoat</title>
  <meta name="description" content="{category.description} — SaltGoat Community" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
  <Container class="py-8 sm:py-10">
    <!-- Breadcrumb -->
    <ForumBreadcrumb crumbs={[{ label: category.name }]} />

    <!-- Header -->
    <div class="mt-6 mb-8">
      <h1 class="heading-page text-slate-900 dark:text-white flex items-center gap-3">
        <CategoryIcon icon={category.icon} class="h-8 w-8 {iconColor}" />
        {category.name}
      </h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400">
        {category.description}
      </p>
      <div class="mt-3 flex items-center justify-between">
        <span class="text-sm text-slate-400 dark:text-slate-500">
          {category.topic_count} topic{category.topic_count !== 1 ? 's' : ''}
        </span>
        <a
          href="/community/{category.slug}/new"
          class="
            inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
            text-sm font-medium
            bg-accent text-white hover:bg-accent-warm
            transition-colors
          "
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Topic
        </a>
      </div>
    </div>

    <!-- Topic List -->
    {#if topics.length > 0}
      <div class="flex flex-col gap-3 stagger-children">
        {#each topics as topic, i (topic.id)}
          <div class={i < initialCount ? 'will-animate animate-fade-in-up' : ''}>
            <TopicCard {topic} categorySlug={category.slug} isUnread={isTopicUnread(topic, topicViews, data.isLoggedIn)} />
          </div>
        {/each}
      </div>

      <!-- Loading indicator -->
      {#if loading}
        <div class="flex flex-col gap-3 mt-3">
          {#each Array(3) as _}
            <TopicCardSkeleton />
          {/each}
        </div>
      {/if}

      {#if !nextCursor && topics.length > 0}
        <p class="text-center py-8 text-sm text-slate-400 dark:text-slate-500">
          You've reached the end
        </p>
      {/if}
    {:else}
      <!-- Empty state -->
      <div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-12 text-center animate-fade-in">
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700/50">
          <CategoryIcon icon={category.icon} class="h-8 w-8 {iconColor}" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">No topics yet</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-5">
          {#if category.icon === 'mountain'}
            Share your summit story or recent conditions report.
          {:else if category.icon === 'compass'}
            Plan your next adventure or find a hiking partner.
          {:else if category.icon === 'backpack'}
            Compare gear and share what works on Colorado's 14ers.
          {:else if category.icon === 'shield-alert'}
            Share safety knowledge and help fellow hikers stay safe.
          {:else if category.icon === 'camera'}
            Show off your summit shots and share photography tips.
          {:else}
            Start a conversation with fellow 14er enthusiasts.
          {/if}
        </p>
        <a
          href="/community/{category.slug}/new"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-warm transition-colors"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Start a Discussion
        </a>
      </div>
    {/if}
  </Container>
</div>
