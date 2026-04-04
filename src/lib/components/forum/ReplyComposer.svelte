<script lang="ts">
  import { enhance } from '$app/forms';
  import QuoteBlock from './QuoteBlock.svelte';

  interface Props {
    topicId: string;
    replyTo?: { id: string; authorName: string | null; body: string } | null;
    onCancelReplyTo?: () => void;
    class?: string;
  }

  let { topicId, replyTo = null, onCancelReplyTo, class: className = '' }: Props = $props();

  let body = $state('');
  let submitting = $state(false);
  const charCount = $derived(body.length);
  const canSubmit = $derived(body.trim().length >= 1 && body.length <= 5000 && !submitting);
</script>

<div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-card {className}">
  <form
    method="POST"
    action="?/createReply"
    use:enhance={() => {
      submitting = true;
      return async ({ update }) => {
        await update();
        submitting = false;
        body = '';
        onCancelReplyTo?.();
      };
    }}
  >
    <input type="hidden" name="topic_id" value={topicId} />
    {#if replyTo}
      <input type="hidden" name="reply_to_id" value={replyTo.id} />
    {/if}

    <div class="p-4">
      <!-- Quote context -->
      {#if replyTo}
        <div class="flex items-start justify-between gap-2 mb-3">
          <QuoteBlock authorName={replyTo.authorName} body={replyTo.body} class="flex-1" />
          <button
            type="button"
            onclick={() => onCancelReplyTo?.()}
            class="flex-shrink-0 p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Cancel reply"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/if}

      <!-- Textarea -->
      <textarea
        name="body"
        bind:value={body}
        placeholder="Write a reply... (Markdown supported)"
        rows="3"
        class="
          w-full rounded-lg border border-slate-200 dark:border-slate-600
          bg-slate-50 dark:bg-slate-900/50
          text-slate-900 dark:text-white
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
          resize-y min-h-[80px]
          transition-colors
        "
        maxlength="5000"
        onkeydown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canSubmit) {
            e.preventDefault();
            e.currentTarget.closest('form')?.requestSubmit();
          }
        }}
      ></textarea>

      <!-- Footer: char count + submit -->
      <div class="mt-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-xs text-slate-400 dark:text-slate-500 {charCount > 4500 ? 'text-semantic-warning' : ''}">
            {charCount.toLocaleString()} / 5,000
          </span>
          <span class="hidden sm:inline text-xs text-slate-300 dark:text-slate-600">Cmd+Enter to submit</span>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          class="
            inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
            text-sm font-medium transition-all
            {canSubmit
              ? 'bg-accent text-white hover:bg-accent-warm'
              : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'}
          "
        >
          {#if submitting}
            <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Posting...
          {:else}
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Reply
          {/if}
        </button>
      </div>
    </div>
  </form>
</div>
