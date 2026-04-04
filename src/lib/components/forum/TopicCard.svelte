<script lang="ts">
  import type { ForumTopicWithAuthor } from '$lib/server/forum';
  import ForumAuthorInfo from './ForumAuthorInfo.svelte';
  import PeakTag from './PeakTag.svelte';

  interface Props {
    topic: ForumTopicWithAuthor;
    categorySlug: string;
    isUnread?: boolean;
    class?: string;
  }

  let { topic, categorySlug, isUnread = false, class: className = '' }: Props = $props();

  const bodyPreview = $derived(
    topic.body.replace(/[#*`>\[\]!_~]/g, '').slice(0, 140) + (topic.body.length > 140 ? '...' : '')
  );

  function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
</script>

<a
  href="/community/{categorySlug}/{topic.slug}"
  class="
    group block rounded-xl
    border border-slate-200 bg-white
    shadow-card transition-all duration-300
    hover:-translate-y-0.5 hover:shadow-card-hover
    dark:border-slate-700 dark:bg-slate-800/90
    {className}
  "
>
  <div class="relative p-4 sm:p-5">
    {#if isUnread}
      <span class="absolute top-3 right-3 h-2 w-2 rounded-full bg-accent" aria-label="Unread"></span>
    {/if}
    <!-- Header: Author + Pinned badge -->
    <div class="flex items-center justify-between gap-3 mb-2.5">
      <ForumAuthorInfo author={topic.author} size="sm" />
      <div class="flex items-center gap-2 flex-shrink-0">
        {#if topic.is_pinned}
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent dark:bg-accent/20">
            <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            </svg>
            Pinned
          </span>
        {/if}
        {#if topic.is_locked}
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Locked
          </span>
        {/if}
      </div>
    </div>

    <!-- Title -->
    <h3 class="font-bold text-slate-900 dark:text-white group-hover:text-mountain-blue dark:group-hover:text-accent transition-colors line-clamp-2">
      {topic.title}
    </h3>

    <!-- Body preview -->
    <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
      {bodyPreview}
    </p>

    <!-- Tags + Stats -->
    <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      {#if topic.peak}
        <PeakTag peak={topic.peak} />
      {/if}

      <div class="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 ml-auto">
        <!-- Replies -->
        <span class="flex items-center gap-1">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {topic.reply_count}
        </span>

        <!-- Views -->
        <span class="flex items-center gap-1">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {topic.view_count}
        </span>

        <!-- Reactions -->
        {#if topic.reaction_count > 0}
          <span class="flex items-center gap-1">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {topic.reaction_count}
          </span>
        {/if}

        <!-- Time -->
        <span class="hidden sm:inline">
          {formatRelativeTime(topic.last_reply_at || topic.created_at)}
        </span>
      </div>
    </div>
  </div>
</a>
