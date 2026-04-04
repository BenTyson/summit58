<script lang="ts">
  import { enhance } from '$app/forms';
  import type { TopicDetail } from '$lib/server/forum';
  import type { ForumReactionData } from '$lib/server/forumReactions';
  import { renderMarkdown } from '$lib/utils/markdown';
  import ForumAuthorInfo from './ForumAuthorInfo.svelte';
  import PeakTag from './PeakTag.svelte';
  import ForumReactions from './ForumReactions.svelte';

  interface Props {
    topic: TopicDetail;
    reactions: ForumReactionData;
    isBookmarked: boolean;
    isLoggedIn: boolean;
    currentUserId?: string | null;
  }

  let { topic, reactions, isBookmarked, isLoggedIn, currentUserId = null }: Props = $props();

  const renderedBody = $derived(renderMarkdown(topic.body));
  const isOwn = $derived(currentUserId === topic.author_id);

  const createdDate = $derived(new Date(topic.created_at));
  const editWindowOpen = $derived(
    isOwn && topic.reply_count === 0 && (Date.now() - createdDate.getTime()) < 30 * 60 * 1000
  );

  let bookmarkSubmitting = $state(false);
  let editing = $state(false);
  let editTitle = $state('');
  let editBody = $state('');
  let editSubmitting = $state(false);

  function startEdit() {
    editTitle = topic.title;
    editBody = topic.body;
    editing = true;
  }

  function cancelEdit() {
    editing = false;
  }

  const editCanSubmit = $derived(
    editTitle.trim().length >= 5 &&
    editTitle.length <= 200 &&
    editBody.trim().length >= 10 &&
    editBody.length <= 10000 &&
    !editSubmitting
  );

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }
</script>

<article class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-card overflow-hidden">
  <!-- Header -->
  <div class="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-700/50">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <!-- Badges row -->
        <div class="flex flex-wrap items-center gap-2 mb-3">
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
          {#if topic.peak}
            <PeakTag peak={topic.peak} />
          {/if}
          {#if topic.route}
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-class-2/10 text-class-2 dark:bg-class-2/20">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {topic.route.name}
            </span>
          {/if}
        </div>

        {#if editing}
          <input
            type="text"
            bind:value={editTitle}
            class="
              w-full text-2xl sm:text-3xl font-bold
              rounded-lg border border-slate-200 dark:border-slate-600
              bg-white dark:bg-slate-900/50
              text-slate-900 dark:text-white
              px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
              transition-colors
            "
          />
        {:else}
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {topic.title}
          </h1>
        {/if}
      </div>

      <!-- Bookmark button -->
      {#if isLoggedIn && !editing}
        <form
          method="POST"
          action="?/toggleBookmark"
          use:enhance={() => {
            bookmarkSubmitting = true;
            return async ({ update }) => {
              await update();
              bookmarkSubmitting = false;
            };
          }}
        >
          <input type="hidden" name="topic_id" value={topic.id} />
          <button
            type="submit"
            disabled={bookmarkSubmitting}
            class="
              flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg
              transition-all duration-200
              {isBookmarked
                ? 'text-accent bg-accent/10 hover:bg-accent/20'
                : 'text-slate-400 hover:text-accent hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-700'}
            "
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this topic'}
          >
            <svg class="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </form>
      {/if}
    </div>

    <!-- Author + meta -->
    <div class="mt-4 flex flex-wrap items-center gap-4">
      <ForumAuthorInfo author={topic.author} />
      <div class="text-xs text-slate-400 dark:text-slate-500">
        {formatDate(topic.created_at)}
        {#if topic.updated_at !== topic.created_at}
          <span class="italic"> (edited)</span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Body -->
  <div class="p-5 sm:p-6">
    {#if editing}
      <form
        method="POST"
        action="?/updateTopic"
        use:enhance={() => {
          editSubmitting = true;
          return async ({ update }) => {
            await update();
            editSubmitting = false;
            editing = false;
          };
        }}
      >
        <input type="hidden" name="topic_id" value={topic.id} />
        <input type="hidden" name="title" value={editTitle} />
        <textarea
          name="body"
          bind:value={editBody}
          rows="10"
          maxlength="10000"
          class="
            w-full rounded-lg border border-slate-200 dark:border-slate-600
            bg-white dark:bg-slate-900/50
            text-slate-900 dark:text-white
            px-3 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
            resize-y min-h-[200px]
            transition-colors
          "
        ></textarea>
        <div class="mt-1 text-xs text-slate-400 dark:text-slate-500 text-right">
          {editBody.length.toLocaleString()} / 10,000
        </div>
        <div class="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onclick={cancelEdit}
            class="px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!editCanSubmit}
            class="
              px-4 py-1.5 rounded-lg text-sm font-medium transition-all
              {editCanSubmit
                ? 'bg-accent text-white hover:bg-accent-warm'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'}
            "
          >
            {editSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    {:else}
      <div class="prose prose-slate dark:prose-invert max-w-none [&_a]:text-accent [&_a:hover]:text-accent-warm [&_img]:rounded-lg">
        {@html renderedBody}
      </div>
    {/if}
  </div>

  <!-- Footer: reactions + stats + actions -->
  {#if !editing}
    <div class="px-5 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-3">
      <ForumReactions
        postType="topic"
        postId={topic.id}
        {reactions}
        {isLoggedIn}
      />

      <div class="flex items-center gap-4">
        <!-- Stats -->
        <div class="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span class="flex items-center gap-1">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {topic.reply_count} replies
          </span>
          <span class="flex items-center gap-1">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {topic.view_count} views
          </span>
        </div>

        <!-- Own actions -->
        {#if editWindowOpen}
          <button
            type="button"
            onclick={startEdit}
            class="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-accent dark:text-slate-500 dark:hover:text-accent-light transition-colors"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <form method="POST" action="?/deleteTopic" class="inline">
            <input type="hidden" name="topic_id" value={topic.id} />
            <button
              type="submit"
              class="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-semantic-danger dark:text-slate-500 dark:hover:text-semantic-danger-light transition-colors"
              onclick={(e) => { if (!confirm('Delete this topic and all its replies?')) e.preventDefault(); }}
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </form>
        {/if}
      </div>
    </div>
  {/if}
</article>
