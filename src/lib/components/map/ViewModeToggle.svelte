<script lang="ts">
  interface Props {
    mode: '2d' | '3d';
    onChange: (mode: '2d' | '3d') => void;
    loading3D?: boolean;
  }

  let { mode, onChange, loading3D = false }: Props = $props();
</script>

<style>
  .view-toggle {
    display: flex;
    gap: 2px;
    padding: 3px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) .view-toggle {
    background: #1e293b;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .view-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 44px;
    min-height: 44px;
    padding: 6px 14px;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.15s ease;
    background: transparent;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', system-ui, sans-serif;
    letter-spacing: 0.02em;
  }

  :global(.dark) .view-toggle-btn {
    color: #94a3b8;
  }

  .view-toggle-btn:hover {
    background: #f1f5f9;
    color: #334155;
  }

  :global(.dark) .view-toggle-btn:hover {
    background: #334155;
    color: #e2e8f0;
  }

  .view-toggle-btn.active {
    background: linear-gradient(135deg, #C8A55C, #D4BC7E);
    color: white;
    box-shadow: 0 2px 6px rgba(200, 165, 92, 0.3);
  }

  :global(.dark) .view-toggle-btn.active {
    background: linear-gradient(135deg, #C8A55C, #D4BC7E);
    color: white;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #94a3b8;
    border-top-color: #C8A55C;
    border-radius: 50%;
    animation: toggle-spin 0.8s linear infinite;
  }

  @keyframes toggle-spin {
    to { transform: rotate(360deg); }
  }
</style>

<div class="view-toggle">
  <button
    class="view-toggle-btn"
    class:active={mode === '2d'}
    onclick={() => onChange('2d')}
    aria-label="2D map view"
  >
    2D
  </button>
  <button
    class="view-toggle-btn"
    class:active={mode === '3d'}
    onclick={() => onChange('3d')}
    aria-label="3D terrain view"
  >
    {#if loading3D}
      <div class="spinner"></div>
    {:else}
      3D
    {/if}
  </button>
</div>
