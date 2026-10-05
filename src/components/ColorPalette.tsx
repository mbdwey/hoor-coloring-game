import React from 'react';
import { sound } from '../utils/audio';
import { Sparkles, Eraser } from 'lucide-react';

export interface PaletteColor {
  hex: string;
  name: string;
  isEraser?: boolean;
}

export const KID_COLORS: PaletteColor[] = [
  { hex: '#FF3B30', name: 'Strawberry Red' },
  { hex: '#FF9500', name: 'Sunny Orange' },
  { hex: '#FFCC00', name: 'Banana Yellow' },
  { hex: '#34C759', name: 'Lime Green' },
  { hex: '#008C4A', name: 'Forest Green' },
  { hex: '#00C7FF', name: 'Sky Blue' },
  { hex: '#007AFF', name: 'Ocean Blue' },
  { hex: '#AF52DE', name: 'Grape Purple' },
  { hex: '#FF2D55', name: 'Bubblegum Pink' },
  { hex: '#FF88A5', name: 'Cotton Candy' },
  { hex: '#8B572A', name: 'Chocolate Brown' },
  { hex: '#FFFFFF', name: 'White Eraser', isEraser: true },
];

interface ColorPaletteProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  onSelectColor,
}) => {
  const handleSelect = (colorHex: string, noteIndex: number) => {
    // Play an ascending chime based on palette index
    const baseFreq = 440;
    const freq = baseFreq * Math.pow(1.059463, noteIndex);
    sound.playChime(freq);
    onSelectColor(colorHex);
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t-4 border-amber-200 shadow-2xl py-3 px-4 z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar py-1">
        {KID_COLORS.map((color, index) => {
          const isSelected = selectedColor.toUpperCase() === color.hex.toUpperCase();

          return (
            <button
              key={color.hex + color.name}
              type="button"
              onClick={() => handleSelect(color.hex, index)}
              aria-label={`Select ${color.name}`}
              className={`
                relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full
                transition-all duration-200 active:scale-90
                shadow-md hover:shadow-lg flex items-center justify-center
                ${isSelected ? 'scale-115 -translate-y-1.5 shadow-xl ring-4 ring-offset-2 ring-indigo-400' : 'hover:scale-105'}
                ${color.hex === '#FFFFFF' ? 'border-2 border-slate-300' : 'border-2 border-white/60'}
              `}
              style={{
                backgroundColor: color.hex,
              }}
            >
              {color.isEraser && (
                <Eraser 
                  className={`w-6 h-6 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} 
                  strokeWidth={2.5}
                />
              )}

              {isSelected && !color.isEraser && (
                <Sparkles 
                  className={`w-6 h-6 ${['#FFFFFF', '#FFCC00', '#FF88A5'].includes(color.hex) ? 'text-slate-800' : 'text-white'}`} 
                  fill="currentColor"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
