<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import CategoryCard from '$lib/components/forum/CategoryCard.svelte';
  import TopicCard from '$lib/components/forum/TopicCard.svelte';
  import { isTopicUnread } from '$lib/utils/forum';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const categories = $derived(data.categories);
  const recentTopics = $derived(data.recentTopics);
  const popularTopics = $derived(data.popularTopics);
  const bookmarkedTopics = $derived(data.bookmarkedTopics);

  // Build a lookup from category id -> slug for TopicCard links
  const categorySlugMap = $derived(
    new Map(categories.map((c) => [c.id, c.slug]))
  );
  const topicViews = $derived(data.topicViews ?? {} as Record<string, string>);

</script>

<svelte:head>
  <title>Community | SaltGoat</title>
  <meta name="description" content="Join the SaltGoat community. Discuss trip reports, gear, route beta, and everything Colorado 14ers." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
  <!-- Hero -->
  <div class="relative overflow-hidden bg-gradient-to-br from-mountain-blue via-mountain-slate to-mountain-navy">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 20%22><polygon fill=%22white%22 points=%220,20 15,8 30,16 50,4 70,14 85,6 100,20%22/></svg>'); background-size: 400px; background-position: bottom; background-repeat: repeat-x;"></div>
    </div>
    <Container class="relative py-16 sm:py-20 text-center">
      <h1 class="font-display text-4xl sm:text-5xl tracking-tight text-white">
        Community
      </h1>
      <p class="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
        Share beta, plan trips, swap gear advice, and connect with fellow 14er enthusiasts.
      </p>

      <!-- Search bar -->
      <form action="/community/search" method="GET" class="mt-8 max-w-lg mx-auto">
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            name="q"
            placeholder="Search discussions..."
            class="
              w-full rounded-xl border border-white/20
              bg-white/10 backdrop-blur-sm
              text-white placeholder:text-white/50
              pl-10 pr-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30
              transition-colors
            "
          />
        </div>
      </form>
    </Container>
  </div>

  <Container class="py-10 sm:py-12">
    <!-- Categories Grid -->
    <section>
      <h2 class="heading-section text-slate-900 dark:text-white mb-6">Categories</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {#each categories as category (category.id)}
          <div class="will-animate animate-fade-in-up">
            <CategoryCard {category} />
          </div>
        {/each}
      </div>
    </section>

    <!-- Recent + Popular Columns -->
    <div class="mt-12 grid lg:grid-cols-2 gap-10">
      <!-- Recent Topics -->
      <section>
        <h2 class="heading-section text-slate-900 dark:text-white mb-5 flex items-center gap-2.5">
          <svg class="h-6 w-6 text-class-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent
        </h2>
        {#if recentTopics.length > 0}
          <div class="flex flex-col gap-3 stagger-children">
            {#each recentTopics as topic (topic.id)}
              <div class="will-animate animate-fade-in-up">
                <TopicCard {topic} categorySlug={categorySlugMap.get(topic.category_id) ?? 'general'} isUnread={isTopicUnread(topic, topicViews, data.isLoggedIn)} />
              </div>
            {/each}
          </div>
        {:else}
          <div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
            <svg class="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-slate-500 dark:text-slate-400 text-sm">No discussions yet. Pick a category above and start the first one!</p>
          </div>
        {/if}
      </section>

      <!-- Popular Topics -->
      <section>
        <h2 class="heading-section text-slate-900 dark:text-white mb-5 flex items-center gap-2.5">
          <svg class="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
          Popular
        </h2>
        {#if popularTopics.length > 0}
          <div class="flex flex-col gap-3 stagger-children">
            {#each popularTopics as topic (topic.id)}
              <div class="will-animate animate-fade-in-up">
                <TopicCard {topic} categorySlug={categorySlugMap.get(topic.category_id) ?? 'general'} isUnread={isTopicUnread(topic, topicViews, data.isLoggedIn)} />
              </div>
            {/each}
          </div>
        {:else}
          <div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
            <svg class="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Popular topics will appear here as the community grows.</p>
          </div>
        {/if}
      </section>
    </div>

    <!-- Bookmarked Topics (logged in only) -->
    {#if data.isLoggedIn && bookmarkedTopics.length > 0}
      <section class="mt-12">
        <h2 class="heading-section text-slate-900 dark:text-white mb-5 flex items-center gap-2.5">
          <svg class="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Your Bookmarks
        </h2>
        <div class="grid lg:grid-cols-2 gap-3">
          {#each bookmarkedTopics as topic (topic.id)}
            <TopicCard {topic} categorySlug={categorySlugMap.get(topic.category_id) ?? 'general'} isUnread={isTopicUnread(topic, topicViews, data.isLoggedIn)} />
          {/each}
        </div>
      </section>
    {/if}
  </Container>
</div>
