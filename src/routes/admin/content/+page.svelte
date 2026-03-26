<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const types = [
    { id: 'photos', label: 'Photos' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'trail_reports', label: 'Trail Reports' },
    { id: 'traces', label: 'GPX Traces' }
  ];

  function setType(type: string) {
    const params = new URLSearchParams();
    params.set('type', type);
    goto(`/admin/content?${params.toString()}`, { replaceState: true });
  }

  function setStatus(status: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.delete('page');
    goto(`/admin/content?${params.toString()}`, { replaceState: true });
  }

  function goToPage(p: number) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', String(p));
    goto(`/admin/content?${params.toString()}`, { replaceState: true });
  }

  function stars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  const activeTotal = $derived(
    data.contentType === 'photos' ? data.photos.total :
    data.contentType === 'reviews' ? data.reviews.total :
    data.contentType === 'trail_reports' ? data.trailReports.total :
    data.traces.total
  );
</script>

<svelte:head>
  <title>Content | Admin | SaltGoat</title>
</svelte:head>

<!-- Content Type Filter -->
<div class="mb-6 flex flex-wrap items-center gap-2">
  {#each types as type}
    <button
      onclick={() => setType(type.id)}
      class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
        {data.contentType === type.id
          ? 'bg-accent text-mountain-blue-900 dark:text-white'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}
      "
    >
      {type.label}
    </button>
  {/each}

  {#if data.contentType === 'photos'}
    <span class="text-slate-300 dark:text-slate-600 mx-1">|</span>
    <select
      value={data.status}
      onchange={(e) => setStatus(e.currentTarget.value)}
      class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-accent/50"
    >
      <option value="">All statuses</option>
      <option value="approved">Approved</option>
      <option value="flagged">Flagged</option>
      <option value="removed">Removed</option>
    </select>
  {/if}

  <span class="text-sm text-slate-500 dark:text-slate-400 ml-auto">
    {activeTotal} {activeTotal === 1 ? 'item' : 'items'}
  </span>
</div>

<!-- Photos -->
{#if data.contentType === 'photos'}
  {#if data.photos.items.length === 0}
    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
      <p class="text-slate-500 dark:text-slate-400">No photos found.</p>
    </div>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.photos.items as photo}
        <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-card">
          <div class="aspect-video relative">
            <img src={photo.url} alt={photo.caption || 'Photo'} class="w-full h-full object-cover" loading="lazy" />
            <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-medium
              {photo.status === 'approved' ? 'bg-semantic-success/90 text-white' :
               photo.status === 'flagged' ? 'bg-semantic-danger/90 text-white' :
               'bg-slate-500/90 text-white'}
            ">
              {photo.status}
            </span>
            {#if photo.flag_count && photo.flag_count > 0}
              <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-semantic-danger/90 text-white">
                {photo.flag_count} flags
              </span>
            {/if}
          </div>
          <div class="p-3">
            <div class="flex items-center justify-between mb-1">
              <a href="/peaks/{photo.peak_slug}" class="text-xs font-medium text-accent hover:text-accent-warm transition-colors">{photo.peak_name}</a>
              {#if photo.category}
                <span class="text-[10px] text-slate-400 dark:text-slate-500">{photo.category}</span>
              {/if}
            </div>
            <p class="text-[11px] text-slate-400 dark:text-slate-500">
              {photo.uploader_name ?? 'Unknown'} &middot; {photo.created_at ? new Date(photo.created_at).toLocaleDateString() : ''}
            </p>
            {#if photo.status === 'flagged'}
              <div class="flex gap-2 mt-2">
                <form method="POST" action="?/approvePhoto" use:enhance class="flex-1">
                  <input type="hidden" name="image_id" value={photo.id} />
                  <button type="submit" class="w-full px-2 py-1 rounded text-xs font-medium bg-semantic-success-dark text-white hover:opacity-90 transition-opacity">Approve</button>
                </form>
                <form method="POST" action="?/removePhoto" use:enhance class="flex-1">
                  <input type="hidden" name="image_id" value={photo.id} />
                  <button type="submit" class="w-full px-2 py-1 rounded text-xs font-medium bg-semantic-danger-dark text-white hover:opacity-90 transition-opacity">Remove</button>
                </form>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/if}

<!-- Reviews -->
{#if data.contentType === 'reviews'}
  {#if data.reviews.items.length === 0}
    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
      <p class="text-slate-500 dark:text-slate-400">No reviews found.</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each data.reviews.items as review}
        <div class="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <a href="/peaks/{review.peak_slug}" class="text-sm font-medium text-accent hover:text-accent-warm transition-colors">{review.peak_name}</a>
              <span class="text-sm text-semantic-warning">{stars(review.rating)}</span>
            </div>
            {#if review.title}
              <p class="text-sm font-medium text-slate-900 dark:text-white">{review.title}</p>
            {/if}
            {#if review.body}
              <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{review.body}</p>
            {/if}
            <p class="text-xs text-slate-400 mt-1">
              {review.author_name ?? 'Unknown'} &middot; {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
            </p>
          </div>
          <form method="POST" action="?/deleteReview" use:enhance class="flex-shrink-0">
            <input type="hidden" name="review_id" value={review.id} />
            <button type="submit" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-semantic-danger-dark text-white hover:opacity-90 transition-opacity"
              onclick={(e) => { if (!confirm('Delete this review?')) e.preventDefault(); }}
            >
              Delete
            </button>
          </form>
        </div>
      {/each}
    </div>
  {/if}
{/if}

<!-- Trail Reports -->
{#if data.contentType === 'trail_reports'}
  {#if data.trailReports.items.length === 0}
    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
      <p class="text-slate-500 dark:text-slate-400">No trail reports found.</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each data.trailReports.items as report}
        <div class="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <a href="/peaks/{report.peak_slug}" class="text-sm font-medium text-accent hover:text-accent-warm transition-colors">{report.peak_name}</a>
              {#if report.trail_status}
                <span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{report.trail_status}</span>
              {/if}
              {#if report.crowd_level}
                <span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{report.crowd_level}</span>
              {/if}
            </div>
            {#if report.notes}
              <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{report.notes}</p>
            {/if}
            <p class="text-xs text-slate-400 mt-1">
              {report.author_name ?? 'Unknown'} &middot; Hiked {report.hike_date ? new Date(report.hike_date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <form method="POST" action="?/deleteTrailReport" use:enhance class="flex-shrink-0">
            <input type="hidden" name="report_id" value={report.id} />
            <button type="submit" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-semantic-danger-dark text-white hover:opacity-90 transition-opacity"
              onclick={(e) => { if (!confirm('Delete this trail report?')) e.preventDefault(); }}
            >
              Delete
            </button>
          </form>
        </div>
      {/each}
    </div>
  {/if}
{/if}

<!-- GPX Traces -->
{#if data.contentType === 'traces'}
  {#if data.traces.items.length === 0}
    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
      <p class="text-slate-500 dark:text-slate-400">No GPX traces found.</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each data.traces.items as trace}
        <div class="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-900 dark:text-white">{trace.route_name}</p>
            <div class="flex items-center gap-3 mt-1 text-xs text-slate-400 dark:text-slate-500">
              <span>{trace.uploader_name ?? 'Unknown'}</span>
              {#if trace.point_count}<span>{trace.point_count} pts</span>{/if}
              {#if trace.distance_miles}<span>{trace.distance_miles.toFixed(1)} mi</span>{/if}
              <span>{trace.vote_count ?? 0} votes</span>
              <span>{trace.created_at ? new Date(trace.created_at).toLocaleDateString() : ''}</span>
            </div>
          </div>
          <form method="POST" action="?/deleteTrace" use:enhance class="flex-shrink-0">
            <input type="hidden" name="trace_id" value={trace.id} />
            <button type="submit" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-semantic-danger-dark text-white hover:opacity-90 transition-opacity"
              onclick={(e) => { if (!confirm('Delete this GPX trace?')) e.preventDefault(); }}
            >
              Delete
            </button>
          </form>
        </div>
      {/each}
    </div>
  {/if}
{/if}

<!-- Pagination -->
{#if data.totalPages > 1}
  <div class="flex items-center justify-between mt-6">
    <p class="text-xs text-slate-500 dark:text-slate-400">
      Page {data.page} of {data.totalPages}
    </p>
    <div class="flex gap-1">
      <button
        onclick={() => goToPage(data.page - 1)}
        disabled={data.page <= 1}
        class="px-3 py-1.5 rounded text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Prev
      </button>
      <button
        onclick={() => goToPage(data.page + 1)}
        disabled={data.page >= data.totalPages}
        class="px-3 py-1.5 rounded text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  </div>
{/if}
