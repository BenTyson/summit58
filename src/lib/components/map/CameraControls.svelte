<script lang="ts">
  interface Props {
    onPreset: (preset: 'overview' | 'birdsEye' | 'reset') => void;
    isPro?: boolean;
    onFlythrough?: () => void;
  }

  let { onPreset, isPro = false, onFlythrough }: Props = $props();
</script>

<style>
  .camera-controls {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 4px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 5;
  }

  :global(.dark) .camera-controls {
    background: rgba(30, 41, 59, 0.8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .camera-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: transparent;
    color: #475569;
    transition: background 0.15s ease, color 0.15s ease;
    position: relative;
  }

  :global(.dark) .camera-btn {
    color: #94a3b8;
  }

  .camera-btn:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #0f172a;
  }

  :global(.dark) .camera-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
  }

  .camera-btn:active {
    background: rgba(0, 0, 0, 0.1);
  }

  :global(.dark) .camera-btn:active {
    background: rgba(255, 255, 255, 0.15);
  }

  .camera-btn.fly-btn {
    color: #C8A55C;
  }

  :global(.dark) .camera-btn.fly-btn {
    color: #C8A55C;
  }

  .camera-btn.fly-btn:hover {
    background: rgba(200, 165, 92, 0.1);
    color: #A8873A;
  }

  :global(.dark) .camera-btn.fly-btn:hover {
    background: rgba(200, 165, 92, 0.15);
    color: #D4BC7E;
  }

  .lock-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #C8A55C;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .divider {
    height: 1px;
    margin: 2px 6px;
    background: rgba(0, 0, 0, 0.08);
  }

  :global(.dark) .divider {
    background: rgba(255, 255, 255, 0.08);
  }
</style>

<div class="camera-controls">
  <button
    class="camera-btn"
    onclick={() => onPreset('overview')}
    aria-label="Overview camera"
    title="Overview"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  </button>
  <button
    class="camera-btn"
    onclick={() => onPreset('birdsEye')}
    aria-label="Bird's eye camera"
    title="Bird's Eye"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  </button>
  <button
    class="camera-btn"
    onclick={() => onPreset('reset')}
    aria-label="Reset camera"
    title="Reset"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  </button>

  {#if onFlythrough}
    <div class="divider"></div>
    <button
      class="camera-btn fly-btn"
      onclick={onFlythrough}
      aria-label="Flythrough animation"
      title={isPro ? 'Flythrough' : 'Flythrough (Pro)'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
      {#if !isPro}
        <span class="lock-badge">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke-width="2.5" />
          </svg>
        </span>
      {/if}
    </button>
  {/if}
</div>
