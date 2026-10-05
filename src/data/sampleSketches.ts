// Built-in Sample Sketches for immediate play without needing to upload a photo

export interface SampleSketch {
  id: string;
  title: string;
  emoji: string;
  svgDataUri: string;
}

// Helper to encode SVG string to Data URI with base64 for cross-browser reliability
function svgToUri(svgString: string): string {
  const clean = svgString.trim();
  try {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(clean)))}`;
  } catch {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(clean)}`;
  }
}

export const SAMPLE_SKETCHES: SampleSketch[] = [
  {
    id: 'dino',
    title: 'Dino Buddy',
    emoji: '🦖',
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <!-- White paper background -->
        <rect width="600" height="600" fill="#FFFFFF" />
        
        <!-- Ground line -->
        <path d="M 40 520 Q 300 500 560 520" stroke="#1E1E24" stroke-width="8" stroke-linecap="round" fill="none" />
        
        <!-- Dino Body & Head -->
        <path d="M 180 480 C 140 470 120 400 130 330 C 135 270 180 230 220 210 C 230 160 270 120 330 120 C 400 120 430 160 440 210 C 470 230 490 280 470 330 C 450 360 430 370 410 380 C 410 440 370 490 310 500 C 250 510 200 495 180 480 Z" stroke="#1E1E24" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Big Smiling Mouth -->
        <path d="M 330 230 Q 380 270 420 230" stroke="#1E1E24" stroke-width="8" stroke-linecap="round" fill="none" />
        
        <!-- Big Friendly Eye -->
        <circle cx="340" cy="180" r="28" stroke="#1E1E24" stroke-width="8" fill="#FFFFFF" />
        <circle cx="348" cy="176" r="14" fill="#1E1E24" />
        <circle cx="352" cy="172" r="5" fill="#FFFFFF" />
        
        <!-- Dino Belly Patch -->
        <path d="M 230 310 C 210 360 210 430 260 470 C 310 470 340 430 340 370 C 340 320 310 280 280 280 C 250 280 235 300 230 310 Z" stroke="#1E1E24" stroke-width="8" stroke-linecap="round" fill="#FFFFFF" />
        
        <!-- Front Little Hand -->
        <path d="M 370 350 C 410 360 420 390 390 400 C 370 405 355 385 350 370 Z" stroke="#1E1E24" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Back Plates / Spikes -->
        <path d="M 220 180 L 190 140 L 235 155 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        <path d="M 180 220 L 140 190 L 190 205 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        <path d="M 150 270 L 105 250 L 155 265 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        <path d="M 130 330 L 80 320 L 130 340 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Cute Spots on Tail -->
        <circle cx="170" cy="420" r="16" stroke="#1E1E24" stroke-width="7" fill="#FFFFFF" />
        <circle cx="210" cy="450" r="12" stroke="#1E1E24" stroke-width="7" fill="#FFFFFF" />
      </svg>
    `)
  },
  {
    id: 'rocket',
    title: 'Cosmic Rocket',
    emoji: '🚀',
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" fill="#FFFFFF" />
        
        <!-- Main Rocket Body -->
        <path d="M 300 70 C 360 160 380 280 370 390 L 230 390 C 220 280 240 160 300 70 Z" stroke="#1E1E24" stroke-width="9" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Rocket Nose Cone -->
        <path d="M 300 70 C 330 120 345 160 353 190 L 247 190 C 255 160 270 120 300 70 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Large Window Port -->
        <circle cx="300" cy="270" r="42" stroke="#1E1E24" stroke-width="8" fill="#FFFFFF" />
        <circle cx="300" cy="270" r="26" stroke="#1E1E24" stroke-width="6" fill="#FFFFFF" />
        
        <!-- Left Wing -->
        <path d="M 230 330 L 140 400 L 170 450 L 230 420 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Right Wing -->
        <path d="M 370 330 L 460 400 L 430 450 L 370 420 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Center Booster Thruster -->
        <path d="M 260 390 L 250 430 L 350 430 L 340 390 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Rocket Fire Flame -->
        <path d="M 260 430 Q 300 540 300 540 Q 300 540 340 430 Q 300 470 260 430 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Distant Planet with Ring -->
        <circle cx="480" cy="140" r="38" stroke="#1E1E24" stroke-width="8" fill="#FFFFFF" />
        <ellipse cx="480" cy="140" rx="60" ry="16" stroke="#1E1E24" stroke-width="7" fill="none" stroke-linecap="round" />
        
        <!-- Twinkle Stars -->
        <polygon points="120,130 130,150 150,155 133,168 138,190 120,175 102,190 107,168 90,155 110,150" stroke="#1E1E24" stroke-width="6" stroke-linejoin="round" fill="#FFFFFF" />
        <polygon points="460,330 467,345 482,348 470,358 473,374 460,363 447,374 450,358 438,348 453,345" stroke="#1E1E24" stroke-width="6" stroke-linejoin="round" fill="#FFFFFF" />
      </svg>
    `)
  },
  {
    id: 'butterfly',
    title: 'Magic Butterfly',
    emoji: '🦋',
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" fill="#FFFFFF" />
        
        <!-- Butterfly Head & Body -->
        <ellipse cx="300" cy="310" rx="20" ry="70" stroke="#1E1E24" stroke-width="8" fill="#FFFFFF" />
        <circle cx="300" cy="210" r="28" stroke="#1E1E24" stroke-width="8" fill="#FFFFFF" />
        
        <!-- Antennae -->
        <path d="M 285 190 Q 240 130 220 150" stroke="#1E1E24" stroke-width="7" stroke-linecap="round" fill="none" />
        <circle cx="220" cy="150" r="8" fill="#1E1E24" />
        <path d="M 315 190 Q 360 130 380 150" stroke="#1E1E24" stroke-width="7" stroke-linecap="round" fill="none" />
        <circle cx="380" cy="150" r="8" fill="#1E1E24" />
        
        <!-- Left Top Wing -->
        <path d="M 285 260 C 210 140 100 170 80 260 C 60 340 180 370 280 330 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        <circle cx="160" cy="260" r="28" stroke="#1E1E24" stroke-width="7" fill="#FFFFFF" />
        
        <!-- Right Top Wing -->
        <path d="M 315 260 C 390 140 500 170 520 260 C 540 340 420 370 320 330 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        <circle cx="440" cy="260" r="28" stroke="#1E1E24" stroke-width="7" fill="#FFFFFF" />
        
        <!-- Left Bottom Wing -->
        <path d="M 285 340 C 200 370 120 440 160 500 C 200 540 270 460 290 380 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        <circle cx="200" cy="440" r="18" stroke="#1E1E24" stroke-width="7" fill="#FFFFFF" />
        
        <!-- Right Bottom Wing -->
        <path d="M 315 340 C 400 370 480 440 440 500 C 400 540 330 460 310 380 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        <circle cx="400" cy="440" r="18" stroke="#1E1E24" stroke-width="7" fill="#FFFFFF" />
      </svg>
    `)
  },
  {
    id: 'cupcake',
    title: 'Sweet Cupcake',
    emoji: '🧁',
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" fill="#FFFFFF" />
        
        <!-- Cupcake Wrapper Base -->
        <path d="M 180 340 L 210 510 C 215 530 385 530 390 510 L 420 340 Z" stroke="#1E1E24" stroke-width="9" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Wrapper Ribs/Stripes -->
        <path d="M 240 340 L 255 515" stroke="#1E1E24" stroke-width="7" stroke-linecap="round" />
        <path d="M 300 340 L 300 520" stroke="#1E1E24" stroke-width="7" stroke-linecap="round" />
        <path d="M 360 340 L 345 515" stroke="#1E1E24" stroke-width="7" stroke-linecap="round" />
        
        <!-- Fluffy Frosting Tier 1 (Bottom Swirl) -->
        <path d="M 150 340 C 140 280 210 270 240 300 C 270 260 330 260 360 300 C 390 270 460 280 450 340 C 450 360 150 360 150 340 Z" stroke="#1E1E24" stroke-width="9" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Fluffy Frosting Tier 2 (Top Swirl) -->
        <path d="M 190 290 C 190 220 270 200 300 240 C 330 200 410 220 410 290 Z" stroke="#1E1E24" stroke-width="9" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Swirl Tip -->
        <path d="M 250 220 C 270 170 330 170 350 220 Z" stroke="#1E1E24" stroke-width="8" stroke-linejoin="round" fill="#FFFFFF" />
        
        <!-- Cherry on Top -->
        <circle cx="300" cy="140" r="34" stroke="#1E1E24" stroke-width="8" fill="#FFFFFF" />
        <circle cx="312" cy="132" r="8" fill="#1E1E24" />
        <!-- Cherry Stem -->
        <path d="M 300 110 Q 340 50 390 60" stroke="#1E1E24" stroke-width="7" stroke-linecap="round" fill="none" />
        
        <!-- Fun Sprinkles -->
        <line x1="220" y1="260" x2="245" y2="265" stroke="#1E1E24" stroke-width="8" stroke-linecap="round" />
        <line x1="355" y1="260" x2="380" y2="250" stroke="#1E1E24" stroke-width="8" stroke-linecap="round" />
        <line x1="270" y1="305" x2="295" y2="315" stroke="#1E1E24" stroke-width="8" stroke-linecap="round" />
        <line x1="320" y1="315" x2="345" y2="305" stroke="#1E1E24" stroke-width="8" stroke-linecap="round" />
      </svg>
    `)
  }
];
