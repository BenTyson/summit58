<script lang="ts">
  interface Props {
    label: string;
    value: string | number;
    secondary?: string;
    variant?: 'default' | 'accent' | 'success' | 'danger' | 'warning';
    href?: string;
  }

  let { label, value, secondary, variant = 'default', href }: Props = $props();

  const variantClasses: Record<string, string> = {
    default: 'text-slate-900 dark:text-white',
    accent: 'text-accent',
    success: 'text-semantic-success-dark dark:text-semantic-success-light',
    danger: 'text-semantic-danger-dark dark:text-semantic-danger-light',
    warning: 'text-semantic-warning-dark dark:text-semantic-warning-light'
  };
</script>

{#if href}
  <a {href} class="block rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-card hover:shadow-card-hover transition-shadow">
    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    <p class="mt-1 text-3xl font-bold tabular-nums {variantClasses[variant]}">{value}</p>
    {#if secondary}
      <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">{secondary}</p>
    {/if}
  </a>
{:else}
  <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-card">
    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    <p class="mt-1 text-3xl font-bold tabular-nums {variantClasses[variant]}">{value}</p>
    {#if secondary}
      <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">{secondary}</p>
    {/if}
  </div>
{/if}
