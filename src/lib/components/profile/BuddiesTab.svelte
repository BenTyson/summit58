<script lang="ts">
  import type { FollowStats, UserWithFollowStatus } from '$lib/server/follows';
  import UserCard from './UserCard.svelte';

  interface Props {
    followStats: FollowStats;
    following: UserWithFollowStatus[];
    followers: UserWithFollowStatus[];
    suggestions: UserWithFollowStatus[];
    isOwnProfile?: boolean;
    currentUserId?: string;
  }

  let {
    followStats,
    following,
    followers,
    suggestions,
    isOwnProfile = false,
    currentUserId
  }: Props = $props();

  type Tab = 'following' | 'followers';
  let activeTab: Tab = $state('following');
</script>

<div class="space-y-8">
  <!-- Stats Bar -->
  <div class="flex items-center gap-6">
    <button
      type="button"
      onclick={() => (activeTab = 'following')}
      class="text-center group"
    >
      <div class="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-sunrise transition-colors">
        {followStats.followingCount}
      </div>
      <div class="text-sm text-slate-500 dark:text-slate-400 {activeTab === 'following' ? 'text-sunrise font-medium' : ''}">
        Following
      </div>
      {#if activeTab === 'following'}
        <div class="mt-1 h-0.5 bg-sunrise rounded-full"></div>
      {/if}
    </button>

    <button
      type="button"
      onclick={() => (activeTab = 'followers')}
      class="text-center group"
    >
      <div class="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-sunrise transition-colors">
        {followStats.followersCount}
      </div>
      <div class="text-sm text-slate-500 dark:text-slate-400 {activeTab === 'followers' ? 'text-sunrise font-medium' : ''}">
        Followers
      </div>
      {#if activeTab === 'followers'}
        <div class="mt-1 h-0.5 bg-sunrise rounded-full"></div>
      {/if}
    </button>
  </div>

  <!-- User Lists -->
  <div class="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
    {#if activeTab === 'following'}
      {#if following.length > 0}
        <div class="divide-y divide-slate-200 dark:divide-slate-700">
          {#each following as user}
            <div class="p-0">
              <UserCard {user} showFollowButton={!!currentUserId && user.id !== currentUserId} {isOwnProfile} />
            </div>
          {/each}
        </div>
      {:else}
        <div class="p-12 text-center">
          <div class="mx-auto h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
            <svg class="h-7 w-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">Not following anyone yet</h3>
          <p class="text-slate-600 dark:text-slate-400">
            {isOwnProfile ? 'Follow other climbers to see their activity!' : 'This user is not following anyone yet.'}
          </p>
        </div>
      {/if}
    {:else}
      {#if followers.length > 0}
        <div class="divide-y divide-slate-200 dark:divide-slate-700">
          {#each followers as user}
            <div class="p-0">
              <UserCard {user} showFollowButton={!!currentUserId && user.id !== currentUserId} {isOwnProfile} />
            </div>
          {/each}
        </div>
      {:else}
        <div class="p-12 text-center">
          <div class="mx-auto h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
            <svg class="h-7 w-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">No followers yet</h3>
          <p class="text-slate-600 dark:text-slate-400">
            {isOwnProfile ? 'Share your profile to get followers!' : 'This user has no followers yet.'}
          </p>
        </div>
      {/if}
    {/if}
  </div>

  <!-- Suggestions (only for own profile) -->
  {#if isOwnProfile && suggestions.length > 0}
    <div>
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <svg class="h-5 w-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Climbers Like You
      </h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Fellow peak baggers who've climbed similar mountains
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        {#each suggestions as user}
          <UserCard {user} showFollowButton={true} showOverlap={true} {isOwnProfile} />
        {/each}
      </div>
    </div>
  {/if}
</div>
