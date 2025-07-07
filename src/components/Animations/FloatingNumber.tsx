// src/components/Animations/FloatingNumber.tsx
import React, { useState, useEffect } from 'react';

interface FloatingNumberProps {
  value: number;
  position: { x: number; y: number };
  color?: string;
  onComplete?: () => void;
}

export const FloatingNumber: React.FC<FloatingNumberProps> = ({
  value,
  position,
  color = '#4ade80',
  onComplete
}) => {
  const [opacity, setOpacity] = useState(1);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1000; // 1 second

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setOffsetY(-50 * easeOut); // Float up 50px
      setOpacity(1 - progress); // Fade out

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y + offsetY,
        transform: 'translate(-50%, -50%)',
        fontSize: '20px',
        fontWeight: 'bold',
        color: color,
        textShadow: `0 0 10px ${color}`,
        opacity: opacity,
        pointerEvents: 'none',
        userSelect: 'none',
        fontFamily: 'monospace',
        zIndex: 1000
      }}
    >
      +{value}
    </div>
  );
};