<script lang="ts">
  import { browser } from '$app/environment';

  interface Props {
    url: string;
    title: string;
    text?: string;
    class?: string;
  }

  let { url, title, text = '', class: className = '' }: Props = $props();

  let copied = $state(false);

  async function handleShare() {
    if (browser && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User cancelled or share failed -- fall through to clipboard
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // Clipboard API not available
    }
  }
</script>

<button
  type="button"
  onclick={handleShare}
  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors {className}"
  title="Share"
>
  {#if copied}
    <svg class="w-4 h-4 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    <span class="text-semantic-success">Copied!</span>
  {:else}
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
    <span class="hidden sm:inline">Share</span>
  {/if}
</button>
