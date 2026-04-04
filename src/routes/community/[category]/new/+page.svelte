<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import ForumBreadcrumb from '$lib/components/forum/ForumBreadcrumb.svelte';
  import TopicComposer from '$lib/components/forum/TopicComposer.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>New Topic | {data.category.name} | SaltGoat Community</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
  <Container class="py-8 sm:py-10" size="default">
    <!-- Breadcrumb -->
    <ForumBreadcrumb crumbs={[
      { label: data.category.name, href: `/community/${data.category.slug}` },
      { label: 'New Topic' }
    ]} />

    <!-- Header -->
    <div class="mt-6 mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
        New Topic
      </h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400 text-sm">
        Posting in <span class="font-medium text-slate-700 dark:text-slate-300">{data.category.name}</span>
      </p>
    </div>

    <!-- Composer -->
    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-card p-5 sm:p-6">
      <TopicComposer
        category={data.category}
        peaks={data.peaks}
        preselectedPeakSlug={data.preselectedPeakSlug}
      />
    </div>
  </Container>
</div>
