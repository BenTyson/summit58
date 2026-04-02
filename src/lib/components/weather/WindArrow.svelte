<script lang="ts">
  import { degreesToCardinal } from '$lib/utils/weather';

  interface Props {
    degrees: number;
    class?: string;
    showLabel?: boolean;
  }

  let { degrees, class: className = 'h-4 w-4', showLabel = false }: Props = $props();
</script>

<span class="inline-flex items-center gap-1">
  <svg
    class="{className} text-slate-500 dark:text-slate-400"
    viewBox="0 0 16 16"
    fill="currentColor"
    style="transform: rotate({degrees}deg)"
  >
    <path d="M8 2l3.5 6H10v6H6V8H4.5L8 2z" />
  </svg>
  {#if showLabel}
    <span class="text-xs text-slate-500 dark:text-slate-400">{degreesToCardinal(degrees)}</span>
  {/if}
</span>
