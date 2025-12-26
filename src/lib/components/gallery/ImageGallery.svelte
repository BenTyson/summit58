<script lang="ts">
  import Lightbox from './Lightbox.svelte';
  import type { PeakImage } from '$lib/server/images';

  interface Props {
    images: PeakImage[];
    getImageUrl: (path: string) => string;
  }

  let { images, getImageUrl }: Props = $props();

  let lightboxOpen = $state(false);
  let currentIndex = $state(0);

  function openLightbox(index: number) {
    currentIndex = index;
    lightboxOpen = true;
  }

  function closeLightbox() {
    lightboxOpen = false;
  }

  function navigateLightbox(index: number) {
    currentIndex = index;
  }
</script>

{#if images.length > 0}
  <section class="mt-10 animate-fade-in-up" style="animation-delay: 250ms">
    <!-- Section Header -->
    <div class="flex items-center gap-3 mb-6">
      <h2 class="heading-section text-slate-900 dark:text-white flex items-center gap-2">
        <svg class="h-6 w-6 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Photos
      </h2>
      <span class="text-sm text-slate-500 dark:text-slate-400">
        {images.length} {images.length === 1 ? 'photo' : 'photos'}
      </span>
    </div>

    <!-- Image Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {#each images as image, i}
        <button
          onclick={() => openLightbox(i)}
          class="
            group relative aspect-square rounded-xl overflow-hidden
            bg-slate-100 dark:bg-slate-800
            hover:ring-2 hover:ring-sunrise hover:ring-offset-2 dark:hover:ring-offset-slate-900
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-sunrise focus:ring-offset-2
          "
        >
          <img
            src={getImageUrl(image.storage_path)}
            alt={image.caption || 'Peak photo'}
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <!-- Hover overlay with caption -->
          {#if image.caption}
            <div class="
              absolute inset-x-0 bottom-0 p-3
              bg-gradient-to-t from-black/70 to-transparent
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
            ">
              <p class="text-white text-sm line-clamp-2">{image.caption}</p>
            </div>
          {/if}

          <!-- Expand icon -->
          <div class="
            absolute top-2 right-2
            p-1.5 rounded-full bg-black/30
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
          ">
            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
        </button>
      {/each}
    </div>
  </section>

  <!-- Lightbox -->
  {#if lightboxOpen}
    <Lightbox
      {images}
      {currentIndex}
      {getImageUrl}
      onClose={closeLightbox}
      onNavigate={navigateLightbox}
    />
  {/if}
{/if}
