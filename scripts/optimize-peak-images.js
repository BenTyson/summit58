#!/usr/bin/env node
/**
 * Optimize peak hero images
 * Converts PNG to optimized JPEG, resizes to max 1920px width
 * Target: ~100-200KB per image (down from ~3MB)
 */

import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import { join } from 'path';

const PEAKS_DIR = './static/images/peaks';
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 82;

async function optimizeImages() {
  const files = await readdir(PEAKS_DIR);
  const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f) && !f.startsWith('.'));

  console.log(`Found ${imageFiles.length} images to optimize\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of imageFiles) {
    const inputPath = join(PEAKS_DIR, file);
    const baseName = file.replace(/\.(png|jpg|jpeg)$/i, '');
    const outputPath = join(PEAKS_DIR, `${baseName}.jpg`);
    const tempPath = join(PEAKS_DIR, `${baseName}_optimized.jpg`);

    try {
      const originalStats = await stat(inputPath);
      const originalSize = originalStats.size;
      totalOriginal += originalSize;

      // Optimize: resize to max width, convert to JPEG
      await sharp(inputPath)
        .resize(MAX_WIDTH, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({
          quality: JPEG_QUALITY,
          mozjpeg: true
        })
        .toFile(tempPath);

      const newStats = await stat(tempPath);
      const newSize = newStats.size;
      totalOptimized += newSize;

      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
      const originalKB = (originalSize / 1024).toFixed(0);
      const newKB = (newSize / 1024).toFixed(0);

      // Remove original if PNG, rename temp to final
      if (file.toLowerCase().endsWith('.png')) {
        await unlink(inputPath);
      } else if (inputPath !== outputPath) {
        await unlink(inputPath);
      }
      await rename(tempPath, outputPath);

      console.log(`✓ ${file} → ${baseName}.jpg (${originalKB}KB → ${newKB}KB, -${savings}%)`);

    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  }

  const totalOriginalMB = (totalOriginal / 1024 / 1024).toFixed(1);
  const totalOptimizedMB = (totalOptimized / 1024 / 1024).toFixed(1);
  const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total: ${totalOriginalMB}MB → ${totalOptimizedMB}MB (-${totalSavings}%)`);
  console.log(`${'='.repeat(50)}`);
}

optimizeImages().catch(console.error);
