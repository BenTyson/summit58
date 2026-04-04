<script lang="ts">
  import Skeleton from '$lib/components/ui/Skeleton.svelte';
</script>

<div class="rounded-xl border border-l-4 border-slate-200 dark:border-slate-700 border-l-slate-300 dark:border-l-slate-600 bg-white dark:bg-slate-800/90 shadow-card p-4 sm:p-5">
  <div class="flex items-start gap-4">
    <!-- Icon -->
    <Skeleton class="!rounded-xl flex-shrink-0" width="44px" height="44px" />

    <div class="flex-1 min-w-0">
      <!-- Name -->
      <Skeleton width="120px" height="1rem" class="mb-2" />
      <!-- Description -->
      <Skeleton width="85%" height="0.75rem" class="mb-1" />
      <Skeleton width="50%" height="0.75rem" />
      <!-- Topic count -->
      <Skeleton width="60px" height="0.625rem" class="mt-2" />
    </div>
  </div>
</div>
