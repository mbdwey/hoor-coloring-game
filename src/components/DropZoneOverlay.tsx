import React from 'react';
import { UploadCloud, Wand2 } from 'lucide-react';

interface DropZoneOverlayProps {
  isDragging: boolean;
  isProcessing: boolean;
}

export const DropZoneOverlay: React.FC<DropZoneOverlayProps> = ({
  isDragging,
  isProcessing,
}) => {
  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-indigo-950/70 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/30 border-2 border-indigo-400 flex items-center justify-center mb-4 animate-bounce">
          <Wand2 className="w-10 h-10 text-amber-300" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black mb-2">
          Working Magic! ✨
        </h2>
        <p className="text-sm sm:text-base text-indigo-200 max-w-sm">
          Erasing paper shadows, cleaning pencil lines, and preparing your coloring page...
        </p>
      </div>
    );
  }

  if (isDragging) {
    return (
      <div className="fixed inset-0 bg-indigo-600/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-white text-center pointer-events-none animate-in fade-in duration-150">
        <div className="w-24 h-24 rounded-3xl bg-white/20 border-4 border-dashed border-white flex items-center justify-center mb-4 scale-110">
          <UploadCloud className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-black mb-2">
          Drop Drawing Photo Here! 📸
        </h2>
        <p className="text-lg text-indigo-100">
          Release to turn it into an interactive coloring book!
        </p>
      </div>
    );
  }

  return null;
};
