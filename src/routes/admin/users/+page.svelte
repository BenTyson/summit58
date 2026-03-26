<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let searchInput = $state(data.search);
  $effect(() => { searchInput = data.search; });

  function updateSearch() {
    const params = new URLSearchParams($page.url.searchParams);
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.delete('page');
    goto(`/admin/users?${params.toString()}`, { replaceState: true });
  }

  function setSort(field: string) {
    const params = new URLSearchParams($page.url.searchParams);
    const currentSort = params.get('sort');
    const currentDir = params.get('dir') ?? 'desc';

    if (currentSort === field) {
      params.set('dir', currentDir === 'desc' ? 'asc' : 'desc');
    } else {
      params.set('sort', field);
      params.set('dir', 'desc');
    }
    params.delete('page');
    goto(`/admin/users?${params.toString()}`, { replaceState: true });
  }

  function goToPage(p: number) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', String(p));
    goto(`/admin/users?${params.toString()}`, { replaceState: true });
  }

  function sortIcon(field: string): string {
    if (data.sortBy !== field) return '';
    return data.sortDir === 'asc' ? ' ↑' : ' ↓';
  }
</script>

<svelte:head>
  <title>Users | Admin | SaltGoat</title>
</svelte:head>

<!-- Search -->
<div class="mb-6 flex items-center gap-3">
  <div class="relative flex-1 max-w-md">
    <input
      type="text"
      bind:value={searchInput}
      onkeydown={(e) => e.key === 'Enter' && updateSearch()}
      placeholder="Search users..."
      class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50"
    />
    {#if searchInput}
      <button
        onclick={() => { searchInput = ''; updateSearch(); }}
        class="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        aria-label="Clear search"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    {/if}
    <button onclick={updateSearch} aria-label="Search" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  </div>
  <span class="text-sm text-slate-500 dark:text-slate-400">
    {data.total} {data.total === 1 ? 'user' : 'users'}
  </span>
</div>

<!-- User Table -->
<div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-card">
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
          <th class="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <button onclick={() => setSort('display_name')} class="hover:text-accent transition-colors">
              User{sortIcon('display_name')}
            </button>
          </th>
          <th class="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Plan
          </th>
          <th class="text-center px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <button onclick={() => setSort('summit_count')} class="hover:text-accent transition-colors">
              Summits{sortIcon('summit_count')}
            </button>
          </th>
          <th class="text-center px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Photos
          </th>
          <th class="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <button onclick={() => setSort('created_at')} class="hover:text-accent transition-colors">
              Joined{sortIcon('created_at')}
            </button>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
        {#each data.users as user}
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                {#if user.avatar_url}
                  <img src={user.avatar_url} alt="" class="h-8 w-8 rounded-full object-cover" />
                {:else}
                  <div class="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400">
                    {(user.display_name ?? user.username ?? '?').charAt(0).toUpperCase()}
                  </div>
                {/if}
                <div>
                  <a href="/users/{user.username ?? user.id}" class="font-medium text-slate-900 dark:text-white hover:text-accent transition-colors">
                    {user.display_name ?? 'Anonymous'}
                  </a>
                  {#if user.username}
                    <p class="text-xs text-slate-400 dark:text-slate-500">@{user.username}</p>
                  {/if}
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              {#if user.plan === 'pro'}
                <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">PRO</span>
              {:else}
                <span class="text-xs text-slate-400">Free</span>
              {/if}
            </td>
            <td class="px-4 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300">
              {user.summit_count}
            </td>
            <td class="px-4 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300">
              {user.photo_count}
            </td>
            <td class="px-4 py-3 text-right text-xs text-slate-400 dark:text-slate-500">
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
            </td>
          </tr>
        {/each}
        {#if data.users.length === 0}
          <tr>
            <td colspan="5" class="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
              {data.search ? `No users matching "${data.search}"` : 'No users found.'}
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  {#if data.totalPages > 1}
    <div class="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-slate-800/80">
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Page {data.page} of {data.totalPages}
      </p>
      <div class="flex gap-1">
        <button
          onclick={() => goToPage(data.page - 1)}
          disabled={data.page <= 1}
          class="px-3 py-1.5 rounded text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>
        <button
          onclick={() => goToPage(data.page + 1)}
          disabled={data.page >= data.totalPages}
          class="px-3 py-1.5 rounded text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  {/if}
</div>
