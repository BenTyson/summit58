<script lang="ts">
  import Container from '../ui/Container.svelte';

  const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
  <Container size="wide" class="py-8">
    <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <!-- Logo and tagline -->
      <div class="flex items-center gap-2">
        <svg class="h-6 w-6 text-sunrise" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
        </svg>
        <span class="font-semibold text-slate-700 dark:text-slate-200">Summit58</span>
        <span class="text-sm text-slate-500 dark:text-slate-400">
          The modern guide to Colorado's 14ers
        </span>
      </div>

      <!-- Copyright -->
      <p class="text-sm text-slate-500 dark:text-slate-400">
        &copy; {currentYear} Summit58. All rights reserved.
      </p>
    </div>

    <!-- Disclaimer -->
    <p class="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
      Mountain climbing is inherently dangerous. Always check current conditions, prepare properly,
      and make your own safety decisions. This site is for informational purposes only.
    </p>
  </Container>
</footer>
