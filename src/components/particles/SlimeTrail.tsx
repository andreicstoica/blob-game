import React, { useState, useEffect, useRef } from 'react';
import { Colors } from '../../styles/colors';

interface SlimeDrop {
  id: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  createdAt: number;
}

interface SlimeTrailProps {
  isActive: boolean;
}

export const SlimeTrail: React.FC<SlimeTrailProps> = ({ isActive }) => {
  const [slimeDrops, setSlimeDrops] = useState<SlimeDrop[]>([]);
  const lastDropTime = useRef(0);
  const dropInterval = 50; // Increased from 25ms to 50ms to reduce frequency

  // Track mouse position
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (event: MouseEvent) => {
      const newPosition = { x: event.clientX, y: event.clientY };

      // Create new slime drop at intervals
      const now = Date.now();
      if (now - lastDropTime.current > dropInterval) {
        const newDrop: SlimeDrop = {
          id: Math.random().toString(36).substr(2, 9),
          x: newPosition.x,
          y: newPosition.y,
          opacity: 0.6, // Reduced opacity
          scale: 1,
          createdAt: now,
        };

        setSlimeDrops(prev => [...prev, newDrop]);
        lastDropTime.current = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  // Clean up old slime drops
  useEffect(() => {
    if (!isActive) {
      setSlimeDrops([]);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      setSlimeDrops(prev => 
        prev.filter(drop => {
          const age = now - drop.createdAt;
          return age < 1000; // Reduced lifetime from 1.5s to 1s
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      {slimeDrops.map((drop) => {
        const age = Date.now() - drop.createdAt;
        const progress = age / 1000; // 1 second lifetime
        const opacity = 0.6 * (1 - progress); // Reduced base opacity
        const scale = 1 - (progress * 0.2); // Reduced scale change

        return (
          <div
            key={drop.id}
            style={{
              position: 'fixed',
              left: drop.x,
              top: drop.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              width: '6px', // Reduced size
              height: '6px', // Reduced size
              backgroundColor: Colors.biomass.primary,
              borderRadius: '50%',
              opacity: opacity,
              pointerEvents: 'none',
              zIndex: 50, // Much lower z-index to avoid cursor interference
              filter: 'blur(0.5px)', // Reduced blur
              boxShadow: `0 0 2px ${Colors.biomass.primary}40`, // Reduced glow
              userSelect: 'none',
              touchAction: 'none',
            }}
          />
        );
      })}
    </>
  );
}; 