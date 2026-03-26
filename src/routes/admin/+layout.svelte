<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import AdminTabs from '$lib/components/admin/AdminTabs.svelte';
  import type { LayoutData } from './$types';

  interface Props {
    children: import('svelte').Snippet;
    data: LayoutData;
  }

  let { children, data }: Props = $props();

  const tabs = $derived([
    { id: 'overview', label: 'Overview', href: '/admin' },
    { id: 'moderation', label: 'Moderation', href: '/admin/moderation', count: data.moderationCount },
    { id: 'users', label: 'Users', href: '/admin/users' },
    { id: 'content', label: 'Content', href: '/admin/content' },
    { id: 'subscriptions', label: 'Subscriptions', href: '/admin/subscriptions' }
  ]);
</script>

<svelte:head>
  <title>Admin | SaltGoat</title>
</svelte:head>

<Container size="wide" class="py-8">
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-slate-900 dark:text-white font-display">Admin Dashboard</h1>
    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Platform management and moderation</p>
  </div>

  <AdminTabs {tabs} />

  <div class="mt-6">
    {@render children()}
  </div>
</Container>
