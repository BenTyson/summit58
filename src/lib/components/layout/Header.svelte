<script lang="ts">
  import ThemeToggle from './ThemeToggle.svelte';
  import Container from '../ui/Container.svelte';

  let isMobileMenuOpen = $state(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/peaks', label: 'Peaks' }
  ];

  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }
</script>

<header
  class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
>
  <Container size="wide">
    <nav class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a
        href="/"
        class="flex items-center gap-2 text-xl font-bold text-mountain-blue dark:text-white"
      >
        <svg class="h-8 w-8 text-sunrise" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
        </svg>
        Summit58
      </a>

      <!-- Desktop Nav -->
      <div class="hidden items-center gap-6 md:flex">
        {#each navLinks as link}
          <a
            href={link.href}
            class="text-slate-600 transition-colors hover:text-mountain-blue dark:text-slate-300 dark:hover:text-white"
          >
            {link.label}
          </a>
        {/each}
        <ThemeToggle />
      </div>

      <!-- Mobile Menu Button -->
      <div class="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <button
          class="tap-target flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
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
      <div class="border-t border-slate-200 py-4 md:hidden dark:border-slate-700">
        <div class="flex flex-col gap-4">
          {#each navLinks as link}
            <a
              href={link.href}
              class="tap-target flex items-center text-lg text-slate-700 hover:text-mountain-blue dark:text-slate-200 dark:hover:text-white"
              onclick={closeMobileMenu}
            >
              {link.label}
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </Container>
</header>
