<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import ForumBreadcrumb from '$lib/components/forum/ForumBreadcrumb.svelte';
  import TopicDetailComponent from '$lib/components/forum/TopicDetail.svelte';
  import ReplyCard from '$lib/components/forum/ReplyCard.svelte';
  import ReplyComposer from '$lib/components/forum/ReplyComposer.svelte';
  import TopicCardSkeleton from '$lib/components/forum/TopicCardSkeleton.svelte';
  import type { ForumReplyWithAuthor } from '$lib/server/forum';
  import type { ForumReactionData } from '$lib/server/forumReactions';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const topic = $derived(data.topic);
  const ogDescription = $derived(topic.body.replace(/[#*`>\[\]!_~]/g, '').slice(0, 200));
  const canonicalUrl = $derived(`https://saltgoat.co/community/${topic.category.slug}/${topic.slug}`);

  let replies = $state<ForumReplyWithAuthor[]>(data.replies);
  let nextCursor = $state<string | null>(data.nextCursor);
  let replyReactions = $state<Record<string, ForumReactionData>>(data.replyReactions);
  let loading = $state(false);
  let initialReplyCount = $state(data.replies.length);

  // Reply-to context for composer
  let replyTo = $state<{ id: string; authorName: string | null; body: string } | null>(null);

  // Reset state when navigating to a different topic
  $effect(() => {
    replies = data.replies;
    nextCursor = data.nextCursor;
    replyReactions = data.replyReactions;
    replyTo = null;
    initialReplyCount = data.replies.length;
  });

  function handleReplyTo(reply: ForumReplyWithAuthor) {
    replyTo = {
      id: reply.id,
      authorName: reply.author.display_name,
      body: reply.body.slice(0, 200)
    };
    // Scroll to composer
    document.getElementById('reply-composer')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearReplyTo() {
    replyTo = null;
  }

  async function loadMoreReplies() {
    if (loading || !nextCursor) return;
    loading = true;

    try {
      const res = await fetch(`/api/v1/forum/topics/${topic.id}/replies?cursor=${encodeURIComponent(nextCursor)}`);
      if (!res.ok) return;

      const result = await res.json();
      replies = [...replies, ...result.replies];
      nextCursor = result.nextCursor;
      replyReactions = { ...replyReactions, ...result.reactions };
    } finally {
      loading = false;
    }
  }

  function handleScroll() {
    if (loading || !nextCursor) return;
    const scrollBottom = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    if (pageHeight - scrollBottom < 600) {
      loadMoreReplies();
    }
  }
</script>

<svelte:window onscroll={handleScroll} />

<svelte:head>
  <title>{topic.title} | {topic.category.name} | SaltGoat Community</title>
  <meta name="description" content={ogDescription} />
  <link rel="canonical" href={canonicalUrl} />

  <meta property="og:type" content="article" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content="{topic.title} | SaltGoat Community" />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:site_name" content="SaltGoat" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={topic.title} />
  <meta name="twitter:description" content={ogDescription} />

  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": topic.title,
    "text": topic.body.slice(0, 300),
    "datePublished": topic.created_at,
    "dateModified": topic.updated_at,
    "author": { "@type": "Person", "name": topic.author.display_name || "Anonymous" },
    "interactionStatistic": [
      { "@type": "InteractionCounter", "interactionType": "https://schema.org/CommentAction", "userInteractionCount": topic.reply_count },
      { "@type": "InteractionCounter", "interactionType": "https://schema.org/ViewAction", "userInteractionCount": topic.view_count }
    ],
    "url": canonicalUrl
  })}</script>`}
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
  <Container class="py-8 sm:py-10">
    <!-- Breadcrumb -->
    <ForumBreadcrumb crumbs={[
      { label: topic.category.name, href: `/community/${topic.category.slug}` },
      { label: topic.title }
    ]} />

    <!-- Topic -->
    <div class="mt-6">
      <TopicDetailComponent
        {topic}
        reactions={data.topicReactions}
        isBookmarked={data.isBookmarked}
        isLoggedIn={data.isLoggedIn}
        currentUserId={data.currentUserId}
      />
    </div>

    <!-- Replies Section -->
    <div class="mt-8">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {topic.reply_count} {topic.reply_count === 1 ? 'Reply' : 'Replies'}
      </h2>

      {#if replies.length > 0}
        <div class="flex flex-col gap-3 stagger-children">
          {#each replies as reply, i (reply.id)}
            <div class={i < initialReplyCount ? 'will-animate animate-fade-in-up' : ''}>
              <ReplyCard
                {reply}
                reactions={replyReactions[reply.id] ?? { counts: {}, userReactions: [] }}
                isLoggedIn={data.isLoggedIn}
                currentUserId={data.currentUserId}
                onReplyTo={handleReplyTo}
              />
            </div>
          {/each}
        </div>

        {#if loading}
          <div class="flex flex-col gap-3 mt-3">
            {#each Array(2) as _}
              <TopicCardSkeleton />
            {/each}
          </div>
        {/if}
      {:else if !topic.is_locked}
        <div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center mb-6">
          <svg class="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-slate-500 dark:text-slate-400 text-sm">No replies yet. Be the first to respond!</p>
        </div>
      {/if}
    </div>

    <!-- Reply Composer -->
    {#if data.isLoggedIn && !topic.is_locked}
      <div id="reply-composer" class="mt-6">
        <ReplyComposer
          topicId={topic.id}
          {replyTo}
          onCancelReplyTo={clearReplyTo}
        />
      </div>
    {:else if !data.isLoggedIn}
      <div class="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 p-6 text-center">
        <p class="text-slate-600 dark:text-slate-400 mb-3">
          Sign in to join the discussion
        </p>
        <a
          href="/auth"
          class="inline-flex items-center px-4 py-2 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-warm transition-colors"
        >
          Log In
        </a>
      </div>
    {:else if topic.is_locked}
      <div class="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 text-center">
        <div class="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span class="text-sm">This topic is locked. No new replies can be posted.</span>
        </div>
      </div>
    {/if}
  </Container>
</div>
