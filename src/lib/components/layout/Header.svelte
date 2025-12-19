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
      <div class="hidden items-center gap-8 md:flex">
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
        <ThemeToggle />
      </div>

      <!-- Mobile Menu Button -->
      <div class="flex items-center gap-2 md:hidden">
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
        </div>
      </div>
    {/if}
  </Container>
</header>
