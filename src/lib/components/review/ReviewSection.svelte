<script lang="ts">
  import StarRating from './StarRating.svelte';
  import ReviewCard from './ReviewCard.svelte';
  import ReviewForm from './ReviewForm.svelte';
  import type { ReviewFormData } from './ReviewForm.svelte';
  import type { ReviewWithProfile, UserReview } from '$lib/server/reviews';

  interface Props {
    peakId: string;
    reviews: ReviewWithProfile[];
    userReview: UserReview | null;
    isLoggedIn: boolean;
    avgRating: number;
    totalReviews: number;
    currentUserId?: string;
    onSubmit: (data: ReviewFormData) => Promise<void>;
    onUpdate: (reviewId: string, data: ReviewFormData) => Promise<void>;
    onDelete: (reviewId: string) => Promise<void>;
  }

  let {
    peakId,
    reviews,
    userReview,
    isLoggedIn,
    avgRating,
    totalReviews,
    currentUserId,
    onSubmit,
    onUpdate,
    onDelete
  }: Props = $props();

  let editingReview = $state<UserReview | null>(null);
  let sortBy = $state<'newest' | 'highest' | 'lowest'>('newest');

  const sortedReviews = $derived(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'newest':
      default:
        return sorted.sort((a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
    }
  });

  async function handleSubmit(data: ReviewFormData) {
    await onSubmit(data);
  }

  async function handleUpdate(data: ReviewFormData) {
    if (editingReview) {
      await onUpdate(editingReview.id, data);
      editingReview = null;
    }
  }

  async function handleDelete(reviewId: string) {
    if (confirm('Are you sure you want to delete your review?')) {
      await onDelete(reviewId);
    }
  }

  function startEditing(review: UserReview) {
    editingReview = review;
  }

  function cancelEditing() {
    editingReview = null;
  }
</script>

<section class="mt-10 animate-fade-in-up" style="animation-delay: 300ms">
  <!-- Section Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div class="flex items-center gap-3">
      <h2 class="heading-section text-slate-900 dark:text-white flex items-center gap-2">
        <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        Reviews
      </h2>

      {#if totalReviews > 0}
        <div class="flex items-center gap-2">
          <StarRating rating={avgRating} size="sm" />
          <span class="text-sm text-slate-600 dark:text-slate-400">
            {avgRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      {/if}
    </div>

    {#if totalReviews > 1}
      <select
        bind:value={sortBy}
        class="
          rounded-lg border border-slate-300 dark:border-slate-600
          bg-white dark:bg-slate-700
          px-3 py-1.5 text-sm
          text-slate-900 dark:text-white
          focus:border-sunrise focus:ring-2 focus:ring-sunrise/20
        "
      >
        <option value="newest">Newest first</option>
        <option value="highest">Highest rated</option>
        <option value="lowest">Lowest rated</option>
      </select>
    {/if}
  </div>

  <!-- Write Review Section -->
  {#if isLoggedIn}
    {#if editingReview}
      <!-- Editing existing review -->
      <div class="mb-6">
        <ReviewForm
          existingReview={editingReview}
          onSubmit={handleUpdate}
          onCancel={cancelEditing}
        />
      </div>
    {:else if !userReview}
      <!-- New review form -->
      <div class="mb-6">
        <ReviewForm onSubmit={handleSubmit} />
      </div>
    {/if}
  {:else}
    <!-- Login prompt -->
    <div class="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 text-center">
      <p class="text-slate-600 dark:text-slate-400 mb-3">
        Share your experience with other hikers
      </p>
      <a
        href="/auth"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sunrise text-white font-medium hover:bg-sunrise-coral transition-colors"
      >
        Log in to write a review
      </a>
    </div>
  {/if}

  <!-- Reviews List -->
  {#if reviews.length > 0}
    <div class="space-y-4">
      {#each sortedReviews() as review}
        {@const isOwner = currentUserId === review.user_id}
        <ReviewCard
          {review}
          {isOwner}
          onEdit={isOwner && !editingReview ? () => startEditing(review) : undefined}
          onDelete={isOwner ? () => handleDelete(review.id) : undefined}
        />
      {/each}
    </div>
  {:else if !isLoggedIn || userReview}
    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
      <div class="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
        <svg class="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <p class="text-slate-600 dark:text-slate-400">No reviews yet. Be the first to share your experience!</p>
    </div>
  {/if}
</section>
