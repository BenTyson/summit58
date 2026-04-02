<script lang="ts">
  import type { HikerInsight } from '$lib/types/database';

  interface Props {
    insights: HikerInsight[];
    limit?: number;
  }

  let { insights, limit }: Props = $props();

  const displayed = $derived(limit ? insights.slice(0, limit) : insights);

  const severityStyles: Record<string, { border: string; bg: string; icon: string; text: string }> = {
    danger: {
      border: 'border-l-semantic-danger',
      bg: 'bg-semantic-danger/5 dark:bg-semantic-danger/10',
      icon: 'text-semantic-danger',
      text: 'text-semantic-danger'
    },
    warning: {
      border: 'border-l-semantic-warning',
      bg: 'bg-semantic-warning/5 dark:bg-semantic-warning/10',
      icon: 'text-semantic-warning',
      text: 'text-semantic-warning'
    },
    caution: {
      border: 'border-l-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/10',
      icon: 'text-amber-500',
      text: 'text-amber-600 dark:text-amber-400'
    },
    info: {
      border: 'border-l-class-1',
      bg: 'bg-class-1/5 dark:bg-class-1/10',
      icon: 'text-class-1',
      text: 'text-class-1'
    }
  };
</script>

{#if displayed.length > 0}
  <div class="space-y-3">
    {#each displayed as insight}
      {@const style = severityStyles[insight.severity] ?? severityStyles.info}
      <div class="rounded-lg border border-slate-200 dark:border-slate-700 border-l-4 {style.border} {style.bg} p-4">
        <h4 class="font-semibold text-sm {style.text} flex items-center gap-2">
          {#if insight.severity === 'danger'}
            <svg class="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
          {:else if insight.severity === 'warning'}
            <svg class="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
          {:else if insight.severity === 'caution'}
            <svg class="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
            </svg>
          {:else}
            <svg class="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
            </svg>
          {/if}
          {insight.title}
        </h4>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{insight.description}</p>
      </div>
    {/each}
  </div>
{/if}
