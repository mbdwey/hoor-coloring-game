import React, { useEffect, useState } from 'react';

export interface SparklePoint {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface SparkleOverlayProps {
  sparkles: SparklePoint[];
  onComplete: (id: number) => void;
}

export const SparkleOverlay: React.FC<SparkleOverlayProps> = ({ sparkles, onComplete }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {sparkles.map((s) => (
        <SingleBurst key={s.id} sparkle={s} onDone={() => onComplete(s.id)} />
      ))}
    </div>
  );
};

const SingleBurst: React.FC<{ sparkle: SparklePoint; onDone: () => void }> = ({ sparkle, onDone }) => {
  const [particles] = useState(() => {
    const count = 7;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i * 2 * Math.PI) / count + (Math.random() - 0.5) * 0.5;
      const speed = 25 + Math.random() * 35;
      return {
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        size: 8 + Math.random() * 8,
      };
    });
  });

  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const anim = requestAnimationFrame(() => {
      setScale(1);
      setOpacity(0);
    });
    const timer = setTimeout(() => {
      onDone();
    }, 450);

    return () => {
      cancelAnimationFrame(anim);
      clearTimeout(timer);
    };
  }, [onDone]);

  return (
    <div
      className="absolute transition-all duration-450 ease-out"
      style={{
        left: sparkle.x,
        top: sparkle.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    >
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full shadow-md"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: sparkle.color || '#FFCC00',
            transform: `translate(${p.dx}px, ${p.dy}px)`,
          }}
        />
      ))}
    </div>
  );
};
