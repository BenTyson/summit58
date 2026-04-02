<script lang="ts">
  interface Props {
    summary: string;
  }

  let { summary }: Props = $props();
</script>

{#if summary}
  <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 p-6">
    <p class="font-serif text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      {summary}
    </p>
  </div>
{/if}
