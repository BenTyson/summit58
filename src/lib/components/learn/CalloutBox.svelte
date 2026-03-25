<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    type?: 'info' | 'warning' | 'danger' | 'tip';
    title?: string;
    children: Snippet;
  }

  let { type = 'info', title, children }: Props = $props();

  const styles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500',
      icon: 'text-blue-500',
      title: 'text-blue-900 dark:text-blue-200'
    },
    warning: {
      bg: 'bg-semantic-warning/5 dark:bg-semantic-warning/15',
      border: 'border-semantic-warning',
      icon: 'text-semantic-warning',
      title: 'text-semantic-warning-dark dark:text-semantic-warning-light'
    },
    danger: {
      bg: 'bg-semantic-danger/5 dark:bg-semantic-danger/15',
      border: 'border-semantic-danger',
      icon: 'text-semantic-danger',
      title: 'text-semantic-danger-dark dark:text-semantic-danger-light'
    },
    tip: {
      bg: 'bg-semantic-success/5 dark:bg-semantic-success/15',
      border: 'border-semantic-success',
      icon: 'text-semantic-success',
      title: 'text-semantic-success-dark dark:text-semantic-success-light'
    }
  };

  const icons = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    danger: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    tip: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  };

  const style = $derived(styles[type]);
</script>

<div class="rounded-xl {style.bg} border-l-4 {style.border} p-4 my-6">
  <div class="flex gap-3">
    <svg
      class="h-6 w-6 flex-shrink-0 {style.icon}"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d={icons[type]}
      />
    </svg>
    <div class="flex-1">
      {#if title}
        <h4 class="font-semibold {style.title} mb-1">{title}</h4>
      {/if}
      <div class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {@render children()}
      </div>
    </div>
  </div>
</div>
