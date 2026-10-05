import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import type { ProcessedSketch } from '../utils/imageProcessing';
import { performFloodFill } from '../utils/floodFill';
import { sound } from '../utils/audio';
import { SparkleOverlay, type SparklePoint } from './SparkleOverlay';

export interface CanvasStageHandle {
  undo: () => boolean;
  canUndo: boolean;
  clear: () => void;
  exportImage: () => Promise<string>;
}

interface CanvasStageProps {
  sketch: ProcessedSketch | null;
  selectedColor: string;
  onUndoAvailabilityChange?: (canUndo: boolean) => void;
}

export const CanvasStage = forwardRef<CanvasStageHandle, CanvasStageProps>(({
  sketch,
  selectedColor,
  onUndoAvailabilityChange,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const colorCanvasRef = useRef<HTMLCanvasElement>(null);
  const lineCanvasRef = useRef<HTMLCanvasElement>(null);

  // Undo Stack (keeps up to 25 full canvas states)
  const undoStackRef = useRef<ImageData[]>([]);
  const [canUndoState, setCanUndoState] = useState(false);

  // Sparkles on tap
  const [sparkles, setSparkles] = useState<SparklePoint[]>([]);

  const updateCanUndo = useCallback((canUndo: boolean) => {
    setCanUndoState(canUndo);
    onUndoAvailabilityChange?.(canUndo);
  }, [onUndoAvailabilityChange]);

  // Initialize and redraw canvases whenever a new sketch is loaded
  useEffect(() => {
    if (!sketch) return;

    const { width, height, lineArtImageData } = sketch;

    // Reset undo history
    undoStackRef.current = [];
    updateCanUndo(false);

    // 1. Setup Color Canvas (middle interactive layer)
    const colorCanvas = colorCanvasRef.current;
    if (colorCanvas) {
      colorCanvas.width = width;
      colorCanvas.height = height;
      const ctx = colorCanvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
    }

    // 2. Setup Line Art Overlay (top transparent layer)
    const lineCanvas = lineCanvasRef.current;
    if (lineCanvas) {
      lineCanvas.width = width;
      lineCanvas.height = height;
      const ctx = lineCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.putImageData(lineArtImageData, 0, 0);
      }
    }
  }, [sketch, updateCanUndo]);

  // Handle tap / click for coloring
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!sketch || !colorCanvasRef.current) return;

    const canvas = colorCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const targetX = Math.floor((e.clientX - rect.left) * scaleX);
    const targetY = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Snapshot current state for Undo
    const previousSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Execute flood fill
    const result = performFloodFill(
      ctx,
      sketch.binaryMask,
      sketch.width,
      sketch.height,
      targetX,
      targetY,
      selectedColor
    );

    if (result.modified) {
      // Push snapshot to undo stack (max 25)
      undoStackRef.current.push(previousSnapshot);
      if (undoStackRef.current.length > 25) {
        undoStackRef.current.shift();
      }
      updateCanUndo(true);

      // Auditory & visual feedback
      sound.playPop();

      // Trigger sparkle burst at touch point
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const screenX = e.clientX - containerRect.left;
        const screenY = e.clientY - containerRect.top;

        setSparkles(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: screenX,
            y: screenY,
            color: selectedColor,
          }
        ]);
      }
    }
  };

  // Imperative handle for parent component actions
  useImperativeHandle(ref, () => ({
    undo: () => {
      if (undoStackRef.current.length === 0 || !colorCanvasRef.current) return false;
      const ctx = colorCanvasRef.current.getContext('2d');
      if (!ctx) return false;

      const previousState = undoStackRef.current.pop();
      if (previousState) {
        ctx.putImageData(previousState, 0, 0);
        sound.playChime(520);
        const hasMore = undoStackRef.current.length > 0;
        updateCanUndo(hasMore);
        return true;
      }
      return false;
    },

    canUndo: canUndoState,

    clear: () => {
      if (!colorCanvasRef.current) return;
      const ctx = colorCanvasRef.current.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Save to undo stack before clearing
      undoStackRef.current.push(ctx.getImageData(0, 0, colorCanvasRef.current.width, colorCanvasRef.current.height));
      updateCanUndo(true);

      ctx.clearRect(0, 0, colorCanvasRef.current.width, colorCanvasRef.current.height);
      sound.playWhoosh();
    },

    exportImage: async () => {
      if (!sketch || !colorCanvasRef.current || !lineCanvasRef.current) {
        throw new Error('No sketch loaded');
      }

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = sketch.width;
      exportCanvas.height = sketch.height;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not create export canvas');

      // 1. Draw crisp white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, sketch.width, sketch.height);

      // 2. Composite filled color layer
      ctx.drawImage(colorCanvasRef.current, 0, 0);

      // 3. Composite line art overlay
      ctx.drawImage(lineCanvasRef.current, 0, 0);

      return exportCanvas.toDataURL('image/png');
    }
  }), [sketch, canUndoState, updateCanUndo]);

  const handleSparkleComplete = useCallback((id: number) => {
    setSparkles(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden p-2 sm:p-4 select-none touch-none"
    >
      {sketch ? (
        <div 
          className="relative max-w-full max-h-full shadow-2xl rounded-2xl overflow-hidden bg-white border-4 border-amber-300"
          style={{
            aspectRatio: `${sketch.width} / ${sketch.height}`,
          }}
        >
          {/* Base Paper Canvas (pure white background) */}
          <div className="absolute inset-0 bg-white" />

          {/* Middle Layer: Color Fill Canvas (Interactive touch receiver) */}
          <canvas
            ref={colorCanvasRef}
            onPointerDown={handlePointerDown}
            className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"
            style={{ imageRendering: 'auto' }}
          />

          {/* Top Layer: Line Art Overlay (Crisp black outlines, pointer-events none) */}
          <canvas
            ref={lineCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            style={{ imageRendering: 'auto' }}
          />

          {/* Touch Sparkle Particle Burst */}
          <SparkleOverlay sparkles={sparkles} onComplete={handleSparkleComplete} />
        </div>
      ) : (
        <div className="text-center text-slate-400">Loading drawing...</div>
      )}
    </div>
  );
});
