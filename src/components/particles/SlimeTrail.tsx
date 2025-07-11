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
  const dropInterval = 25; // Drop every 25ms (50% more frequent)

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
          opacity: 0.8,
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
          return age < 1500; // Keep drops for 1.5 seconds (reduced from 2 seconds)
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
        const progress = age / 1500; // 1.5 second lifetime
        const opacity = 0.8 * (1 - progress);
        const scale = 1 - (progress * 0.3);

        return (
          <div
            key={drop.id}
            style={{
              position: 'fixed',
              left: drop.x,
              top: drop.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              width: '8px',
              height: '8px',
              backgroundColor: Colors.biomass.primary,
              borderRadius: '50%',
              opacity: opacity,
              pointerEvents: 'none',
              zIndex: 1000,
              filter: 'blur(1px)',
              boxShadow: `0 0 4px ${Colors.biomass.primary}80`,
            }}
          />
        );
      })}
    </>
  );
}; 