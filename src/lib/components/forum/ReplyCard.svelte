<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ForumReplyWithAuthor, ForumReactionData } from '$lib/server/forum';
  import { renderMarkdown } from '$lib/utils/markdown';
  import { formatRelativeTime } from '$lib/utils/time';
  import ForumAuthorInfo from './ForumAuthorInfo.svelte';
  import ForumReactions from './ForumReactions.svelte';
  import QuoteBlock from './QuoteBlock.svelte';

  interface Props {
    reply: ForumReplyWithAuthor;
    reactions: ForumReactionData;
    isLoggedIn: boolean;
    currentUserId?: string | null;
    onReplyTo?: (reply: ForumReplyWithAuthor) => void;
    class?: string;
  }

  let { reply, reactions, isLoggedIn, currentUserId = null, onReplyTo, class: className = '' }: Props = $props();

  const renderedBody = $derived(renderMarkdown(reply.body));
  const isOwn = $derived(currentUserId === reply.author_id);

  const createdDate = $derived(new Date(reply.created_at));
  const editWindowOpen = $derived(
    isOwn && (Date.now() - createdDate.getTime()) < 30 * 60 * 1000
  );

  let editing = $state(false);
  let editBody = $state('');
  let editSubmitting = $state(false);

  function startEdit() {
    editBody = reply.body;
    editing = true;
  }

  function cancelEdit() {
    editing = false;
  }

  const editCanSubmit = $derived(
    editBody.trim().length >= 1 && editBody.length <= 5000 && !editSubmitting
  );

</script>

<div id="reply-{reply.id}" class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-card {className}">
  <div class="p-4 sm:p-5">
    <!-- Header: author + time -->
    <div class="flex items-center justify-between gap-3 mb-3">
      <ForumAuthorInfo author={reply.author} size="sm" />
      <span class="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
        {formatRelativeTime(reply.created_at)}
        {#if reply.updated_at !== reply.created_at}
          <span class="italic">(edited)</span>
        {/if}
      </span>
    </div>

    <!-- Quoted reply -->
    {#if reply.quoted_reply && !editing}
      <QuoteBlock
        authorName={reply.quoted_reply.author.display_name}
        body={reply.quoted_reply.body}
        replyId={reply.quoted_reply.id}
      />
    {/if}

    <!-- Body -->
    {#if editing}
      <form
        method="POST"
        action="?/updateReply"
        use:enhance={() => {
          editSubmitting = true;
          return async ({ update }) => {
            await update();
            editSubmitting = false;
            editing = false;
          };
        }}
      >
        <input type="hidden" name="reply_id" value={reply.id} />
        <textarea
          name="body"
          bind:value={editBody}
          rows="4"
          maxlength="5000"
          class="
            w-full rounded-lg border border-slate-200 dark:border-slate-600
            bg-white dark:bg-slate-900/50
            text-slate-900 dark:text-white
            px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
            resize-y min-h-[80px]
            transition-colors
          "
        ></textarea>
        <div class="mt-1 text-xs text-slate-400 dark:text-slate-500 text-right">
          {editBody.length.toLocaleString()} / 5,000
        </div>
        <div class="mt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onclick={cancelEdit}
            class="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!editCanSubmit}
            class="
              px-3 py-1.5 rounded-lg text-xs font-medium transition-all
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
      <div class="prose prose-sm prose-slate dark:prose-invert max-w-none [&_a]:text-accent [&_a:hover]:text-accent-warm">
        {@html renderedBody}
      </div>
    {/if}

    <!-- Footer: reactions + actions -->
    {#if !editing}
      <div class="mt-4 flex items-center justify-between gap-3">
        <ForumReactions
          postType="reply"
          postId={reply.id}
          {reactions}
          {isLoggedIn}
        />

        <div class="flex items-center gap-2">
          {#if isLoggedIn && onReplyTo}
            <button
              type="button"
              onclick={() => onReplyTo?.(reply)}
              class="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-accent dark:text-slate-500 dark:hover:text-accent-light transition-colors"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>
          {/if}

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
            <form method="POST" action="?/deleteReply" class="inline">
              <input type="hidden" name="reply_id" value={reply.id} />
              <button
                type="submit"
                class="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-semantic-danger dark:text-slate-500 dark:hover:text-semantic-danger-light transition-colors"
                onclick={(e) => { if (!confirm('Delete this reply?')) e.preventDefault(); }}
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
  </div>
</div>
