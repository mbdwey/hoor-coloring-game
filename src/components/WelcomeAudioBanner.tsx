import React, { useEffect, useState } from 'react';
import { welcomeVoice } from '../utils/welcomeAudio';
import { Volume2, Sparkles } from 'lucide-react';

export const WelcomeAudioBanner: React.FC = () => {
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = welcomeVoice.subscribe((blocked) => {
      setIsBlocked(blocked);
    });
    return () => unsubscribe();
  }, []);

  if (!isBlocked) return null;

  return (
    <div 
      onClick={() => welcomeVoice.play()}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 cursor-pointer animate-bounce"
    >
      <div className="bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 p-1 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform">
        <div className="bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pulse">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-black text-slate-800 flex items-center gap-1">
              Tap to Hear Hoor Say Hi!
              <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Click anywhere on screen to begin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
