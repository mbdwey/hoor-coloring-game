import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { CanvasStage, type CanvasStageHandle } from './components/CanvasStage';
import { ColorPalette, KID_COLORS } from './components/ColorPalette';
import { Toolbar } from './components/Toolbar';
import { SamplePickerModal } from './components/SamplePickerModal';
import { SettingsModal } from './components/SettingsModal';
import { DropZoneOverlay } from './components/DropZoneOverlay';
import { SAMPLE_SKETCHES, type SampleSketch } from './data/sampleSketches';
import { processSketchImage, type ProcessedSketch, type ProcessingOptions } from './utils/imageProcessing';
import { sound } from './utils/audio';
import { welcomeVoice } from './utils/welcomeAudio';

export function App() {
  const canvasRef = useRef<CanvasStageHandle>(null);

  // Core App State
  const [sketch, setSketch] = useState<ProcessedSketch | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(KID_COLORS[0].hex);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Modals (Sample sketch picker is open by default on launch!)
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Audio & Processing Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    sensitivity: 0.12,
    closeGaps: true,
    denoise: true,
    maxDimension: 1200,
  });

  // Keep a reference to the active raw source image so settings changes can re-process it
  const activeSourceImageRef = useRef<HTMLImageElement | null>(null);

  // Process a loaded HTMLImageElement and update canvas
  const processImageElement = useCallback(async (
    img: HTMLImageElement,
    options: ProcessingOptions
  ) => {
    setIsProcessing(true);
    try {
      // Yield to event loop so loading UI renders
      await new Promise((resolve) => setTimeout(resolve, 50));
      const processed = await processSketchImage(img, options);
      setSketch(processed);
      activeSourceImageRef.current = img;
    } catch (err) {
      console.error('Failed to process sketch image:', err);
      alert('Could not process this image. Please try a different photo!');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Load an image from a URL, Blob URI, or Data URI
  const loadImageFromUri = useCallback((uri: string, options: ProcessingOptions) => {
    const img = new Image();
    // Only set crossOrigin for external http(s) URLs; setting it on data: or blob: causes CORS blocks in Chromium/WebKit
    if (!uri.startsWith('data:') && !uri.startsWith('blob:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      processImageElement(img, options);
    };
    img.onerror = (e) => {
      console.error('Failed to load image from URI:', uri.slice(0, 100), e);
      alert('Could not load image. Please try a different drawing or photo.');
      setIsProcessing(false);
    };
    img.src = uri;
  }, [processImageElement]);

  // Initial load: Load default sample sketch & start welcome greeting
  useEffect(() => {
    const defaultSample = SAMPLE_SKETCHES[0];
    loadImageFromUri(defaultSample.svgDataUri, processingOptions);
    welcomeVoice.initAutoplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle user uploaded photo
  const handleUploadFile = (file: File) => {
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|heic|heif|bmp|svg)$/i.test(file.name);
    if (!isImage) {
      alert('Please upload an image file (JPG, PNG, WebP, SVG, etc.)');
      return;
    }

    try {
      const blobUrl = URL.createObjectURL(file);
      loadImageFromUri(blobUrl, processingOptions);
    } catch {
      // Fallback to FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        const uri = e.target?.result as string;
        if (uri) {
          loadImageFromUri(uri, processingOptions);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-process current image when processing settings change
  const handleChangeOptions = (newOpts: ProcessingOptions) => {
    setProcessingOptions(newOpts);
    if (activeSourceImageRef.current) {
      processImageElement(activeSourceImageRef.current, newOpts);
    }
  };

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    welcomeVoice.setMuted(!next);
    if (next) sound.playChime(660);
  };

  // Handle selecting a sample sketch
  const handleSelectSketch = (sample: SampleSketch) => {
    loadImageFromUri(sample.svgDataUri, processingOptions);
  };

  // Save / Export finished masterpiece
  const handleSave = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await canvasRef.current.exportImage();
      
      // Cheerful fanfare and confetti!
      sound.playFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#00C7FF', '#AF52DE'],
      });

      // Trigger download
      const link = document.createElement('a');
      link.download = `hoor-masterpiece-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export image:', err);
    }
  };

  // Drag and drop listeners on entire window
  const dragCounterRef = useRef(0);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current++;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current--;
      if (dragCounterRef.current <= 0) {
        setIsDragging(false);
        dragCounterRef.current = 0;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      dragCounterRef.current = 0;

      const file = e.dataTransfer?.files?.[0];
      if (file) {
        handleUploadFile(file);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processingOptions]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-indigo-100 font-sans select-none">
      {/* Top Action Bar */}
      <Toolbar
        canUndo={canUndo}
        onUndo={() => canvasRef.current?.undo()}
        onClear={() => canvasRef.current?.clear()}
        onOpenSamples={() => setIsSampleModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onSave={handleSave}
        onUploadImage={handleUploadFile}
        onPlayWelcomeVoice={() => welcomeVoice.play()}
        isProcessing={isProcessing}
      />

      {/* Main Interactive Canvas Area */}
      <main className="flex-1 relative w-full h-full min-h-0 overflow-hidden">
        <CanvasStage
          ref={canvasRef}
          sketch={sketch}
          selectedColor={selectedColor}
          onUndoAvailabilityChange={setCanUndo}
        />
      </main>

      {/* Kid-Friendly Bottom Color Palette */}
      <ColorPalette
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />

      {/* Modals and Overlays */}
      <SamplePickerModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSketch={(selected) => {
          handleSelectSketch(selected);
          welcomeVoice.play();
        }}
        onUploadImage={(file) => {
          handleUploadFile(file);
          welcomeVoice.play();
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        options={processingOptions}
        onChangeOptions={handleChangeOptions}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <DropZoneOverlay
        isDragging={isDragging}
        isProcessing={isProcessing}
      />
    </div>
  );
}

export default App;
