import React, { useRef } from 'react';
import { 
  Undo2, 
  RotateCcw, 
  Camera, 
  Download, 
  Image as ImageIcon,
  Settings,
  Sparkles
} from 'lucide-react';

interface ToolbarProps {
  canUndo: boolean;
  onUndo: () => void;
  onClear: () => void;
  onOpenSamples: () => void;
  onOpenSettings: () => void;
  onSave: () => void;
  onUploadImage: (file: File) => void;
  isProcessing: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  canUndo,
  onUndo,
  onClear,
  onOpenSamples,
  onOpenSettings,
  onSave,
  onUploadImage,
  isProcessing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
    // Reset so same file can be re-uploaded if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b-4 border-amber-200 shadow-md px-3 py-2 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 flex items-center justify-center shadow-md animate-pulse-subtle">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="hidden xs:block sm:block">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-amber-950 leading-none">
              Magic <span className="text-rose-500">Color!</span>
            </h1>
            <p className="text-[10px] sm:text-xs font-semibold text-amber-800/80 uppercase tracking-wider">
              Photo to Coloring Book
            </p>
          </div>
        </div>

        {/* Center / Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Undo Button */}
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo Last Color"
            className={`
              flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-bold text-sm sm:text-base
              transition-all duration-150 active:scale-90 shadow-sm
              ${canUndo 
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 cursor-pointer' 
                : 'bg-slate-100 text-slate-300 border-2 border-slate-200 cursor-not-allowed opacity-60'}
            `}
          >
            <Undo2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            <span className="hidden sm:inline">Undo</span>
          </button>

          {/* Clear / Restart Canvas */}
          <button
            type="button"
            onClick={onClear}
            title="Start Over"
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-bold text-sm sm:text-base bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-300 transition-all duration-150 active:scale-90 shadow-sm"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Samples Gallery */}
          <button
            type="button"
            onClick={onOpenSamples}
            title="Choose a Picture"
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-bold text-sm sm:text-base bg-sky-50 hover:bg-sky-100 text-sky-700 border-2 border-sky-300 transition-all duration-150 active:scale-90 shadow-sm"
          >
            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            <span className="hidden md:inline">Sketches</span>
          </button>

          {/* Camera / Photo Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload-input"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            title="Upload or Take Photo of a Drawing"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-bold text-sm sm:text-base bg-indigo-500 hover:bg-indigo-600 text-white border-2 border-indigo-400 transition-all duration-150 active:scale-90 shadow-md shadow-indigo-200"
          >
            <Camera className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            <span className="hidden md:inline">Photo</span>
          </button>

          {/* Save Artwork */}
          <button
            type="button"
            onClick={onSave}
            title="Save Finished Drawing"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-bold text-sm sm:text-base bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-emerald-400 transition-all duration-150 active:scale-90 shadow-md shadow-emerald-200"
          >
            <Download className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>

        {/* Settings Button */}
        <div>
          <button
            type="button"
            onClick={onOpenSettings}
            title="Drawing & Audio Settings"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 flex items-center justify-center transition-all duration-150 active:scale-90 shadow-sm"
          >
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </header>
  );
};
