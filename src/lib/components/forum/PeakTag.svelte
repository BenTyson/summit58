<script lang="ts">
  interface Props {
    peak: { name: string; slug: string };
    class?: string;
  }

  let { peak, class: className = '' }: Props = $props();
</script>

<a
  href="/peaks/{peak.slug}"
  class="
    inline-flex items-center gap-1 px-2 py-0.5 rounded-full
    text-xs font-medium
    bg-class-1/10 text-class-1 dark:bg-class-1/20
    hover:bg-class-1/20 dark:hover:bg-class-1/30
    transition-colors
    {className}
  "
>
  <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
  </svg>
  {peak.name}
</a>
