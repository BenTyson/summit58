<script lang="ts">
  import ThemeToggle from './ThemeToggle.svelte';
  import Container from '../ui/Container.svelte';
  import SearchModal from '../search/SearchModal.svelte';
  import type { Session } from '@supabase/supabase-js';
  import type { Tables } from '$lib/types/database';

  type Peak = Pick<Tables<'peaks'>, 'id' | 'name' | 'slug' | 'elevation' | 'rank' | 'range'>;

  interface Props {
    session?: Session | null;
    profile?: { display_name?: string; avatar_url?: string } | null;
    peaks?: Peak[];
  }

  let { session = null, profile = null, peaks = [] }: Props = $props();

  let isMobileMenuOpen = $state(false);
  let userMenuOpen = $state(false);
  let searchOpen = $state(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/peaks', label: 'Peaks' },
    { href: '/ranges', label: 'Ranges' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/map', label: 'Map' },
    { href: '/learn', label: 'Learn' }
  ];

  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }

  function closeUserMenu() {
    userMenuOpen = false;
  }

  function openSearch() {
    searchOpen = true;
  }

  function closeSearch() {
    searchOpen = false;
  }

  function handleGlobalKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchOpen = !searchOpen;
    }
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<header
  class="
    sticky top-0 z-50
    border-b border-slate-200/80
    bg-white/80 backdrop-blur-md
    transition-all duration-300
    dark:border-slate-700/80 dark:bg-slate-900/80
  "
