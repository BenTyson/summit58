<script lang="ts">
  import { enhance } from '$app/forms';
  import { renderMarkdown } from '$lib/utils/markdown';
  import type { ForumCategory } from '$lib/server/forum';

  interface PeakOption {
    id: string;
    name: string;
    slug: string;
  }

  interface Props {
    category: ForumCategory;
    peaks: PeakOption[];
    preselectedPeakSlug?: string | null;
  }

  let { category, peaks, preselectedPeakSlug = null }: Props = $props();

  let title = $state('');
  let body = $state('');
  let selectedPeakId = $state<string>('');
  let showPreview = $state(false);
  let submitting = $state(false);
  let peakSearch = $state('');

  // Pre-select peak if provided via query param
  $effect(() => {
    if (preselectedPeakSlug && !selectedPeakId) {
      const found = peaks.find((p) => p.slug === preselectedPeakSlug);
      if (found) selectedPeakId = found.id;
    }
  });

  const titleCharCount = $derived(title.length);
  const bodyCharCount = $derived(body.length);
  const renderedPreview = $derived(showPreview ? renderMarkdown(body) : '');

  const canSubmit = $derived(
    title.trim().length >= 5 &&
    title.length <= 200 &&
    body.trim().length >= 10 &&
    body.length <= 10000 &&
    !submitting
  );

  const filteredPeaks = $derived(
    peakSearch.length >= 2
      ? peaks.filter((p) => p.name.toLowerCase().includes(peakSearch.toLowerCase())).slice(0, 10)
      : []
  );

  function selectPeak(peak: PeakOption) {
    selectedPeakId = peak.id;
    peakSearch = peak.name;
  }

  function clearPeak() {
    selectedPeakId = '';
    peakSearch = '';
  }
</script>

<form
  method="POST"
  action="?/createTopic"
  use:enhance={() => {
    submitting = true;
    return async ({ update }) => {
      await update();
      submitting = false;
    };
  }}
  class="space-y-5"
>
  <input type="hidden" name="category_id" value={category.id} />
  {#if selectedPeakId}
    <input type="hidden" name="peak_id" value={selectedPeakId} />
  {/if}

  <!-- Title -->
  <div>
    <label for="topic-title" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
      Title
    </label>
    <input
      id="topic-title"
      type="text"
      name="title"
      bind:value={title}
      placeholder="What's on your mind?"
      maxlength="200"
      class="
        w-full rounded-lg border border-slate-200 dark:border-slate-600
        bg-white dark:bg-slate-900/50
        text-slate-900 dark:text-white
        placeholder:text-slate-400 dark:placeholder:text-slate-500
        px-3 py-2.5 text-base font-medium
        focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
        transition-colors
      "
    />
    <div class="mt-1 flex justify-between text-xs text-slate-400 dark:text-slate-500">
      <span class={titleCharCount < 5 ? 'text-semantic-warning' : ''}>
        {titleCharCount < 5 ? `${5 - titleCharCount} more characters needed` : ''}
      </span>
      <span class={titleCharCount > 180 ? 'text-semantic-warning' : ''}>
        {titleCharCount} / 200
      </span>
    </div>
  </div>

  <!-- Peak picker -->
  <div>
    <label for="peak-search" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
      Link to a peak <span class="text-slate-400 dark:text-slate-500 font-normal">(optional)</span>
    </label>
    {#if selectedPeakId}
      <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-class-1/10 dark:bg-class-1/20 border border-class-1/20 dark:border-class-1/30">
        <svg class="h-4 w-4 text-class-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
        </svg>
        <span class="text-sm font-medium text-slate-900 dark:text-white flex-1">{peakSearch || peaks.find(p => p.id === selectedPeakId)?.name}</span>
        <button
          type="button"
          onclick={clearPeak}
          class="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="Remove peak"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    {:else}
      <div class="relative">
        <input
          id="peak-search"
          type="text"
          bind:value={peakSearch}
          placeholder="Search for a peak..."
          autocomplete="off"
          class="
            w-full rounded-lg border border-slate-200 dark:border-slate-600
            bg-white dark:bg-slate-900/50
            text-slate-900 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
            transition-colors
          "
        />
        {#if filteredPeaks.length > 0}
          <div class="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-card-elevated max-h-48 overflow-y-auto">
            {#each filteredPeaks as peak}
              <button
                type="button"
                onclick={() => selectPeak(peak)}
                class="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
              >
                <svg class="h-3.5 w-3.5 text-class-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
                </svg>
                {peak.name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Body with preview toggle -->
  <div>
    <div class="flex items-center justify-between mb-1.5">
      <label for="topic-body" class="text-sm font-medium text-slate-700 dark:text-slate-300">
        Body
      </label>
      <button
        type="button"
        onclick={() => showPreview = !showPreview}
        class="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent-light transition-colors"
      >
        {showPreview ? 'Edit' : 'Preview'}
      </button>
    </div>

    {#if showPreview}
      <div class="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2.5 min-h-[200px]">
        {#if renderedPreview}
          <div class="prose prose-sm prose-slate dark:prose-invert max-w-none [&_a]:text-accent [&_a:hover]:text-accent-warm">
            {@html renderedPreview}
          </div>
        {:else}
          <p class="text-sm text-slate-400 dark:text-slate-500 italic">Nothing to preview</p>
        {/if}
      </div>
    {:else}
      <textarea
        id="topic-body"
        name="body"
        bind:value={body}
        placeholder="Share your trip report, question, or discussion... (Markdown supported)"
        rows="10"
        maxlength="10000"
        class="
          w-full rounded-lg border border-slate-200 dark:border-slate-600
          bg-white dark:bg-slate-900/50
          text-slate-900 dark:text-white
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          px-3 py-2.5 text-sm
          focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
          resize-y min-h-[200px]
          transition-colors
        "
      ></textarea>
    {/if}

    <div class="mt-1 flex justify-between text-xs text-slate-400 dark:text-slate-500">
      <span>Markdown supported</span>
      <span class={bodyCharCount > 9000 ? 'text-semantic-warning' : ''}>
        {bodyCharCount.toLocaleString()} / 10,000
      </span>
    </div>
  </div>

  <!-- Submit -->
  <div class="flex items-center justify-end gap-3 pt-2">
    <a
      href="/community/{category.slug}"
      class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      Cancel
    </a>
    <button
      type="submit"
      disabled={!canSubmit}
      class="
        inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg
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
        Creating...
      {:else}
        Create Topic
      {/if}
    </button>
  </div>
</form>
