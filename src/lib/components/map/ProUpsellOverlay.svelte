<script lang="ts">
  import { fade } from 'svelte/transition';

  type ProFeature = 'flythrough' | 'camera_modes' | 'traces_3d' | 'weather_3d';

  interface Props {
    feature: ProFeature;
    onDismiss: () => void;
  }

  let { feature, onDismiss }: Props = $props();

  const featureInfo: Record<ProFeature, { title: string; pitch: string }> = {
    flythrough: {
      title: 'Flythrough Animation',
      pitch: 'Experience the full route from a virtual hiker\'s perspective with smooth camera flythrough.'
    },
    camera_modes: {
      title: 'Advanced Camera Modes',
      pitch: 'Explore routes with bird\'s eye, hiker POV, and custom camera angles.'
    },
    traces_3d: {
      title: '3D Community Traces',
      pitch: 'See community GPS traces overlaid on 3D terrain for route comparison.'
    },
    weather_3d: {
      title: '3D Weather Overlay',
      pitch: 'View weather conditions at different elevation bands directly on the 3D terrain.'
    }
  };

  const info = $derived(featureInfo[feature]);
</script>

<style>
  .upsell-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .upsell-card {
    max-width: 340px;
    width: 90%;
    padding: 28px 24px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  :global(.dark) .upsell-card {
    background: rgba(30, 41, 59, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  }

  .upsell-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #C8A55C, #A8873A);
    margin-bottom: 16px;
  }

  .upsell-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #A8873A;
    background: rgba(200, 165, 92, 0.15);
    margin-bottom: 12px;
  }

  :global(.dark) .upsell-badge {
    color: #C8A55C;
    background: rgba(200, 165, 92, 0.2);
  }

  .upsell-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  :global(.dark) .upsell-title {
    color: white;
  }

  .upsell-text {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  :global(.dark) .upsell-text {
    color: #94a3b8;
  }

  .upsell-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 12px 20px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #C8A55C, #A8873A);
    color: white;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.15s ease;
  }

  .upsell-cta:hover {
    opacity: 0.9;
  }

  .upsell-dismiss {
    display: block;
    margin-top: 12px;
    padding: 8px;
    border: none;
    background: none;
    color: #94a3b8;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: color 0.15s ease;
    width: 100%;
  }

  .upsell-dismiss:hover {
    color: #64748b;
  }

  :global(.dark) .upsell-dismiss:hover {
    color: #cbd5e1;
  }
</style>

<div class="upsell-overlay" transition:fade={{ duration: 300 }}>
  <div class="upsell-card">
    <div class="upsell-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </div>

    <div class="upsell-badge">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z" />
      </svg>
      Pro Feature
    </div>

    <h3 class="upsell-title">{info.title}</h3>
    <p class="upsell-text">{info.pitch}</p>

    <a href="/pricing" class="upsell-cta">
      Upgrade to Pro
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </a>

    <button class="upsell-dismiss" onclick={onDismiss}>
      Maybe later
    </button>
  </div>
</div>
