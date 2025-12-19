<script lang="ts">
  import type { Peak } from '$lib/types/database';

  interface Props {
    peak: Peak;
    class?: string;
  }

  let { peak, class: className = '' }: Props = $props();
</script>

<div class="relative h-48 sm:h-64 lg:h-80 {className}">
  {#if peak.hero_image_url}
    <img src={peak.hero_image_url} alt={peak.name} class="h-full w-full object-cover" />
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
  {:else}
    <div class="h-full w-full peak-gradient">
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <svg
          class="h-24 w-24 text-white/20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M12 2L2 22h20L12 2z"
          />
        </svg>
      </div>
    </div>
  {/if}
</div>
