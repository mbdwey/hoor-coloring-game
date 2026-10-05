import React from 'react';
import { X, Sliders, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import type { ProcessingOptions } from '../utils/imageProcessing';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: ProcessingOptions;
  onChangeOptions: (newOpts: ProcessingOptions) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  options,
  onChangeOptions,
  soundEnabled,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border-4 border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute -top-3 -right-3 w-10 h-10 bg-slate-700 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform active:scale-90"
        >
          <X className="w-6 h-6" strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Drawing Settings</h2>
            <p className="text-xs text-slate-500">Fine-tune photo line extraction & audio</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-6 h-6 text-emerald-600" />
              ) : (
                <VolumeX className="w-6 h-6 text-slate-400" />
              )}
              <div>
                <div className="font-semibold text-slate-800">Sound Effects</div>
                <div className="text-xs text-slate-500">Pops, chimes & celebration fanfares</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Line Sensitivity Slider */}
          <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">Line Detection Sensitivity</span>
              <span className="text-sm font-bold text-indigo-600">
                {Math.round((options.sensitivity ?? 0.12) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.25"
              step="0.01"
              value={options.sensitivity ?? 0.12}
              onChange={(e) =>
                onChangeOptions({
                  ...options,
                  sensitivity: parseFloat(e.target.value),
                })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Light Pencil</span>
              <span>Balanced</span>
              <span>Dark Marker</span>
            </div>
          </div>

          {/* Stroke Gap Closing */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <div>
                <div className="font-semibold text-slate-800">Seal Stroke Gaps</div>
                <div className="text-xs text-slate-500">Prevents flood fill color from leaking</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangeOptions({
                  ...options,
                  closeGaps: !options.closeGaps,
                })
              }
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                options.closeGaps !== false ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-98"
        >
          Done
        </button>
      </div>
    </div>
  );
};
