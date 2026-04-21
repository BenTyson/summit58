<script lang="ts">
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let expanded = $state<string | null>(null);

  function toggle(id: string) {
    expanded = expanded === id ? null : id;
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>Contact | Admin | SaltGoat</title>
</svelte:head>

<div class="flex items-center justify-between mb-6">
  <div>
    <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Contact submissions</h2>
    <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{data.submissions.length} total</p>
  </div>
</div>

{#if data.submissions.length === 0}
  <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center">
    <p class="text-slate-400 dark:text-slate-500 text-sm">No contact submissions yet.</p>
  </div>
{:else}
  <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-card divide-y divide-slate-100 dark:divide-slate-700">
    {#each data.submissions as sub (sub.id)}
      <div>
        <!-- Row -->
        <button
          type="button"
          onclick={() => toggle(sub.id)}
          class="w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
        >
          <div class="flex items-start gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-3 flex-wrap">
                <span class="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {sub.subject}
                </span>
                <span class="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                  {formatDate(sub.created_at)}
                </span>
              </div>
              <div class="mt-0.5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                {#if sub.name}
                  <span>{sub.name}</span>
                  <span class="text-slate-300 dark:text-slate-600">&middot;</span>
                {/if}
                <a
                  href="mailto:{sub.email}"
                  onclick={(e) => e.stopPropagation()}
                  class="hover:text-accent transition-colors"
                >
                  {sub.email}
                </a>
              </div>
            </div>
            <svg
              class="h-4 w-4 text-slate-400 shrink-0 mt-0.5 transition-transform {expanded === sub.id ? 'rotate-180' : ''}"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <!-- Expanded message -->
        {#if expanded === sub.id}
          <div class="px-5 pb-5 pt-1 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
            <p class="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {sub.message}
            </p>
            <div class="mt-4">
              <a
                href="mailto:{sub.email}?subject=Re: {encodeURIComponent(sub.subject)}"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent text-white hover:bg-accent-warm transition-colors"
              >
                Reply
              </a>
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}
