import React, { useRef } from 'react';
import { SAMPLE_SKETCHES, type SampleSketch } from '../data/sampleSketches';
import { X, Sparkles, Camera, UploadCloud } from 'lucide-react';

interface SamplePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSketch: (sketch: SampleSketch) => void;
  onUploadImage: (file: File) => void;
}

export const SamplePickerModal: React.FC<SamplePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectSketch,
  onUploadImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
      onClose();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-gradient-to-b from-amber-50 via-orange-50 to-indigo-50 border-4 border-amber-300 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 w-11 h-11 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform active:scale-90 z-10"
        >
          <X className="w-6 h-6" strokeWidth={3} />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-amber-200/90 px-4 py-1 rounded-full text-amber-950 font-bold text-xs sm:text-sm mb-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Welcome to Hoor Coloring Game!
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
            Choose What to Color! 🎨
          </h2>
          <p className="text-xs sm:text-sm text-amber-900/80 mt-1">
            Upload your own sketch or pick a fun picture below
          </p>
        </div>

        {/* Section 1: Upload Your Own Drawing */}
        <div className="mb-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            onChange={handleFileChange}
            className="hidden"
            id="modal-upload-input"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full group bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 hover:from-indigo-600 hover:via-purple-600 hover:to-rose-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-indigo-300/40 border-3 border-white transition-all duration-200 flex items-center justify-between gap-4 active:scale-98 cursor-pointer text-left"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/40 group-hover:scale-105 transition-transform">
                <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-black text-lg sm:text-xl flex items-center gap-2">
                  <span>📸 Color Your Own Drawing</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-300 text-amber-950 font-bold">
                    Magic!
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-indigo-100">
                  Take a photo of paper drawing or select from your photos
                </div>
              </div>
            </div>

            <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/20 items-center justify-center shrink-0">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t-2 border-amber-200"></div>
          <span className="flex-shrink mx-3 text-amber-800/80 font-bold text-xs uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
            Or Pick a Ready Picture
          </span>
          <div className="flex-grow border-t-2 border-amber-200"></div>
        </div>

        {/* Section 2: Ready Sample Sketches Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {SAMPLE_SKETCHES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => {
                onSelectSketch(sample);
                onClose();
              }}
              type="button"
              className="group bg-white rounded-2xl p-3 sm:p-3.5 border-3 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all duration-200 flex flex-col items-center gap-2.5 active:scale-95 cursor-pointer"
            >
              <div className="w-full aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                <img
                  src={sample.svgDataUri}
                  alt={sample.title}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
              <span className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-1.5">
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
