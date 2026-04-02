<script lang="ts">
  import { weatherCodeToIcon, weatherCodeToDescription } from '$lib/utils/weather';

  interface Props {
    code: number;
    class?: string;
  }

  let { code, class: className = 'h-6 w-6' }: Props = $props();

  const icon = $derived(weatherCodeToIcon(code));
  const description = $derived(weatherCodeToDescription(code));
</script>

{#if icon === 'sun'}
  <svg class="{className} text-accent" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label={description}>
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
{:else if icon === 'cloud-sun'}
  <svg class="{className} text-semantic-warning" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label={description}>
    <path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
    <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" opacity="0.5" />
  </svg>
{:else if icon === 'cloud'}
  <svg class="{className} text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label={description}>
    <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
  </svg>
{:else if icon === 'fog'}
  <svg class="{className} text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-label={description}>
    <path stroke-linecap="round" stroke-width="2" d="M3 13h18M5 17h14M7 9h10M4 21h16" />
  </svg>
{:else if icon === 'cloud-drizzle'}
  <svg class="{className} text-blue-400" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label={description}>
    <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
    <path d="M9 18v2M12 17v2M15 18v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" />
  </svg>
{:else if icon === 'cloud-rain'}
  <svg class="{className} text-blue-500" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label={description}>
    <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
    <path d="M8 17v3M12 17v3M16 17v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
  </svg>
{:else if icon === 'cloud-sleet'}
  <svg class="{className} text-sky-500" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label={description}>
    <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
    <path d="M9 17v2M12 18v2M15 17v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
    <circle cx="9" cy="21" r="0.75" fill="currentColor" />
    <circle cx="15" cy="21" r="0.75" fill="currentColor" />
  </svg>
{:else if icon === 'snowflake'}
  <svg class="{className} text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-label={description}>
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v18M7.5 5.5l9 13M16.5 5.5l-9 13M3 12h18M5.5 7.5l13 9M5.5 16.5l13-9" />
  </svg>
{:else if icon === 'cloud-lightning'}
  <svg class="{className} text-semantic-warning-light" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label={description}>
    <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
    <path d="M13 12l-2 4h3l-2 4" stroke="#B09860" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  </svg>
{:else}
  <svg class="{className} text-slate-400" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label={description}>
    <path fill-rule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clip-rule="evenodd" />
  </svg>
{/if}
