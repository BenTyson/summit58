<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getCumulativeDistances } from '$lib/utils/geo';

  interface Props {
    coordinates: [number, number, number][]; // [lon, lat, elevation]
    difficultyClass?: number;
    hoveredIndex?: number | null;
    onHover?: (index: number | null) => void;
  }

  let {
    coordinates,
    difficultyClass = 1,
    hoveredIndex = null,
    onHover
  }: Props = $props();

  let canvas: HTMLCanvasElement;
  let container: HTMLDivElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationFrame: number | null = null;

  // Cached calculations
  let distances: number[] = [];
  let elevations: number[] = [];
  let minElevation = 0;
  let maxElevation = 0;
  let totalDistance = 0;

  // Dimensions
  const PADDING = { top: 20, right: 20, bottom: 40, left: 60 };
  let width = 0;
  let height = 0;

  // Difficulty class colors
  const classColors: Record<number, string> = {
    1: '#22c55e',
    2: '#3b82f6',
    3: '#eab308',
    4: '#ef4444'
  };

  const color = $derived(classColors[difficultyClass] || classColors[1]);

  // Process coordinates when they change
  $effect(() => {
    if (coordinates.length > 0) {
      distances = getCumulativeDistances(coordinates);
      elevations = coordinates.map((c) => c[2]);
      minElevation = Math.min(...elevations);
      maxElevation = Math.max(...elevations);
      totalDistance = distances[distances.length - 1] || 0;

      // Add some padding to elevation range
      const elevRange = maxElevation - minElevation;
      minElevation = Math.floor((minElevation - elevRange * 0.05) / 100) * 100;
      maxElevation = Math.ceil((maxElevation + elevRange * 0.05) / 100) * 100;

      draw();
    }
  });

  // Redraw when hoveredIndex changes
  $effect(() => {
    if (hoveredIndex !== undefined) {
      draw();
    }
  });

  function setupCanvas() {
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    draw();
  }

  function draw() {
    if (!ctx || coordinates.length < 2) return;

    const chartWidth = width - PADDING.left - PADDING.right;
    const chartHeight = height - PADDING.top - PADDING.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    drawGrid(chartWidth, chartHeight);

    // Draw elevation area
    drawElevationArea(chartWidth, chartHeight);

    // Draw elevation line
    drawElevationLine(chartWidth, chartHeight);

    // Draw axes labels
    drawAxes(chartWidth, chartHeight);

    // Draw hover indicator
    if (hoveredIndex !== null && hoveredIndex >= 0 && hoveredIndex < coordinates.length) {
      drawHoverIndicator(chartWidth, chartHeight, hoveredIndex);
    }
  }

  function drawGrid(chartWidth: number, chartHeight: number) {
    if (!ctx) return;

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    // Horizontal grid lines (elevation)
    const elevSteps = 5;
    const elevStep = (maxElevation - minElevation) / elevSteps;

    for (let i = 0; i <= elevSteps; i++) {
      const y = PADDING.top + (chartHeight * i) / elevSteps;
      ctx.beginPath();
      ctx.moveTo(PADDING.left, y);
      ctx.lineTo(PADDING.left + chartWidth, y);
      ctx.stroke();
    }

    // Vertical grid lines (distance)
    const distSteps = Math.min(5, Math.ceil(totalDistance));
    for (let i = 0; i <= distSteps; i++) {
      const x = PADDING.left + (chartWidth * i) / distSteps;
      ctx.beginPath();
      ctx.moveTo(x, PADDING.top);
      ctx.lineTo(x, PADDING.top + chartHeight);
      ctx.stroke();
    }
  }

  function drawElevationArea(chartWidth: number, chartHeight: number) {
    if (!ctx || elevations.length < 2) return;

    const gradient = ctx.createLinearGradient(0, PADDING.top, 0, PADDING.top + chartHeight);
    gradient.addColorStop(0, color + '40'); // 25% opacity at top
    gradient.addColorStop(1, color + '05'); // 2% opacity at bottom

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(PADDING.left, PADDING.top + chartHeight);

    for (let i = 0; i < elevations.length; i++) {
      const x = PADDING.left + (distances[i] / totalDistance) * chartWidth;
      const y = PADDING.top + chartHeight - ((elevations[i] - minElevation) / (maxElevation - minElevation)) * chartHeight;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(PADDING.left + chartWidth, PADDING.top + chartHeight);
    ctx.closePath();
    ctx.fill();
  }

  function drawElevationLine(chartWidth: number, chartHeight: number) {
    if (!ctx || elevations.length < 2) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();

    for (let i = 0; i < elevations.length; i++) {
      const x = PADDING.left + (distances[i] / totalDistance) * chartWidth;
      const y = PADDING.top + chartHeight - ((elevations[i] - minElevation) / (maxElevation - minElevation)) * chartHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }

  function drawAxes(chartWidth: number, chartHeight: number) {
    if (!ctx) return;

    ctx.fillStyle = '#64748b';
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'right';

    // Y-axis labels (elevation)
    const elevSteps = 5;
    const elevStep = (maxElevation - minElevation) / elevSteps;

    for (let i = 0; i <= elevSteps; i++) {
      const elev = maxElevation - elevStep * i;
      const y = PADDING.top + (chartHeight * i) / elevSteps;
      ctx.fillText(`${Math.round(elev).toLocaleString()}'`, PADDING.left - 8, y + 4);
    }

    // X-axis labels (distance)
    ctx.textAlign = 'center';
    const distSteps = Math.min(5, Math.ceil(totalDistance));

    for (let i = 0; i <= distSteps; i++) {
      const dist = (totalDistance * i) / distSteps;
      const x = PADDING.left + (chartWidth * i) / distSteps;
      ctx.fillText(`${dist.toFixed(1)} mi`, x, height - 10);
    }
  }

  function drawHoverIndicator(chartWidth: number, chartHeight: number, index: number) {
    if (!ctx) return;

    const x = PADDING.left + (distances[index] / totalDistance) * chartWidth;
    const y = PADDING.top + chartHeight - ((elevations[index] - minElevation) / (maxElevation - minElevation)) * chartHeight;

    // Vertical line
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, PADDING.top);
    ctx.lineTo(x, PADDING.top + chartHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Point circle
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tooltip
    const tooltipText = `${Math.round(elevations[index]).toLocaleString()}' @ ${distances[index].toFixed(1)} mi`;
    const tooltipWidth = ctx.measureText(tooltipText).width + 16;
    const tooltipHeight = 24;
    let tooltipX = x - tooltipWidth / 2;
    const tooltipY = y - 35;

    // Keep tooltip in bounds
    if (tooltipX < PADDING.left) tooltipX = PADDING.left;
    if (tooltipX + tooltipWidth > width - PADDING.right) {
      tooltipX = width - PADDING.right - tooltipWidth;
    }

    // Tooltip background
    ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
    ctx.beginPath();
    ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 4);
    ctx.fill();

    // Tooltip text
    ctx.fillStyle = 'white';
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(tooltipText, tooltipX + tooltipWidth / 2, tooltipY + 16);
  }

  function handleMouseMove(event: MouseEvent) {
    if (!container || coordinates.length < 2) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const chartWidth = width - PADDING.left - PADDING.right;

    // Calculate which point we're closest to
    const relativeX = (x - PADDING.left) / chartWidth;

    if (relativeX < 0 || relativeX > 1) {
      onHover?.(null);
      return;
    }

    const targetDistance = relativeX * totalDistance;

    // Find closest point
    let closestIndex = 0;
    let closestDiff = Math.abs(distances[0] - targetDistance);

    for (let i = 1; i < distances.length; i++) {
      const diff = Math.abs(distances[i] - targetDistance);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = i;
      }
    }

    onHover?.(closestIndex);
  }

  function handleMouseLeave() {
    onHover?.(null);
  }

  function handleResize() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    animationFrame = requestAnimationFrame(setupCanvas);
  }

  onMount(() => {
    setupCanvas();
    window.addEventListener('resize', handleResize);
  });

  onDestroy(() => {
    window.removeEventListener('resize', handleResize);
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
</script>

<div
  bind:this={container}
  class="elevation-profile w-full h-full min-h-[200px] relative"
  role="img"
  aria-label="Elevation profile chart"
>
  <canvas
    bind:this={canvas}
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    class="cursor-crosshair"
  ></canvas>
</div>

<style>
  .elevation-profile {
    background: linear-gradient(to bottom, rgb(248 250 252), white);
    border-radius: 0.75rem;
  }

  :global(.dark) .elevation-profile {
    background: linear-gradient(to bottom, rgb(30 41 59), rgb(15 23 42));
  }
</style>
