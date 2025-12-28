<script lang="ts">
  import '../app.css';
  import { browser } from '$app/environment';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import ReloadPrompt from '$lib/components/pwa/ReloadPrompt.svelte';
  import type { LayoutData } from './$types';

  interface Props {
    children: import('svelte').Snippet;
    data: LayoutData;
  }

  let { children, data }: Props = $props();
</script>

<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-sunrise focus:text-white focus:rounded-lg focus:font-medium"
>
  Skip to main content
</a>

<div class="flex min-h-screen flex-col">
  <Header session={data.session} profile={data.profile} peaks={data.peaks} />
  <main id="main-content" class="flex-1">
    {@render children()}
  </main>
  <Footer />
</div>

{#if browser}
  <ReloadPrompt />
{/if}
