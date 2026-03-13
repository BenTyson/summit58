<script lang="ts">
  import '../app.css';
  import { browser } from '$app/environment';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import ReloadPrompt from '$lib/components/pwa/ReloadPrompt.svelte';
  import type { LayoutData } from './$types';

  const ADMIN_USER_ID = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0';

  interface Props {
    children: import('svelte').Snippet;
    data: LayoutData;
  }

  let { children, data }: Props = $props();

  const isAdmin = $derived(data.session?.user?.id === ADMIN_USER_ID);
</script>

<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-sunrise focus:text-white focus:rounded-lg focus:font-medium"
>
  Skip to main content
</a>

<div class="flex min-h-screen flex-col">
  <Header session={data.session} profile={data.profile} peaks={data.peaks} {isAdmin} />
  <main id="main-content" class="flex-1">
    {@render children()}
  </main>
  <Footer />
</div>

{#if browser}
  <ReloadPrompt />
{/if}
