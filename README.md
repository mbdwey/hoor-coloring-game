# 🎨 Magic Color! — Sketch to Digital Coloring Game for Children

A modern web application that turns photos of physical hand-drawn sketches into an interactive digital coloring game for kids.

---

## ✨ Features

- 📸 **Photo to Coloring Page**: Upload or take a picture of any hand-drawn sketch (pencil, pen, marker).
- 🪄 **Shadow & Background Eraser**: Adaptive integral thresholding erases shadows, phone reflections, and paper wrinkles.
- 🛡️ **Stroke Gap Sealing**: Morphological closing ($\text{Dilation} \to \text{Erosion}$) bridges 1–3px pencil stroke gaps so color fill never leaks into the background.
- 🪣 **Interactive Paint Bucket**: Non-recursive scanline flood fill operating directly on little-endian `Uint32Array` buffers with 1px stroke underbleed (no white fringe halos).
- 🎨 **Multi-Layer Canvas Architecture**:
  1. **Line Art Layer (Top)**: Crisp extracted black strokes on a transparent background (`pointer-events: none`).
  2. **Color Fill Layer (Middle)**: Receives tap/click fills and undo snapshots.
  3. **Paper Canvas (Bottom)**: Solid white background.
- 🦖 **Built-in Sample Sketches**: Comes preloaded with ready-to-color drawings (Dino Buddy, Cosmic Rocket, Magic Butterfly, Sweet Cupcake) for instant play.
- 🔊 **Zero-Asset Sound Synthesizer**: Web Audio API generates pops, sparkles, chimes, and celebration fanfares without loading external audio files.
- ✨ **Touch Sparkles & Confetti**: Visual bursts on tap and confetti explosions upon downloading finished masterpieces.
- ↩️ **Undo & Clear**: Kid-friendly buttons with snapshot state history.
- 📱 **Mobile & Tablet Optimized**: Designed for iPad, tablet, and smartphone touchscreens with `touch-action: none` and oversized buttons.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- **Bundler & Dev Server**: [Vite](https://vite.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Native Web Audio API Synthesizer
