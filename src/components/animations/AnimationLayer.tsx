import React, { useState, useCallback } from 'react';
import { FloatingNumber } from './FloatingNumber';
import type { FloatingNumberAnimation } from '../../game/types';

interface AnimationLayerProps {
  children?: (addFloatingNumber: (position: { x: number; y: number }, value: number, color?: string) => void) => React.ReactNode;
}

export const AnimationLayer: React.FC<AnimationLayerProps> = React.memo(({ children }) => {
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumberAnimation[]>([]);

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



  const removeFloatingNumber = useCallback((id: string) => {
    setFloatingNumbers(prev => prev.filter(anim => anim.id !== id));
  }, []);



  return (
    <>
      {/* Render children with addFloatingNumber function */}
      {children?.(addFloatingNumber)}
      
      {/* Animation Layer */}
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
      </div>
    </>
  );
});

AnimationLayer.displayName = 'AnimationLayer';