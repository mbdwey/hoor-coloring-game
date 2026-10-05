import React from 'react';
import { SAMPLE_SKETCHES, type SampleSketch } from '../data/sampleSketches';
import { X, Sparkles } from 'lucide-react';

interface SamplePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSketch: (sketch: SampleSketch) => void;
}

export const SamplePickerModal: React.FC<SamplePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectSketch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 border-4 border-amber-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute -top-3 -right-3 w-12 h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform active:scale-90"
        >
          <X className="w-7 h-7" strokeWidth={3} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-200/80 px-4 py-1.5 rounded-full text-amber-900 font-bold text-sm mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Pick a Fun Picture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
            Choose What to Color! 🎨
          </h2>
        </div>

        {/* Sketches Grid */}
        <div className="grid grid-cols-2 gap-4">
          {SAMPLE_SKETCHES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => {
                onSelectSketch(sample);
                onClose();
              }}
              type="button"
              className="group bg-white rounded-2xl p-4 border-3 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all duration-200 flex flex-col items-center gap-3 active:scale-95"
            >
              <div className="w-full aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                <img
                  src={sample.svgDataUri}
                  alt={sample.title}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
              <span className="font-bold text-slate-800 text-lg flex items-center gap-1.5">
                <span>{sample.emoji}</span>
                <span>{sample.title}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
