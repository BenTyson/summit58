<script lang="ts">
  type Band = 'summit' | 'mid' | 'base';

  interface BandInfo {
    key: Band;
    label: string;
    elevation_ft: number;
  }

  interface Props {
    bands: BandInfo[];
    selected: Band;
    onSelect: (band: Band) => void;
    sticky?: boolean;
  }

  let { bands, selected, onSelect, sticky = true }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    const currentIndex = bands.findIndex((b) => b.key === selected);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % bands.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + bands.length) % bands.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = bands.length - 1;
    } else {
      return;
    }

    onSelect(bands[nextIndex].key);
    // Focus the newly selected tab
    const container = (e.currentTarget as HTMLElement).closest('[role="tablist"]');
    const tabs = container?.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs?.[nextIndex]?.focus();
  }
</script>

<div
  class="
    {sticky ? 'sticky top-0 z-30' : ''}
    py-3 transition-all duration-200
  "
>
  <div
    class="
      inline-flex rounded-xl p-1
      bg-white/80 dark:bg-slate-800/80
      backdrop-blur-md
      border border-slate-200/60 dark:border-slate-700/60
      shadow-card
    "
    role="tablist"
    aria-label="Elevation band"
  >
    {#each bands as band}
      <button
        onclick={() => onSelect(band.key)}
        onkeydown={handleKeydown}
        role="tab"
        aria-selected={selected === band.key}
        aria-controls="forecast-panel"
        tabindex={selected === band.key ? 0 : -1}
        class="
          relative px-4 py-2.5 rounded-lg text-sm font-medium
          transition-all duration-200 whitespace-nowrap
          {selected === band.key
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}
        "
      >
        <span class="block">{band.label}</span>
        <span class="block text-xs mt-0.5 {selected === band.key ? 'text-accent' : 'text-slate-400 dark:text-slate-500'}">
          {band.elevation_ft.toLocaleString()}'
        </span>
      </button>
    {/each}
  </div>
</div>
