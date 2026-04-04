<script lang="ts">
  interface Props {
    authorName: string | null;
    body: string;
    replyId?: string;
    class?: string;
  }

  let { authorName, body, replyId, class: className = '' }: Props = $props();

  const truncated = $derived(body.length > 150 ? body.slice(0, 150) + '...' : body);
</script>

<div class="rounded-lg border-l-3 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 mb-2 {className}">
  <div class="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
    {authorName || 'Anonymous Hiker'} wrote:
  </div>
  <p class="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 italic">
    {truncated}
  </p>
</div>
