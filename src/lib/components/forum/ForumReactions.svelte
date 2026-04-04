<script lang="ts">
  import type { ForumReactionData } from '$lib/server/forumReactions';

  interface Props {
    postType: 'topic' | 'reply';
    postId: string;
    reactions: ForumReactionData;
    isLoggedIn: boolean;
    class?: string;
  }

  let { postType, postId, reactions, isLoggedIn, class: className = '' }: Props = $props();

  const reactionTypes = [
    { key: 'like', label: 'Like' },
    { key: 'helpful', label: 'Helpful' },
    { key: 'fire', label: 'Fire' },
    { key: 'summit', label: 'Summit' }
  ];

  const hasAny = $derived(
    Object.values(reactions.counts).some((c) => c > 0) || isLoggedIn
  );
</script>

{#if hasAny}
  <div class="flex flex-wrap items-center gap-1.5 {className}">
    {#each reactionTypes as type}
      {@const count = reactions.counts[type.key] ?? 0}
      {@const isActive = reactions.userReactions.includes(type.key)}
      {@const showButton = count > 0 || isLoggedIn}

      {#if showButton}
        {#if isLoggedIn}
          <form method="POST" action="?/toggleReaction" class="inline">
            <input type="hidden" name="reactable_type" value={postType} />
            <input type="hidden" name="reactable_id" value={postId} />
            <input type="hidden" name="reaction_type" value={type.key} />
            <button
              type="submit"
              class="
                inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                transition-all duration-200
                {isActive
                  ? 'bg-accent/15 text-accent border border-accent/30 dark:bg-accent/20 dark:border-accent/40'
                  : 'bg-slate-100 text-slate-500 border border-transparent hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'}
              "
              title={type.label}
            >
              {#if type.key === 'like'}
                <svg class="h-3.5 w-3.5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                </svg>
              {:else if type.key === 'helpful'}
                <svg class="h-3.5 w-3.5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              {:else if type.key === 'fire'}
                <svg class="h-3.5 w-3.5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              {:else}
                <svg class="h-3.5 w-3.5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L2 22h20L12 2z" />
                </svg>
              {/if}
              {#if count > 0}
                <span>{count}</span>
              {/if}
            </button>
          </form>
        {:else if count > 0}
          <span
            class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
            title={type.label}
          >
            {#if type.key === 'like'}
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
              </svg>
            {:else if type.key === 'helpful'}
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            {:else if type.key === 'fire'}
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            {:else}
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L2 22h20L12 2z" />
              </svg>
            {/if}
            <span>{count}</span>
          </span>
        {/if}
      {/if}
    {/each}
  </div>
{/if}
