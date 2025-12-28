<script lang="ts">
  interface Props {
    class?: string;
    width?: string;
    height?: string;
  }

  let { class: className = '', width = '100%', height = '1rem' }: Props = $props();
</script>

<div
  class="animate-pulse rounded bg-slate-200 dark:bg-slate-700 {className}"
  style="width: {width}; height: {height}"
  role="status"
  aria-label="Loading..."
></div>
