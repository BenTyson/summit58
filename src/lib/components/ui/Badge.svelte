<script lang="ts">
  interface Props {
    variant?: 'class-1' | 'class-2' | 'class-3' | 'class-4' | 'default';
    class?: string;
    children: import('svelte').Snippet;
  }

  let { variant = 'default', class: className = '', children }: Props = $props();

  const variants: Record<string, string> = {
    'class-1': 'badge-class-1',
    'class-2': 'badge-class-2',
    'class-3': 'badge-class-3',
    'class-4': 'badge-class-4',
    default: 'badge-default'
  };
</script>

<span class="badge {variants[variant]} {className}">
  {@render children()}
</span>
