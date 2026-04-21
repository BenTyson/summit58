<script lang="ts">
  interface Props {
    label?: string;
    placeholder?: string;
    buttonText?: string;
  }

  let {
    label = 'Stay in the loop',
    placeholder = 'your@email.com',
    buttonText = 'Subscribe'
  }: Props = $props();

  let email = $state('');
  let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let errorMessage = $state('');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      errorMessage = 'Enter a valid email address.';
      status = 'error';
      return;
    }

    status = 'loading';
    try {
      const res = await fetch('/api/v1/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed })
      });
      if (res.ok) {
        status = 'success';
        email = '';
      } else {
        const data = await res.json().catch(() => ({}));
        errorMessage = data?.error ?? 'Something went wrong. Please try again.';
        status = 'error';
      }
    } catch {
      errorMessage = 'Something went wrong. Please try again.';
      status = 'error';
    }
  }
</script>

{#if status === 'success'}
  <p class="text-sm font-medium text-green-600 dark:text-green-400">You're subscribed.</p>
{:else}
  <div>
    {#if label}
      <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</p>
    {/if}
    <form onsubmit={handleSubmit} class="flex gap-2">
      <input
        type="email"
        bind:value={email}
        {placeholder}
        required
        disabled={status === 'loading'}
        class="
          flex-1 min-w-0 rounded-lg border border-slate-200 dark:border-slate-600
          bg-white dark:bg-slate-900/50
          text-slate-900 dark:text-white
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
          disabled:opacity-50 transition-colors
        "
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        class="
          shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
          {status === 'loading'
            ? 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
            : 'bg-accent text-white hover:bg-accent-warm'}
        "
      >
        {status === 'loading' ? '...' : buttonText}
      </button>
    </form>
    {#if status === 'error'}
      <p class="mt-1.5 text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
    {/if}
  </div>
{/if}
