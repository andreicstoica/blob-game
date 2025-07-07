// src/components/Animations/AnimationLayer.tsx
import React, { useState, useCallback, useRef } from 'react';
import { FloatingNumber } from './FloatingNumber';
import { ParticleSystem } from './ParticleSystem';

interface FloatingNumberAnimation {
  id: string;
  type: 'floatingNumber';
  position: { x: number; y: number };
  value: number;
  color?: string;
  startTime: number;
}

interface ParticleData {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  color: string;
  size: number;
  startTime: number;
  lifespan: number;
}

declare global {
  interface Window {
    addFloatingNumber?: (position: { x: number; y: number }, value: number, color?: string) => void;
    addParticleBurst?: (position: { x: number; y: number }, count?: number, colors?: string[]) => void;
  }
}

export const AnimationLayer: React.FC = React.memo(() => {
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumberAnimation[]>([]);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const isInitialized = useRef(false);

  const addFloatingNumber = useCallback((position: { x: number; y: number }, value: number, color?: string) => {
    const id = Math.random().toString();
    const startTime = Date.now();
    
    setFloatingNumbers(prev => [...prev, {
      id,
      type: 'floatingNumber',
      position,
      value,
      color,
      startTime
    }]);
  }, []);

  const addParticleBurst = useCallback((
    position: { x: number; y: number }, 
    count: number = 8, 
    colors: string[] = ['#4ade80', '#22c55e', '#16a34a']
  ) => {
    const startTime = Date.now();
    const newParticles: ParticleData[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 80 + Math.random() * 40; // 80-120 pixels per second
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      };

      newParticles.push({
        id: Math.random().toString(),
        position: { ...position },
        velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4, // 3-7 pixels
        startTime,
        lifespan: 600 + Math.random() * 400 // 600-1000ms
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const removeFloatingNumber = useCallback((id: string) => {
    setFloatingNumbers(prev => prev.filter(anim => anim.id !== id));
  }, []);

  const removeParticle = useCallback((id: string) => {
    setParticles(prev => prev.filter(particle => particle.id !== id));
  }, []);

  // Set up global functions
  React.useEffect(() => {
    if (!isInitialized.current) {
      window.addFloatingNumber = addFloatingNumber;
      window.addParticleBurst = addParticleBurst;
      isInitialized.current = true;
    }
  }, [addFloatingNumber, addParticleBurst]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {/* Floating Numbers */}
      {floatingNumbers.map(anim => (
        <FloatingNumber
          key={anim.id}
          value={anim.value}
          position={anim.position}
          color={anim.color}
          startTime={anim.startTime}
          onComplete={() => removeFloatingNumber(anim.id)}
        />
      ))}
      
      {/* Particles */}
      <ParticleSystem 
        particles={particles}
        onParticleComplete={removeParticle}
      />
    </div>
  );
});

AnimationLayer.displayName = 'AnimationLayer';