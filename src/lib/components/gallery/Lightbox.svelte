<script lang="ts">
  import type { PeakImage } from '$lib/server/images';

  interface Props {
    images: PeakImage[];
    currentIndex: number;
    getImageUrl: (path: string) => string;
    onClose: () => void;
    onNavigate: (index: number) => void;
  }

  let {
    images,
    currentIndex,
    getImageUrl,
    onClose,
    onNavigate
  }: Props = $props();

  const currentImage = $derived(images[currentIndex]);
  const hasPrev = $derived(currentIndex > 0);
  const hasNext = $derived(currentIndex < images.length - 1);

  function handleKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (hasPrev) onNavigate(currentIndex - 1);
        break;
      case 'ArrowRight':
        if (hasNext) onNavigate(currentIndex + 1);
        break;
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
<div
  class="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-fade-in flex items-center justify-center"
  onclick={handleBackdropClick}
  role="dialog"
  aria-modal="true"
  aria-label="Image lightbox"
  tabindex="-1"
>
  <!-- Close button -->
  <button
    onclick={onClose}
    class="absolute top-4 right-4 z-10 rounded-full p-3 bg-white/10 text-white hover:bg-white/20 transition-colors"
    aria-label="Close lightbox"
  >
    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Counter -->
  <div class="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm">
    {currentIndex + 1} / {images.length}
  </div>

  <!-- Previous button -->
  {#if hasPrev}
    <button
      onclick={() => onNavigate(currentIndex - 1)}
      class="absolute left-4 z-10 rounded-full p-3 bg-white/10 text-white hover:bg-white/20 transition-colors"
      aria-label="Previous image"
    >
      <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  {/if}

  <!-- Next button -->
  {#if hasNext}
    <button
      onclick={() => onNavigate(currentIndex + 1)}
      class="absolute right-4 z-10 rounded-full p-3 bg-white/10 text-white hover:bg-white/20 transition-colors"
      aria-label="Next image"
    >
      <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  {/if}

  <!-- Image container -->
  <div class="max-w-[90vw] max-h-[85vh] flex flex-col items-center">
    <img
      src={getImageUrl(currentImage.storage_path)}
      alt={currentImage.caption || 'Peak image'}
      class="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl animate-fade-in"
    />

    <!-- Caption -->
    {#if currentImage.caption}
      <p class="mt-4 text-white/90 text-center max-w-xl px-4">
        {currentImage.caption}
      </p>
    {/if}
  </div>

  <!-- Thumbnail strip -->
  {#if images.length > 1}
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-white/10 rounded-full max-w-[90vw] overflow-x-auto">
      {#each images as image, i}
        <button
          onclick={() => onNavigate(i)}
          class="
            w-12 h-12 rounded-md overflow-hidden flex-shrink-0 transition-all
            {i === currentIndex ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'}
          "
          aria-label="Go to image {i + 1}"
        >
          <img
            src={getImageUrl(image.storage_path)}
            alt=""
            class="w-full h-full object-cover"
          />
        </button>
      {/each}
    </div>
  {/if}
</div>
