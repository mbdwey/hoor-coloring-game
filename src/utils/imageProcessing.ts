// Image Processing Pipeline: Converts camera photos of sketches into crisp, clean line art

export interface ProcessingOptions {
  maxDimension?: number;
  sensitivity?: number; // 0.05 to 0.25 (default: 0.12)
  closeGaps?: boolean;  // Apply morphological closing to bridge 1-3px stroke gaps
  denoise?: boolean;
}

export interface ProcessedSketch {
  width: number;
  height: number;
  lineArtImageData: ImageData;
  binaryMask: Uint8Array; // 1 = line boundary, 0 = fillable region
}

export async function processSketchImage(
  source: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  options: ProcessingOptions = {}
): Promise<ProcessedSketch> {
  const {
    maxDimension = 1200,
    sensitivity = 0.12,
    closeGaps = true,
    denoise = true
  } = options;

  // 1. Calculate downscaled dimensions preserving aspect ratio
  let targetWidth = source.width;
  let targetHeight = source.height;

  if (targetWidth > maxDimension || targetHeight > maxDimension) {
    if (targetWidth > targetHeight) {
      targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
      targetWidth = maxDimension;
    } else {
      targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
      targetHeight = maxDimension;
    }
  }

  // Ensure minimum dimensions
  targetWidth = Math.max(100, targetWidth);
  targetHeight = Math.max(100, targetHeight);

  // 2. Render onto an offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not acquire 2D canvas context');

  // Fill with white first in case of transparent pngs
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(source, 0, 0, targetWidth, targetHeight);

  const rawImageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const rawPixels = rawImageData.data;
  const pixelCount = targetWidth * targetHeight;

  // 3. Compute Luminance Grayscale Array
  const grayscale = new Uint8Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    // Standard perceptual luminance formula
    grayscale[i] = Math.round(
      0.299 * rawPixels[idx] + 
      0.587 * rawPixels[idx + 1] + 
      0.114 * rawPixels[idx + 2]
    );
  }

  // 4. Optional 3x3 Gaussian/Box Denoise filter on grayscale (smoothes paper grain/pencil dust)
  let smoothedGray = grayscale;
  if (denoise) {
    smoothedGray = new Uint8Array(pixelCount);
    for (let y = 0; y < targetHeight; y++) {
      const y0 = Math.max(0, y - 1) * targetWidth;
      const y1 = y * targetWidth;
      const y2 = Math.min(targetHeight - 1, y + 1) * targetWidth;

      for (let x = 0; x < targetWidth; x++) {
        const x0 = Math.max(0, x - 1);
        const x2 = Math.min(targetWidth - 1, x + 1);

        // 3x3 weighted smoothing (center weight 4, cardinal 2, diagonal 1)
        const sum =
          grayscale[y0 + x0] + 2 * grayscale[y0 + x] + grayscale[y0 + x2] +
          2 * grayscale[y1 + x0] + 4 * grayscale[y1 + x] + 2 * grayscale[y1 + x2] +
          grayscale[y2 + x0] + 2 * grayscale[y2 + x] + grayscale[y2 + x2];

        smoothedGray[y1 + x] = Math.round(sum / 16);
      }
    }
  }

  // 5. Compute 2D Integral Image (Prefix sums for Bradley-Roth Adaptive Thresholding)
  // Float64Array guarantees no integer overflow for large images
  const integral = new Float64Array((targetWidth + 1) * (targetHeight + 1));
  const intStride = targetWidth + 1;

  for (let y = 0; y < targetHeight; y++) {
    let rowSum = 0;
    const yOffset = (y + 1) * intStride;
    const prevYOffset = y * intStride;
    const grayOffset = y * targetWidth;

    for (let x = 0; x < targetWidth; x++) {
      rowSum += smoothedGray[grayOffset + x];
      integral[yOffset + (x + 1)] = integral[prevYOffset + (x + 1)] + rowSum;
    }
  }

  // 6. Bradley-Roth Adaptive Thresholding
  // Window radius: adapts to sketch size (roughly 1/32 of image dimension)
  const windowRadius = Math.max(10, Math.min(32, Math.round(targetWidth / 32)));
  const thresholdRatio = 1.0 - sensitivity;
  let binaryMask = new Uint8Array(pixelCount); // 1 = line, 0 = background

  for (let y = 0; y < targetHeight; y++) {
    const y1 = Math.max(0, y - windowRadius);
    const y2 = Math.min(targetHeight - 1, y + windowRadius);
    const intY1 = y1 * intStride;
    const intY2 = (y2 + 1) * intStride;
    const grayRow = y * targetWidth;

    for (let x = 0; x < targetWidth; x++) {
      const x1 = Math.max(0, x - windowRadius);
      const x2 = Math.min(targetWidth - 1, x + windowRadius);

      const count = (x2 - x1 + 1) * (y2 - y1 + 1);
      const sum =
        integral[intY2 + (x2 + 1)] -
        integral[intY1 + (x2 + 1)] -
        integral[intY2 + x1] +
        integral[intY1 + x1];

      const localMean = sum / count;
      const pixelVal = smoothedGray[grayRow + x];

      // A pixel is a line if it is significantly darker than the local neighborhood average
      if (pixelVal < localMean * thresholdRatio && pixelVal < 210) {
        binaryMask[grayRow + x] = 1;
      } else {
        binaryMask[grayRow + x] = 0;
      }
    }
  }

  // 7. Morphological Closing (Dilation followed by Erosion)
  // Essential for hand-drawn sketches: seals 1-3px gaps in pencil lines so flood-fill doesn't leak!
  if (closeGaps) {
    const dilated = new Uint8Array(pixelCount);
    // Dilation pass (3x3 cross kernel)
    for (let y = 0; y < targetHeight; y++) {
      const yPrev = Math.max(0, y - 1) * targetWidth;
      const yCurr = y * targetWidth;
      const yNext = Math.min(targetHeight - 1, y + 1) * targetWidth;

      for (let x = 0; x < targetWidth; x++) {
        const xPrev = Math.max(0, x - 1);
        const xNext = Math.min(targetWidth - 1, x + 1);

        if (
          binaryMask[yCurr + x] === 1 ||
          binaryMask[yPrev + x] === 1 ||
          binaryMask[yNext + x] === 1 ||
          binaryMask[yCurr + xPrev] === 1 ||
          binaryMask[yCurr + xNext] === 1
        ) {
          dilated[yCurr + x] = 1;
        }
      }
    }

    // Erosion pass (3x3 cross kernel)
    const closed = new Uint8Array(pixelCount);
    for (let y = 0; y < targetHeight; y++) {
      const yPrev = Math.max(0, y - 1) * targetWidth;
      const yCurr = y * targetWidth;
      const yNext = Math.min(targetHeight - 1, y + 1) * targetWidth;

      for (let x = 0; x < targetWidth; x++) {
        const xPrev = Math.max(0, x - 1);
        const xNext = Math.min(targetWidth - 1, x + 1);

        if (
          dilated[yCurr + x] === 1 &&
          dilated[yPrev + x] === 1 &&
          dilated[yNext + x] === 1 &&
          dilated[yCurr + xPrev] === 1 &&
          dilated[yCurr + xNext] === 1
        ) {
          closed[yCurr + x] = 1;
        }
      }
    }
    binaryMask = closed;
  }

  // 8. Generate Clean Transparent Line Art (RGBA)
  // Lines become crisp charcoal black (#1e2024), background is 100% transparent.
  // We also apply subtle anti-aliasing on edges for buttery-smooth rendering.
  const lineArtImageData = ctx.createImageData(targetWidth, targetHeight);
  const outPixels = lineArtImageData.data;

  for (let y = 0; y < targetHeight; y++) {
    const rowOffset = y * targetWidth;
    for (let x = 0; x < targetWidth; x++) {
      const idx = (rowOffset + x) * 4;
      const isLine = binaryMask[rowOffset + x] === 1;

      if (isLine) {
        // Deep ink charcoal black
        outPixels[idx] = 25;      // R
        outPixels[idx + 1] = 27;  // G
        outPixels[idx + 2] = 34;  // B
        outPixels[idx + 3] = 255; // Solid Alpha
      } else {
        // Check if adjacent to a line to create an antialiased soft outline
        let neighborLineCount = 0;
        if (x > 0 && binaryMask[rowOffset + x - 1] === 1) neighborLineCount++;
        if (x < targetWidth - 1 && binaryMask[rowOffset + x + 1] === 1) neighborLineCount++;
        if (y > 0 && binaryMask[(y - 1) * targetWidth + x] === 1) neighborLineCount++;
        if (y < targetHeight - 1 && binaryMask[(y + 1) * targetWidth + x] === 1) neighborLineCount++;

        if (neighborLineCount >= 2) {
          // Soft edge pixel
          outPixels[idx] = 30;
          outPixels[idx + 1] = 32;
          outPixels[idx + 2] = 40;
          outPixels[idx + 3] = 130; // Semi-transparent antialiasing
        } else {
          // Pure transparent
          outPixels[idx] = 0;
          outPixels[idx + 1] = 0;
          outPixels[idx + 2] = 0;
          outPixels[idx + 3] = 0;
        }
      }
    }
  }

  return {
    width: targetWidth,
    height: targetHeight,
    lineArtImageData,
    binaryMask,
  };
}
