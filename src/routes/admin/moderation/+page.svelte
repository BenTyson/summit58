<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const flaggedImages = $derived(data.flaggedImages);
  const pendingFlags = $derived(data.pendingFlags);
  const recentPhotos = $derived(data.recentPhotos);
  const resolvedFlags = $derived(data.resolvedFlags);

  let showResolved = $state(false);
</script>

<svelte:head>
  <title>Moderation | Admin | SaltGoat</title>
</svelte:head>

<!-- Flagged Photos -->
<section class="mb-10">
  <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
    <svg class="h-5 w-5 text-semantic-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
    Flagged Photos
    {#if flaggedImages.length > 0}
      <span class="px-2 py-0.5 rounded-full bg-semantic-danger/10 dark:bg-semantic-danger/20 text-semantic-danger-dark dark:text-semantic-danger-light text-sm">
        {flaggedImages.length}
      </span>
    {/if}
  </h2>

  {#if flaggedImages.length === 0}
    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
      <p class="text-slate-500 dark:text-slate-400">No flagged photos to review.</p>
    </div>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each flaggedImages as image}
        <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-card">
          <div class="aspect-video">
            <img
              src={image.url}
              alt={image.caption || 'Flagged photo'}
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <a href="/peaks/{image.peak.slug}" class="text-sm font-medium text-accent hover:text-accent-warm transition-colors">
                {image.peak.name}
              </a>
              <span class="text-xs px-2 py-0.5 rounded-full bg-semantic-danger/10 dark:bg-semantic-danger/20 text-semantic-danger-dark dark:text-semantic-danger-light">
                {image.flag_count} {image.flag_count === 1 ? 'flag' : 'flags'}
              </span>
            </div>
            {#if image.uploader?.display_name}
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Uploaded by {image.uploader.display_name}
              </p>
            {/if}
            <div class="flex gap-2">
              <form method="POST" action="?/approveImage" use:enhance class="flex-1">
                <input type="hidden" name="image_id" value={image.id} />
                <button type="submit" class="w-full px-3 py-2 rounded-lg bg-semantic-success-dark text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  Approve
                </button>
              </form>
              <form method="POST" action="?/removeImage" use:enhance class="flex-1">
                <input type="hidden" name="image_id" value={image.id} />
                <button type="submit" class="w-full px-3 py-2 rounded-lg bg-semantic-danger-dark text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  Remove
                </button>
              </form>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>

<!-- Pending Content Flags -->
<section class="mb-10">
  <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
    <svg class="h-5 w-5 text-semantic-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
    Pending Content Flags
    {#if pendingFlags.length > 0}
      <span class="px-2 py-0.5 rounded-full bg-semantic-warning/10 dark:bg-semantic-warning/20 text-semantic-warning-dark dark:text-semantic-warning-light text-sm">
        {pendingFlags.length}
      </span>
    {/if}
  </h2>

  {#if pendingFlags.length === 0}
    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
      <p class="text-slate-500 dark:text-slate-400">No pending flags to review.</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each pendingFlags as flag}
        <div class="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {flag.content_type}
              </span>
              <span class="text-sm font-medium text-slate-900 dark:text-white capitalize">
                {flag.reason}
              </span>
            </div>
            {#if flag.details}
              <p class="text-sm text-slate-600 dark:text-slate-400 truncate">{flag.details}</p>
            {/if}
            <p class="text-xs text-slate-400 mt-1">
              Reported by {flag.reporter_name || 'Unknown'}
              {#if flag.created_at} on {new Date(flag.created_at).toLocaleDateString()}{/if}
            </p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <form method="POST" action="?/resolveFlag" use:enhance>
              <input type="hidden" name="flag_id" value={flag.id} />
              <input type="hidden" name="action" value="dismissed" />
              <button type="submit" class="px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                Dismiss
              </button>
            </form>
            <form method="POST" action="?/resolveFlag" use:enhance>
              <input type="hidden" name="flag_id" value={flag.id} />
              <input type="hidden" name="action" value="actioned" />
              <button type="submit" class="px-3 py-1.5 rounded-lg text-sm bg-semantic-danger-dark text-white hover:opacity-90 transition-opacity">
                Action
              </button>
            </form>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>

<!-- Recent Uploads -->
<section class="mb-10">
  <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
    <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    Recent Uploads
  </h2>

  {#if recentPhotos.length === 0}
    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
      <p class="text-slate-500 dark:text-slate-400">No recent uploads.</p>
    </div>
  {:else}
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {#each recentPhotos as photo}
        <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-card">
          <div class="aspect-video relative">
            <img
              src={photo.url}
              alt={photo.caption || 'Recent upload'}
              class="w-full h-full object-cover"
              loading="lazy"
            />
            {#if photo.status}
              <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-medium
                {photo.status === 'approved' ? 'bg-semantic-success/90 text-white' :
                 photo.status === 'flagged' ? 'bg-semantic-danger/90 text-white' :
                 photo.status === 'removed' ? 'bg-slate-500/90 text-white' : 'bg-slate-100 text-slate-600'}
              ">
                {photo.status}
              </span>
            {/if}
          </div>
          <div class="p-3">
            <a href="/peaks/{photo.peak_slug}" class="text-xs font-medium text-accent hover:text-accent-warm transition-colors">
              {photo.peak_name}
            </a>
            <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              {photo.uploader_name ?? 'Unknown'} &middot; {photo.created_at ? new Date(photo.created_at).toLocaleDateString() : ''}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>

<!-- Resolved Flags -->
<section>
  <button
    onclick={() => showResolved = !showResolved}
    class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 hover:text-accent transition-colors"
  >
    <svg class="h-5 w-5 text-slate-400 transition-transform {showResolved ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
    Resolved Flags
    <span class="text-sm font-normal text-slate-400">({resolvedFlags.length})</span>
  </button>

  {#if showResolved}
    {#if resolvedFlags.length === 0}
      <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
        <p class="text-slate-500 dark:text-slate-400">No resolved flags yet.</p>
      </div>
    {:else}
      <div class="space-y-2">
        {#each resolvedFlags as flag}
          <div class="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  {flag.content_type}
                </span>
                <span class="text-xs text-slate-600 dark:text-slate-400 capitalize">{flag.reason}</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] font-medium
                  {flag.status === 'dismissed' ? 'bg-slate-100 dark:bg-slate-700 text-slate-500' : 'bg-semantic-danger/10 text-semantic-danger-dark dark:text-semantic-danger-light'}
                ">
                  {flag.status}
                </span>
              </div>
              {#if flag.details}
                <p class="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{flag.details}</p>
              {/if}
            </div>
            <span class="text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0">
              {flag.created_at ? new Date(flag.created_at).toLocaleDateString() : ''}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</section>
