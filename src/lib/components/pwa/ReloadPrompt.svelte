<script lang="ts">
  import { onMount } from 'svelte';

  let offlineReady = $state(false);
  let needRefresh = $state(false);
  let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | undefined;

  onMount(async () => {
    const { useRegisterSW } = await import('virtual:pwa-register/svelte');

    const {
      offlineReady: offlineReadyStore,
      needRefresh: needRefreshStore,
      updateServiceWorker: updateSW
    } = useRegisterSW({
      onRegistered(r) {
        console.log('SW Registered:', r);
      },
      onRegisterError(error) {
        console.error('SW registration error:', error);
      }
    });

    updateServiceWorker = updateSW;

    // Subscribe to stores
    offlineReadyStore.subscribe((value) => (offlineReady = value));
    needRefreshStore.subscribe((value) => (needRefresh = value));
  });

  function close() {
    offlineReady = false;
    needRefresh = false;
  }

  async function updateNow() {
    if (updateServiceWorker) {
      await updateServiceWorker(true);
    }
  }
</script>

{#if offlineReady || needRefresh}
  <div
    class="
      fixed bottom-4 right-4 z-50
      max-w-sm p-4 rounded-xl
      bg-white dark:bg-slate-800
      border border-slate-200 dark:border-slate-700
      shadow-card-elevated
      animate-fade-in-up
    "
    role="alert"
  >
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        {#if offlineReady}
          <div class="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <svg class="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        {:else}
          <div class="h-10 w-10 rounded-full bg-sunrise/10 flex items-center justify-center">
            <svg class="h-5 w-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        {/if}
      </div>

      <div class="flex-1 min-w-0">
        <p class="font-medium text-slate-900 dark:text-white">
          {#if offlineReady}
            Ready for offline use
          {:else}
            Update available
          {/if}
        </p>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {#if offlineReady}
            Summit58 is now available offline.
          {:else}
            A new version is available. Reload to update.
          {/if}
        </p>

        <div class="mt-3 flex items-center gap-2">
          {#if needRefresh}
            <button
              onclick={updateNow}
              class="px-3 py-1.5 rounded-lg bg-sunrise text-white text-sm font-medium hover:bg-sunrise-coral transition-colors"
            >
              Reload
            </button>
          {/if}
          <button
            onclick={close}
            class="px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>

      <button
        onclick={close}
        class="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        aria-label="Dismiss"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
{/if}
