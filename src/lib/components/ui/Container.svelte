<script lang="ts">
  interface Props {
    class?: string;
    size?: 'narrow' | 'default' | 'wide';
    children: import('svelte').Snippet;
  }

  let { class: className = '', size = 'default', children }: Props = $props();

  const sizes = {
    narrow: 'max-w-2xl',
    default: 'max-w-4xl',
    wide: 'max-w-6xl'
  };
</script>

<div class="mx-auto px-4 sm:px-6 lg:px-8 {sizes[size]} {className}">
  {@render children()}
</div>
