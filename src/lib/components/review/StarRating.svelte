<script lang="ts">
  interface Props {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onRate?: (rating: number) => void;
  }

  let {
    rating,
    maxRating = 5,
    size = 'md',
    interactive = false,
    onRate
  }: Props = $props();

  let hoverRating = $state(0);

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  function handleClick(star: number) {
    if (interactive && onRate) {
      onRate(star);
    }
  }

  function handleMouseEnter(star: number) {
    if (interactive) {
      hoverRating = star;
    }
  }

  function handleMouseLeave() {
    hoverRating = 0;
  }

  const displayRating = $derived(hoverRating || rating);
</script>

<div
  class="flex items-center gap-0.5"
  role={interactive ? 'radiogroup' : 'img'}
  aria-label={interactive ? 'Rate this peak' : `Rating: ${rating} out of ${maxRating} stars`}
  onmouseleave={handleMouseLeave}
>
  {#each Array(maxRating) as _, i}
    {@const starNum = i + 1}
    {@const filled = starNum <= displayRating}
    {@const halfFilled = !filled && starNum - 0.5 <= displayRating}

    {#if interactive}
      <button
        type="button"
        onclick={() => handleClick(starNum)}
        onmouseenter={() => handleMouseEnter(starNum)}
        class="
          {sizes[size]}
          transition-transform duration-150
          {interactive ? 'cursor-pointer hover:scale-110' : ''}
          {filled ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}
        "
        aria-label="Rate {starNum} star{starNum > 1 ? 's' : ''}"
      >
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    {:else}
      <span
        class="
          {sizes[size]}
          {filled ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}
        "
      >
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </span>
    {/if}
  {/each}
</div>
