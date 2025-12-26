<script lang="ts">
  interface Props {
    icon: string;
    earned?: boolean;
    class?: string;
  }

  let { icon, earned = true, class: className = '' }: Props = $props();
</script>

<svg
  class="w-5 h-5 {className}"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  {#if icon === 'mountain'}
    <!-- Single mountain peak -->
    <path d="M12 4L3 20h18L12 4z" class={earned ? 'fill-current opacity-20' : ''} />
    <path d="M12 4L3 20h18L12 4z" />
    <path d="M12 4l-4 8h8l-4-8" class="opacity-60" />
  {:else if icon === 'star'}
    <!-- 5-point star -->
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" class={earned ? 'fill-current opacity-30' : ''} />
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  {:else if icon === 'star-double'}
    <!-- Double star / sparkle -->
    <path d="M12 2l2.4 4.8 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8L12 2z" class={earned ? 'fill-current opacity-30' : ''} />
    <path d="M12 2l2.4 4.8 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8L12 2z" />
    <circle cx="19" cy="5" r="2" class={earned ? 'fill-current opacity-50' : ''} />
  {:else if icon === 'target'}
    <!-- Target / bullseye -->
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" class={earned ? 'fill-current' : ''} />
  {:else if icon === 'flame'}
    <!-- Flame -->
    <path d="M12 22c-4-2-7-5-7-9 0-3 2-5 4-7 .5 2 2 3 3 3s2-1 2-3c2 2 5 4 5 7 0 4-3 7-7 9z" class={earned ? 'fill-current opacity-30' : ''} />
    <path d="M12 22c-4-2-7-5-7-9 0-3 2-5 4-7 .5 2 2 3 3 3s2-1 2-3c2 2 5 4 5 7 0 4-3 7-7 9z" />
    <path d="M12 22c-2-1-3.5-2.5-3.5-5 0-1.5 1-2.5 2-3.5.25 1 1 1.5 1.5 1.5s1-.5 1-1.5c1 1 2.5 2 2.5 3.5 0 2.5-1.5 4-3.5 5z" class={earned ? 'fill-current opacity-60' : 'opacity-50'} />
  {:else if icon === 'crown'}
    <!-- Crown -->
    <path d="M2 17l3-9 4 4 3-6 3 6 4-4 3 9H2z" class={earned ? 'fill-current opacity-30' : ''} />
    <path d="M2 17l3-9 4 4 3-6 3 6 4-4 3 9H2z" />
    <path d="M2 17h20v4H2v-4z" class={earned ? 'fill-current opacity-30' : ''} />
    <path d="M2 17h20v4H2z" />
    <circle cx="5" cy="8" r="1" class={earned ? 'fill-current' : ''} />
    <circle cx="12" cy="6" r="1" class={earned ? 'fill-current' : ''} />
    <circle cx="19" cy="8" r="1" class={earned ? 'fill-current' : ''} />
  {:else if icon === 'mountain-range'}
    <!-- Mountain range (multiple peaks) -->
    <path d="M2 20L7 10l3 4 4-8 4 6 4-4 2 12H2z" class={earned ? 'fill-current opacity-20' : ''} />
    <path d="M2 20L7 10l3 4 4-8 4 6 4-4 2 12H2z" />
  {:else if icon === 'shield-1'}
    <!-- Shield with 1 -->
    <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6l-8-4z" class={earned ? 'fill-emerald-500/30' : ''} />
    <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6l-8-4z" />
    <text x="12" y="15" text-anchor="middle" font-size="8" font-weight="bold" class="fill-current" stroke="none">1</text>
  {:else if icon === 'shield-2'}
    <!-- Shield with 2 -->
    <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6l-8-4z" class={earned ? 'fill-blue-500/30' : ''} />
    <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6l-8-4z" />
    <text x="12" y="15" text-anchor="middle" font-size="8" font-weight="bold" class="fill-current" stroke="none">2</text>
  {:else if icon === 'shield-3'}
    <!-- Shield with 3 -->
    <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6l-8-4z" class={earned ? 'fill-amber-500/30' : ''} />
    <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6l-8-4z" />
    <text x="12" y="15" text-anchor="middle" font-size="8" font-weight="bold" class="fill-current" stroke="none">3</text>
  {:else if icon === 'shield-4'}
    <!-- Shield with 4 -->
    <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6l-8-4z" class={earned ? 'fill-rose-500/30' : ''} />
    <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6l-8-4z" />
    <text x="12" y="15" text-anchor="middle" font-size="8" font-weight="bold" class="fill-current" stroke="none">4</text>
  {:else if icon === 'pencil'}
    <!-- Pencil / write -->
    <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" class={earned ? 'fill-current opacity-20' : ''} />
    <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    <path d="M15 5l4 4" />
  {:else if icon === 'trail'}
    <!-- Trail / path -->
    <path d="M3 17h2l2-3 3 3 4-6 3 3 4-4" class={earned ? '' : ''} />
    <circle cx="3" cy="17" r="1.5" class={earned ? 'fill-current' : ''} />
    <circle cx="21" cy="10" r="1.5" class={earned ? 'fill-current' : ''} />
    <path d="M6 21c0-2 1-3 3-3s3 1 3 3" />
    <path d="M12 21c0-2 1-3 3-3s3 1 3 3" />
  {:else if icon === 'document'}
    <!-- Document / notes -->
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" class={earned ? 'fill-current opacity-20' : ''} />
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8M8 17h8M8 9h2" />
  {:else if icon === 'compass'}
    <!-- Compass -->
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" class={earned ? 'fill-current opacity-40' : ''} />
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
  {:else if icon === 'snowflake'}
    <!-- Snowflake -->
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
    <circle cx="12" cy="12" r="3" class={earned ? 'fill-current opacity-30' : ''} />
    <circle cx="12" cy="5" r="1" class={earned ? 'fill-current' : ''} />
    <circle cx="12" cy="19" r="1" class={earned ? 'fill-current' : ''} />
    <circle cx="5" cy="12" r="1" class={earned ? 'fill-current' : ''} />
    <circle cx="19" cy="12" r="1" class={earned ? 'fill-current' : ''} />
  {:else if icon === 'sun'}
    <!-- Sun -->
    <circle cx="12" cy="12" r="5" class={earned ? 'fill-current opacity-30' : ''} />
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
  {:else}
    <!-- Fallback: generic badge -->
    <circle cx="12" cy="12" r="10" class={earned ? 'fill-current opacity-20' : ''} />
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l2 2" />
  {/if}
</svg>
