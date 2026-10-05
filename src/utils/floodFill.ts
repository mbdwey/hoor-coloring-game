// High-Performance Scanline Flood Fill with Stroke-Underbleed & Little-Endian Uint32Array

export interface FloodFillResult {
  modified: boolean;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// Convert hex string (#RRGGBB or #RGB) to 32-bit ABGR format (little-endian for Canvas ImageData)
export function hexToUint32Color(hex: string, alpha = 255): number {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  // Little-endian in memory: R at byte 0, G at byte 1, B at byte 2, A at byte 3
  return (alpha << 24) | (b << 16) | (g << 8) | r;
}

export function performFloodFill(
  ctx: CanvasRenderingContext2D,
  binaryMask: Uint8Array,
  width: number,
  height: number,
  startX: number,
  startY: number,
  fillColorHex: string
): FloodFillResult {
  const defaultFail: FloodFillResult = { modified: false, minX: 0, minY: 0, maxX: 0, maxY: 0 };

  // Bounds check
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
    return defaultFail;
  }

  // If user tapped directly on a line, look at 8 neighbors to find adjacent open space
  let seedX = startX;
  let seedY = startY;

  if (binaryMask[startY * width + startX] === 1) {
    let found = false;
    for (let dy = -2; dy <= 2 && !found; dy++) {
      for (let dx = -2; dx <= 2 && !found; dx++) {
        const nx = startX + dx;
        const ny = startY + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          if (binaryMask[ny * width + nx] === 0) {
            seedX = nx;
            seedY = ny;
            found = true;
          }
        }
      }
    }
    if (!found) {
      return defaultFail; // Trapped directly inside a solid thick border
    }
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels32 = new Uint32Array(imageData.data.buffer);
  const newColor32 = hexToUint32Color(fillColorHex);
  const seedIndex = seedY * width + seedX;
  const targetColor32 = pixels32[seedIndex];

  // Already colored with the exact same color
  if (targetColor32 === newColor32) {
    return defaultFail;
  }

  // Scanline Flood Fill Queue using Float64/Int32 arrays for speed
  const queueX = new Int32Array(width * height);
  const queueY = new Int32Array(width * height);
  let queueHead = 0;
  let queueTail = 0;

  queueX[queueTail] = seedX;
  queueY[queueTail] = seedY;
  queueTail++;

  const visited = new Uint8Array(width * height);
  visited[seedIndex] = 1;

  let minX = seedX;
  let maxX = seedX;
  let minY = seedY;
  let maxY = seedY;

  // BFS / Scanline fill
  while (queueHead < queueTail) {
    const x = queueX[queueHead];
    const y = queueY[queueHead];
    queueHead++;

    const idx = y * width + x;
    pixels32[idx] = newColor32;

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;

    // 4-way neighbors (East, West, South, North)
    const neighbors = [
      x + 1, y,
      x - 1, y,
      x, y + 1,
      x, y - 1,
    ];

    for (let i = 0; i < 8; i += 2) {
      const nx = neighbors[i];
      const ny = neighbors[i + 1];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;

        if (visited[nIdx] === 0) {
          // If it's not a line boundary, and it matches the target color
          if (binaryMask[nIdx] === 0 && pixels32[nIdx] === targetColor32) {
            visited[nIdx] = 1;
            queueX[queueTail] = nx;
            queueY[queueTail] = ny;
            queueTail++;
          }
        }
      }
    }
  }

  // Stroke Underbleed:
  // Bleed color 1 pixel into adjacent boundary lines so there are NO white gap artifacts.
  // The line art overlay sits on top, so this looks crisp and seamless!
  for (let y = minY; y <= maxY; y++) {
    const rowOffset = y * width;
    for (let x = minX; x <= maxX; x++) {
      const idx = rowOffset + x;
      // If this pixel was filled
      if (visited[idx] === 1) {
        // Expand 1px to adjacent line pixels
        if (x > 0 && binaryMask[idx - 1] === 1) pixels32[idx - 1] = newColor32;
        if (x < width - 1 && binaryMask[idx + 1] === 1) pixels32[idx + 1] = newColor32;
        if (y > 0 && binaryMask[idx - width] === 1) pixels32[idx - width] = newColor32;
        if (y < height - 1 && binaryMask[idx + width] === 1) pixels32[idx + width] = newColor32;
      }
    }
  }

  // Put image data back onto the canvas
  ctx.putImageData(imageData, 0, 0);

  return {
    modified: true,
    minX: Math.max(0, minX - 1),
    minY: Math.max(0, minY - 1),
    maxX: Math.min(width - 1, maxX + 1),
    maxY: Math.min(height - 1, maxY + 1),
  };
}