>
  <Container size="wide">
    <nav class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a
        href="/"
        class="group flex items-center gap-2.5 text-xl font-bold text-mountain-blue dark:text-white"
      >
        <svg
          class="h-9 w-9 text-sunrise transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
        </svg>
        <span class="font-display text-2xl tracking-tight">Summit58</span>
      </a>

      <!-- Desktop Nav -->
      <div class="hidden items-center gap-6 md:flex">
        <!-- Search Button -->
        <button
          onclick={openSearch}
          class="
            flex items-center gap-2 px-3 py-1.5 rounded-lg
            border border-slate-200 dark:border-slate-600
            bg-slate-50 dark:bg-slate-800
            text-slate-500 dark:text-slate-400
            hover:border-slate-300 dark:hover:border-slate-500
            hover:text-slate-700 dark:hover:text-slate-200
            transition-colors
          "
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="text-sm">Search</span>
          <kbd class="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs">
            <span class="text-xs">⌘</span>K
          </kbd>
        </button>

        {#each navLinks as link}
          <a
            href={link.href}
            class="
              relative px-1 py-2 text-slate-600 font-medium
              transition-colors duration-200
              hover:text-mountain-blue
              dark:text-slate-300 dark:hover:text-white
              after:absolute after:inset-x-0 after:bottom-0 after:h-0.5
              after:bg-sunrise after:scale-x-0 after:transition-transform after:duration-300
              hover:after:scale-x-100
            "
          >
            {link.label}
          </a>
        {/each}

        <!-- My 58 - Prominent for logged in users -->
        {#if session}
          <a
            href="/profile"
            class="
              flex items-center gap-1.5 px-3 py-1.5 rounded-full
              bg-gradient-to-r from-sunrise/10 to-sunrise-coral/10
              border border-sunrise/30
              text-sunrise font-semibold
              hover:from-sunrise/20 hover:to-sunrise-coral/20
              hover:border-sunrise/50
              transition-all duration-200
            "
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
            </svg>
            My 58
          </a>
        {/if}

        <ThemeToggle />

        <!-- Auth -->
        {#if session}
          <div class="relative">
            <button
              onclick={() => userMenuOpen = !userMenuOpen}
              class="
                flex items-center gap-2 rounded-full
                border border-slate-200 dark:border-slate-600
                bg-white dark:bg-slate-700
                pl-3 pr-1 py-1
                text-sm font-medium text-slate-700 dark:text-slate-200
                hover:border-sunrise transition-colors
              "
            >
              <span class="max-w-24 truncate">{profile?.display_name || 'Hiker'}</span>
              {#if profile?.avatar_url}
                <img src={profile.avatar_url} alt="" class="h-7 w-7 rounded-full" />
              {:else}
                <div class="h-7 w-7 rounded-full bg-sunrise/20 flex items-center justify-center">
                  <svg class="h-4 w-4 text-sunrise" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
              {/if}
            </button>

            {#if userMenuOpen}
              <div
                class="
                  absolute right-0 mt-2 w-48 rounded-xl overflow-hidden
                  bg-white dark:bg-slate-800 shadow-card-elevated
                  border border-slate-200 dark:border-slate-700
                  animate-fade-in-up
                "
              >
                <a
                  href="/profile"
                  onclick={closeUserMenu}
                  class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <svg class="h-4 w-4 text-sunrise" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
                  </svg>
                  My 58
                </a>
                <form action="/auth/logout" method="POST">
                  <button
                    type="submit"
                    class="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-t border-slate-100 dark:border-slate-700"
                  >
                    Log Out
                  </button>
                </form>
              </div>
            {/if}
          </div>
        {:else}
          <a
            href="/auth"
            class="
              px-4 py-2 rounded-lg
              bg-sunrise text-white font-medium
              hover:bg-sunrise-coral transition-colors
            "
          >
            Log In
          </a>
        {/if}
      </div>

      <!-- Mobile Menu Button -->
      <div class="flex items-center gap-2 md:hidden">
        <!-- Mobile Search Button -->
        <button
          onclick={openSearch}
          class="tap-target flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-mountain-blue dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
          aria-label="Search"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <ThemeToggle />
        <button
          class="
            tap-target flex items-center justify-center rounded-lg p-2
            text-slate-600 transition-colors
            hover:bg-slate-100 hover:text-mountain-blue
            dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white
          "
          onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if isMobileMenuOpen}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            {:else}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            {/if}
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    {#if isMobileMenuOpen}
      <div
        class="
          border-t border-slate-200 py-4 md:hidden dark:border-slate-700
          animate-fade-in-down
        "
      >
        <div class="flex flex-col gap-1">
          {#each navLinks as link, i}
            <a
              href={link.href}
              class="
                tap-target flex items-center rounded-lg px-4 py-3
                text-lg font-medium text-slate-700
                transition-all duration-200
                hover:bg-sunrise/10 hover:text-sunrise
                dark:text-slate-200 dark:hover:bg-sunrise/20
                animate-fade-in-up
              "
              style="animation-delay: {i * 50}ms"
              onclick={closeMobileMenu}
            >
              {link.label}
            </a>
          {/each}

          <!-- Mobile Auth -->
          <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            {#if session}
              <!-- My 58 prominent link -->
              <a
                href="/profile"
                onclick={closeMobileMenu}
                class="
                  flex items-center gap-3 mx-4 mb-4 px-4 py-3 rounded-xl
                  bg-gradient-to-r from-sunrise/10 to-sunrise-coral/10
                  border border-sunrise/30
                  hover:from-sunrise/20 hover:to-sunrise-coral/20
                "
              >
                <div class="h-10 w-10 rounded-full bg-sunrise/20 flex items-center justify-center">
                  <svg class="h-5 w-5 text-sunrise" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
                  </svg>
                </div>
                <div>
                  <span class="font-semibold text-sunrise">My 58</span>
                  <span class="block text-xs text-slate-500 dark:text-slate-400">Track your summits</span>
                </div>
              </a>

              <div class="flex items-center gap-3 px-4 py-2 mb-2">
                {#if profile?.avatar_url}
                  <img src={profile.avatar_url} alt="" class="h-8 w-8 rounded-full" />
                {:else}
                  <div class="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <svg class="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                {/if}
                <span class="text-sm text-slate-600 dark:text-slate-300">{profile?.display_name || 'Hiker'}</span>
              </div>
              <form action="/auth/logout" method="POST">
                <button
                  type="submit"
                  class="w-full text-left px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
                >
                  Log Out
                </button>
              </form>
            {:else}
              <a
                href="/auth"
                onclick={closeMobileMenu}
                class="block mx-4 py-3 text-center rounded-lg bg-sunrise text-white font-medium hover:bg-sunrise-coral transition-colors"
              >
                Log In
              </a>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </Container>
</header>

<!-- Search Modal -->
<SearchModal {peaks} open={searchOpen} onClose={closeSearch} />
