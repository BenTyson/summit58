<script lang="ts">
  interface Props {
    icon: string;
    class?: string;
  }

  let { icon, class: className = 'h-5 w-5' }: Props = $props();
</script>

{#if icon === 'mountain'}
  <svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L2 22h20L12 2z" />
  </svg>
{:else if icon === 'compass'}
  <svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke-width="2" />
    <polygon fill="currentColor" points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
  </svg>
{:else if icon === 'backpack'}
  <svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3h6v3H9V3zM4 8h16v13H4V8z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8V6M15 8V6M8 14h8M8 17h5" />
  </svg>
{:else if icon === 'message-circle'}
  <svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
{:else if icon === 'shield-alert'}
  <svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round" />
    <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round" />
  </svg>
{:else if icon === 'camera'}
  <svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" stroke-width="2" />
  </svg>
{:else}
  <svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
{/if}
