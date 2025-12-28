import sharp from 'sharp';

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

/**
 * Optimize an image buffer using sharp
 * - Resizes to max dimensions while maintaining aspect ratio
 * - Converts to JPEG with specified quality
 * - Strips metadata (EXIF, etc.)
 */
export async function optimizeImage(
  buffer: Buffer | ArrayBuffer,
  options: OptimizeOptions = {}
): Promise<Buffer> {
  const { maxWidth, maxHeight, quality } = { ...DEFAULT_OPTIONS, ...options };

  const inputBuffer = buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;

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
  const inputBuffer = buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;
  return sharp(inputBuffer).metadata();
}
