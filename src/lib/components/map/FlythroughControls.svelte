<script lang="ts">
  interface Props {
    playing: boolean;
    speed: number;
    progress: number;
    onPlay: () => void;
    onPause: () => void;
    onStop: () => void;
    onSpeedChange: (speed: number) => void;
  }

  let { playing, speed, progress, onPlay, onPause, onStop, onSpeedChange }: Props = $props();

  const speeds = [0.5, 1, 2];

  function cycleSpeed() {
    const currentIdx = speeds.indexOf(speed);
    const nextIdx = (currentIdx + 1) % speeds.length;
    onSpeedChange(speeds[nextIdx]);
  }
</script>

<style>
  .flythrough-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 70%, transparent 100%);
    padding: 12px 16px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .fly-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 44px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: background 0.15s ease;
    flex-shrink: 0;
  }

  .fly-btn:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .fly-btn:active {
    background: rgba(255, 255, 255, 0.3);
  }

  .progress-track {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;
    min-width: 0;
  }

  .progress-fill {
    height: 100%;
    background: #C8A55C;
    border-radius: 3px;
    transition: width 0.1s linear;
  }

  .speed-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 44px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: background 0.15s ease;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    flex-shrink: 0;
    padding: 0 8px;
  }

  .speed-btn:hover {
    background: rgba(255, 255, 255, 0.25);
  }
</style>

<div class="flythrough-controls">
  <!-- Play / Pause -->
  <button
    class="fly-btn"
    onclick={() => playing ? onPause() : onPlay()}
    aria-label={playing ? 'Pause flythrough' : 'Resume flythrough'}
    title={playing ? 'Pause' : 'Play'}
  >
    {#if playing}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </svg>
    {:else}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    {/if}
  </button>

  <!-- Progress bar -->
  <div class="progress-track">
    <div class="progress-fill" style="width: {progress * 100}%"></div>
  </div>

  <!-- Speed toggle -->
  <button
    class="speed-btn"
    onclick={cycleSpeed}
    aria-label="Change speed"
    title="Playback speed"
  >
    {speed}x
  </button>

  <!-- Stop / Exit -->
  <button
    class="fly-btn"
    onclick={onStop}
    aria-label="Stop flythrough"
    title="Exit"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
</div>
