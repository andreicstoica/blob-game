// src/components/Animations/AnimationLayer.tsx
import React, { useState, useCallback, useRef } from 'react';
import { FloatingNumber } from './FloatingNumber';

interface Animation {
  id: string;
  type: 'floatingNumber';
  position: { x: number; y: number };
  value: number;
  color?: string;
}

declare global {
  interface Window {
    addFloatingNumber?: (position: { x: number; y: number }, value: number, color?: string) => void;
  }
}

export const AnimationLayer: React.FC = () => {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const isInitialized = useRef(false);

  const addFloatingNumber = useCallback((position: { x: number; y: number }, value: number, color?: string) => {
    const id = Math.random().toString();
    console.log('Adding floating number:', { id, position, value }); // Debug log
    setAnimations(prev => [...prev, {
      id,
      type: 'floatingNumber',
      position,
      value,
      color
    }]);
  }, []);

  const removeAnimation = useCallback((id: string) => {
    console.log('Removing animation:', id); // Debug log
    setAnimations(prev => prev.filter(anim => anim.id !== id));
  }, []);

  // Only set up the global function once
  React.useEffect(() => {
    if (!isInitialized.current) {
      console.log('Setting up global addFloatingNumber function');
      window.addFloatingNumber = addFloatingNumber;
      isInitialized.current = true;
    }
  }, []); // Empty dependency array - only runs once

  // Update the function reference when it changes, but don't re-initialize
  React.useEffect(() => {
    if (isInitialized.current) {
      window.addFloatingNumber = addFloatingNumber;
    }
  }, [addFloatingNumber]);

  console.log('AnimationLayer render, animations count:', animations.length);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {animations.map(anim => (
        <FloatingNumber
          key={anim.id}
          value={anim.value}
          position={anim.position}
          color={anim.color}
          onComplete={() => removeAnimation(anim.id)}
        />
      ))}
    </div>
  );
};