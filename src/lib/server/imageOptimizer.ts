interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

const DEFAULT_OPTIONS: OptimizeOptions = {
  maxWidth: 1600,
  maxHeight: 1200,
  quality: 80
};

// Use createRequire to load sharp at runtime, bypassing Vite's static analysis.
// Vite/SvelteKit bundles all import() targets which breaks sharp's native binaries.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSharp(): Promise<any> {
  try {
    const { createRequire } = await import(/* @vite-ignore */ 'node:module');
    const require = createRequire(import.meta.url);
    return require('sharp');
  } catch {
    return null;
  }
}

/**
 * Optimize an image buffer using sharp
 * - Resizes to max dimensions while maintaining aspect ratio
 * - Converts to JPEG with specified quality
 * - Strips metadata (EXIF, etc.)
 *
 * Falls back to returning the original buffer if sharp is unavailable.
 */
export async function optimizeImage(
  buffer: Buffer | ArrayBuffer,
  options: OptimizeOptions = {}
): Promise<Buffer> {
  const inputBuffer = buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;
  const sharp = await getSharp();

  if (!sharp) {
    return inputBuffer;
  }

  const { maxWidth, maxHeight, quality } = { ...DEFAULT_OPTIONS, ...options };

  const optimized = await sharp(inputBuffer)
    .rotate() // Auto-rotate based on EXIF
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({
      quality,
      progressive: true,
      mozjpeg: true
    })
    .toBuffer();

  return optimized;
}

/**
 * Get image metadata (dimensions, format, size)
 */
export async function getImageMetadata(buffer: Buffer | ArrayBuffer) {
  const sharp = await getSharp();
  if (!sharp) return null;

  const inputBuffer = buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;
  return sharp(inputBuffer).metadata();
}
