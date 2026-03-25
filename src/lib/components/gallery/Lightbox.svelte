<script lang="ts">
  import type { PeakImageWithUploader } from '$lib/server/images';
  import type { PeakImage } from '$lib/server/images';

  interface Props {
    images: (PeakImageWithUploader | PeakImage | { url: string; caption: string | null })[];
    currentIndex: number;
    getImageUrl?: (path: string) => string;
    onClose: () => void;
    onNavigate: (index: number) => void;
    currentUserId?: string;
    onFlag?: (imageId: string, reason: string) => Promise<void>;
  }

  let {
    images,
    currentIndex,
    getImageUrl,
    onClose,
    onNavigate,
    currentUserId,
    onFlag
  }: Props = $props();

  const currentImage = $derived(images[currentIndex]);
  const hasPrev = $derived(currentIndex > 0);
  const hasNext = $derived(currentIndex < images.length - 1);

  // Helper to get image src — works with storage_path or direct url
  function getSrc(img: typeof currentImage): string {
    if ('url' in img && img.url) return img.url;
    if ('storage_path' in img && getImageUrl) return getImageUrl(img.storage_path);
    return '';
  }

  function getCaption(img: typeof currentImage): string | null {
    return img.caption || null;
  }

  function getCategory(img: typeof currentImage): string | null {
    if ('category' in img) return (img.category as string) || null;
    return null;
  }

  function getUploader(img: typeof currentImage): { id: string; display_name: string | null } | null {
    if ('uploader' in img) return img.uploader as { id: string; display_name: string | null } | null;
    return null;
  }

  function getImageId(img: typeof currentImage): string | null {
    if ('id' in img) return img.id as string;
    return null;
  }

  function getUploadedBy(img: typeof currentImage): string | null {
    if ('uploaded_by' in img) return img.uploaded_by as string;
    return null;
  }

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
      src={getSrc(currentImage)}
      alt={getCaption(currentImage) || 'Peak image'}
      class="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl animate-fade-in"
    />

    <!-- Caption + uploader -->
    <div class="mt-4 text-center max-w-xl px-4">
      {#if getCategory(currentImage)}
        <span class="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-white/80 text-xs font-medium mb-2">
          {getCategory(currentImage)}
        </span>
      {/if}
      {#if getCaption(currentImage)}
        <p class="text-white/90">{getCaption(currentImage)}</p>
      {/if}
      {#if getUploader(currentImage)?.display_name}
        <p class="text-white/60 text-sm mt-1">
          Photo by <a href="/users/{getUploadedBy(currentImage)}" class="text-accent hover:text-accent-warm">{getUploader(currentImage)?.display_name}</a>
        </p>
      {/if}
    </div>

    <!-- Flag button in lightbox -->
    {#if onFlag && currentUserId && getImageId(currentImage) && getUploadedBy(currentImage) !== currentUserId}
      <button
        onclick={() => {
          const id = getImageId(currentImage);
          if (id) onFlag(id, 'inappropriate');
        }}
        class="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/60 text-xs hover:bg-semantic-danger/30 hover:text-white transition-colors"
      >
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
        Report
      </button>
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
            src={getSrc(image)}
            alt=""
            class="w-full h-full object-cover"
          />
        </button>
      {/each}
    </div>
  {/if}
</div>
