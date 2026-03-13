<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
</script>

<svelte:head>
  <title>Community Guidelines | Cairn58</title>
  <meta name="description" content="Community guidelines for photos, reviews, and trail reports on Cairn58." />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cairn58.com/" },
      { "@type": "ListItem", "position": 2, "name": "Community Guidelines", "item": "https://cairn58.com/guidelines" }
    ]
  })}</script>`}
</svelte:head>

<Container class="py-12 max-w-3xl">
  <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Community Guidelines</h1>
  <p class="text-lg text-slate-600 dark:text-slate-400 mb-10">
    Cairn58 is built by hikers, for hikers. These guidelines help keep the community helpful and respectful.
  </p>

  <!-- Photo Guidelines -->
  <section class="mb-10">
    <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <svg class="h-5 w-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Photo Guidelines
    </h2>
    <div class="space-y-3 text-slate-700 dark:text-slate-300">
      <div class="flex gap-3">
        <span class="text-emerald-500 mt-0.5">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
        </span>
        <p>Share photos of the peak, route, trailhead, or surrounding scenery</p>
      </div>
      <div class="flex gap-3">
        <span class="text-emerald-500 mt-0.5">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
        </span>
        <p>Add helpful captions describing conditions, time of year, or notable features</p>
      </div>
      <div class="flex gap-3">
        <span class="text-emerald-500 mt-0.5">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
        </span>
        <p>Use the "Private" option for personal photos you'd rather not share publicly</p>
      </div>
      <div class="flex gap-3">
        <span class="text-red-500 mt-0.5">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </span>
        <p>Do not upload photos unrelated to the peak or hiking</p>
      </div>
      <div class="flex gap-3">
        <span class="text-red-500 mt-0.5">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </span>
        <p>Do not upload offensive, graphic, or copyrighted content</p>
      </div>
    </div>
  </section>

  <!-- Review Guidelines -->
  <section class="mb-10">
    <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <svg class="h-5 w-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      Review Guidelines
    </h2>
    <div class="space-y-3 text-slate-700 dark:text-slate-300">
      <p>Reviews help other hikers plan their trips. Share your honest experience including difficulty, conditions, and what to expect.</p>
      <p>Be constructive and respectful. Focus on the hike, not other people.</p>
    </div>
  </section>

  <!-- Reporting Process -->
  <section class="mb-10">
    <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <svg class="h-5 w-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
      Reporting Content
    </h2>
    <div class="space-y-3 text-slate-700 dark:text-slate-300">
      <p>If you see content that violates these guidelines, use the flag button to report it. You can report for:</p>
      <ul class="list-disc list-inside space-y-1 pl-2">
        <li><strong>Inappropriate content</strong> -- offensive or unrelated material</li>
        <li><strong>Spam</strong> -- promotional or repetitive content</li>
        <li><strong>Inaccurate</strong> -- wrong peak, misleading information</li>
        <li><strong>Other</strong> -- anything else that needs review</li>
      </ul>
      <p>Content that receives multiple reports is automatically hidden pending review by our team.</p>
    </div>
  </section>

  <!-- Consequences -->
  <section>
    <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <svg class="h-5 w-5 text-sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      Enforcement
    </h2>
    <div class="space-y-3 text-slate-700 dark:text-slate-300">
      <p>We review reported content promptly. Depending on severity:</p>
      <ul class="list-disc list-inside space-y-1 pl-2">
        <li>Content may be removed</li>
        <li>Repeat offenders may have upload privileges restricted</li>
        <li>Accounts creating harmful content may be suspended</li>
      </ul>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-4">
        These guidelines may be updated as the community grows. Last updated March 2026.
      </p>
    </div>
  </section>
</Container>
