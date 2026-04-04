<script lang="ts">
  import Skeleton from '$lib/components/ui/Skeleton.svelte';
</script>

<div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-card">
  <div class="p-4 sm:p-5">
    <!-- Author row -->
    <div class="flex items-center gap-2.5 mb-3">
      <Skeleton class="!rounded-full flex-shrink-0" width="28px" height="28px" />
      <Skeleton width="100px" height="0.75rem" />
    </div>

    <!-- Title -->
    <Skeleton width="75%" height="1.25rem" class="mb-2" />

    <!-- Body preview -->
    <Skeleton width="100%" height="0.75rem" class="mb-1.5" />
    <Skeleton width="60%" height="0.75rem" />

    <!-- Stats row -->
    <div class="mt-3 flex items-center gap-4">
      <Skeleton width="40px" height="0.75rem" />
      <Skeleton width="40px" height="0.75rem" />
      <Skeleton width="40px" height="0.75rem" />
    </div>
  </div>
</div>
