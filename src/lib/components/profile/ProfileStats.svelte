<script lang="ts">
  interface Stat {
    value: string | number;
    label: string;
    href?: string;
  }

  interface Props {
    stats: Stat[];
  }

  let { stats }: Props = $props();
</script>

<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700">
  {#each stats as stat}
    {#if stat.href}
      <a
        href={stat.href}
        class="group text-center p-3 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
      >
        <div class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-sunrise transition-colors">
          {stat.value}
        </div>
        <div class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {stat.label}
        </div>
      </a>
    {:else}
      <div class="text-center p-3">
        <div class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {stat.value}
        </div>
        <div class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {stat.label}
        </div>
      </div>
    {/if}
  {/each}
</div>
