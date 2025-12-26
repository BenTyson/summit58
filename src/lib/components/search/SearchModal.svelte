<script lang="ts">
  import type { Tables } from '$lib/types/database';

  type Peak = Tables<'peaks'>;

  interface Props {
    peaks: Peak[];
    open: boolean;
    onClose: () => void;
  }

  let { peaks, open, onClose }: Props = $props();

  let query = $state('');
  let selectedIndex = $state(0);
  let inputRef: HTMLInputElement;

  const filteredPeaks = $derived(() => {
    if (!query.trim()) return peaks.slice(0, 8);
    const q = query.toLowerCase();
    return peaks
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.range?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  });

  function handleKeydown(e: KeyboardEvent) {
    const results = filteredPeaks();
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          navigateToPeak(results[selectedIndex].slug);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  }

  function navigateToPeak(slug: string) {
    window.location.href = `/peaks/${slug}`;
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function getDifficultyClass(peak: Peak): number {
    // Use standard route difficulty if available in the data
    return 1; // Default, would need routes joined to get actual class
  }

  $effect(() => {
    if (open && inputRef) {
      inputRef.focus();
      query = '';
      selectedIndex = 0;
    }
  });

  $effect(() => {
    // Reset selection when query changes
    selectedIndex = 0;
  });
</script>

<svelte:window onkeydown={(e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (open) {
      onClose();
    } else {
      // Parent handles opening
    }
  }
}} />

{#if open}
  <!-- Backdrop -->
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
    onclick={handleBackdropClick}
  >
    <!-- Modal -->
    <div
      class="
        mx-auto mt-[15vh] w-full max-w-xl
        rounded-2xl overflow-hidden
        bg-white dark:bg-slate-800
        shadow-2xl border border-slate-200 dark:border-slate-700
        animate-fade-in-up
      "
      role="dialog"
      aria-modal="true"
      aria-label="Search peaks"
    >
      <!-- Search Input -->
      <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <svg class="h-5 w-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          bind:this={inputRef}
          bind:value={query}
          onkeydown={handleKeydown}
          type="text"
          placeholder="Search peaks..."
          class="
            flex-1 bg-transparent text-lg
            text-slate-900 dark:text-white
            placeholder:text-slate-400
            focus:outline-none
          "
        />
        <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 dark:text-slate-400">
          ESC
        </kbd>
      </div>

      <!-- Results -->
      <div class="max-h-[60vh] overflow-y-auto py-2">
        {#if filteredPeaks().length === 0}
          <div class="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
            No peaks found for "{query}"
          </div>
        {:else}
          <div class="px-2">
            {#if !query.trim()}
              <div class="px-3 py-2 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Popular Peaks
              </div>
            {/if}
            {#each filteredPeaks() as peak, i}
              <button
                onclick={() => navigateToPeak(peak.slug)}
                onmouseenter={() => selectedIndex = i}
                class="
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-left transition-colors
                  {i === selectedIndex
                    ? 'bg-sunrise/10 text-sunrise'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                "
              >
                <!-- Peak icon -->
                <div class="
                  h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0
                  {i === selectedIndex
                    ? 'bg-sunrise/20'
                    : 'bg-slate-100 dark:bg-slate-700'}
                ">
                  <svg class="h-5 w-5 {i === selectedIndex ? 'text-sunrise' : 'text-slate-500 dark:text-slate-400'}" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
                  </svg>
                </div>

                <!-- Peak info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-medium truncate">{peak.name}</span>
                    <span class="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                      #{peak.rank}
                    </span>
                  </div>
                  <div class="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {peak.elevation.toLocaleString()}' · {peak.range}
                  </div>
                </div>

                <!-- Arrow -->
                {#if i === selectedIndex}
                  <svg class="h-4 w-4 text-sunrise flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div class="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">↑</kbd>
            <kbd class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">↓</kbd>
            navigate
          </span>
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">↵</kbd>
            select
          </span>
        </div>
        <a
          href="/peaks"
          onclick={onClose}
          class="text-xs text-sunrise hover:text-sunrise-coral transition-colors"
        >
          Browse all peaks →
        </a>
      </div>
    </div>
  </div>
{/if}
